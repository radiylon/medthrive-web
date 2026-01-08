import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const caregiverProfileSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  email: z.string().min(1, "Required").email("Valid email required"),
  phone_number: z.string().refine((val) => isValidPhoneNumber(val, "US"), {
    message: "Valid US phone number required",
  }),
});

export const caregiverUpdateSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string().min(1, "Required").optional(),
  last_name: z.string().min(1, "Required").optional(),
  email: z.string().email("Valid email required").optional(),
  phone_number: z.string().refine((val) => !val || isValidPhoneNumber(val, "US"), {
    message: "Valid US phone number required",
  }).optional(),
});

export type CaregiverProfileData = z.infer<typeof caregiverProfileSchema>;
export type CaregiverUpdateInput = z.infer<typeof caregiverUpdateSchema>;
