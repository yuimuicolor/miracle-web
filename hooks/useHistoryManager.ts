import { useState, useEffect, useRef } from "react";
import { uploadImage } from "@/lib/utils/storage";
import { toggleDeleteState } from "@/lib/utils/storage";
import { reorderItems } from "@/lib/utils/reorder";
import { cleanupStorageFiles, ensureRecordId } from "@/lib/api/common";
import { supabase } from "@/lib/supabase/client";
import { HistoryItem } from "@/lib/types/aboutUs";
import { getHistoryItems, saveHistoryItems } from "@/lib/api/history";

export const useHistoryManager = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 1. 데이터 불러오기
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistoryItems();
      setItems(data);
    } catch (error) {
      console.error("데이터 로딩 중 에러 발생:", error);
      alert("데이터를 불러오지 못했습니다. 새로고침 해보세요!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 2. 입력값 변경
  const handleChange = (id: number, field: keyof HistoryItem, value: any) => {
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
    const newItem: HistoryItem = {
      id: Date.now(), // 임시 ID (실제 저장 시 DB에서 받아올 예정)
      year: "",
      date: "",
      title: "",
      imageUrl: "",
      previewUrl,
      tempFile: file,
      isVisible: true,
      displayOrder: items.length + 1,
      isNew: true, // 신규 아이템 표시
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
      reorderItems(prev, result.source.index, result.destination.index),
    );
  };

  // 7. 전체 저장 (핵심 로직)
  const handleAllSave = async () => {
    const activeItems = items.filter((item) => !item.isDeleted);
    if (
      activeItems.some(
        (item) => !item.title.trim() || !item.year.trim() || !item.date.trim(),
      )
    ) {
      alert("모든 항목의 제목, 연도, 날짜를 입력해주세요.");
      return;
    }
    setIsSaving(true);
    try {
      // 2. 이미지 업로드 및 ID 확보 (신규 아이템은 DB에 먼저 등록해서 ID부터 받아와야 함)
      const processedItems = await Promise.all(
        items.map(async (item, index) => {
          if (item.isDeleted) return item;
          let finalImageUrl = item.imageUrl;

          // [A] 신규 아이템이면 DB에서 진짜 ID부터 받아오기
          const currentId = item.isNew
            ? await ensureRecordId(supabase, "history", {
                title: item.title,
                year: item.year,
                date: item.date,
                displayOrder: index + 1,
              })
            : item.id;

          // [B] 새로 선택한 이미지가 있다면 업로드
          if (item.tempFile) {
            const prefix = `history-${String(currentId).padStart(2, "0")}`;
            const newName = `${prefix}_${Date.now()}.webp`;

            await cleanupStorageFiles(supabase, "aboutUs", "history", [newName], prefix); // 기존 파일 청소
            finalImageUrl = await uploadImage(
              supabase, 
              item.tempFile,
              "aboutUs/history",
              newName,
              { maxWidthOrHeight: 2000, maxSizeMB: 3 },
            );
          }

          return {
            id: currentId,
            imageUrl: finalImageUrl,
            title: item.title,
            year: item.year,
            date: item.date,
            isVisible: item.isVisible,
            displayOrder: index + 1,
          };
        }),
      );

      await saveHistoryItems(processedItems);

      alert("✅ 히스토리 저장이 완료되었습니다.");
      await fetchHistory();
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
