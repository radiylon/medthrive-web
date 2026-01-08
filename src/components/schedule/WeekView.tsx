import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import type { DoseWithDetails } from "@/server/services/ScheduleService";

interface WeekViewProps {
  weekOffset?: number;
  onWeekChange?: (offset: number) => void;
}

export function WeekView({ weekOffset = 0, onWeekChange }: WeekViewProps) {
  const weekDates = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [weekOffset]);

  const { data: doses, isLoading } = trpc.schedule.getTodaysDoses.useQuery(undefined, {
    refetchInterval: 60000,
  });

  const dosesByDate = useMemo(() => {
    if (!doses) return new Map<string, DoseWithDetails[]>();
    const map = new Map<string, DoseWithDetails[]>();
    for (const dose of doses) {
      const dateKey = new Date(dose.scheduled_date).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(dose);
    }
    return map;
  }, [doses]);

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  };

  const formatDayNumber = (date: Date) => {
    return date.getDate();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <LoadingSkeleton key={i} variant="rectangular" height={100} className="rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onWeekChange?.(weekOffset - 1)}
          className="btn btn-ghost btn-sm"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </button>
        <span className="font-semibold">
          {weekDates[0].toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={() => onWeekChange?.(weekOffset + 1)}
          className="btn btn-ghost btn-sm"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateKey = date.toDateString();
          const dayDoses = dosesByDate.get(dateKey) ?? [];
          const takenCount = dayDoses.filter((d) => d.status === "taken").length;
          const totalCount = dayDoses.length;

          return (
            <div
              key={dateKey}
              className={`flex flex-col rounded-xl border p-3 min-h-[120px] ${
                isToday(date)
                  ? "border-primary bg-primary/5"
                  : "border-base-200 bg-base-100"
              }`}
            >
              <div className="text-center mb-2">
                <p className="text-xs text-base-content/60">{formatDayName(date)}</p>
                <p className={`text-lg font-bold ${isToday(date) ? "text-primary" : ""}`}>
                  {formatDayNumber(date)}
                </p>
              </div>

              {totalCount > 0 ? (
                <div className="flex-1 space-y-1">
                  {/* Show first 3 doses as avatars */}
                  <div className="flex -space-x-2 justify-center">
                    {dayDoses.slice(0, 3).map((dose) => (
                      <div
                        key={dose.id}
                        className={`ring-2 ring-base-100 rounded-full ${
                          dose.status === "taken" ? "opacity-50" : ""
                        }`}
                      >
                        <Avatar
                          src={dose.patient.photo_url}
                          name={`${dose.patient.first_name} ${dose.patient.last_name}`}
                          size="xs"
                        />
                      </div>
                    ))}
                    {dayDoses.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-base-200 flex items-center justify-center text-xs font-medium ring-2 ring-base-100">
                        +{dayDoses.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center justify-center gap-1 text-xs">
                    {takenCount === totalCount ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : null}
                    <span className={takenCount === totalCount ? "text-success" : "text-base-content/60"}>
                      {takenCount}/{totalCount}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-base-content/40">
                  No doses
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
