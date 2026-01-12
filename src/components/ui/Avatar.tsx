import { type ReactNode } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  children?: ReactNode;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-primary",
    "bg-secondary",
    "bg-accent",
    "bg-info",
    "bg-success",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ src, alt, name, size = "md", className = "", children }: AvatarProps) {
  const sizeClass = sizeClasses[size];

  if (src) {
    return (
      <div className={`avatar ${className}`}>
        <div className={`${sizeClass} rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-1`}>
          <img src={src} alt={alt || name || "Avatar"} />
        </div>
      </div>
    );
  }

  if (children) {
    return (
      <div className={`avatar placeholder ${className}`}>
        <div className={`${sizeClass} rounded-full bg-neutral text-neutral-content`}>
          {children}
        </div>
      </div>
    );
  }

  if (name) {
    const initials = getInitials(name);
    const bgColor = getColorFromName(name);
    return (
      <div className={`avatar placeholder ${className}`}>
        <div className={`${sizeClass} rounded-full ${bgColor} text-primary-content`}>
          <span>{initials}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`avatar placeholder ${className}`}>
      <div className={`${sizeClass} rounded-full bg-base-300 text-base-content`}>
        <span>?</span>
      </div>
    </div>
  );
}
