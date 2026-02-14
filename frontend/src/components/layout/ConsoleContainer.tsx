import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ConsoleContainer({ children }: Props) {
  return (
    <div className="
      bg-slate-900
      border border-slate-800
      rounded-2xl
      p-8
      shadow-xl
    ">
      {children}
    </div>
  );
}
