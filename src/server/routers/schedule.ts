import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { scheduleService } from "../services";

export const scheduleRouter = router({
  byMedicationId: publicProcedure
    .input(z.object({ medicationId: z.string().uuid() }))
    .query(async ({ input }) => {
      return await scheduleService.getSchedulesByMedicationId(input.medicationId);
    }),

  markTaken: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      return await scheduleService.markScheduleAsTaken(input.id);
    }),
});
