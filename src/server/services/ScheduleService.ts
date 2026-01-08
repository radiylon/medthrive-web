import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { schedules, type Schedule, type Medication } from "@/db/schema";

export class ScheduleService {
  async getSchedulesByMedicationId(medicationId: string): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(eq(schedules.medication_id, medicationId))
      .orderBy(asc(schedules.scheduled_date), asc(schedules.taken_at));
  }

  async createSchedules(medicationData: Medication): Promise<Schedule[]> {
    const { quantity, schedule, id: medicationId, patient_id: patientId } = medicationData;
    const { frequency, type, start_date } = schedule;

    const startDate = new Date(start_date);

    // Build array of all schedules to insert
    const schedulesToInsert: Array<{
      medication_id: string;
      patient_id: string;
      scheduled_date: Date;
      taken_at: null;
    }> = [];

    // Track how many pills we've scheduled
    let totalPillsScheduled = 0;

    // Track which day we're scheduling for
    let dayOffset = 0;

    // Continue until we've scheduled all pills
    while (totalPillsScheduled < quantity) {
      // Calculate the date for this set of pills
      const currentScheduleDate = new Date(startDate);

      // Add the day offset to get the current schedule date
      // For daily: adds 1 day each iteration
      // For weekly: adds 7 days each iteration
      currentScheduleDate.setDate(startDate.getDate() + dayOffset);

      // Schedule multiple pills for this date based on frequency
      // ex. if frequency is 2, create 2 schedules for the same date
      for (
        let pillsForThisDate = 0;
        pillsForThisDate < frequency && totalPillsScheduled < quantity;
        pillsForThisDate++
      ) {
        // Add schedule to batch insert array
        schedulesToInsert.push({
          medication_id: medicationId,
          patient_id: patientId,
          scheduled_date: currentScheduleDate,
          taken_at: null,
        });

        // Increment our pill counter
        totalPillsScheduled++;
      }

      // Move to the next day/week based on schedule type
      if (type === "daily") {
        dayOffset += 1; // Move to next day
      } else {
        dayOffset += 7; // Move to next week
      }
    }

    // Batch insert all schedules at once
    return await db.insert(schedules).values(schedulesToInsert).returning();
  }

  async markScheduleAsTaken(scheduleId: string): Promise<Schedule> {
    const [result] = await db
      .update(schedules)
      .set({
        taken_at: new Date(),
      })
      .where(eq(schedules.id, scheduleId))
      .returning();

    if (!result) {
      throw new Error("Schedule not found");
    }

    return result;
  }
}

export const scheduleService = new ScheduleService();
