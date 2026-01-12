import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockSchedule, mockSchedulesList } from "../data/schedules";
import { mockMedication } from "../data/medications";

// Mock the database module
vi.mock("@/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

// Import after mocking
import { db } from "@/db";
import { ScheduleRepository } from "@/server/repositories/ScheduleRepository";

describe("ScheduleRepository", () => {
  let scheduleRepository: ScheduleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    scheduleRepository = new ScheduleRepository();
  });

  describe("getSchedulesByMedicationId", () => {
    it("should return schedules for a medication ordered by date", async () => {
      vi.mocked(db.orderBy).mockResolvedValueOnce(mockSchedulesList as any);

      const result = await scheduleRepository.getSchedulesByMedicationId("medication-1");

      expect(db.select).toHaveBeenCalled();
      expect(db.from).toHaveBeenCalled();
      expect(db.where).toHaveBeenCalled();
      expect(db.orderBy).toHaveBeenCalled();
      expect(result).toEqual(mockSchedulesList);
    });

    it("should return empty array when medication has no schedules", async () => {
      vi.mocked(db.orderBy).mockResolvedValueOnce([] as any);

      const result = await scheduleRepository.getSchedulesByMedicationId("medication-no-schedules");

      expect(result).toEqual([]);
    });
  });

  describe("createSchedules", () => {
    it("should create schedules based on medication quantity and frequency", async () => {
      const medication = {
        ...mockMedication,
        quantity: 4,
        schedule: {
          frequency: 2,
          type: "daily" as const,
          start_date: "2024-01-01",
        },
      };

      // Mock returning the inserted schedules
      vi.mocked(db.returning).mockImplementation(() => {
        // Get the values that were passed to insert
        const insertCall = vi.mocked(db.values).mock.calls[0][0];
        return Promise.resolve(
          (insertCall as any[]).map((s: any, index: number) => ({
            id: `schedule-${index + 1}`,
            ...s,
            created_at: new Date(),
            updated_at: new Date(),
          }))
        ) as any;
      });

      const result = await scheduleRepository.createSchedules(medication);

      expect(db.insert).toHaveBeenCalled();
      expect(db.values).toHaveBeenCalled();
      expect(db.returning).toHaveBeenCalled();

      // With quantity 4 and frequency 2, we should have 4 schedules across 2 days
      expect(result).toHaveLength(4);
    });

    it("should create weekly schedules correctly", async () => {
      const medication = {
        ...mockMedication,
        quantity: 3,
        schedule: {
          frequency: 1,
          type: "weekly" as const,
          start_date: "2024-01-01",
        },
      };

      vi.mocked(db.returning).mockImplementation(() => {
        const insertCall = vi.mocked(db.values).mock.calls[0][0];
        return Promise.resolve(
          (insertCall as any[]).map((s: any, index: number) => ({
            id: `schedule-${index + 1}`,
            ...s,
            created_at: new Date(),
            updated_at: new Date(),
          }))
        ) as any;
      });

      const result = await scheduleRepository.createSchedules(medication);

      expect(result).toHaveLength(3);

      // Verify the scheduled dates are 7 days apart
      const dates = result.map((s) => s.scheduled_date);
      const startDate = new Date("2024-01-01");
      expect(dates[0].getTime()).toBe(startDate.getTime());
      expect(dates[1].getTime()).toBe(new Date("2024-01-08").getTime());
      expect(dates[2].getTime()).toBe(new Date("2024-01-15").getTime());
    });

    it("should set taken_at to null for all new schedules", async () => {
      const medication = {
        ...mockMedication,
        quantity: 2,
        schedule: {
          frequency: 1,
          type: "daily" as const,
          start_date: "2024-01-01",
        },
      };

      vi.mocked(db.returning).mockImplementation(() => {
        const insertCall = vi.mocked(db.values).mock.calls[0][0];
        return Promise.resolve(
          (insertCall as any[]).map((s: any, index: number) => ({
            id: `schedule-${index + 1}`,
            ...s,
            created_at: new Date(),
            updated_at: new Date(),
          }))
        ) as any;
      });

      const result = await scheduleRepository.createSchedules(medication);

      result.forEach((schedule) => {
        expect(schedule.taken_at).toBeNull();
      });
    });
  });

  describe("markScheduleAsTaken", () => {
    it("should mark a schedule as taken with current timestamp", async () => {
      const takenSchedule = { ...mockSchedule, taken_at: new Date() };
      vi.mocked(db.returning).mockResolvedValueOnce([takenSchedule] as any);

      const result = await scheduleRepository.markScheduleAsTaken("schedule-1");

      expect(db.update).toHaveBeenCalled();
      expect(db.set).toHaveBeenCalled();
      expect(db.where).toHaveBeenCalled();
      expect(db.returning).toHaveBeenCalled();
      expect(result.taken_at).not.toBeNull();
    });

    it("should throw an error when schedule is not found", async () => {
      vi.mocked(db.returning).mockResolvedValueOnce([undefined] as any);

      await expect(scheduleRepository.markScheduleAsTaken("non-existent")).rejects.toThrow(
        "Schedule not found"
      );
    });
  });
});
