import Link from "next/link";
import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";
import { SidebarLink } from "./SidebarLink";

interface SidebarProps {
  overdueBadge?: number;
}

export function Sidebar({ overdueBadge }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r border-base-300 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-base-300">
        <Link href="/dashboard" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-base-content">med</span>
          <span className="text-2xl font-bold text-primary">thrive</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        <SidebarLink
          href="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          badge={overdueBadge}
        />
        <SidebarLink href="/patients" icon={Users} label="Patients" />
        <SidebarLink href="/schedule" icon={Calendar} label="Schedule" />
        <SidebarLink href="/settings" icon={Settings} label="Settings" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-base-300">
        <p className="text-xs text-base-content/50 text-center">
          MedThrive v1.0
        </p>
      </div>
    </aside>
  );
}
