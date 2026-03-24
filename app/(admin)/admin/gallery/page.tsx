"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import AdminAddButton from "@/components/admin/AdminAddButton";

interface GalleryItem {
  id: number;
  fileName: string;
  subtitle: string;
  mainTitle: string;
  isVisible: boolean;
  displayOrder: number;
  isDeleted?: boolean; // 삭제 예정 상태 관리용
  isNew?: boolean; // 신규 아이템 여부 (DB에 아직 없는 아이템 구분용)
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletedFileNames, setDeletedFileNames] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 데이터 불러오기
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

  // 2. 사진 추가 (업로드 + DB에 임시 아이템 추가)
  const handleAddClick = () => fileInputRef.current?.click();
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. WebP 변환 및 압축 옵션 설정
      const options = {
        maxSizeMB: 1, // 최대 용량 1MB
        maxWidthOrHeight: 1920, // 최대 너비/높이
        useWebWorker: true,
        fileType: "image/webp", // webp로 변환
      };

      // 2. 압축 실행
      const compressedFile = await imageCompression(file, options);

      // 3. 파일명 생성 (확장자를 .webp로 강제 변경)
      const fileName = `${Date.now()}.webp`;

      // 4. Supabase Storage 업로드
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      // 5. 리스트에 임시 아이템 추가 (DB 저장은 전체 저장 시 일괄 처리)
      const newItem: GalleryItem = {
        id: Date.now(), // 임시 ID
        fileName,
        subtitle: "",
        mainTitle: "",
        isVisible: true,
        displayOrder: items.length + 1,
        isNew: true, // 신규 아이템 표시
      };
      setItems([...items, newItem]);
      alert(
        "이미지가 업로드되었습니다. 내용 입력 후 우측 상단의 [전체 저장] 버튼을 눌러 DB에 반영해주세요.",
      );
    } catch (err) {
      console.error(err);
      alert("이미지 변환 및 업로드 중 오류가 발생했습니다.");
    } finally {
      e.target.value = ""; // input 초기화
    }
  };

  // 3. 흑백 토글 (삭제 예정 처리)
  const toggleDelete = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isDeleted: !item.isDeleted } : item,
      ),
    );
  };

  // 4. 전체 저장 (업데이트 + 삭제 일괄 처리)
  const handleAllSave = async () => {
    // [검증]
    if (items.some((item) => !item.subtitle.trim() || !item.mainTitle.trim())) {
      alert(
        "⚠️ 모든 사진의 서브 제목과 메인 제목을 입력해야 저장이 가능합니다.",
      );
      return;
    }

    setIsSaving(true);

    try {
      //  1. 삭제 대상 추출 (유저가 삭제 누른 아이템들만)
      const itemsToDelete = items.filter((item) => item.isDeleted);

      //  2. 스토리지 삭제
      const fileNamesToDelete = itemsToDelete.map((item) => item.fileName);

      if (fileNamesToDelete.length > 0) {
        const { error } = await supabase.storage
          .from("gallery")
          .remove(fileNamesToDelete);

        if (error) throw new Error("스토리지 파일 삭제 실패");
      }

      //  3. DB 삭제 (기존 데이터만)
      const idsToDelete = itemsToDelete
        .filter((item) => !item.isNew)
        .map((item) => item.id);

      if (idsToDelete.length > 0) {
        const { error } = await supabase
          .from("gallery")
          .delete()
          .in("id", idsToDelete);

        if (error) throw new Error("DB 데이터 삭제 실패");
      }

      // 4. 삭제 안된 아이템만 저장 대상으로
      const itemsToSave = items.filter((item) => !item.isDeleted);

      //  5. payload 생성 (id 분리 핵심)
      const finalPayload = itemsToSave.map((item, index) => {
        const baseData = {
          fileName: item.fileName,
          subtitle: item.subtitle,
          mainTitle: item.mainTitle,
          isVisible: item.isVisible,
          displayOrder: index + 1,
        };

        if (item.isNew) {
          return baseData; // ✅ id 없음 → DB 자동 생성
        } else {
          return { ...baseData, id: item.id }; // ✅ 기존 → update
        }
      });

      // 🔥 6. upsert
      const { error: upsertError } = await supabase
        .from("gallery")
        .upsert(finalPayload, { onConflict: "id", defaultToNull: false });

      if (upsertError) throw upsertError;

      // ✅ 완료
      alert("✅ 변경사항 저장 완료");
      fetchGallery();
    } catch (error: any) {
      console.error("저장 오류 상세:", error);
      alert(`❌ 저장 실패: ${error.message || "알 수 없는 오류"}`);
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
                        className={`grid grid-cols-12 gap-8 items-start py-8 border-b border-gray-100 last:border-0 transition-all ${
                          item.isDeleted
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
                        <div className="col-span-2 relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={getPublicUrl(item.fileName)}
                            alt="p"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        {/* 3. 제목 입력 */}
                        <div className="col-span-3">
                          <input
                            type="text"
                            disabled={item.isDeleted}
                            value={item.subtitle}
                            onChange={(e) =>
                              handleChange(item.id, "subtitle", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-transparent disabled:border-transparent"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="text"
                            disabled={item.isDeleted}
                            value={item.mainTitle}
                            onChange={(e) =>
                              handleChange(item.id, "mainTitle", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold disabled:bg-transparent disabled:border-transparent"
                          />
                        </div>

                        {/* 4. 진열 상태 */}
                        <div className="col-span-1 flex justify-center">
                          <button
                            disabled={item.isDeleted}
                            onClick={() =>
                              handleChange(
                                item.id,
                                "isVisible",
                                !item.isVisible,
                              )
                            }
                            className={`w-24 h-12 flex items-center rounded-full p-1 transition-colors ${item.isVisible ? "bg-green-500" : "bg-slate-300"}`}
                          >
                            <div
                              className={`bg-white w-10 h-10 rounded-full shadow-md transform transition-transform ${item.isVisible ? "translate-x-12" : "translate-x-0"}`}
                            />
                          </button>
                        </div>

                        {/* 5. 삭제/복구 버튼 */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => toggleDelete(item.id)}
                            className={`px-4 py-2 rounded-lg font-bold text-admin-small transition-all ${item.isDeleted ? "bg-blue-100 text-blue-600" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                          >
                            {item.isDeleted ? "복구" : "삭제"}
                          </button>
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
    </div>
  );
}
