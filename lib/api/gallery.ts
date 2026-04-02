import { GalleryItem } from "../types/gallery";

// 1. GET (그냥 호출)
export const getGalleryImages = async (limit?: number): Promise<GalleryItem[]> => {
  const res = await fetch(`/api/gallery${limit ? `?limit=${limit}` : ""}`, { cache: "no-store" });
  return res.json();
};

export const saveGalleryAll = async (items: GalleryItem[]) => {
  // 삭제할 Item ID 필터링
  const deletedIds = items.filter(item => item.isDeleted && !item.isNew).map(item => item.id);
  const finalItems = items
    .filter(item => !item.isDeleted)
    .map((item) => ({
      id: item.id,
      subtitle: item.subtitle,
      mainTitle: item.mainTitle,
      imageUrl: item.imageUrl,
      isVisible: item.isVisible,
      displayOrder: item.displayOrder,
    }));

  const res = await fetch(`/api/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ finalItems, deletedIds }),
  });

  if (!res.ok) throw new Error("서버 저장에 실패했습니다.");
  return res.json();
};