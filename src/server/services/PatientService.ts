import { eq } from "drizzle-orm";
import { db } from "@/db";
import { patients, type Patient, type NewPatient } from "@/db/schema";

export class PatientService {
  async getPatients() {
    return await db.select({
      id: patients.id,
      first_name: patients.first_name,
      last_name: patients.last_name,
      photo_url: patients.photo_url,
      medical_conditions: patients.medical_conditions,
    }).from(patients);
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

export const patientService = new PatientService();
