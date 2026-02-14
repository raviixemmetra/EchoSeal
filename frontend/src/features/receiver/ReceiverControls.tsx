import { ReceiverStatusType } from "./useReceiver";

interface Props {
  status: ReceiverStatusType;
  startListening: () => void;
  stopListening: () => void;
}

export default function ReceiverControls({
  status,
  startListening,
  stopListening,
}: Props) {
  const isListening =
    status === "listening" ||
    status === "signal_detected" ||
    status === "decoding";

  return (
    <div>
      {isListening ? (
        <button
          onClick={stopListening}
          className="
            w-full
            py-3
            rounded-xl
            font-semibold
            bg-red-500
            text-black
            hover:bg-red-400
            transition
          "
        >
          Stop Listening
        </button>
      ) : (
        <button
          onClick={startListening}
          className="
            w-full
            py-3
            rounded-xl
            font-semibold
            bg-cyan-500
            text-black
            hover:bg-cyan-400
            transition
          "
        >
          Start Listening
        </button>
      )}
    </div>
  );
}

