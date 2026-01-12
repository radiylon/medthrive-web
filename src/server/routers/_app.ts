import { router } from "../trpc";
import { patientRouter } from "./patient";
import { medicationRouter } from "./medication";
import { scheduleRouter } from "./schedule";

export const appRouter = router({
  patient: patientRouter,
  medication: medicationRouter,
  schedule: scheduleRouter,
});

export type AppRouter = typeof appRouter;
