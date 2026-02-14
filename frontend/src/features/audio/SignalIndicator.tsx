interface Props {
  signalStrength: number;
}

export default function SignalIndicator({ signalStrength }: Props) {
  const level =
    signalStrength > 20
      ? "High"
      : signalStrength > 10
      ? "Medium"
      : "Low";

  const color =
    level === "High"
      ? "bg-emerald-500"
      : level === "Medium"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        <div className={`w-2 h-6 ${color} rounded`} />
        <div className={`w-2 h-6 ${color} rounded`} />
        <div className={`w-2 h-6 ${color} rounded`} />
      </div>
      <span className="text-sm text-slate-400">
        Signal: {level}
      </span>
    </div>
  );
}
