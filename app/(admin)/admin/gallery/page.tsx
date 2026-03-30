"use client";

import { useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import AdminAddButton from "@/components/admin/AdminAddButton";
import { AdminInput } from "@/components/admin/AdminInput";
import { AdminToggle } from "@/components/admin/AdminToggle";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { useGalleryManager } from "@/hooks/useGalleryManager";


export default function AdminGalleryPage() {

  const {
    items,
    loading,
    isSaving,
    bottomRef,
    addItem,
    toggleDelete,
    handleReplaceImage,
    handleChange,
    handleAllSave,
    onReorder,
  } = useGalleryManager();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

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
      <div className="flex gap-3 mt-6 lg:mt-0  mb-10 justify-end">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) addItem(file); // 훅에 있는 addItem 호출!
          e.target.value = ""; // 같은 파일 또 올릴 수 있게 비워주기
        }} />
        <AdminAddButton onClick={() => fileInputRef.current?.click()} label="사진 추가" />
        <AdminSaveButton onClick={handleAllSave} isSaving={isSaving} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
       <div className="overflow-x-auto">
       <div className="min-w-[400px]">
          <div className="grid grid-cols-12 gap-4 py-5 bg-slate-50 border-b border-slate-100 text-admin-body font-semibold text-slate-500">
          <div className="col-span-1 text-center">순서</div>
          <div className="col-span-2">미리보기</div>

          <div className="hidden lg:block col-span-3">서브 제목</div>
          <div className="hidden lg:block col-span-3">메인 제목</div>
          <div className="block lg:hidden col-span-6">서브제목/메인제목</div>
          <div className="col-span-1 text-center">진열</div>
          <div className="col-span-2 text-center">삭제</div>
        </div>

        <DragDropContext onDragEnd={onReorder}>
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
                            src={item.previewUrl || item.imageUrl}
                            alt="p"
                            fill
                            className="object-contain"
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

                        {/* 3. 제목 입력  - PC*/}
                        <div className="hidden lg:block col-span-3">
                          <AdminInput
                            value={item.subtitle}
                            disabled={item.isDeleted}
                            onChange={(v) => handleChange(item.id, "subtitle", v)}
                          />
                        </div>


                        <div className="hidden lg:block col-span-3">
                          <AdminInput
                            value={item.mainTitle}
                            disabled={item.isDeleted}
                            onChange={(v) => handleChange(item.id, "mainTitle", v)}
                          />
                        </div>

                        {/* 3-1. 제목입력 - mobile */}
                        <div className="flex flex-col lg:hidden col-span-6 gap-2 text-admin-small">
                          <div className="flex flex-row gap-4">
                            <span>서브</span>
                            <AdminInput
                              value={item.subtitle}
                              disabled={item.isDeleted}
                              placeholder="서브 제목"
                              onChange={(v) => handleChange(item.id, "subtitle", v)}
                            />
                          </div>
                          <div className="flex flex-row gap-4">
                            <span>메인</span>
                            <AdminInput
                              value={item.mainTitle}
                              disabled={item.isDeleted}
                              placeholder="메인 제목"
                              onChange={(v) => handleChange(item.id, "mainTitle", v)}
                            />
                          </div>
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
       </div>
      </div>
      <div className="flex justify-center mt-10">
        <AdminSaveButton size="large" onClick={handleAllSave} isSaving={isSaving} />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
