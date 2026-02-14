import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`
        bg-slate-900
        border border-slate-800
        rounded-2xl
        p-6
        shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}

