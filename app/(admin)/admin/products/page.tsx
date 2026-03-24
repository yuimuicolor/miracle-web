"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { AdminHeader } from "@/components/admin/AdminHeader";
import AdminSaveButton from "@/components/admin/AdminSaveButton";
import AdminAddButton from "@/components/admin/AdminAddButton";

interface ProductItem {
  id?: number;
  brandEn: string;
  brandKo: string;
  desc: string;
  category: string;
  options: string[];
  image: string;
  thumbnailImages: string[];
  detailImages: string[];
  purchaseLink: string;
  isVisible: boolean;
  displayOrder: number;

  isDeleted?: boolean;
  isNew?: boolean;
}

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

      {items.map((item, index) => (
        <div
          key={index}
          className={`border p-5 mb-6 rounded ${
            item.isDeleted ? "opacity-40" : ""
          }`}
        >
          <input
            placeholder="brandEn"
            value={item.brandEn}
            onChange={(e) => updateItem(index, "brandEn", e.target.value)}
          />

          <input
            placeholder="brandKo"
            value={item.brandKo}
            onChange={(e) => updateItem(index, "brandKo", e.target.value)}
          />

          <input
            placeholder="category"
            value={item.category}
            onChange={(e) => updateItem(index, "category", e.target.value)}
          />

          <input
            placeholder="purchaseLink"
            value={item.purchaseLink}
            onChange={(e) => updateItem(index, "purchaseLink", e.target.value)}
          />

          {/* 대표 이미지 */}
          <div className="mt-4">
            <input
              type="file"
              onChange={(e) =>
                e.target.files &&
                handleMainImageUpload(index, e.target.files[0])
              }
            />
            {item.image && (
              <Image src={item.image} alt="" width={200} height={200} />
            )}
          </div>

          {/* 썸네일 */}
          <div className="mt-4">
            <input
              type="file"
              onChange={(e) =>
                e.target.files &&
                handleThumbnailUpload(index, e.target.files[0])
              }
            />
            <div className="flex gap-2">
              {item.thumbnailImages.map((img, i) => (
                <Image key={i} src={img} alt="" width={80} height={80} />
              ))}
            </div>
          </div>

          {/* 디테일 */}
          <div className="mt-4">
            <input
              type="file"
              onChange={(e) =>
                e.target.files && handleDetailUpload(index, e.target.files[0])
              }
            />
            <div className="flex gap-2">
              {item.detailImages.map((img, i) => (
                <Image key={i} src={img} alt="" width={80} height={80} />
              ))}
            </div>
          </div>

          <button
            onClick={() => toggleDelete(index)}
            className="mt-4 text-red-500"
          >
            {item.isDeleted ? "복구" : "삭제"}
          </button>
        </div>
      ))}
    </div>
  );
}
