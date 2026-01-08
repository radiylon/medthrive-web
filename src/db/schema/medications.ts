import { pgTable, uuid, timestamp, text, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { patients } from "./patients";

export const medications = pgTable("medications", {
  id: uuid("id").primaryKey().defaultRandom(),
  patient_id: uuid("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  dosage: text("dosage"),
  quantity: integer("quantity").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  rx_number: text("rx_number"),
  schedule: jsonb("schedule").notNull().$type<{
    frequency: number;
    type: "daily" | "weekly";
    start_date: string; // ISO string, not Date
  }>(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("medications_patient_id_idx").on(table.patient_id),
]);
