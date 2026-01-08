import type { Medication, NewMedication } from "@/db/schema";

export const mockMedication: Medication = {
  id: "medication-1",
  patient_id: "patient-1",
  name: "Aspirin",
  description: "Pain relief",
  dosage: "325mg",
  quantity: 30,
  is_active: true,
  rx_number: "RX-2024-001234",
  schedule: {
    frequency: 2,
    type: "daily",
    start_date: "2024-01-01",
  },
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-01"),
};

export const mockNewMedication: NewMedication = {
  patient_id: "patient-1",
  name: "Vitamin D",
  description: "Daily supplement",
  quantity: 60,
  is_active: true,
  schedule: {
    frequency: 1,
    type: "daily",
    start_date: "2024-02-01",
  },
};

export const mockMedicationsList: Medication[] = [
  mockMedication,
  {
    id: "medication-2",
    patient_id: "patient-1",
    name: "Ibuprofen",
    description: "Anti-inflammatory",
    dosage: "200mg",
    quantity: 20,
    is_active: false,
    rx_number: "RX-2024-005678",
    schedule: {
      frequency: 3,
      type: "daily",
      start_date: "2024-01-15",
    },
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
  },
];
