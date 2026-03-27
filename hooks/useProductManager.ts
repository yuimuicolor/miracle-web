import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { DropResult } from "@hello-pangea/dnd";

import {
  toggleDeleteState,
} from "@/lib/utils/storage";
import { reorderItems } from "@/lib/utils/reorder";
import { ImageSlot, ProductItem } from "@/lib/types/products";
import {
  getAllProducts,
  prepareProductData,
  saveProductsAll,
} from "@/lib/api/products";

export const useProductManager = () => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. 데이터 가져오기
  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();

    if (data) {
      const formatted = data.map((item: any) => ({
        ...item,
        thumbnailImages:
          item.thumbnailImages?.map((url: string) => ({
            id: crypto.randomUUID(),
            url,
          })) || [],
        detailImages:
          item.detailImages?.map((url: string) => ({
            id: crypto.randomUUID(),
            url,
          })) || [],
      }));
      setItems(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. 상품 추가 (기본 상태 정의)
  const handleAddProduct = () => {
    const newItem: ProductItem = {
      id: Date.now(), // 임시 ID
      subTitle: "",
      mainTitle: "",
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

  // 3. 필드 업데이트 (이미지 포함)
  const updateItem = (index: number, field: keyof ProductItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // 4. 삭제 토글
  const toggleDelete = (id: number) => {
    setItems((prev) => toggleDeleteState(prev, id));
  };

  // 5. 드래그 앤 드롭 순서 변경 (전체 상품 순서)
  const onReorder = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    setItems((prev) => reorderItems(prev, sourceIndex, destinationIndex));
  };

  // 6. 리스트 이미지 순서 변경 (썸네일/상세 각각)
  const reorderImageList = (
    productIndex: number,
    field: "thumbnailImages" | "detailImages",
    result: DropResult,
  ) => {
    // 1. 드롭 대상이 없으면 종료
    if (!result.destination) return;

    // 2. 해당 상품의 기존 이미지 리스트 복사
    const list = Array.from(items[productIndex][field] || []);

    // 3. 배열 내 위치 이동
    const [moved] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, moved);

    // 4. 새로운 순서에 맞춰 displayOrder 부여 (1부터 시작)
    const updatedList = list.map((slot, idx) => ({
      ...slot,
      displayOrder: idx + 1,
    }));

    // 5. 전체 상품 상태 업데이트 (이미 만들어둔 updateItem 활용)
    updateItem(productIndex, field, updatedList);
  };

  // 6. 리스트 이미지 추가 (ID 생성 포함)
  const handleListUpload = (
    index: number,
    field: "thumbnailImages" | "detailImages",
    files: File[],
  ) => {
    const newSlots: ImageSlot[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));
    updateItem(index, field, [...(items[index][field] || []), ...newSlots]);
  };

  // 7. 리스트 이미지 삭제
  const handleRemoveImage = (
    index: number,
    field: "thumbnailImages" | "detailImages",
    id: string,
  ) => {
    const filtered = items[index][field].filter((img) => img.id !== id);
    updateItem(index, field, filtered);
  };

  // 8. 옵션 추가
  const handleAddOption = (index: number, newOption: string) => {
    if (!newOption.trim()) return;
    const nextOptions = [...(items[index].options || []), newOption.trim()];
    updateItem(index, "options", nextOptions);
  };

  // 9. 옵션 삭제
  const handleRemoveOption = (productIndex: number, optIdx: number) => {
    const newOptions = items[productIndex].options.filter(
      (_, i) => i !== optIdx,
    );
    updateItem(productIndex, "options", newOptions);
  };

  // 11. 최종 저장
  const handleSave = async () => {
    const activeItems = items.filter((i) => !i.isDeleted);

    // 1. 유효하지 않은 아이템 찾기 (대표 이미지, 제목이 없는 경우)
    const invalidItem = activeItems.find(
      (i) =>
        (!i.image && !i.tempMainFile) ||
        !i.mainTitle ||
        !i.thumbnailImages ||
        i.thumbnailImages.length === 0,
    );

    if (invalidItem) {
      // 2. 제목이 없는 경우 우선 순위로 체크
      if (!invalidItem.mainTitle) {
        alert("❌ 모든 상품은 메인 제목이 필요합니다.");
      }
      // 3. 대표 이미지 없는 경우 체크
      else if (!invalidItem.image && !invalidItem.tempMainFile) {
        alert("❌ 모든 상품은 대표 이미지가 필요합니다.");
      }
      // 4. 썸네일 이미지 없는 경우 체크
      else if (
        !invalidItem.thumbnailImages ||
        invalidItem.thumbnailImages.length === 0
      ) {
        alert("❌ 모든 상품은 최소 1개 이상의 썸네일 이미지가 필요합니다.");
      }

      return; // 검사 걸리면 중단
    }

    setIsSaving(true);

    try {const deletedIds = items
        .filter((i) => i.isDeleted && !i.isNew)
        .map((i) => i.id);

      // 2. 이미지 처리 및 데이터 가공
      const finalItems = await prepareProductData(supabase, activeItems);
      
      await saveProductsAll(finalItems, deletedIds);

      alert("✅ 저장이 완료되었습니다!");
      await fetchProducts();
    } catch (e: any) {
      alert(`❌ 오류: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
};
