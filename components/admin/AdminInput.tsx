type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  bold?: boolean;
  textarea?: boolean;
};

export function AdminInput({ value, onChange, disabled, bold, textarea }: Props) {
  if (textarea) {
    return (
      <textarea
        disabled={disabled}
        value={value}
        rows={4}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
          bold ? "font-semibold" : ""
        } disabled:bg-transparent disabled:border-transparent`}
      />
    );
  }

  return (
    <input
      type="text"
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
        bold ? "font-semibold" : ""
      } disabled:bg-transparent disabled:border-transparent`}
    />
  );
}