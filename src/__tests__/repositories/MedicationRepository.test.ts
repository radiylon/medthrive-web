import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockMedication, mockMedicationsList, mockNewMedication } from "../data/medications";

// Mock the database module
vi.mock("@/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

// Import after mocking
import { db } from "@/db";
import { MedicationRepository } from "@/server/repositories/MedicationRepository";

describe("MedicationRepository", () => {
  let medicationRepository: MedicationRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    medicationRepository = new MedicationRepository();
  });

  describe("getMedicationsByPatientId", () => {
    it("should return medications for a patient", async () => {
      vi.mocked(db.where).mockResolvedValueOnce(mockMedicationsList as any);

      const result = await medicationRepository.getMedicationsByPatientId("patient-1");

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalled();
      expect(db.where).toHaveBeenCalled();
      expect(result).toEqual(mockMedicationsList);
    });

    it("should return empty array when patient has no medications", async () => {
      vi.mocked(db.where).mockResolvedValueOnce([] as any);

      const result = await medicationRepository.getMedicationsByPatientId("patient-no-meds");

      expect(result).toEqual([]);
    });
  });

  describe("getMedicationById", () => {
    it("should return a medication when found", async () => {
      vi.mocked(db.where).mockResolvedValueOnce([mockMedication] as any);

      const result = await medicationRepository.getMedicationById("medication-1");

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalled();
      expect(db.where).toHaveBeenCalled();
      expect(result).toEqual(mockMedication);
    });

    it("should throw an error when medication is not found", async () => {
      vi.mocked(db.where).mockResolvedValueOnce([] as any);

      await expect(medicationRepository.getMedicationById("non-existent")).rejects.toThrow(
        "Medication not found"
      );
    });
  });

  describe("createMedication", () => {
    it("should create and return a new medication", async () => {
      const createdMedication = { ...mockMedication, ...mockNewMedication };
      vi.mocked(db.returning).mockResolvedValueOnce([createdMedication] as any);

      const result = await medicationRepository.createMedication(mockNewMedication);

      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith(mockNewMedication);
      expect(db.returning).toHaveBeenCalled();
      expect(result).toEqual(createdMedication);
    });
  });

  describe("updateMedication", () => {
    it("should update and return the medication", async () => {
      const updatedMedication = { ...mockMedication, is_active: false };
      vi.mocked(db.returning).mockResolvedValueOnce([updatedMedication] as any);

      const result = await medicationRepository.updateMedication("medication-1", { is_active: false });

      expect(db.update).toHaveBeenCalled();
      expect(db.set).toHaveBeenCalledWith({ is_active: false });
      expect(db.where).toHaveBeenCalled();
      expect(db.returning).toHaveBeenCalled();
      expect(result).toEqual(updatedMedication);
    });

    it("should throw an error when medication is not found", async () => {
      vi.mocked(db.returning).mockResolvedValueOnce([undefined] as any);

      await expect(
        medicationRepository.updateMedication("non-existent", { is_active: false })
      ).rejects.toThrow("Medication not found");
    });
  });
});
