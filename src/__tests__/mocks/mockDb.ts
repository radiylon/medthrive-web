import { vi } from "vitest";

// In-memory storage for mock data
export const mockData = {
  caregivers: [] as any[],
  patients: [] as any[],
  medications: [] as any[],
  schedules: [] as any[],
};

// Reset mock data between tests
export const resetMockData = () => {
  mockData.caregivers = [];
  mockData.patients = [];
  mockData.medications = [];
  mockData.schedules = [];
};

// Mock database operations
export const createMockDb = () => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
});

export const mockDb = createMockDb();
