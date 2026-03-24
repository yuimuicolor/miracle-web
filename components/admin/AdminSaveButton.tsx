type Props = {
  onClick: () => void;
  isSaving?: boolean;
};

export default function AdminSaveButton({ onClick, isSaving }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={isSaving}
      className={`text-admin-body px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
        isSaving
          ? "bg-gray-400 cursor-not-allowed text-white shadow-none"
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
      }`}
    >
      {isSaving ? "저장 중..." : "저장"}
    </button>
  );
}