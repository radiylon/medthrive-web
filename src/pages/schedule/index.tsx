import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";

export default function SchedulePage() {
  return (
    <AppLayout>
      <PageHeader
        title="Schedule"
        subtitle="View and manage medication schedules"
      />
      <div className="text-base-content/60">
        Schedule views coming soon...
      </div>
    </AppLayout>
  );
}
