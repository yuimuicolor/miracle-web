"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import AdminAddButton from "@/components/admin/AdminAddButton";
import { ProductItem } from "@/lib/productsData";
import ProductItemForm from "@/components/admin/ProductItemForm";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";


export default function AdminProductsPage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔥 fetch
  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(
      newItems.map((item, index) => ({ ...item, displayOrder: index + 1 })),
    );
  };


  // 🔥 webp 업로드
  const uploadImage = async (file: File, path: string) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    };

    const compressedFile = await imageCompression(file, options);

    const fileName = `${Date.now()}.webp`;

    const { error } = await supabase.storage
      .from("products")
      .upload(`${path}/${fileName}`, compressedFile);

    if (error) throw error;

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(`${path}/${fileName}`);

    return data.publicUrl;
  };

  // 🔥 상품 추가
  const handleAddProduct = () => {
    const newItem: ProductItem = {
      brandEn: "",
      brandKo: "",
      desc: "",
      category: "",
      options: [],
      image: "",
      thumbnailImages: [],
      detailImages: [],
      purchaseLink: "",
      isVisible: true,
      displayOrder: items.length + 1,
      isNew: true,
    };

    setItems([...items, newItem]);
  };

  // 🔥 대표 이미지 업로드
  const handleMainImageUpload = async (index: number, file: File) => {
    const url = await uploadImage(file, `product-${Date.now()}`);
    updateItem(index, "image", url);
  };

  // 🔥 썸네일 추가
  const handleThumbnailUpload = async (index: number, file: File) => {
    const url = await uploadImage(file, `thumb`);
    const newList = [...items[index].thumbnailImages, url];
    updateItem(index, "thumbnailImages", newList);
  };

  // 🔥 디테일 추가
  const handleDetailUpload = async (index: number, file: File) => {
    const url = await uploadImage(file, `detail`);
    const newList = [...items[index].detailImages, url];
    updateItem(index, "detailImages", newList);
  };

  // 🔥 값 변경
  const updateItem = (index: number, field: keyof ProductItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // 🔥 삭제
  const toggleDelete = (index: number) => {
    const newItems = [...items];
    newItems[index].isDeleted = !newItems[index].isDeleted;
    setItems(newItems);
  };

  // 🔥 저장
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const itemsToDelete = items.filter((i) => i.isDeleted);

      const idsToDelete = itemsToDelete
        .filter((i) => !i.isNew)
        .map((i) => i.id);

      if (idsToDelete.length > 0) {
        await supabase.from("products").delete().in("id", idsToDelete);
      }

      const itemsToSave = items.filter((i) => !i.isDeleted);

      const finalPayload = itemsToSave.map((item, index) => {
        const base = {
          brandEn: item.brandEn,
          brandKo: item.brandKo,
          desc: item.desc,
          category: item.category,
          options: item.options,
          image: item.image,
          thumbnailImages: item.thumbnailImages,
          detailImages: item.detailImages,
          purchaseLink: item.purchaseLink,
          isVisible: item.isVisible,
          displayOrder: index + 1,
        };

        if (item.isNew) return base;
        return { ...base, id: item.id };
      });

      const { error } = await supabase.from("products").upsert(finalPayload, {
        onConflict: "id",
        defaultToNull: false,
      });

      if (error) throw error;

      alert("✅ 저장 완료");
      fetchProducts();
    } catch (e: any) {
      console.error(e);
      alert("❌ 저장 실패");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10">로딩중...</div>;

  return (
    <div>
      <AdminHeader title="상품 관리" subtitle="상품을 관리하는 페이지입니다." tip="* 변경사항이 있을 경우 [저장] 버튼을 눌러주세요." />
      <div className="flex gap-3 mb-10 justify-end">
        <AdminAddButton onClick={handleAddProduct} label="상품 추가" />
        <AdminSaveButton onClick={handleSave} isSaving={isSaving} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 py-5 bg-slate-50 border-b border-slate-100 text-admin-body font-semibold text-slate-500">
          <div className="col-span-1 text-center">순서</div>
          <div className="col-span-2 text-center">사진</div>
          <div className="col-span-2 text-center">영어 제목</div>
          <div className="col-span-2 text-center">한글 제목</div>
          <div className="col-span-1 text-center">카테고리</div>
          <div className="col-span-2 text-center">구매 링크</div>
          <div className="col-span-1 text-center">진열</div>
          <div className="col-span-1 text-center">삭제</div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
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
                        <ProductItemForm
                          key={index}
                          item={item}
                          index={index}
                          updateItem={updateItem}
                          handleMainImageUpload={handleMainImageUpload}
                          handleThumbnailUpload={handleThumbnailUpload}
                          handleDetailUpload={handleDetailUpload}
                          toggleDelete={toggleDelete}
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
  );
}
