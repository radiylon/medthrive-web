import { eq, and, count } from "drizzle-orm";
import { db } from "@/db";
import { patients, medications, type Patient, type NewPatient } from "@/db/schema";

export class PatientRepository {
  async getPatients() {
    return await db
      .select({
        id: patients.id,
        first_name: patients.first_name,
        last_name: patients.last_name,
        photo_url: patients.photo_url,
        active_medication_count: count(medications.id),
      })
      .from(patients)
      .leftJoin(
        medications,
        and(
          eq(medications.patient_id, patients.id),
          eq(medications.is_active, true)
        )
      )
      .groupBy(patients.id, patients.first_name, patients.last_name, patients.photo_url);
  }

  async getPatientById(patientId: string): Promise<Patient> {
    const result = await db.select().from(patients).where(eq(patients.id, patientId));

    if (!result || result.length === 0) {
      throw new Error("Patient not found");
    }

    return result[0];
  }

  async createPatient(patient: NewPatient): Promise<Patient> {
    const [result] = await db.insert(patients).values(patient).returning();
    return result;
  }

  async updatePatient(patientId: string, updates: Partial<Omit<Patient, "id" | "caregiver_id" | "created_at" | "updated_at">>): Promise<Patient> {
    const [result] = await db
      .update(patients)
      .set(updates)
      .where(eq(patients.id, patientId))
      .returning();

    if (!result) {
      throw new Error("Patient not found");
    }

    return result;
  }
}

export const patientRepository = new PatientRepository();
