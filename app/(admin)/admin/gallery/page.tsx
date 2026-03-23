"use client";

import { useState, useEffect } from "react";
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
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 데이터 불러오기
  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 💡 Supabase Storage URL 생성 함수
  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage
      .from("gallery") // 👈 누나 버킷 이름 (예: "gallery" 혹은 "miracle")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  // 2. 순서 변경 처리
  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = newItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));

    setItems(updatedItems);

    // DB 일괄 업데이트
    const { error } = await supabase.from("gallery").upsert(updatedItems);
    if (error) alert("순서 저장에 실패했어요 유이 누나 ㅠ");
  };

  // 3. 노출 상태 토글
  const toggleVisibility = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from("gallery")
      .update({ isVisible: !currentStatus })
      .eq("id", id);

    if (!error) {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, isVisible: !currentStatus } : item,
        ),
      );
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-gray-500">
        이미지 불러오는 중... ⏳
      </div>
    );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-admin-title text-black font-bold">
            갤러리 관리
          </h1>
          <p className="text-admin-small text-gray-500 mt-1">
            Gallery 페이지에 노출될 아카이브 사진들을 관리합니다.
            <br />
            ✅ TIP: 드래그하여 순서 조정이 가능합니다.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-admin-body hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
          + 새로운 사진 등록
        </button>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="gallery-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={String(item.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`group flex items-center gap-8 p-6 border rounded-2xl transition-all ${
                          snapshot.isDragging
                            ? "bg-blue-50 border-blue-400 shadow-2xl scale-[1.02] z-50"
                            : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-md"
                        }`}
                      >
                        {/* 1. 드래그 핸들 */}
                        <div className="text-gray-300 text-[2.4rem] group-hover:text-blue-400 transition-colors">
                          <span className="material-icons">::</span>
                          {/* 아이콘 폰트 없으면 "::" 로 대체 가능 */}
                        </div>

                        {/* 2. 사진 미리보기 (스토리지 URL 적용) */}
                        <div className="relative w-40 h-24 rounded-xl overflow-hidden bg-slate-100 border border-gray-50 shrink-0 shadow-inner">
                          <Image
                            src={getPublicUrl(item.fileName)}
                            alt={item.mainTitle}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                            unoptimized // Storage 이미지는 넥스트 최적화보다 원본 주소가 빠를 때가 많긔
                          />
                        </div>

                        {/* 3. 정보 섹션 */}
                        <div className="flex-1 min-w-0">
                          <p className="text-blue-500 text-[1.2rem] font-black tracking-widest uppercase mb-1">
                            {item.subtitle}
                          </p>
                          <h3 className="text-[1.8rem] font-bold text-slate-800 truncate">
                            {item.mainTitle}
                          </h3>
                        </div>

                        {/* 4. 액션 버튼 */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              toggleVisibility(item.id, item.isVisible)
                            }
                            className={`px-5 py-2.5 rounded-xl font-black text-[1.3rem] transition-all ${
                              item.isVisible
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-gray-50 text-gray-400 border border-gray-100"
                            }`}
                          >
                            {item.isVisible ? "진열 중" : "숨김"}
                          </button>

                          <div className="h-8 w-[1px] bg-gray-100 mx-2" />

                          <button className="text-slate-400 hover:text-blue-600 font-bold text-[1.4rem] p-2 transition-colors">
                            수정
                          </button>
                          <button className="text-slate-300 hover:text-red-500 font-bold text-[1.4rem] p-2 transition-colors">
                            삭제
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
