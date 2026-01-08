import { useState } from "react";
import { useRouter } from "next/router";
import { Check, Pill, Calendar, Hash, Clock, ToggleLeft, ToggleRight } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MedicationPage() {
  const [pendingScheduleId, setPendingScheduleId] = useState<string | null>(null);
  const router = useRouter();
  const { patientId, medicationId } = router.query;
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const { data: medication, isLoading: medicationLoading, error: medicationError } = trpc.medication.byId.useQuery(
    { id: medicationId as string },
    { enabled: !!medicationId }
  );

  const { data: schedules, isLoading: schedulesLoading, error: schedulesError } = trpc.schedule.byMedicationId.useQuery(
    { medicationId: medicationId as string },
    { enabled: !!medicationId }
  );

  const patchMedication = trpc.medication.update.useMutation({
    onSuccess: () => {
      showToast({ message: "Medication updated successfully", type: "success" });
      utils.medication.byId.invalidate({ id: medicationId as string });
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const markTaken = trpc.schedule.markTaken.useMutation({
    onSuccess: () => {
      showToast({ message: "Dose marked as taken", type: "success" });
      utils.schedule.byMedicationId.invalidate({ medicationId: medicationId as string });
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
    onSettled: () => {
      setPendingScheduleId(null);
    },
  });

  const onScheduleClick = (scheduleId: string) => {
    setPendingScheduleId(scheduleId);
    markTaken.mutate({ id: scheduleId });
  };

  const onToggleActive = () => {
    if (medication) {
      patchMedication.mutate({
        id: medication.id,
        is_active: !medication.is_active,
      });
    }
  };

  const isLoading = medicationLoading || schedulesLoading;
  const isError = medicationError || schedulesError;

  const takenCount = schedules?.filter((s) => s.taken_at).length ?? 0;
  const totalCount = schedules?.length ?? 0;

  return (
    <AppLayout>
      <PageHeader
        title={medication?.name ?? "Medication Details"}
        subtitle={medication?.dosage ?? undefined}
        backHref={`/patients/${patientId}`}
        actions={
          medication && (
            <button
              onClick={onToggleActive}
              className={`btn ${medication.is_active ? "btn-ghost" : "btn-success"}`}
              disabled={patchMedication.isPending}
            >
              {medication.is_active ? (
                <>
                  <ToggleRight className="h-5 w-5" />
                  {patchMedication.isPending ? "Updating..." : "Deactivate"}
                </>
              ) : (
                <>
                  <ToggleLeft className="h-5 w-5" />
                  {patchMedication.isPending ? "Updating..." : "Activate"}
                </>
              )}
            </button>
          )
        }
      />

      {isLoading && (
        <div className="space-y-6">
          <LoadingSkeleton.Card />
          <LoadingSkeleton.Card />
        </div>
      )}

      {isError && (
        <div className="alert alert-error">
          <span>Error loading medication details. Please try again later.</span>
        </div>
      )}

      {/* Medication Details */}
      {!isLoading && medication && (
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${medication.is_active ? "bg-success/20" : "bg-base-200"}`}>
                <Pill className={`h-6 w-6 ${medication.is_active ? "text-success" : "text-base-content/50"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{medication.name}</h2>
                  <Badge variant={medication.is_active ? "success" : "neutral"}>
                    {medication.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {medication.description && (
                  <p className="text-sm text-base-content/60">{medication.description}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                <Hash className="h-5 w-5 text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Quantity</p>
                  <p className="font-semibold">{medication.quantity} pills</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                <Clock className="h-5 w-5 text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Frequency</p>
                  <p className="font-semibold">
                    {medication.schedule.frequency}x {medication.schedule.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                <Calendar className="h-5 w-5 text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Start Date</p>
                  <p className="font-semibold">{medication.schedule.start_date.split("T")[0]}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg">
                <Check className="h-5 w-5 text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Progress</p>
                  <p className="font-semibold">
                    {takenCount} / {totalCount} doses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Doses */}
      {!isLoading && schedules && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Scheduled Doses</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                  <span className="text-base-content/60">Taken</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-base-300"></div>
                  <span className="text-base-content/60">Pending</span>
                </div>
              </div>
            </div>

            {schedules.length === 0 && (
              <EmptyState
                icon={Calendar}
                title="No scheduled doses"
                description="No doses have been scheduled for this medication"
              />
            )}

            {schedules.length > 0 && (
              <div className="overflow-x-auto max-h-[32rem] overflow-y-auto">
                <table className="table table-pin-rows">
                  <thead>
                    <tr>
                      <th>Scheduled Date</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((dose) => (
                      <tr
                        key={dose.id}
                        className={`${dose.taken_at ? "bg-success/5" : ""} hover:bg-base-200/50 transition-colors`}
                      >
                        <td className="font-medium">
                          {new Date(dose.scheduled_date).toLocaleDateString(undefined, {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td>
                          {dose.taken_at ? (
                            <Badge variant="taken" size="sm">
                              Taken {new Date(dose.taken_at).toLocaleDateString()}
                            </Badge>
                          ) : (
                            <Badge variant="upcoming" size="sm">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="text-right">
                          {!dose.taken_at && (
                            <button
                              onClick={() => onScheduleClick(dose.id)}
                              className="btn btn-success btn-sm"
                              disabled={pendingScheduleId === dose.id}
                            >
                              <Check className="h-4 w-4" />
                              {pendingScheduleId === dose.id ? "Marking..." : "Mark Taken"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
