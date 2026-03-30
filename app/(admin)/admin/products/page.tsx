"use client";

import { useProductManager } from "@/hooks/useProductManager";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import AdminAddButton from "@/components/admin/AdminAddButton";
import ProductItemForm from "@/components/admin/ProductItemForm";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useRef } from "react";


export default function AdminProductsPage() {
  const {
    items,
    loading,
    isSaving,
    handleAddProduct,
    handleSave,
    handleAddOption,
    handleRemoveOption,
    handleListUpload,
    handleRemoveImage,
    onReorder,
    reorderImageList,
    updateItem,
    toggleDelete,
  } = useProductManager();

  const scrollRef = useRef<HTMLDivElement>(null);

  // 상품 추가 버튼 클릭 시 새로 추가된 상품으로 스크롤 이동
  const onAddClick = () => {
    handleAddProduct();
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  if (loading) return <div className="p-10">로딩중...</div>;

  return (
    <div>
      <AdminHeader title="상품 관리" subtitle="상품을 관리하는 페이지입니다. 이미지 파일은 webp 형식으로 업로드됩니다." tip="* 변경사항이 있을 경우 [저장] 버튼을 눌러주세요." />
      <div className="flex gap-3 mt-6 lg:mt-0 mb-10 justify-end">
        <AdminAddButton onClick={onAddClick} label="상품 추가" />
        <AdminSaveButton onClick={handleSave} isSaving={isSaving} />
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
       <div className="w-full min-w-[1000px]">
         <div className="grid grid-cols-12 gap-20 py-5 bg-slate-50 border-b border-slate-100 text-admin-small lg:text-admin-body font-semibold text-slate-500">
          <div className="col-span-1 text-center">순서</div>
          <div className="col-span-3 text-center">사진</div>
          <div className="col-span-6 text-center">상품 정보</div>
          <div className="col-span-1 text-center">진열</div>
          <div className="col-span-1 text-center">삭제</div>
        </div>

     <div className="w-full min-w-[1000px]">
         <DragDropContext onDragEnd={onReorder}>
          <Droppable droppableId="products-list">
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
                        className={`w-full grid grid-cols-12 gap-20 items-start py-8 border-b border-gray-300 last:border-0 transition-all ${item.isDeleted
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
                        <ProductItemForm
                          item={item}
                          index={index}
                          updateItem={updateItem}
                          toggleDelete={toggleDelete}
                          handleListUpload={handleListUpload}
                          handleRemoveImage={handleRemoveImage}
                          reorderImageList={reorderImageList}
                          handleAddOption={handleAddOption}
                          handleRemoveOption={handleRemoveOption}

                        />
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
        <AdminSaveButton size="large" onClick={handleSave} isSaving={isSaving} />
      </div>
      <div ref={scrollRef} /> 
    </div>
  );
}
