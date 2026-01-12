// Tables
export { caregivers } from "./caregivers";
export { patients } from "./patients";
export { medications } from "./medications";
export { schedules } from "./schedules";

// Relations
export * from "./relations";

// Types (singular naming convention for types)
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { caregivers } from "./caregivers";
import type { patients } from "./patients";
import type { medications } from "./medications";
import type { schedules } from "./schedules";

export type Caregiver = InferSelectModel<typeof caregivers>;
export type NewCaregiver = InferInsertModel<typeof caregivers>;

export type Patient = InferSelectModel<typeof patients>;
export type NewPatient = InferInsertModel<typeof patients>;

export type Medication = InferSelectModel<typeof medications>;
export type NewMedication = InferInsertModel<typeof medications>;

export type Schedule = InferSelectModel<typeof schedules>;
export type NewSchedule = InferInsertModel<typeof schedules>;

// Address type for reuse
export type Address = {
  street: string;
  city: string;
  state: string;
  zipcode: string;
};

// Schedule config type for reuse
export type MedicationSchedule = {
  frequency: number;
  type: "daily" | "weekly";
  start_date: string;
};
