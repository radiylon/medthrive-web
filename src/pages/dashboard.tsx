import { useState } from "react";
import { AlertCircle, AlertTriangle, Clock, Calendar } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DoseListItem } from "@/components/dashboard/DoseListItem";
import { UrgencySection } from "@/components/dashboard/UrgencySection";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  const [markingId, setMarkingId] = useState<string | null>(null);
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const { data: summary, isLoading: summaryLoading } = trpc.schedule.getDashboardSummary.useQuery(undefined, {
    refetchInterval: 60000,
  });

  const { data: overdueDoses, isLoading: overdueLoading } = trpc.schedule.getOverdueDoses.useQuery(undefined, {
    refetchInterval: 60000,
  });

  const { data: dueNowDoses, isLoading: dueNowLoading } = trpc.schedule.getDueNowDoses.useQuery(undefined, {
    refetchInterval: 60000,
  });

  const { data: upcomingDoses, isLoading: upcomingLoading } = trpc.schedule.getUpcomingDoses.useQuery(undefined, {
    refetchInterval: 60000,
  });

  const markTaken = trpc.schedule.markTaken.useMutation({
    onMutate: (variables) => {
      setMarkingId(variables.id);
    },
    onSuccess: (_, variables) => {
      showToast({
        message: "Dose marked as taken",
        type: "success",
        onUndo: () => {
          unmarkTaken.mutate({ id: variables.id });
        },
      });
      // Invalidate all dashboard queries
      utils.schedule.getDashboardSummary.invalidate();
      utils.schedule.getOverdueDoses.invalidate();
      utils.schedule.getDueNowDoses.invalidate();
      utils.schedule.getUpcomingDoses.invalidate();
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
    onSettled: () => {
      setMarkingId(null);
    },
  });

  const unmarkTaken = trpc.schedule.unmarkTaken.useMutation({
    onSuccess: () => {
      showToast({ message: "Dose unmarked", type: "info" });
      utils.schedule.getDashboardSummary.invalidate();
      utils.schedule.getOverdueDoses.invalidate();
      utils.schedule.getDueNowDoses.invalidate();
      utils.schedule.getUpcomingDoses.invalidate();
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const handleMarkTaken = (scheduleId: string) => {
    markTaken.mutate({ id: scheduleId });
  };

  const greeting = getGreeting();
  const isLoading = summaryLoading || overdueLoading || dueNowLoading || upcomingLoading;

  const needsAttentionDoses = [
    ...(overdueDoses ?? []),
    ...(dueNowDoses ?? []),
  ];

  return (
    <AppLayout>
      <PageHeader
        title={greeting}
        subtitle="Here's what needs your attention today"
      />

      {/* Stats Grid */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} variant="rectangular" height={100} className="rounded-xl" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Overdue"
            value={summary.overdue}
            icon={AlertCircle}
            variant={summary.overdue > 0 ? "overdue" : "neutral"}
          />
          <StatCard
            label="Due Now"
            value={summary.dueNow}
            icon={AlertTriangle}
            variant={summary.dueNow > 0 ? "due-now" : "neutral"}
          />
          <StatCard
            label="Upcoming"
            value={summary.upcoming}
            icon={Clock}
            variant="upcoming"
          />
          <StatCard
            label="Total Today"
            value={summary.totalToday}
            icon={Calendar}
            variant="neutral"
          />
        </div>
      ) : null}

      {/* Needs Attention Section */}
      {!isLoading && needsAttentionDoses.length > 0 && (
        <UrgencySection
          title="Needs Attention"
          icon={<AlertCircle className="h-5 w-5 text-error" />}
          className="mb-8"
        >
          {needsAttentionDoses.map((dose) => (
            <DoseListItem
              key={dose.id}
              id={dose.id}
              medicationName={dose.medication.name}
              dosage={dose.medication.dosage}
              patientName={`${dose.patient.first_name} ${dose.patient.last_name}`}
              patientPhotoUrl={dose.patient.photo_url}
              patientId={dose.patient.id}
              scheduledTime={dose.scheduled_date}
              status={dose.status}
              onMarkTaken={handleMarkTaken}
              isMarking={markingId === dose.id}
            />
          ))}
        </UrgencySection>
      )}

      {/* Coming Up Section */}
      {!isLoading && upcomingDoses && upcomingDoses.length > 0 && (
        <UrgencySection
          title="Coming Up"
          icon={<Clock className="h-5 w-5 text-base-content/60" />}
          className="mb-8"
        >
          {upcomingDoses.slice(0, 5).map((dose) => (
            <DoseListItem
              key={dose.id}
              id={dose.id}
              medicationName={dose.medication.name}
              dosage={dose.medication.dosage}
              patientName={`${dose.patient.first_name} ${dose.patient.last_name}`}
              patientPhotoUrl={dose.patient.photo_url}
              patientId={dose.patient.id}
              scheduledTime={dose.scheduled_date}
              status={dose.status}
              onMarkTaken={handleMarkTaken}
              isMarking={markingId === dose.id}
            />
          ))}
        </UrgencySection>
      )}

      {/* Empty State */}
      {!isLoading && needsAttentionDoses.length === 0 && (!upcomingDoses || upcomingDoses.length === 0) && (
        <EmptyState
          icon="calendar"
          title="All caught up!"
          description="No doses scheduled for today. Enjoy your day!"
        />
      )}

      {/* Loading State */}
      {(overdueLoading || dueNowLoading || upcomingLoading) && (
        <div className="space-y-4">
          <LoadingSkeleton.ListItem />
          <LoadingSkeleton.ListItem />
          <LoadingSkeleton.ListItem />
        </div>
      )}
    </AppLayout>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
