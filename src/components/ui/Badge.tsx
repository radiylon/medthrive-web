import { type ReactNode } from "react";

export type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info" | "neutral" | "overdue" | "due-now" | "upcoming" | "taken";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-base-200 text-base-content",
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  success: "bg-success text-success-content",
  warning: "bg-warning text-warning-content",
  error: "bg-error text-error-content",
  info: "bg-info text-info-content",
  neutral: "bg-base-300 text-base-content/70",
  overdue: "bg-[var(--dose-overdue-bg)] text-[var(--dose-overdue-text)] border border-[var(--dose-overdue-border)]",
  "due-now": "bg-[var(--dose-due-now-bg)] text-[var(--dose-due-now-text)] border border-[var(--dose-due-now-border)]",
  upcoming: "bg-[var(--dose-upcoming-bg)] text-[var(--dose-upcoming-text)] border border-[var(--dose-upcoming-border)]",
  taken: "bg-[var(--dose-taken-bg)] text-[var(--dose-taken-text)] border border-[var(--dose-taken-border)]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export function Badge({ children, variant = "default", size = "md", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
