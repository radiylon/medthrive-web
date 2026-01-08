import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: "overdue" | "due-now" | "upcoming" | "neutral";
  onClick?: () => void;
}

const variantStyles = {
  overdue: {
    bg: "bg-error/10",
    border: "border-error/20",
    iconBg: "bg-error/20",
    iconColor: "text-error",
    valueColor: "text-error",
  },
  "due-now": {
    bg: "bg-warning/10",
    border: "border-warning/20",
    iconBg: "bg-warning/20",
    iconColor: "text-warning",
    valueColor: "text-warning",
  },
  upcoming: {
    bg: "bg-base-100",
    border: "border-base-300",
    iconBg: "bg-base-200",
    iconColor: "text-base-content/60",
    valueColor: "text-base-content",
  },
  neutral: {
    bg: "bg-base-100",
    border: "border-base-300",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    valueColor: "text-base-content",
  },
};

export function StatCard({ label, value, icon: Icon, variant, onClick }: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border ${styles.bg} ${styles.border} transition-all hover:shadow-md w-full text-left`}
      disabled={!onClick}
    >
      <div className={`p-3 rounded-xl ${styles.iconBg}`}>
        <Icon className={`h-6 w-6 ${styles.iconColor}`} />
      </div>
      <div>
        <p className={`text-2xl font-bold ${styles.valueColor}`}>{value}</p>
        <p className="text-sm text-base-content/60">{label}</p>
      </div>
    </button>
  );
}
