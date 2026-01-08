import { type ReactNode } from "react";

interface UrgencySectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function UrgencySection({ title, icon, children, className = "" }: UrgencySectionProps) {
  return (
    <section className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-base-content">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
