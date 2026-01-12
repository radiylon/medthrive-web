import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { medicationRepository, scheduleRepository } from "../repositories";
import { medicationCreateSchema, medicationUpdateSchema } from "@/schemas";

export const medicationRouter = router({
  byPatientId: publicProcedure
    .input(z.object({ patientId: z.string().uuid() }))
    .query(async ({ input }) => {
      return await medicationRepository.getMedicationsByPatientId(input.patientId);
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await medicationRepository.getMedicationById(input.id);
    }),

  create: publicProcedure.input(medicationCreateSchema).mutation(async ({ input }) => {
    // Create the medication
    const medication = await medicationRepository.createMedication(input);

    // Create schedules based on the medication data
    await scheduleRepository.createSchedules(medication);

    return medication;
  }),

  update: publicProcedure.input(medicationUpdateSchema).mutation(async ({ input }) => {
    const { id, ...data } = input;
    return await medicationRepository.updateMedication(id, data);
  }),
});
