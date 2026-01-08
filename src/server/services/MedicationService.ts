import { eq } from "drizzle-orm";
import { db } from "@/db";
import { medications, type Medication, type NewMedication } from "@/db/schema";

export class MedicationService {
  async getMedicationsByPatientId(patientId: string): Promise<Medication[]> {
    return await db.select().from(medications).where(eq(medications.patient_id, patientId));
  }

  async getMedicationById(medicationId: string): Promise<Medication> {
    const result = await db.select().from(medications).where(eq(medications.id, medicationId));

    if (!result || result.length === 0) {
      throw new Error("Medication not found");
    }

    return result[0];
  }

  async createMedication(medication: NewMedication): Promise<Medication> {
    const [result] = await db.insert(medications).values(medication).returning();
    return result;
  }

  async updateMedication(medicationId: string, data: Partial<Omit<Medication, "id" | "created_at">>): Promise<Medication> {
    const [result] = await db
      .update(medications)
      .set(data)
      .where(eq(medications.id, medicationId))
      .returning();

    if (!result) {
      throw new Error("Medication not found");
    }

    return result;
  }
}

export const medicationService = new MedicationService();
