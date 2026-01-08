import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { patientService } from "../services";

export const patientRouter = router({
  list: publicProcedure.query(async () => {
    return await patientService.getPatients();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await patientService.getPatientById(input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        caregiver_id: z.string().uuid(),
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        email: z.string().email(),
        phone_number: z.string().min(1),
        date_of_birth: z.string(), // ISO date string
        gender: z.string().min(1),
        address: z.object({
          street: z.string().min(1),
          city: z.string().min(1),
          state: z.string().min(1),
          zipcode: z.string().min(1),
        }),
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
      })
    )
    .mutation(async ({ input }) => {
      return await patientService.createPatient(input);
    }),
});
