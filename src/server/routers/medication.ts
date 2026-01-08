import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { medicationService, scheduleService } from "../services";
import { medicationCreateSchema, medicationUpdateSchema } from "@/schemas";

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

  create: publicProcedure.input(medicationCreateSchema).mutation(async ({ input }) => {
    // Create the medication
    const medication = await medicationService.createMedication(input);

    // Create schedules based on the medication data
    await scheduleService.createSchedules(medication);

    return medication;
  }),

  update: publicProcedure.input(medicationUpdateSchema).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await medicationService.updateMedication(id, data);
  }),
});
