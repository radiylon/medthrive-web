import { type ReactNode } from "react";

export type BadgeVariant = "success" | "neutral" | "taken" | "upcoming";
export type BadgeSize = "sm";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success text-success-content",
  neutral: "bg-base-300 text-base-content/70",
  upcoming: "bg-[var(--dose-upcoming-bg)] text-[var(--dose-upcoming-text)] border border-[var(--dose-upcoming-border)]",
  taken: "bg-[var(--dose-taken-bg)] text-[var(--dose-taken-text)] border border-[var(--dose-taken-border)]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5",
};

export function Badge({ children, variant = "neutral", size = "sm", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
