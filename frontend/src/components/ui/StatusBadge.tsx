type Status =
  | "idle"
  | "active"
  | "success"
  | "error"
  | "warning";

interface Props {
  status: Status;
  label: string;
}

export default function StatusBadge({ status, label }: Props) {
  const styles = {
    idle: "bg-slate-700 text-slate-300",
    active: "bg-cyan-500/20 text-cyan-400",
    success: "bg-emerald-500/20 text-emerald-400",
    error: "bg-red-500/20 text-red-400",
    warning: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {label}
    </span>
  );
}
