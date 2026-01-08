import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { caregiverService } from "../services";
import { caregiverUpdateSchema } from "@/schemas";

export const caregiverRouter = router({
  // Get current caregiver (for demo, returns the first one)
  current: publicProcedure.query(async () => {
    return await caregiverService.getCurrentCaregiver();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await caregiverService.getCaregiverById(input.id);
    }),

  update: publicProcedure.input(caregiverUpdateSchema).mutation(async ({ input }) => {
    const { id, ...updates } = input;
    return await caregiverService.updateCaregiver(id, updates);
  }),
});
