import { eq, asc, and, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { schedules, medications, patients, type Schedule, type Medication } from "@/db/schema";

export type DoseStatus = "taken" | "pending";

export interface DoseWithDetails extends Schedule {
  medication: {
    id: string;
    name: string;
    dosage: string | null;
  };
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    photo_url: string | null;
  };
  status: DoseStatus;
}

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

  async unmarkScheduleAsTaken(scheduleId: string): Promise<Schedule> {
    const [result] = await db
      .update(schedules)
      .set({
        taken_at: null,
      })
      .where(eq(schedules.id, scheduleId))
      .returning();

    if (!result) {
      throw new Error("Schedule not found");
    }

    return result;
  }

  private getTimeRanges() {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    return { now, startOfToday, endOfToday };
  }

  async getTodaysDoses(): Promise<DoseWithDetails[]> {
    const { startOfToday, endOfToday } = this.getTimeRanges();

    const results = await db
      .select({
        schedule: schedules,
        medication: {
          id: medications.id,
          name: medications.name,
          dosage: medications.dosage,
        },
        patient: {
          id: patients.id,
          first_name: patients.first_name,
          last_name: patients.last_name,
          photo_url: patients.photo_url,
        },
      })
      .from(schedules)
      .innerJoin(medications, eq(schedules.medication_id, medications.id))
      .innerJoin(patients, eq(schedules.patient_id, patients.id))
      .where(
        and(
          gte(schedules.scheduled_date, startOfToday),
          lte(schedules.scheduled_date, endOfToday)
        )
      )
      .orderBy(asc(schedules.scheduled_date));

    return results.map((r) => ({
      ...r.schedule,
      medication: r.medication,
      patient: r.patient,
      status: r.schedule.taken_at ? "taken" : "pending" as DoseStatus,
    }));
  }
}

export const scheduleService = new ScheduleService();
