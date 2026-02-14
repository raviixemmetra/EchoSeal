import SenderStatus from "./SenderStatus";
import SenderControls from "./SenderControls";
import { SenderStatusType } from "./useSender";

interface SenderPanelProps {
  message: string;
  setMessage: (value: string) => void;
  status: SenderStatusType;
  error: string | null;
  transmit: () => void;
}

export default function SenderPanel({
  message,
  setMessage,
  status,
  error,
  transmit,
}: SenderPanelProps) {
  return (
    <div className="space-y-8">
      <SenderStatus status={status} />
      <SenderControls
        message={message}
        setMessage={setMessage}
        transmit={transmit}
        status={status}
      />
      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
