import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export function CalendarView() {
  const [monthOffset, setMonthOffset] = useState(0);

  const { currentMonth, days } = useMemo(() => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    // Get the first day of the week for the calendar grid
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    // Generate 6 weeks of days
    const days: Date[] = [];
    const current = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return { currentMonth, days, firstDay, lastDay };
  }, [monthOffset]);

  const { data: doses, isLoading } = trpc.schedule.getTodaysDoses.useQuery();

  const doseCountByDate = useMemo(() => {
    if (!doses) return new Map<string, { total: number; taken: number }>();
    const map = new Map<string, { total: number; taken: number }>();
    for (const dose of doses) {
      const dateKey = new Date(dose.scheduled_date).toDateString();
      const current = map.get(dateKey) ?? { total: 0, taken: 0 };
      current.total++;
      if (dose.status === "taken") current.taken++;
      map.set(dateKey, current);
    }
    return map;
  }, [doses]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  if (isLoading) {
    return <LoadingSkeleton variant="rectangular" height={400} className="rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonthOffset(monthOffset - 1)}
          className="btn btn-ghost btn-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-semibold text-lg">
          {currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </span>
        <button
          onClick={() => setMonthOffset(monthOffset + 1)}
          className="btn btn-ghost btn-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-base-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-base-content/60">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dateKey = date.toDateString();
            const counts = doseCountByDate.get(dateKey);
            const hasAll = counts && counts.taken === counts.total && counts.total > 0;
            const hasSome = counts && counts.taken > 0 && counts.taken < counts.total;
            const hasNone = counts && counts.taken === 0;

            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border-b border-r border-base-200
                  ${!isCurrentMonth(date) ? "bg-base-200/30" : ""}
                  ${isToday(date) ? "bg-primary/5" : ""}
                `}
              >
                <p
                  className={`text-sm ${
                    isToday(date)
                      ? "font-bold text-primary"
                      : !isCurrentMonth(date)
                      ? "text-base-content/30"
                      : ""
                  }`}
                >
                  {date.getDate()}
                </p>

                {counts && counts.total > 0 && (
                  <div className="mt-1">
                    {/* Status dots */}
                    <div className="flex gap-0.5 flex-wrap">
                      {Array.from({ length: Math.min(counts.total, 5) }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < counts.taken ? "bg-success" : "bg-base-300"
                          }`}
                        />
                      ))}
                      {counts.total > 5 && (
                        <span className="text-xs text-base-content/50">+{counts.total - 5}</span>
                      )}
                    </div>

                    {/* Count label */}
                    <p
                      className={`text-xs mt-1 ${
                        hasAll ? "text-success" : hasSome ? "text-warning" : "text-base-content/50"
                      }`}
                    >
                      {counts.taken}/{counts.total}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
