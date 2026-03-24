type Props = {
  isDeleted?: boolean;
  onDelete: () => void;
  onRestore?: () => void;
  canRestore?: boolean; 
};

export function AdminDeleteButton({
  isDeleted,
  onDelete,
  onRestore,
  canRestore = true,
}: Props) {
  // 즉시 삭제 타입
  if (!canRestore) {
    return (
      <button
        onClick={onDelete}
        className="px-4 py-2 rounded-lg font-bold text-admin-small bg-red-50 text-red-500 hover:bg-red-100 transition-all"
      >
        삭제
      </button>
    );
  }

  // 복구 가능한 타입
  return (
    <button
      onClick={isDeleted ? onRestore : onDelete}
      className={`px-4 py-2 rounded-lg font-bold text-admin-small transition-all ${
        isDeleted
          ? "bg-blue-100 text-blue-600"
          : "bg-red-50 text-red-500 hover:bg-red-100"
      }`}
    >
      {isDeleted ? "복구" : "삭제"}
    </button>
  );
}