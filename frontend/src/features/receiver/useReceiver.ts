import { useState } from "react";

export type ReceiverStatusType =
  | "idle"
  | "listening"
  | "signal_detected"
  | "decoding"
  | "received"
  | "error";

export function useReceiver() {
  const [status, setStatus] = useState<ReceiverStatusType>("idle");
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startListening = async () => {
    try {
      setError(null);
      setDecodedMessage(null);
      setStatus("listening");

      // Simulate signal detection
      await delay(1500);
      setStatus("signal_detected");

      await delay(1000);
      setStatus("decoding");

      // 🔹 Replace with real backend call
      const message = await fakeDecode();

      setDecodedMessage(message);
      setStatus("received");
    } catch (err) {
      setStatus("error");
      setError("Decoding failed");
    }
  };

  const stopListening = () => {
    setStatus("idle");
    setDecodedMessage(null);
    setError(null);
  };

  return {
    status,
    decodedMessage,
    error,
    startListening,
    stopListening,
  };
}

// Helpers
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fakeDecode = async () => {
  await delay(1200);
  return "This is a decoded secure message.";
};
