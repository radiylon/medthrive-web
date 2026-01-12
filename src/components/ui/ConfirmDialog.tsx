import { type ReactNode, useEffect, useRef } from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

export type ConfirmDialogVariant = "default" | "warning" | "danger" | "success" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
}

const variantConfig: Record<ConfirmDialogVariant, {
  icon: typeof AlertTriangle;
  iconClass: string;
  confirmButtonClass: string;
}> = {
  default: {
    icon: Info,
    iconClass: "text-primary",
    confirmButtonClass: "btn-primary",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-warning",
    confirmButtonClass: "btn-warning",
  },
  danger: {
    icon: XCircle,
    iconClass: "text-error",
    confirmButtonClass: "btn-error",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-success",
    confirmButtonClass: "btn-success",
  },
  info: {
    icon: Info,
    iconClass: "text-info",
    confirmButtonClass: "btn-info",
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isInDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!isInDialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClick={handleBackdropClick}
      onClose={onClose}
    >
      <div className="modal-box">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 ${config.iconClass}`}>
            <IconComponent size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{title}</h3>
            {description && (
              <div className="py-2 text-base-content/70">
                {typeof description === "string" ? <p>{description}</p> : description}
              </div>
            )}
          </div>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${config.confirmButtonClass}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <span className="loading loading-spinner loading-sm" />}
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
