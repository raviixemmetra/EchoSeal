interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full
        p-3
        bg-slate-800
        border border-slate-700
        rounded-xl
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500
      "
    />
  );
}
