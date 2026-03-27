// lib/utils/reorder.ts
export const reorderItems = <T extends { displayOrder: number; isDeleted?: boolean }>(
  items: T[],
  sourceIndex: number,
  destinationIndex: number
): T[] => {
  // 1. 삭제되지 않은 아이템과 삭제된 아이템 분리
  const activeItems = items.filter((item) => !item.isDeleted);
  const deletedItems = items.filter((item) => item.isDeleted);

  // 2. 활성 아이템 순서 변경
  const reorderedActive = Array.from(activeItems);
  const [moved] = reorderedActive.splice(sourceIndex, 1);
  reorderedActive.splice(destinationIndex, 0, moved);

  // 3. displayOrder 재부여 (1부터 시작)
  const updatedActive = reorderedActive.map((item, idx) => ({
    ...item,
    displayOrder: idx + 1,
  }));

  // 4. 합쳐서 반환
  return [...updatedActive, ...deletedItems];
};