import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageWrapper({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {children}
    </div>
  );
}
