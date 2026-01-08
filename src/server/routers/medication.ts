import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { medicationService, scheduleService } from "../services";

export const medicationRouter = router({
  byPatientId: publicProcedure
    .input(z.object({ patientId: z.string().uuid() }))
    .query(async ({ input }) => {
      return await medicationService.getMedicationsByPatientId(input.patientId);
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await medicationService.getMedicationById(input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        patient_id: z.string().uuid(),
        name: z.string().min(1),
        description: z.string().optional(),
        dosage: z.string().optional(),
        quantity: z.number().int().positive(),
        is_active: z.boolean().default(true),
        rx_number: z.string().optional(),
        schedule: z.object({
          frequency: z.number().int().positive(),
          type: z.enum(["daily", "weekly"]),
          start_date: z.string(), // ISO date string
        }),
      })
    )
    .mutation(async ({ input }) => {
      // Create the medication
      const medication = await medicationService.createMedication(input);

      // Create schedules based on the medication data
      await scheduleService.createSchedules(medication);

      return medication;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        dosage: z.string().optional(),
        quantity: z.number().int().positive().optional(),
        is_active: z.boolean().optional(),
        rx_number: z.string().optional(),
        schedule: z
          .object({
            frequency: z.number().int().positive(),
            type: z.enum(["daily", "weekly"]),
            start_date: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await medicationService.updateMedication(id, data);
    }),
});
