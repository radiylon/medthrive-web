import Link from "next/link";
import { useRouter } from "next/router";
import type { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function SidebarLink({ href, icon: Icon, label, badge }: SidebarLinkProps) {
  const router = useRouter();
  const isActive = router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-primary text-primary-content"
          : "text-base-content hover:bg-base-200"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
            isActive ? "bg-primary-content/20 text-primary-content" : "bg-error text-error-content"
          }`}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
