import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { patientRepository } from "../repositories";
import { patientCreateSchema, patientUpdateSchema } from "@/schemas";

export const patientRouter = router({
  list: publicProcedure.query(async () => {
    return await patientRepository.getPatients();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await patientRepository.getPatientById(input.id);
    }),

  create: publicProcedure.input(patientCreateSchema).mutation(async ({ input }) => {
    return await patientRepository.createPatient(input);
  }),

  update: publicProcedure.input(patientUpdateSchema).mutation(async ({ input }) => {
    const { id, ...updates } = input;
    return await patientRepository.updatePatient(id, updates);
  }),
});
