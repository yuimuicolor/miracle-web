import { ImageSlot } from "@/lib/types/products";

  // 7. 리스트 이미지 삭제
  const handleRemoveImage = (
    index: number,
    field: "thumbnailImages" | "detailImages",
    id: string,
  ) => {
    const filtered = items[index][field].filter((img) => img.id !== id);
    updateItem(index, field, filtered);
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
  