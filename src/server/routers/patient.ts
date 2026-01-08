import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { patientService } from "../services";
import { patientCreateSchema, patientUpdateSchema } from "@/schemas";

export const patientRouter = router({
  list: publicProcedure.query(async () => {
    return await patientService.getPatients();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await patientService.getPatientById(input.id);
    }),

  create: publicProcedure.input(patientCreateSchema).mutation(async ({ input }) => {
    return await patientService.createPatient(input);
  }),

  update: publicProcedure.input(patientUpdateSchema).mutation(async ({ input }) => {
    const { id, ...updates } = input;
    return await patientService.updatePatient(id, updates);
  }),
});
