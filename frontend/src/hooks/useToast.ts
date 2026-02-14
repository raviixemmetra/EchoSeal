import { useState } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const clearToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    clearToast,
  };
}
