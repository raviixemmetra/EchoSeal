import ReceiverStatus from "./ReceiverStatus";
import ReceiverControls from "./ReceiverControls";
import { ReceiverStatusType } from "./useReceiver";

interface Props {
  status: ReceiverStatusType;
  decodedMessage: string | null;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

export default function ReceiverPanel({
  status,
  decodedMessage,
  error,
  startListening,
  stopListening,
}: Props) {
  return (
    <div className="space-y-8">
      <ReceiverStatus status={status} />

      <ReceiverControls
        status={status}
        startListening={startListening}
        stopListening={stopListening}
      />

      {decodedMessage && (
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-slate-100">
          <p className="text-sm text-slate-400 mb-2">Decoded Message:</p>
          <p>{decodedMessage}</p>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
