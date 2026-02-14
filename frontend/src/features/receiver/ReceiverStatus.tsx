import { ReceiverStatusType } from "./useReceiver";

interface Props {
  status: ReceiverStatusType;
}

export default function ReceiverStatus({ status }: Props) {
  const getLabel = () => {
    switch (status) {
      case "listening":
        return "Listening...";
      case "signal_detected":
        return "Signal Detected";
      case "decoding":
        return "Decoding...";
      case "received":
        return "Message Received";
      case "error":
        return "Error";
      default:
        return "Idle";
    }
  };

  const getStyle = () => {
    switch (status) {
      case "listening":
        return "bg-cyan-500/20 text-cyan-400";
      case "signal_detected":
        return "bg-yellow-500/20 text-yellow-400";
      case "decoding":
        return "bg-purple-500/20 text-purple-400";
      case "received":
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
        Receiver Console
      </h2>

      <span
        className={`px-4 py-1 rounded-full text-sm font-medium ${getStyle()}`}
      >
        {getLabel()}
      </span>
    </div>
  );
}
