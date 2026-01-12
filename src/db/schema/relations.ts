import { relations } from "drizzle-orm";
import { caregivers } from "./caregivers";
import { patients } from "./patients";
import { medications } from "./medications";
import { schedules } from "./schedules";

export const caregiversRelations = relations(caregivers, ({ many }) => ({
  patients: many(patients),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  caregiver: one(caregivers, {
    fields: [patients.caregiver_id],
    references: [caregivers.id],
  }),
  medications: many(medications),
  schedules: many(schedules),
}));

export const medicationsRelations = relations(medications, ({ one, many }) => ({
  patient: one(patients, {
    fields: [medications.patient_id],
    references: [patients.id],
  }),
  schedules: many(schedules),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  medication: one(medications, {
    fields: [schedules.medication_id],
    references: [medications.id],
  }),
  patient: one(patients, {
    fields: [schedules.patient_id],
    references: [patients.id],
  }),
}));
