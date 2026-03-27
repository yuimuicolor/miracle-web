// lib/storageUtils.ts
import * as imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase/client";
import { CompressionOptions } from "../types/common";


// 압축 옵션의 기본값 설정 (필요에 따라 조정 가능)
const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 3,
  maxWidthOrHeight: 1920,
  fileType: "image/webp",
};

/**
 * 이미지를 압축하고 Supabase Storage에 업로드한 뒤 Public URL을 반환
 */
export const uploadImage = async (
  file: File,
  bucket: string,
  path: string,
  options?: CompressionOptions
) => {
  const compressOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    useWebWorker: true,
  };

  try {
    // 1. 이미지 압축 (WebP 변환 포함)
    const compressed = await (imageCompression as any).default(file, compressOptions);

    // 2. 스토리지 업로드 (upsert: true로 덮어쓰기 허용)
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, compressed, { upsert: true });

    if (uploadError) throw uploadError;

    // 3. Public URL 추출
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

/**
 * URL에서 파일명만 추출 (쿼리 스트링 제거)
 */
export const getFileNameFromUrl = (url: string) => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const parts = decodedUrl.split("/");
    const fileNameWithQuery = parts[parts.length - 1];
    return fileNameWithQuery.split("?")[0];
  } catch (e) {
    return "";
  }
};

/**
 * 캐시 방지용 유니크한 파일 경로 생성
 */
export const generateUniquePath = (folder: string, prefix: string, id: number | string) => {
  const formattedId = String(id).padStart(2, "0");
  const uniqueSuffix = Date.now();
  return `${folder}/${prefix}-${formattedId}_${uniqueSuffix}.webp`;
};

// 삭제 토글 함수 (isDeleted 플래그 활용)
export const toggleDeleteState = <T extends { id: number; isDeleted?: boolean }>(
  prevItems: T[],
  id: number
): T[] => {
  return prevItems.map((item) =>
    item.id === id ? { ...item, isDeleted: !item.isDeleted } : item
  );
};
