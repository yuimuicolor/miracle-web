import { supabase } from "@/lib/supabase";
import { GalleryItem } from "../types/gallery";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

/**
 * [일반 사용자용] 노출 가능한 이미지 리스트 가져오기
 */
export const getPublicGalleryImages = async (limit?: number): Promise<GalleryItem[]> => {
  let query = supabase
    .from("gallery")
    .select("*")
    .eq("isVisible", true)
    .order("displayOrder", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) {
    console.error("갤러리 로딩 실패:", error);
    return [];
  }

  // 헬퍼 함수: DB의 imageUrl을 전체 URL로 변환
  return data.map(item => ({
    ...item,
    // 만약 DB에 파일명만 저장된다면 아래처럼 풀 경로를 만들어줍니다.
    imageUrl: item.imageUrl?.startsWith('http') 
      ? item.imageUrl 
      : `${supabaseUrl}/storage/v1/object/public/gallery/${item.imageUrl}`
  }));
};

/**
 * [관리자용] 모든 데이터 가져오기 (비공개 포함)
 */
export const getAllGalleryForAdmin = async (): Promise<GalleryItem[]> => {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("displayOrder", { ascending: true });

  if (error) throw error;
  return data || [];
};