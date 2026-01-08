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
  },
}));

// Import after mocking
import { db } from "@/db";
import { PatientService } from "@/server/services/PatientService";

describe("PatientService", () => {
  let patientService: PatientService;

  beforeEach(() => {
    vi.clearAllMocks();
    patientService = new PatientService();
  });

  describe("getPatients", () => {
    it("should return a list of patients with id, first_name, and last_name", async () => {
      vi.mocked(db.from).mockResolvedValueOnce(mockPatientsList as any);

      const result = await patientService.getPatients();

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalled();
      expect(result).toEqual(mockPatientsList);
    });
  });

  describe("getPatientById", () => {
    it("should return a patient when found", async () => {
      vi.mocked(db.where).mockResolvedValueOnce([mockPatient] as any);

      const result = await patientService.getPatientById("patient-1");

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalled();
      expect(db.where).toHaveBeenCalled();
      expect(result).toEqual(mockPatient);
    });

    it("should throw an error when patient is not found", async () => {
      vi.mocked(db.where).mockResolvedValueOnce([] as any);

      await expect(patientService.getPatientById("non-existent")).rejects.toThrow(
        "Patient not found"
      );
    });
  });

  describe("createPatient", () => {
    it("should create and return a new patient", async () => {
      const createdPatient = { ...mockPatient, ...mockNewPatient };
      vi.mocked(db.returning).mockResolvedValueOnce([createdPatient] as any);

      const result = await patientService.createPatient(mockNewPatient);

      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalledWith(mockNewPatient);
      expect(db.returning).toHaveBeenCalled();
      expect(result).toEqual(createdPatient);
    });
  });
});
