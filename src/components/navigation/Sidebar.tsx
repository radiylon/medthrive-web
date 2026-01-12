import Link from "next/link";
import { Users } from "lucide-react";
import { SidebarLink } from "./SidebarLink";

export function Sidebar() {
  const currentYear = new Date().getFullYear();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-base-100 border-l border-base-300 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-6 border-b border-base-300">
        <Link href="/patients" className="flex items-center">
          <span className="text-3xl font-bold text-base-content">med</span>
          <span className="text-3xl font-bold text-primary">thrive</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        <SidebarLink href="/patients" icon={Users} label="Patients" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-base-300">
        <p className="text-xs text-base-content/50 text-center">
          &copy; {currentYear}{" "}
          <a
            href="https://radiylon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            radiylon.com
          </a>
        </p>
      </div>
    </aside>
  );
}
