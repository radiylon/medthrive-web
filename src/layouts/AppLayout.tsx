import { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import Toast from "@/components/Toast";
import { trpc } from "@/utils/trpc";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Get overdue count for badge display
  const { data: dashboardSummary } = trpc.schedule.getDashboardSummary.useQuery(undefined, {
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  const overdueCount = dashboardSummary?.overdue ?? 0;

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-content focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <Sidebar overdueBadge={overdueCount} />

      {/* Main Content */}
      <main id="main-content" className="flex-1 pb-20 md:pb-0" role="main">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav overdueBadge={overdueCount} />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
