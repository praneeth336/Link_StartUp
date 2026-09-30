import { useState, useEffect } from "react";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
}

let toastListeners: Array<(toast: ToastProps) => void> = [];

export function toast({ title, description }: { title?: string; description?: string }) {
  const newToast: ToastProps = {
    id: `toast_${Date.now()}`,
    title,
    description,
  };
  toastListeners.forEach((listener) => listener(newToast));
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const handleToast = (newToast: ToastProps) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    toastListeners.push(handleToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleToast);
    };
  }, []);

  return { toasts, toast };
}
