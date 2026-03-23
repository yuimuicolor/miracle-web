"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";

interface GalleryItem {
  id: number;
  fileName: string;
  subtitle: string;
  mainTitle: string;
  isVisible: boolean;
  displayOrder: number;
  isDeleted?: boolean; // 삭제 예정 상태 관리용
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => { fetchGallery(); }, []);

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from("gallery").getPublicUrl(fileName);
    return data.publicUrl;
  };

  // 2. 사진 추가 (업로드 + DB에 임시 아이템 추가)
  const handleAddClick = () => fileInputRef.current?.click();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("gallery").upload(fileName, file);

    if (error) return alert("업로드 실패");

    const newItem: GalleryItem = {
      id: Date.now(), // 임시 ID
      fileName,
      subtitle: "",
      mainTitle: "",
      isVisible: true,
      displayOrder: items.length + 1,
    };

    setItems([...items, newItem]);
    e.target.value = "";
  };

  // 3. 흑백 토글 (삭제 예정 처리)
  const toggleDelete = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isDeleted: !item.isDeleted } : item
    ));
  };

  // 4. 전체 저장 (진짜 삭제 & 수정 동시 처리)
  const handleAllSave = async () => {
    setIsSaving(true);
    
    // 삭제할 아이템 리스트
    const itemsToDelete = items.filter(item => item.isDeleted && item.id <= 2000000000);
    // 업데이트/신규 저장할 아이템 리스트
    const itemsToUpsert = items.filter(item => !item.isDeleted);

    try {
      // DB 삭제 실행
      if (itemsToDelete.length > 0) {
        const ids = itemsToDelete.map(i => i.id);
        const fileNames = itemsToDelete.map(i => i.fileName);
        await supabase.from("gallery").delete().in("id", ids);
        await supabase.storage.from("gallery").remove(fileNames);
      }

      // 수정 및 신규 저장 (순서 1부터 다시 매김)
      const payload = itemsToUpsert.map((item, index) => ({
        id: item.id > 2000000000 ? undefined : item.id,
        fileName: item.fileName,
        subtitle: item.subtitle,
        mainTitle: item.mainTitle,
        isVisible: item.isVisible,
        displayOrder: index + 1,
      }));

      const { error } = await supabase.from("gallery").upsert(payload);
      
      if (!error) {
        alert("전체 저장되었습니다.");
        fetchGallery();
      }
    } catch (err) {
      alert("저장 중 에러가 발생했습니다. 페이지를 새로고침 후 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems.map((item, index) => ({ ...item, displayOrder: index + 1 })));
  };

  const handleChange = (id: number, field: keyof GalleryItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  if (loading) return <div className="p-10 text-center text-admin-body">불러오는 중...</div>;

  return (
    <div className="min-h-screen text-black">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-admin-title font-bold">갤러리 관리</h2>
          <p className="text-admin-body text-slate-500 mt-1">
            수정 후 우측 상단의 <span className="text-blue-600 font-bold">[전체 저장]</span> 버튼을 눌러주세요.
          </p>
        </div>

        <div className="flex gap-3">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          <button onClick={handleAddClick} className="bg-slate-100 text-slate-700 text-admin-body px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all">
            + 사진 추가
          </button>
          <button 
            onClick={handleAllSave} 
            disabled={isSaving}
            className={`text-white text-admin-body px-8 py-3 rounded-xl font-semibold transition-all shadow-lg ${isSaving ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}
          >
            {isSaving ? "저장 중..." : "전체 저장"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 py-5 bg-slate-50 border-b border-slate-100 text-admin-body font-semibold text-slate-500">
          <div className="col-span-1 text-center">순서</div>
          <div className="col-span-2">미리보기</div>
          <div className="col-span-3">서브 제목</div>
          <div className="col-span-3">메인 제목</div>
          <div className="col-span-1 text-center">진열</div>
          <div className="col-span-2 text-center">삭제/복구</div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index} isDragDisabled={item.isDeleted}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`grid grid-cols-12 gap-8 items-start py-8 border-b border-gray-100 last:border-0 transition-all ${
                          item.isDeleted ? "bg-slate-50 grayscale opacity-40" : snapshot.isDragging ? "bg-blue-50" : "bg-white"
                        }`}
                      >
                        {/* 1. 드래그 핸들 */}
                        <div {...provided.dragHandleProps} className="col-span-1 text-center text-gray-400">
                          {item.isDeleted ? "❌" : <span className="text-admin-title cursor-grab">⋮⋮</span>}
                        </div>

                        {/* 2. 사진 미리보기 */}
                        <div className="col-span-2 relative aspect-video rounded-lg overflow-hidden border">
                          <Image src={getPublicUrl(item.fileName)} alt="p" fill className="object-cover" unoptimized />
                        </div>

                        {/* 3. 제목 입력 */}
                        <div className="col-span-3">
                          <input
                            type="text"
                            disabled={item.isDeleted}
                            value={item.subtitle}
                            onChange={(e) => handleChange(item.id, "subtitle", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-transparent disabled:border-transparent"
                          />
                        </div>

                        <div className="col-span-3">
                          <input
                            type="text"
                            disabled={item.isDeleted}
                            value={item.mainTitle}
                            onChange={(e) => handleChange(item.id, "mainTitle", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold disabled:bg-transparent disabled:border-transparent"
                          />
                        </div>

                        {/* 4. 진열 상태 */}
                        <div className="col-span-1 flex justify-center">
                          <button
                            disabled={item.isDeleted}
                            onClick={() => handleChange(item.id, "isVisible", !item.isVisible)}
                            className={`w-24 h-12 flex items-center rounded-full p-1 transition-colors ${item.isVisible ? "bg-green-500" : "bg-slate-300"}`}
                          >
                            <div className={`bg-white w-10 h-10 rounded-full shadow-md transform transition-transform ${item.isVisible ? "translate-x-12" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* 5. 삭제/복구 버튼 */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => toggleDelete(item.id)}
                            className={`px-4 py-2 rounded-lg font-bold text-admin-small transition-all ${item.isDeleted ? "bg-blue-100 text-blue-600" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                          >
                            {item.isDeleted ? "복구하기" : "삭제예정"}
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