import { SenderStatusType } from "./useSender";

interface Props {
  status: SenderStatusType;
}

export default function SenderStatus({ status }: Props) {
  const getStatusLabel = () => {
    switch (status) {
      case "transmitting":
        return "Transmitting...";
      case "success":
        return "Transmission Successful";
      case "error":
        return "Transmission Failed";
      default:
        return "Idle";
    }
  };

  const getStatusStyle = () => {
    switch (status) {
      case "transmitting":
        return "bg-cyan-500/20 text-cyan-400";
      case "success":
        return "bg-emerald-500/20 text-emerald-400";
      case "error":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold tracking-wide">
        Sender Console
      </h2>

      <span
        className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusStyle()}`}
      >
        {getStatusLabel()}
      </span>
    </div>
  );
}
