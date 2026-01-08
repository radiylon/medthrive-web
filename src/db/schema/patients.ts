import { pgTable, uuid, timestamp, text, date, jsonb, index, numeric } from "drizzle-orm/pg-core";
import { caregivers } from "./caregivers";

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  caregiver_id: uuid("caregiver_id")
    .notNull()
    .references(() => caregivers.id, { onDelete: "cascade" }),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").notNull(),
  phone_number: text("phone_number").notNull(),
  date_of_birth: date("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  address: jsonb("address").notNull().$type<{
    street: string;
    city: string;
    state: string;
    zipcode: string;
  }>(),
  allergies: text("allergies").array(),
  medical_conditions: text("medical_conditions").array(),
  emergency_contact: jsonb("emergency_contact").$type<{
    name: string;
    phone: string;
    relationship: string;
  }>(),
  notes: text("notes"),
  photo_url: text("photo_url"),
  blood_type: text("blood_type"),
  weight_lbs: numeric("weight_lbs", { precision: 5, scale: 1 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("patients_caregiver_id_idx").on(table.caregiver_id),
]);
