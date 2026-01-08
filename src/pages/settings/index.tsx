import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />
      <div className="text-base-content/60">
        Settings coming soon...
      </div>
    </AppLayout>
  );
}
