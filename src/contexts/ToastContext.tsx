import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onUndo?: () => void;
  undoText?: string;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: {
    message: string;
    type: ToastType;
    duration?: number;
    onUndo?: () => void;
    undoText?: string;
  }) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    ({
      message,
      type,
      duration = 3000,
      onUndo,
      undoText = "Undo",
    }: {
      message: string;
      type: ToastType;
      duration?: number;
      onUndo?: () => void;
      undoText?: string;
    }) => {
      const id = `toast-${++toastIdCounter}`;

      setToasts((prev) => [...prev, { id, message, type, duration, onUndo, undoText }]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearToasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
