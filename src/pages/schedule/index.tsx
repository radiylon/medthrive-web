import { useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { TabGroup } from "@/components/navigation/TabGroup";
import { TodayView } from "@/components/schedule/TodayView";
import { WeekView } from "@/components/schedule/WeekView";
import { CalendarView } from "@/components/schedule/CalendarView";

type ScheduleTab = "today" | "week" | "calendar";

const tabs = [
  { id: "today", label: "Today" },
  { id: "week", label: "Week" },
  { id: "calendar", label: "Calendar" },
];

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<ScheduleTab>("today");
  const [weekOffset, setWeekOffset] = useState(0);

  return (
    <AppLayout>
      <PageHeader
        title="Schedule"
        subtitle="View and manage medication schedules"
      />

      <div className="mb-6">
        <TabGroup
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as ScheduleTab)}
        />
      </div>

      {activeTab === "today" && <TodayView />}
      {activeTab === "week" && (
        <WeekView weekOffset={weekOffset} onWeekChange={setWeekOffset} />
      )}
      {activeTab === "calendar" && <CalendarView />}
    </AppLayout>
  );
}
