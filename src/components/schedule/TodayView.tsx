import { useState } from "react";
import { Sun, Sunset, Moon, CheckCircle } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { DoseCard } from "./DoseCard";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DoseWithDetails } from "@/server/services/ScheduleService";

type TimeOfDay = "morning" | "afternoon" | "evening";

function getTimeOfDay(date: Date): TimeOfDay {
  const hour = new Date(date).getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function groupDosesByTimeOfDay(doses: DoseWithDetails[]) {
  const groups: Record<TimeOfDay, DoseWithDetails[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  for (const dose of doses) {
    const timeOfDay = getTimeOfDay(dose.scheduled_date);
    groups[timeOfDay].push(dose);
  }

  return groups;
}

const timeOfDayConfig = {
  morning: {
    label: "Morning",
    icon: Sun,
  },
  afternoon: {
    label: "Afternoon",
    icon: Sunset,
  },
  evening: {
    label: "Evening",
    icon: Moon,
  },
};

export function TodayView() {
  const [markingId, setMarkingId] = useState<string | null>(null);
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const { data: doses, isLoading } = trpc.schedule.getTodaysDoses.useQuery(undefined, {
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
      utils.schedule.getTodaysDoses.invalidate();
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
      utils.schedule.getTodaysDoses.invalidate();
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const handleMarkTaken = (scheduleId: string) => {
    markTaken.mutate({ id: scheduleId });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="rectangular" height={40} className="rounded-lg w-48" />
        <div className="space-y-3">
          <LoadingSkeleton.ListItem />
          <LoadingSkeleton.ListItem />
          <LoadingSkeleton.ListItem />
        </div>
      </div>
    );
  }

  if (!doses || doses.length === 0) {
    return (
      <EmptyState
        icon="calendar"
        title="All done for today"
        description="No medications scheduled. Enjoy your day!"
      />
    );
  }

  const groupedDoses = groupDosesByTimeOfDay(doses);
  const takenCount = doses.filter((d) => d.status === "taken").length;
  const totalCount = doses.length;

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex items-center gap-3 p-4 bg-base-100 rounded-xl border border-base-200">
        <CheckCircle className="h-6 w-6 text-success" />
        <div className="flex-1">
          <p className="font-semibold">
            {takenCount} of {totalCount} completed
          </p>
          <div className="w-full bg-base-200 rounded-full h-2 mt-2">
            <div
              className="bg-success h-2 rounded-full transition-all"
              style={{ width: `${(takenCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-2xl font-bold text-success">
          {Math.round((takenCount / totalCount) * 100)}%
        </span>
      </div>

      {/* Time of day sections */}
      {(["morning", "afternoon", "evening"] as TimeOfDay[]).map((timeOfDay) => {
        const config = timeOfDayConfig[timeOfDay];
        const Icon = config.icon;
        const dosesForTime = groupedDoses[timeOfDay];

        if (dosesForTime.length === 0) return null;

        return (
          <section key={timeOfDay} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-base-content/60" />
              <h3 className="font-semibold text-base-content">{config.label}</h3>
            </div>
            <div className="space-y-2">
              {dosesForTime.map((dose) => (
                <DoseCard
                  key={dose.id}
                  id={dose.id}
                  medicationName={dose.medication.name}
                  dosage={dose.medication.dosage}
                  patientName={`${dose.patient.first_name} ${dose.patient.last_name}`}
                  patientPhotoUrl={dose.patient.photo_url}
                  patientId={dose.patient.id}
                  isTaken={dose.status === "taken"}
                  onMarkTaken={handleMarkTaken}
                  isMarking={markingId === dose.id}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
