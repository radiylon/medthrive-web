import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";

export default function DashboardPage() {
  const greeting = getGreeting();

  return (
    <AppLayout>
      <PageHeader
        title={`${greeting}`}
        subtitle="Here's what needs your attention today"
      />
      <div className="text-base-content/60">
        Dashboard content coming soon...
      </div>
    </AppLayout>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
