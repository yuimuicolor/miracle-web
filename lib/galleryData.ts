import { supabase } from "@/lib/supabase";

export interface GalleryImageItem {
  id: number;
  createdAt?: string;
  fileName: string;
  subtitle: string;
  mainTitle: string;
  isVisible: boolean;
  displayOrder: number;
  src: string;
  alt: string;
}

// 2. 갤러리 이미지 리스트 로딩
export const getGalleryImages = async (
  limit?: number,
): Promise<GalleryImageItem[]> => {
  let query = supabase
    .from("gallery")
    .select("*")
    .eq("isVisible", true) // 노출 여부 필터링
    .order("displayOrder", { ascending: true }); // 정렬 순서대로

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("갤러리 데이터를 불러오지 못했습니다:", error);
    return [];
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  // 3. 데이터 맵핑 (프론트에서 쓰기 편하게 가공)
  return data.map((item) => ({
    id: item.id,
    createdAt: item.createdAt,
    fileName: item.fileName,
    subtitle: item.subtitle || "MIRACLE ARCHIVE",
    mainTitle: item.mainTitle || "",
    isVisible: item.isVisible,
    displayOrder: item.displayOrder,
    src: `${supabaseUrl}/storage/v1/object/public/gallery/${encodeURIComponent(item.fileName)}`,
    alt: `MIRACLE gallery ${item.mainTitle}`,
  }));
};
