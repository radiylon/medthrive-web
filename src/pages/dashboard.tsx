import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { TodayView } from "@/components/schedule/TodayView";
import { getFormattedDate } from "@/utils/date";

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
