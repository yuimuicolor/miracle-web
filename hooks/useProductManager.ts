import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import * as imageCompression from "browser-image-compression";
import { ProductItem, ImageSlot } from "@/lib/productsData";
import { DropResult } from "@hello-pangea/dnd";

export const useProductManager = () => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // WebP 변환 옵션 (유이 누나의 1920px 그리드 최적화)
  const compressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp" as const,
  };

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
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDeleted: !item.isDeleted } : item,
      ),
    );
  };

  // 5. 드래그 앤 드롭 순서 변경 (전체 상품 순서)
  const onReorder = (result: DropResult) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setItems(newItems.map((item, idx) => ({ ...item, displayOrder: idx + 1 })));
  };

  // 6. 이미지 압축 및 업로드 핵심 로직
  const uploadAndGetUrl = async (file: File, path: string) => {
    // 타입 에러 방지를 위해 any 캐스팅 후 호출
    const compressed = await (imageCompression as any).default(
      file,
      compressOptions,
    );
    const { error } = await supabase.storage
      .from("products")
      .upload(path, compressed, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    return data.publicUrl;
  };

  // 7. 최종 저장
  const handleSave = async () => {
    // 삭제되지 않은 아이템들만 제목 체크 (삭제 처리할 건 제목 없어도 통과!)
    const activeItems = items.filter((i) => !i.isDeleted);
    if (activeItems.some((i) => !i.mainTitle)) {
      return alert("제목은 필수입니다.");
    }

    setIsSaving(true);

    try {
      // 1. 삭제 처리 (isDeleted가 true인 것들 DB에서 즉시 삭제)
      const idsToDelete = items
        .filter((i) => i.isDeleted && !i.isNew)
        .map((i) => i.id);
      if (idsToDelete.length > 0) {
        const { error: delError } = await supabase
          .from("products")
          .delete()
          .in("id", idsToDelete);
        if (delError) throw delError;
      }

      // 2. 저장할 아이템들 가공
      const itemsToSave = items.filter((i) => !i.isDeleted);

      const processedItems = await Promise.all(
        itemsToSave.map(async (item, idx) => {
          const folder = `product-${String(item.id).slice(-6)}`;

          // 메인 이미지 업로드
          let finalMain = item.image;
          if (item.tempMainFile) {
            finalMain = await uploadAndGetUrl(
              item.tempMainFile,
              `${folder}/main.webp`,
            );
          }

          // 리스트 이미지 처리 함수
          const processList = async (list: ImageSlot[], type: string) => {
            return Promise.all(
              list.map(async (slot, i) => {
                if (slot.file) {
                  return await uploadAndGetUrl(
                    slot.file,
                    `${folder}/${type}/${i + 1}.webp`,
                  );
                }
                return slot.url || "";
              }),
            );
          };

          const finalThumbs = await processList(item.thumbnailImages, "thumb");
          const finalDetails = await processList(item.detailImages, "detail");

          // ✅ 1. 기본 저장 객체 (id 제외)
          const saveObject: any = {
            subTitle: item.subTitle,
            mainTitle: item.mainTitle,
            desc: item.desc,
            category: item.category,
            options: item.options,
            image: finalMain,
            thumbnailImages: finalThumbs,
            detailImages: finalDetails,
            purchaseLink: item.purchaseLink,
            isVisible: item.isVisible,
            displayOrder: idx + 1,
          };

          // ✅ 2. 기존 상품일 때만 id를 "추가"한다
          // 새 상품(isNew: true)일 때는 saveObject에 'id'라는 키 자체가 생성되지 않음!
          if (!item.isNew) {
            saveObject.id = item.id;
          }

          return saveObject;
        }),
      );

      // 3. DB Upsert
      const itemsToInsert = processedItems.filter((item) => !item.id);
      const itemsToUpdate = processedItems.filter((item) => item.id);

      if (itemsToInsert.length > 0) {
        const { error } = await supabase.from("products").insert(itemsToInsert);
        if (error) throw error;
      }
      if (itemsToUpdate.length > 0) {
        const { error } = await supabase.from("products").upsert(itemsToUpdate);
        if (error) throw error;
      }

      alert("✅ 저장 완료!");
      await fetchProducts(); // 최신 데이터로 리프레시
    } catch (e: any) {
      console.error("저장 중 상세 오류:", e);
      alert(`❌ 오류: ${e.message || "저장에 실패했습니다."}`);
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
