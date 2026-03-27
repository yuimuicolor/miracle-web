import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/utils/storage";
import { toggleDeleteState } from "@/lib/utils/storage";
import { getAllGalleryForAdmin } from "@/lib/api/gallery";
import { reorderItems } from "@/lib/utils/reorder";
import { GalleryItem } from "@/lib/types/gallery";
import { cleanupStorageFiles, deleteMarkedItems, ensureRecordId } from "@/lib/api/common";

export const useGalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 1. 데이터 불러오기
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await getAllGalleryForAdmin();
      setItems(data);
    } catch (error) {
      console.error("데이터 로딩 중 에러 발생:", error);
      alert("데이터를 불러오지 못했습니다. 새로고침 해보세요!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // 2. 입력값 변경
  const handleChange = (id: number, field: keyof GalleryItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  // 3. 삭제 토글
  const toggleDelete = (id: number) => {
    setItems((prev) => toggleDeleteState(prev, id));
  };

  // 4. 이미지 교체 (미리보기)
  const handleReplaceImage = (id: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, tempFile: file, previewUrl } : item,
      ),
    );
  };

  // 5. 새 아이템 추가 (미리보기)
  const addItem = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const newItem: GalleryItem = {
      id: Date.now(), // 임시 ID
      subtitle: "",
      mainTitle: "",
      imageUrl: "",
      previewUrl,
      tempFile: file,
      isVisible: true,
      displayOrder: items.length + 1,
      isNew: true,
    };

    setItems((prev) => [...prev, newItem]);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 6. 드래그 앤 드롭 순서 변경
const onReorder = (result: any) => {
  if (!result.destination) return;
  
  setItems((prev) => 
    reorderItems(prev, result.source.index, result.destination.index)
  );
};

  // 7. 전체 저장 (핵심 로직)
  const handleAllSave = async () => {
    const activeItems = items.filter((item) => !item.isDeleted);
    if (
      activeItems.some(
        (item) => !item.subtitle.trim() || !item.mainTitle.trim(),
      )
    ) {
      alert("모든 항목의 서브 제목과 메인 제목을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // [A] 공통 함수로 삭제 처리
      await deleteMarkedItems("gallery", items);

      // [B] 신규/수정 처리
      const activeItems = items.filter((item) => !item.isDeleted);
      const finalItems = await Promise.all(
        activeItems.map(async (item, index) => {
          let finalImageUrl = item.imageUrl;
          const currentId = item.isNew 
            ? await ensureRecordId("gallery", { subtitle: item.subtitle, mainTitle: item.mainTitle, displayOrder: index + 1 }) 
            : item.id;

          if (item.tempFile) {
            const prefix = `gallery-${String(currentId).padStart(2, "0")}`;
            const newName = `${prefix}_${Date.now()}.webp`;
            // 1. 기존 파일 청소 (함수 사용)
            await cleanupStorageFiles("gallery", "", [newName], prefix); 
            // 2. 업로드
            finalImageUrl = await uploadImage(item.tempFile, "gallery", newName);
          }

          return { id: currentId, imageUrl: finalImageUrl, subtitle: item.subtitle, mainTitle: item.mainTitle, isVisible: item.isVisible, displayOrder: index + 1 };
        })
      );

      await supabase.from("gallery").upsert(finalItems);
      alert("✅ 갤러리 저장이 완료되었습니다.");
      await fetchGallery();
    } catch (error: any) {
      console.error(error);
      alert(`❌ 저장 실패: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
};
