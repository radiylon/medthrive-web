import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPatient, mockPatientsList, mockNewPatient } from "../data/patients";

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
    leftJoin: vi.fn().mockReturnThis(),
    groupBy: vi.fn(),
  },
}));

// Import after mocking
import { db } from "@/db";
import { PatientRepository } from "@/server/repositories/PatientRepository";

describe("PatientRepository", () => {
  let patientRepository: PatientRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    patientRepository = new PatientRepository();
  });

  describe("getPatients", () => {
    it("should return a list of patients with id, first_name, and last_name", async () => {
      vi.mocked(db.groupBy).mockResolvedValueOnce(mockPatientsList as any);

      const result = await patientRepository.getPatients();

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalled();
      expect(db.leftJoin).toHaveBeenCalled();
      expect(db.groupBy).toHaveBeenCalled();
      expect(result).toEqual(mockPatientsList);
    });
  });

  describe("getPatientById", () => {
    it("should return a patient when found", async () => {
      vi.mocked(db.where).mockResolvedValueOnce([mockPatient] as any);

      const result = await patientRepository.getPatientById("patient-1");

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalled();
      expect(db.where).toHaveBeenCalled();
      expect(result).toEqual(mockPatient);
    });

    it("should throw an error when patient is not found", async () => {
      vi.mocked(db.where).mockResolvedValueOnce([] as any);

      await expect(patientRepository.getPatientById("non-existent")).rejects.toThrow(
        "Patient not found"
      );
    });
  });

  describe("createPatient", () => {
    it("should create and return a new patient", async () => {
      const createdPatient = { ...mockPatient, ...mockNewPatient };
      vi.mocked(db.returning).mockResolvedValueOnce([createdPatient] as any);

      const result = await patientRepository.createPatient(mockNewPatient);

      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith(mockNewPatient);
      expect(db.returning).toHaveBeenCalled();
      expect(result).toEqual(createdPatient);
    });
  });
});
