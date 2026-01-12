import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { scheduleRepository } from "../repositories";

export const scheduleRouter = router({
  byMedicationId: publicProcedure
    .input(z.object({ medicationId: z.string().uuid() }))
    .query(async ({ input }) => {
      return await scheduleRepository.getSchedulesByMedicationId(input.medicationId);
    }),

  markTaken: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return await scheduleRepository.markScheduleAsTaken(input.id);
    }),

  unmarkTaken: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return await scheduleRepository.unmarkScheduleAsTaken(input.id);
    }),

  getTodaysDoses: publicProcedure.query(async () => {
    return await scheduleRepository.getTodaysDoses();
  }),
});
