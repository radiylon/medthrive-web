import Link from "next/link";
import { useRouter } from "next/router";
import { Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

function NavItem({ href, icon: Icon, label }: NavItemProps) {
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
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 z-40"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <NavItem href="/patients" icon={Users} label="Patients" />
      </div>
    </nav>
  );
}
