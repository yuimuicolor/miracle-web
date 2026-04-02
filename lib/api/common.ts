import { getFileNameFromUrl } from "@/lib/utils/storage";

/**
 * 1. 삭제 통합 관리 (DB 레코드 + 스토리지 파일)
 * - 데이터 완전 삭제 시 사용됨
 */
export const deleteItemsWithStorage = async (
  supabaseClient: any,
  tableName: string,
  bucketName: string,
  itemsToDelete: { id: number; imageUrl?: string | string[] }[],
) => {
  if (itemsToDelete.length === 0) return;

  const ids = itemsToDelete.map((i) => i.id);
  const fileNames: string[] = [];

  itemsToDelete.forEach((item) => {
    if (Array.isArray(item.imageUrl)) {
      item.imageUrl.forEach((url) => {
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
    supabaseClient.from(tableName).delete().in("id", ids),
    fileNames.length > 0
      ? supabaseClient.storage.from(bucketName).remove(fileNames)
      : Promise.resolve(),
  ]);
};

/**
 * 2. 신규 아이템 ID 먼저 확보하기 (Common Pattern)
 */
export const ensureRecordId = async (
  supabaseClient: any,
  tableName: string,
  initialData: object,
) => {
  const { data, error } = await supabaseClient
    .from(tableName)
    .insert(initialData)
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

/**
 * 3. 스토리지 폴더 내의 찌꺼기 파일 삭제 (Cleanup)
 * - 이미지를 '교체'했을 때, 이전에 올렸던 파일들을 찾아서 지워주는 용도
 * -완전 삭제 아님
 */
export const cleanupStorageFiles = async (
  supabaseClient: any,
  bucket: string,
  folderPath: string,
  activeFiles: string[],
  prefix?: string,
) => {
  // 해당 폴더(또는 루트)의 파일 목록을 가져옴
  const { data: storageFiles, error: listError } = await supabaseClient.storage
    .from(bucket)
    .list(folderPath);

  if (listError || !storageFiles) return;

const filesToDelete = storageFiles
    .filter((f: any) => {
      // 1. 현재 사용 중인 파일(activeFiles)에 포함되어 있다면 절대 삭제 금지
      if (activeFiles.includes(f.name)) return false;

      // 2. prefix가 있다면 해당 prefix로 시작하는 파일만 타겟팅
      if (prefix) {
        return f.name.startsWith(prefix);
      }

      // 3. prefix가 없다면 위에서 걸러진 activeFiles 외에 모든 파일을 삭제 타겟으로 설정
      return true; 
    })
    .map((f: any) => (folderPath ? `${folderPath}/${f.name}` : f.name));
    
  if (filesToDelete.length > 0) {
    const { error: removeError } = await supabaseClient.storage
      .from(bucket)
      .remove(filesToDelete);
    
    if (removeError) {
      console.error("파일 삭제 중 에러:", removeError);
    }
  }
};

/**
 * 4. DB에서 삭제 표시(isDeleted)된 항목들을 한 번에 제거
 */
export const deleteMarkedItems = async (
  supabaseClient: any,
  tableName: string,
  items: any[],
) => {
  const idsToDelete = items
    .filter((i) => i.isDeleted && !i.isNew)
    .map((i) => i.id);
  if (idsToDelete.length > 0) {
    const { error } = await supabaseClient
      .from(tableName)
      .delete()
      .in("id", idsToDelete);
    if (error) throw error;
  }
};
