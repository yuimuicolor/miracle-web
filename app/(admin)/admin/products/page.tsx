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


  // 🔥 상품 추가
  const handleAddProduct = () => {
    const newItem: ProductItem = {
      id: Date.now(),
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
  // 대표 이미지 선택
  const handleMainImageUpload = (index: number, file: File) => {
    updateItem(index, "tempMainImage", file);
  };

  // 썸네일 선택
  const handleThumbnailUpload = (index: number, files: File[]) => {
    const existing = items[index].tempThumbnailFiles || [];
    updateItem(index, "tempThumbnailFiles", [...existing, ...files]);
  };

  // 상세 이미지 선택
  const handleDetailUpload = (index: number, files: File[]) => {
    const existing = items[index].tempDetailFiles || [];
    updateItem(index, "tempDetailFiles", [...existing, ...files]);
  };


  const removeMainImage = (index: number) => {
    updateItem(index, "tempMainImage", undefined);
    updateItem(index, "image", "");
  };

  const removeThumbnailImage = (index: number, i: number) => {
    updateItem(index, "tempThumbnailFiles", [
      ...(items[index].tempThumbnailFiles?.filter((_, idx) => idx !== i) || [])
    ]);

    updateItem(index, "thumbnailImages", [
      ...items[index].thumbnailImages.filter((_, idx) => idx !== i)
    ]);
  };

  const removeDetailImage = (index: number, i: number) => {
    updateItem(index, "tempDetailFiles", [
      ...(items[index].tempDetailFiles?.filter((_, idx) => idx !== i) || [])
    ]);

    updateItem(index, "detailImages", [
      ...items[index].detailImages.filter((_, idx) => idx !== i)
    ]);
  };
  // 값 변경
  const updateItem = (index: number, field: keyof ProductItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // 흑백 토글 (삭제 예정 처리)
  const toggleDelete = (id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isDeleted: !item.isDeleted } : item
      )
    );
  };


  // webp 파일로 변경 옵션
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };

  // 저장
  const handleSave = async () => {
    if (items.some(item => !item.brandEn || !item.brandKo)) {
      alert("영문 제목과 한글 제목은 필수입니다.");
      return;
    }

    setIsSaving(true);

    try {
      // 1️⃣ 삭제 처리
      const itemsToDelete = items.filter(i => i.isDeleted);
      const idsToDelete = itemsToDelete.filter(i => !i.isNew).map(i => i.id);

      if (idsToDelete.length > 0) {
        await supabase.from("products").delete().in("id", idsToDelete);
      }

      // 2️⃣ 저장 대상
      const itemsToSave = items.filter(i => !i.isDeleted);
      // 3️⃣ 이미지 업로드 및 URL 처리
      const processedItems = await Promise.all(
        itemsToSave.map(async (item, index) => {
          let finalImage = item.image || "";
          let finalThumbnailImages: string[] = [];
          let finalDetailImages: string[] = [];

          // ✅ 메인 이미지
          if (item.tempMainImage) {
            const compressedFile = await imageCompression(item.tempMainImage, options);
            const mainFilePath = `product-${String(item.id).padStart(2, '0')}.webp`;
            const { error: uploadError } = await supabase.storage.from("products").upload(mainFilePath, compressedFile, { upsert: true });
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from("products").getPublicUrl(mainFilePath);
            if (!data?.publicUrl) throw new Error("대표 이미지 URL 가져오기 실패");
            finalImage = data.publicUrl;
          }

          // ✅ 썸네일 이미지
          if (item.tempThumbnailFiles?.length) {
            for (let i = 0; i < item.tempThumbnailFiles.length; i++) {
              const file = item.tempThumbnailFiles[i];
              const compressedFile = await imageCompression(file, options);
              const filePath = `product-${String(item.id).padStart(2, '0')}/thumb/${String(i + 1).padStart(2, '0')}.webp`;

              const { error: uploadError } = await supabase.storage.from("products").upload(filePath, compressedFile, { upsert: true });
              if (uploadError) throw uploadError;

              const { data } = supabase.storage.from("products").getPublicUrl(filePath);
              if (!data?.publicUrl) throw new Error("썸네일 URL 가져오기 실패");

              finalThumbnailImages.push(data.publicUrl);
            }
          } else {
            // temp가 없으면 기존 URL 그대로
            finalThumbnailImages = [...item.thumbnailImages];
          }


          if (item.tempDetailFiles?.length) {
            for (let i = 0; i < item.tempDetailFiles.length; i++) {
              const file = item.tempDetailFiles[i];
              const filePath = `product-${String(item.id).padStart(2, '0')}/detail/${String(i + 1).padStart(2, '0')}.webp`;
              const compressedFile = await imageCompression(file, options);

              const { error: uploadError } = await supabase.storage.from("products").upload(filePath, compressedFile, { upsert: true });
              if (uploadError) throw uploadError;

              const { data } = supabase.storage.from("products").getPublicUrl(filePath);
              if (!data?.publicUrl) throw new Error("상세 이미지 URL 가져오기 실패");

              finalDetailImages.push(data.publicUrl);
            }
          } else {
            // temp가 없으면 기존 URL 그대로
            finalDetailImages = [...item.detailImages];
          }


          // 4️⃣ DB 업로드 데이터 구성
          const baseData = {
            brandEn: item.brandEn,
            brandKo: item.brandKo,
            desc: item.desc || "",
            category: item.category || "",
            options: item.options || [],
            image: finalImage,
            thumbnailImages: finalThumbnailImages,
            detailImages: finalDetailImages,
            purchaseLink: item.purchaseLink || "",
            isVisible: item.isVisible ?? true,
            displayOrder: index + 1, // UI 순서 기준
          };

          return item.isNew ? baseData : { ...baseData, id: item.id };
        })
      );

      // 5️⃣ DB upsert
      const { error } = await supabase.from("products").upsert(processedItems, {
        onConflict: "id",
        defaultToNull: false,
      });
      if (error) throw error;

      alert("✅ 저장 완료");
      fetchProducts();

    } catch (e: any) {
      console.error(e);
      alert(`❌ 저장 실패: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10">로딩중...</div>;

  return (
    <div>
      <AdminHeader title="상품 관리" subtitle="상품을 관리하는 페이지입니다. 이미지 파일은 webp 형식으로 업로드됩니다." tip="* 변경사항이 있을 경우 [저장] 버튼을 눌러주세요." />
      <div className="flex gap-3 mb-10 justify-end">
        <AdminAddButton onClick={handleAddProduct} label="상품 추가" />
        <AdminSaveButton onClick={handleSave} isSaving={isSaving} />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-20 py-5 bg-slate-50 border-b border-slate-100 text-admin-body font-semibold text-slate-500">
          <div className="col-span-1 text-center">순서</div>
          <div className="col-span-3 text-center">사진</div>
          <div className="col-span-6 text-center">상품 정보</div>
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
                        className={`grid grid-cols-12 gap-20 items-start py-8 border-b border-gray-300 last:border-0 transition-all ${item.isDeleted
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
                          removeMainImage={removeMainImage}
                          removeThumbnailImage={removeThumbnailImage}
                          removeDetailImage={removeDetailImage}
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
