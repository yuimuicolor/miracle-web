"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import AdminAddButton from "@/components/admin/AdminAddButton";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

interface GalleryItem {
  id: number;
  fileName: string;
  subtitle: string;
  mainTitle: string;
  isVisible: boolean;
  displayOrder: number;
  isDeleted?: boolean; // 삭제 예정 상태 관리용
  isNew?: boolean; // 신규 아이템 여부 (DB에 아직 없는 아이템 구분용)
  previewUrl?: string; // 교체 시 미리보기용 URL
  tempFile?: File; // 교체 시 임시 파일 저장용 (미리보기)
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 데이터 불러오기
  const fetchGallery = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from("gallery").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // 사진 교체 (파일명 유지 + 임시 URL로 미리보기)
  const handleReplaceImage = (id: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            tempFile: file,
            previewUrl, // 미리보기용
          }
          : item
      )
    );
  };

  // 사진 추가 (업로드 + DB에 임시 아이템 추가)
  const handleAddClick = () => fileInputRef.current?.click();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 실제 업로드는 저장 시점에 처리하므로, 여기서는 미리보기용 URL과 임시 파일만 관리
      const previewUrl = URL.createObjectURL(file);

      const newItem: GalleryItem = {
        id: Date.now(),
        fileName: "",
        previewUrl, // 미리보기용 URL
        tempFile: file, // 실제 파일 보관
        subtitle: "",
        mainTitle: "",
        isVisible: true,
        displayOrder: items.length + 1,
        isNew: true
      };

      setItems(prev => [...prev, newItem]);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      alert(
        "이미지가 추가되었습니다. 저장 버튼을 눌러야 실제로 반영됩니다."
      );

    } catch (err) {
      console.error(err);
      alert("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  // 흑백 토글 (삭제 예정 처리)
  const toggleDelete = (id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isDeleted: !item.isDeleted } : item
      )
    );
  };

  // 전체 저장 (업데이트 + 삭제 일괄 처리)
  const handleAllSave = async () => {
    if (items.some(item => !item.subtitle.trim() || !item.mainTitle.trim())) {
      alert("모든 항목의 서브 제목과 메인 제목을 입력해주세요.");
      return;
    }

    setIsSaving(true);

    try {
      // 1️⃣ 삭제 대상
      const itemsToDelete = items.filter(item => item.isDeleted);

      // storage 삭제
      const deleteFiles = itemsToDelete
        .filter(item => !item.isNew)
        .map(item => item.fileName);

      if (deleteFiles.length > 0) {
        await supabase.storage.from("gallery").remove(deleteFiles);
      }

      // DB 삭제
      const deleteIds = itemsToDelete
        .filter(item => !item.isNew)
        .map(item => item.id);

      if (deleteIds.length > 0) {
        await supabase.from("gallery").delete().in("id", deleteIds);
      }

      // 2️⃣ 저장 대상
      const itemsToSave = items.filter(item => !item.isDeleted);

      // 3️⃣ 이미지 업로드 + 데이터 정리
      const processedItems = await Promise.all(
        itemsToSave.map(async (item, index) => {
          let finalFileName = item.fileName;

          if (item.tempFile) {
            const compressed = await imageCompression(item.tempFile, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              fileType: "image/webp",
            });

            const newFileName = `${Date.now()}-${index}.webp`; // ⭐ 충돌 방지

            const { error } = await supabase.storage
              .from("gallery")
              .upload(newFileName, compressed);

            if (error) throw error;

            finalFileName = newFileName;
          }

          const baseData = {
            fileName: finalFileName,
            subtitle: item.subtitle,
            mainTitle: item.mainTitle,
            isVisible: item.isVisible,
            displayOrder: index + 1,
          };

          // ⭐ id 분리 핵심
          return item.isNew ? baseData : { ...baseData, id: item.id };
        })
      );

      // 4️⃣ upsert
      const { error: upsertError } = await supabase
        .from("gallery")
        .upsert(processedItems, {
          onConflict: "id",
          defaultToNull: false,
        });

      if (upsertError) throw upsertError;

      alert("✅ 변경사항 저장 완료");
      await fetchGallery();

    } catch (error: any) {
      console.error("저장 오류:", error);
      alert(`❌ 저장 실패: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(
      newItems.map((item, index) => ({ ...item, displayOrder: index + 1 })),
    );
  };

  const handleChange = (id: number, field: keyof GalleryItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  if (loading)
    return (
      <div className="p-10 text-center text-admin-body">불러오는 중...</div>
    );

  return (
    <div>
      <AdminHeader
        title="갤러리 관리"
        subtitle="Gallery에 진열된 사진을 관리하는 페이지입니다."
        tip="* 변경사항이 있을 경우 [저장] 버튼을 눌러주세요."
      />
      <div className="flex gap-3 mb-10 justify-end">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        <AdminAddButton onClick={handleAddClick} label="사진 추가" />
        <AdminSaveButton onClick={handleAllSave} isSaving={isSaving} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 py-5 bg-slate-50 border-b border-slate-100 text-admin-body font-semibold text-slate-500">
          <div className="col-span-1 text-center">순서</div>
          <div className="col-span-2">미리보기</div>
          <div className="col-span-3">서브 제목</div>
          <div className="col-span-3">메인 제목</div>
          <div className="col-span-1 text-center">진열</div>
          <div className="col-span-2 text-center"></div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={String(item.id)}
                    index={index}
                    isDragDisabled={item.isDeleted}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`grid grid-cols-12 gap-8 items-start py-8 border-b border-gray-100 last:border-0 transition-all ${item.isDeleted
                          ? "bg-slate-50 grayscale opacity-40"
                          : snapshot.isDragging
                            ? "bg-blue-50"
                            : "bg-white"
                          }`}
                      >
                        {/* 1. 드래그 핸들 */}
                        <div
                          {...provided.dragHandleProps}
                          className="col-span-1 text-center text-gray-400"
                        >
                          {item.isDeleted ? (
                            "❌"
                          ) : (
                            <span className="text-admin-title cursor-grab">
                              ⋮⋮
                            </span>
                          )}
                        </div>

                        {/* 2. 사진 미리보기 */}
                        <div className="col-span-2 relative aspect-video rounded-lg overflow-hidden group">

                          <Image
                            src={item.previewUrl || getPublicUrl(item.fileName)}
                            alt="p"
                            fill
                            className="object-cover"
                            loading="eager"
                            unoptimized
                          />
                          {/* hover overlay */}
                          {!item.isDeleted && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <button
                                onClick={() => fileInputRefs.current[item.id]?.click()}
                                className="px-4 py-2 bg-white text-black rounded-lg font-semibold text-admin-small hover:bg-gray-200"
                              >
                                이미지 변경
                              </button>
                            </div>
                          )}

                          {/* hidden input */}
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current[item.id] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleReplaceImage(item.id, file);
                            }}
                            className="hidden"
                          />
                        </div>

                        {/* 3. 제목 입력 */}
                        <div className="col-span-3">
                          <AdminInput
                            value={item.subtitle}
                            disabled={item.isDeleted}
                            onChange={(v) => handleChange(item.id, "subtitle", v)}
                          />
                        </div>


                        <div className="col-span-3">
                          <AdminInput
                            value={item.mainTitle}
                            disabled={item.isDeleted}
                            onChange={(v) => handleChange(item.id, "mainTitle", v)}
                          />
                        </div>

                        {/* 4. 진열 상태 */}
                        <div className="col-span-1 flex justify-center">
                          <AdminToggle
                            value={item.isVisible}
                            disabled={item.isDeleted}
                            onToggle={() => handleChange(item.id, "isVisible", !item.isVisible)}
                          />
                        </div>

                        {/* 5. 삭제/복구 버튼 */}
                        <div className="col-span-2 flex justify-center">
                          <AdminDeleteButton
                            isDeleted={item.isDeleted}
                            onDelete={() => toggleDelete(item.id)}
                            onRestore={() => toggleDelete(item.id)}
                            canRestore
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
