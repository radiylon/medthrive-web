import { useToast, type ToastItem } from "@/contexts/ToastContext";
import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface ToastItemProps {
  toast: ToastItem;
  onDismiss: () => void;
  onUndo: () => void;
}

function ToastItemComponent({ toast, onDismiss, onUndo }: ToastItemProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleUndo = () => {
    if (toast.onUndo) {
      toast.onUndo();
    }
    onUndo();
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertClass = () => {
    switch (toast.type) {
      case "success":
        return "bg-success text-success-content";
      case "error":
        return "bg-error text-error-content";
      case "warning":
        return "bg-warning text-warning-content";
      default:
        return "bg-info text-info-content";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ease-out min-w-[300px] max-w-md ${getAlertClass()} ${
        isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      role="alert"
      aria-live="polite"
    >
      <span className="flex-shrink-0">{getIcon()}</span>
      <span className="flex-1 font-medium text-sm">{toast.message}</span>
      {toast.onUndo && (
        <button
          type="button"
          onClick={handleUndo}
          className="flex-shrink-0 font-semibold text-sm underline underline-offset-2 hover:no-underline"
        >
          {toast.undoText || "Undo"}
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts, hideToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItemComponent
          key={toast.id}
          toast={toast}
          onDismiss={() => hideToast(toast.id)}
          onUndo={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}
