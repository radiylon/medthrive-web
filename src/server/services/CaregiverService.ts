import { eq } from "drizzle-orm";
import { db } from "@/db";
import { caregivers, type Caregiver } from "@/db/schema";

export class CaregiverService {
  // For demo purposes, get the first caregiver (no auth in this demo)
  async getCurrentCaregiver(): Promise<Caregiver> {
    const result = await db.select().from(caregivers).limit(1);

    if (!result || result.length === 0) {
      throw new Error("No caregiver found");
    }

    return result[0];
  }

  async getCaregiverById(caregiverId: string): Promise<Caregiver> {
    const result = await db.select().from(caregivers).where(eq(caregivers.id, caregiverId));

    if (!result || result.length === 0) {
      throw new Error("Caregiver not found");
    }

    return result[0];
  }

  async updateCaregiver(
    caregiverId: string,
    updates: Partial<Omit<Caregiver, "id" | "created_at" | "updated_at">>
  ): Promise<Caregiver> {
    const [result] = await db
      .update(caregivers)
      .set(updates)
      .where(eq(caregivers.id, caregiverId))
      .returning();

    if (!result) {
      throw new Error("Caregiver not found");
    }

    return result;
  }
}

export const caregiverService = new CaregiverService();
