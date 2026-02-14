import { SenderStatusType } from "./useSender";

interface Props {
  message: string;
  setMessage: (value: string) => void;
  transmit: () => void;
  status: SenderStatusType;
}

export default function SenderControls({
  message,
  setMessage,
  transmit,
  status,
}: Props) {
  const isLoading = status === "transmitting";

  return (
    <div className="space-y-6">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter secure message..."
        className="
          w-full
          h-32
          p-4
          bg-slate-800
          border border-slate-700
          rounded-xl
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500
          resize-none
          text-slate-100
        "
      />

      <button
        onClick={transmit}
        disabled={isLoading}
        className={`
          w-full
          py-3
          rounded-xl
          font-semibold
          transition-all duration-300
          ${
            isLoading
              ? "bg-slate-700 cursor-not-allowed"
              : "bg-cyan-500 text-black hover:bg-cyan-400"
          }
        `}
      >
        {isLoading ? "Encrypting & Transmitting..." : "Encrypt & Transmit"}
      </button>
    </div>
  );
}
