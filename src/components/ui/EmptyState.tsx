import { type ReactNode } from "react";
import { Inbox, FileX, Users, Pill, Calendar } from "lucide-react";

export type EmptyStateIcon = "inbox" | "file" | "users" | "pill" | "calendar" | "custom";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: EmptyStateIcon;
  customIcon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const iconComponents: Record<Exclude<EmptyStateIcon, "custom">, typeof Inbox> = {
  inbox: Inbox,
  file: FileX,
  users: Users,
  pill: Pill,
  calendar: Calendar,
};

export function EmptyState({
  title,
  description,
  icon = "inbox",
  customIcon,
  action,
  className = "",
}: EmptyStateProps) {
  const IconComponent = icon !== "custom" ? iconComponents[icon] : null;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4 text-base-content/30">
        {icon === "custom" && customIcon ? (
          customIcon
        ) : IconComponent ? (
          <IconComponent size={48} strokeWidth={1.5} />
        ) : null}
      </div>
      <h3 className="text-lg font-semibold text-base-content mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-base-content/60 max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
