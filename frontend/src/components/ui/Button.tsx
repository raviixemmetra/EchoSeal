import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  loading = false,
  disabled = false,
  fullWidth = false,
}: Props) {
  const base =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-300";

  const variants = {
    primary: "bg-cyan-500 text-black hover:bg-cyan-400",
    secondary: "bg-slate-800 hover:bg-slate-700",
    danger: "bg-red-500 text-black hover:bg-red-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
