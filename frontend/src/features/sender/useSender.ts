import { useState } from "react";

export type SenderStatusType =
  | "idle"
  | "transmitting"
  | "success"
  | "error";

export function useSender() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SenderStatusType>("idle");
  const [error, setError] = useState<string | null>(null);

  const transmit = async () => {
    if (!message.trim()) return;

    try {
      setStatus("transmitting");
      setError(null);

      // 🔹 Replace with your real API call
      await fakeBackendCall(message);

      setStatus("success");

      // Reset back to idle after short delay
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (err) {
      setStatus("error");
      setError("Transmission failed");
    }
  };

  return {
    message,
    setMessage,
    status,
    error,
    transmit,
  };
}

// Temporary mock function
const fakeBackendCall = (msg: string) => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1500);
  });
};
