interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: Props) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full
        p-4
        bg-slate-800
        border border-slate-700
        rounded-xl
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500
        resize-none
      "
    />
  );
}

