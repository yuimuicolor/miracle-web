type Props = {
  onClick: () => void;
  isSaving?: boolean;
  size?: "small" | "large";
};

export default function AdminSaveButton({ onClick, isSaving, size = "small" }: Props) {

  const sizeClasses = size === "large" ? "px-30 py-4 text-admin-large" : "px-6 py-3 text-admin-body";

  return (
    <button
      onClick={onClick}
      disabled={isSaving}
      className={`rounded-xl font-bold transition-all shadow-lg active:scale-95 ${sizeClasses} ${
        isSaving
          ? "bg-gray-400 cursor-not-allowed text-white shadow-none"
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
      }`}
    >
      {isSaving ? "저장 중..." : "저장"}
    </button>
  );
}