import { supabase } from "@/lib/supabase";
import { getFileNameFromUrl, uploadImage } from "@/lib/supabase-utils";

/**
 * 1. 삭제 통합 관리 (DB 레코드 + 스토리지 파일)
 */
export const deleteItemsWithStorage = async (
  tableName: string,
  bucketName: string,
  itemsToDelete: { id: number; imageUrl?: string | string[] }[]
) => {
  if (itemsToDelete.length === 0) return;

  const ids = itemsToDelete.map(i => i.id);
  const fileNames: string[] = [];

  itemsToDelete.forEach(item => {
    if (Array.isArray(item.imageUrl)) {
      item.imageUrl.forEach(url => {
        const name = getFileNameFromUrl(url);
        if (name) fileNames.push(name);
      });
    } else if (item.imageUrl) {
      const name = getFileNameFromUrl(item.imageUrl);
      if (name) fileNames.push(name);
    }
  });

  // DB 삭제와 스토리지 삭제를 병렬로 처리
  await Promise.all([
    supabase.from(tableName).delete().in("id", ids),
    fileNames.length > 0 
      ? supabase.storage.from(bucketName).remove(fileNames) 
      : Promise.resolve()
  ]);
};

/**
 * 2. 신규 아이템 ID 먼저 확보하기 (Common Pattern)
 */
export const ensureRecordId = async (tableName: string, initialData: object) => {
  const { data, error } = await supabase
    .from(tableName)
    .insert(initialData)
    .select().single();

  if (error) throw error;
  return data.id;
};