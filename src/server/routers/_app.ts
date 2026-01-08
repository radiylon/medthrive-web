import { router } from "../trpc";
import { patientRouter } from "./patient";
import { medicationRouter } from "./medication";
import { scheduleRouter } from "./schedule";
import { caregiverRouter } from "./caregiver";

export const appRouter = router({
  patient: patientRouter,
  medication: medicationRouter,
  schedule: scheduleRouter,
  caregiver: caregiverRouter,
});

export type AppRouter = typeof appRouter;
