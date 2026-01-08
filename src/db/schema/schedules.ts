import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { medications } from "./medications";
import { patients } from "./patients";

export const schedules = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  medication_id: uuid("medication_id")
    .notNull()
    .references(() => medications.id, { onDelete: "cascade" }),
  patient_id: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  scheduled_date: timestamp("scheduled_date").notNull(),
  taken_at: timestamp("taken_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("schedules_medication_id_idx").on(table.medication_id),
  index("schedules_scheduled_date_idx").on(table.scheduled_date),
]);
