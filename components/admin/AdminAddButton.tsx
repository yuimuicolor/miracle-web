type Props = {
  onClick: () => void;
  label?: string;
};

export default function AdminAddButton({ onClick, label = "추가" }: Props) {
  return (
    <button
      onClick={onClick}
    className="bg-white border border-slate-300 text-slate-700 text-admin-body px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
    >
      + {label}
    </button>
  );
}