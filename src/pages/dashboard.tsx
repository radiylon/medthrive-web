import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { TodayView } from "@/components/schedule/TodayView";

function getFormattedDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Today's Medications"
        subtitle={getFormattedDate()}
      />
      <TodayView />
    </AppLayout>
  );
}
