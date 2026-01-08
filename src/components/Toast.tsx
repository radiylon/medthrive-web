import { useToast } from "@/contexts/ToastContext";
import { useEffect, useState } from "react";

export default function Toast() {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (toast.isVisible) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [toast.isVisible]);

  if (!shouldRender) return null;

  const alertClass = () => {
    if (toast.type === "success") {
      return "alert alert-success bg-success/50";
    } else if (toast.type === "error") {
      return "alert alert-error bg-error/50";
    } else if (toast.type === "warning") {
      return "alert alert-warning bg-warning/50";
    } else {
      return "alert alert-info bg-info/50";
    }
  };

  return (
    <div
      className={`toast toast-bottom z-50 h-12 mb-6 mr-6 rounded-sm transition-all duration-300 ease-in-out ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className={alertClass()}>
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
