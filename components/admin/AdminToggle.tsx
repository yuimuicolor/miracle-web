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
      className={`w-20 h-10 lg:w-24 lg:h-12 flex items-center rounded-full p-1 transition-colors ${
        value ? "bg-green-500" : "bg-slate-300"
      }`}
    >
      <div
        className={`bg-white w-8 h-8 lg:w-10 lg:h-10 rounded-full shadow-md transform transition-transform ${
          value ? "translate-x-10 lg:translate-x-12" : "translate-x-0"
        }`}
      />
    </button>
  );
}