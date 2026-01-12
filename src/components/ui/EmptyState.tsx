import { type ReactNode, type ComponentType } from "react";
import { Inbox, Pill, Calendar, type LucideProps } from "lucide-react";

export type EmptyStateIconName = "inbox" | "pill" | "calendar";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: EmptyStateIconName | ComponentType<LucideProps>;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const iconComponents: Record<EmptyStateIconName, ComponentType<LucideProps>> = {
  inbox: Inbox,
  pill: Pill,
  calendar: Calendar,
};

export function EmptyState({
  title,
  description,
  icon = "inbox",
  action,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  // Determine the icon component
  let IconComponent: ComponentType<LucideProps> | null = null;
  if (typeof icon === "string") {
    IconComponent = iconComponents[icon];
  } else {
    IconComponent = icon;
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {IconComponent && (
        <div className="mb-4 text-base-content/30">
          <IconComponent size={48} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-base-content mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-base-content/60 max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
      {actionLabel && onAction && (
        <button className="btn btn-primary mt-4" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
