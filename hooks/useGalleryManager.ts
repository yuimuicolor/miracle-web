import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage, getFileNameFromUrl } from "@/lib/supabase-utils";
import { toggleDeleteState } from "@/lib/supabase-utils";
import { GalleryItem, getAllGalleryForAdmin } from "@/lib/galleryService";
import { ensureRecordId } from "@/lib/api/supabase-service";

export const useGalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 1. 데이터 불러오기
  const fetchGallery = async () => {
    setLoading(true);
    try {
      // 아까 합친 파일에서 가져온 함수!
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
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(
      newItems.map((item, index) => ({ ...item, displayOrder: index + 1 })),
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
      // [A] 삭제 처리
      const itemsToDelete = items.filter(
        (item) => item.isDeleted && !item.isNew,
      );
      if (itemsToDelete.length > 0) {
        const deletePaths = itemsToDelete
          .map((item) => getFileNameFromUrl(item.imageUrl))
          .filter(Boolean) as string[];
        const deleteIds = itemsToDelete.map((item) => item.id);

        await Promise.all([
          supabase.storage.from("gallery").remove(deletePaths),
          supabase.from("gallery").delete().in("id", deleteIds),
        ]);
      }

      // [B] 신규/수정 처리
      const itemsToSave = items.filter((item) => !item.isDeleted);
      const finalItems = await Promise.all(
        itemsToSave.map(async (item, index) => {
          let finalImageUrl = item.imageUrl;

          const currentId = item.isNew
            ? await ensureRecordId("gallery", {
                subtitle: item.subtitle,
                mainTitle: item.mainTitle,
                displayOrder: index + 1,
                isVisible: item.isVisible,
              })
            : item.id;

          if (item.tempFile) {
            // 1. 기존 파일 및 찌꺼기 파일들 싹 청소하기
            if (item.imageUrl || !item.isNew) {
              const formattedId = String(currentId).padStart(2, "0");
              const prefix = `gallery-${formattedId}_`; // 예: "gallery-01_"

              // A. 스토리지에서 해당 ID로 시작하는 모든 파일 목록 가져오기
              const { data: allFiles } = await supabase.storage
                .from("gallery")
                .list();

              if (allFiles) {
                // B. 파일명 중에 해당 ID를 포함한 것들만 필터링 (예: gallery-01_123, gallery-01_456...)
                const filesToDelete = allFiles
                  .filter((f) => f.name.startsWith(prefix))
                  .map((f) => f.name);

                if (filesToDelete.length > 0) {
                  // C. 찾은 찌꺼기들 한 번에 다 지우기
                  const { error: deleteError } = await supabase.storage
                    .from("gallery")
                    .remove(filesToDelete);

                  if (deleteError)
                    console.error("찌꺼기 파일 삭제 실패:", deleteError);
                  else console.log("청소 완료된 파일들:", filesToDelete);
                }
              }
            }

            // 2. 새 파일 업로드 (기존 로직 동일)
            const newPath = `gallery-${String(currentId).padStart(2, "0")}_${Date.now()}.webp`;
            finalImageUrl = await uploadImage(
              item.tempFile,
              "gallery",
              newPath,
            );
          }

          return {
            id: currentId,
            imageUrl: finalImageUrl,
            subtitle: item.subtitle,
            mainTitle: item.mainTitle,
            isVisible: item.isVisible,
            displayOrder: index + 1,
          };
        }),
      );

      const { error: upsertError } = await supabase
        .from("gallery")
        .upsert(finalItems);
      if (upsertError) throw upsertError;

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
    handleDragEnd,
    handleChange,
    handleAllSave,
  };
};
