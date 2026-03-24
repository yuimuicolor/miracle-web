type Props = {
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function AdminToggle({ value, onToggle, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onToggle}
      className={`w-24 h-12 flex items-center rounded-full p-1 transition-colors ${
        value ? "bg-green-500" : "bg-slate-300"
      }`}
    >
      <div
        className={`bg-white w-10 h-10 rounded-full shadow-md transform transition-transform ${
          value ? "translate-x-12" : "translate-x-0"
        }`}
      />
    </button>
  );
}