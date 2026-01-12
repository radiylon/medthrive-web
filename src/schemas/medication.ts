import { z } from "zod";

export const scheduleSchema = z.object({
  frequency: z.number().int().positive("Must be a positive number"),
  type: z.enum(["daily", "weekly"]),
  start_date: z.string().min(1, "Required"),
});

export const medicationFormSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  quantity: z.number().int().positive("Must be a positive number"),
  is_active: z.boolean(),
  schedule: scheduleSchema,
});

// Full schema for tRPC (includes patient_id and optional fields)
export const medicationCreateSchema = medicationFormSchema.extend({
  patient_id: z.string().uuid(),
  dosage: z.string().optional(),
  rx_number: z.string().optional(),
});

export const medicationUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  dosage: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  is_active: z.boolean().optional(),
  rx_number: z.string().optional(),
  schedule: scheduleSchema.optional(),
});

export type MedicationFormData = z.infer<typeof medicationFormSchema>;
export type MedicationCreateInput = z.infer<typeof medicationCreateSchema>;
export type MedicationUpdateInput = z.infer<typeof medicationUpdateSchema>;
