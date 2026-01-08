import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const addressSchema = z.object({
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().length(2, "Required"),
  zipcode: z.string().min(5, "Valid zipcode required"),
});

export const patientFormSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z.string().min(1, "Required").email("Valid email required"),
  phone_number: z.string().refine((val) => isValidPhoneNumber(val, "US"), {
    message: "Valid US phone number required",
  }),
  date_of_birth: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  address: addressSchema,
});

// Full schema for tRPC (includes caregiver_id and optional fields)
export const patientCreateSchema = patientFormSchema.extend({
  caregiver_id: z.string().uuid(),
  allergies: z.array(z.string()).optional(),
  medical_conditions: z.array(z.string()).optional(),
  emergency_contact: z
    .object({
      name: z.string().min(1),
      phone: z.string().min(1),
      relationship: z.string().min(1),
    })
    .optional(),
  notes: z.string().optional(),
  photo_url: z.string().optional().nullable(),
  blood_type: z.string().optional(),
  weight_lbs: z.string().optional(),
});

// Update schema - all fields optional except id
export const patientUpdateSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1, "Required").optional(),
  last_name: z.string().min(1, "Required").optional(),
  email: z.string().email("Valid email required").optional(),
  phone_number: z.string().refine((val) => !val || isValidPhoneNumber(val, "US"), {
    message: "Valid US phone number required",
  }).optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  address: addressSchema.optional(),
  allergies: z.array(z.string()).optional().nullable(),
  medical_conditions: z.array(z.string()).optional().nullable(),
  emergency_contact: z
    .object({
      name: z.string().min(1),
      phone: z.string().min(1),
      relationship: z.string().min(1),
    })
    .optional()
    .nullable(),
  notes: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  blood_type: z.string().optional().nullable(),
  weight_lbs: z.string().optional().nullable(),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;
export type PatientCreateInput = z.infer<typeof patientCreateSchema>;
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;
