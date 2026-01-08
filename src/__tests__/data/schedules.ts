import type { Schedule } from "@/db/schema";

export const mockSchedule: Schedule = {
  id: "schedule-1",
  medication_id: "medication-1",
  patient_id: "patient-1",
  scheduled_date: new Date("2024-01-01"),
  taken_at: null,
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-01"),
};

export const mockSchedulesList: Schedule[] = [
  mockSchedule,
  {
    id: "schedule-2",
    medication_id: "medication-1",
    patient_id: "patient-1",
    scheduled_date: new Date("2024-01-01"),
    taken_at: new Date("2024-01-01T10:00:00"),
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: "schedule-3",
    medication_id: "medication-1",
    patient_id: "patient-1",
    scheduled_date: new Date("2024-01-02"),
    taken_at: null,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
];
