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
      {/* Desktop Sidebar */}
      <Sidebar overdueBadge={overdueCount} />

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
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
