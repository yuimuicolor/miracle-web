import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ProductItem, ImageSlot } from "@/lib/productsData";
import { DropResult } from "@hello-pangea/dnd";
import { getFileNameFromUrl, toggleDeleteState, uploadImage } from "@/lib/supabase-utils";
import { cleanupStorageFiles, ensureRecordId } from "@/lib/api/supabase-service";

export const useProductManager = () => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. 데이터 가져오기
  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("displayOrder", { ascending: true });

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

    // 1. '삭제 예정'인 아이템 제거
    const deletedItems = items.filter((item) => item.isDeleted);
    // 2. '삭제 예정'이 아닌 아이템만 필터링
    const activeItems = items.filter((item) => !item.isDeleted);

    // 3. 순서 변경
    const reorderedActive = Array.from(activeItems);
    const [moved] = reorderedActive.splice(result.source.index, 1);
    reorderedActive.splice(result.destination.index, 0, moved);

    // 4. 변경된 순서에 맞게 displayOrder 업데이트 (1부터 시작)
    const updatedActive = reorderedActive.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    // 5. 삭제 예정 아이템은 기존 displayOrder 유지하면서 뒤에 붙이기
    setItems([...updatedActive, ...deletedItems]);
  };

  // 6-1. 리스트 이미지 처리 (청소 후 재업로드)
  const processList = async (
    list: ImageSlot[],
    type: string,
    folder: string,
  ) => {
    const uploadPromises = list.map(async (slot) => {
      // [Case A] 새로 추가된 파일이 있는 경우 -> 무조건 업로드
    if (slot.file) {
      const uniqueName = `${crypto.randomUUID()}_${Date.now()}.webp`;
      const targetPath = `${folder}/${type}/${uniqueName}`;
      return await uploadImage(slot.file, "products", targetPath);
    }
    
    // [Case B] 파일은 없고 기존 URL만 있는 경우 -> 유지
    if (slot.url) {
      return slot.url;
    }

    return null;
    });

    const finalUrls = (await Promise.all(uploadPromises)).filter((url): url is string => !!url);

    // 2. 청소 로직: 현재 DB에 저장될 finalUrls에 포함되지 않은 파일들은 스토리지에서 삭제
  // 여기서 getFileNameFromUrl을 써서 실제 파일명만 추출해야 해요.
  const activeFileNames = finalUrls.map(url => getFileNameFromUrl(url));
  await cleanupStorageFiles("products", `${folder}/${type}`, activeFileNames);

  return finalUrls; // 이 배열이 그대로 DB의 column으로 들어갑니다.
  };

  // 7. 최종 저장
  const handleSave = async () => {
    // 삭제되지 않은 아이템들만 제목 체크 (삭제 처리할 건 제목 없어도 통과!)
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
    try {
      // 1. 삭제 대상 제거
      const idsToDelete = items
        .filter((i) => i.isDeleted && !i.isNew)
        .map((i) => i.id);
      if (idsToDelete.length > 0)
        await supabase.from("products").delete().in("id", idsToDelete);

      const activeItems = items.filter((i) => !i.isDeleted);

      // 2. 저장 및 이미지 처리
      const finalItemsToUpdate = await Promise.all(
        activeItems.map(async (item) => {
          const currentId = item.isNew
            ? await ensureRecordId("products", {
                mainTitle: item.mainTitle,
                displayOrder: item.displayOrder,
              })
            : item.id;

          const folder = `product-${String(currentId).padStart(2, "0")}`;

          // 이미지 업로드 (업로드 시 UUID 사용으로 덮어쓰기 문제 해결)
          let finalMain = item.image;
          if (item.tempMainFile) {
            const mainName = `main_${Date.now()}.webp`; // 유니크한 이름
            await cleanupStorageFiles("products", folder, [mainName], "main_");
            finalMain = await uploadImage(item.tempMainFile, "products", `${folder}/${mainName}`);
          }

          const finalThumbs = await processList(
            item.thumbnailImages,
            "thumb",
            folder,
          );
          const finalDetails = await processList(
            item.detailImages,
            "detail",
            folder,
          );

          return {
            ...item,
            id: currentId,
            image: finalMain,
            thumbnailImages: finalThumbs,
            detailImages: finalDetails,
            isNew: false,
          };
        }),
      );

      const dataToUpsert = finalItemsToUpdate.map(
        ({ tempMainFile, isNew, isDeleted, ...rest }) => ({
            ...rest,
        })
      );

      const { error } = await supabase.from("products").upsert(dataToUpsert);
      if (error) throw error;

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
    onReorder,
    updateItem,
    toggleDelete,
  };
};
