import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

function NavItem({ href, icon: Icon, label, badge }: NavItemProps) {
  const router = useRouter();
  const isActive = router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-3 relative ${
        isActive ? "text-primary" : "text-base-content/60"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="relative">
        <Icon className="h-6 w-6" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold bg-error text-error-content rounded-full">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

interface BottomNavProps {
  overdueBadge?: number;
}

export function BottomNav({ overdueBadge }: BottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-40"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <NavItem
          href="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          badge={overdueBadge}
        />
        <NavItem href="/patients" icon={Users} label="Patients" />
        <NavItem href="/schedule" icon={Calendar} label="Schedule" />
        <NavItem href="/settings" icon={Settings} label="Settings" />
      </div>
    </nav>
  );
}
