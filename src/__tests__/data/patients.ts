import type { Patient, NewPatient } from "@/db/schema";

export const mockCaregiver = {
  id: "97bca0dd-d50e-4b69-b416-21df0421dc15",
  first_name: "John",
  last_name: "Caregiver",
  email: "caregiver@test.com",
  phone_number: "1234567890",
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-01"),
};

export const mockPatient: Patient = {
  id: "patient-1",
  caregiver_id: mockCaregiver.id,
  first_name: "Jane",
  last_name: "Doe",
  email: "jane@test.com",
  phone_number: "0987654321",
  date_of_birth: "1990-05-15",
  gender: "female",
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipcode: "12345",
  },
  allergies: ["Penicillin", "Sulfa"],
  medical_conditions: ["Hypertension", "Type 2 Diabetes"],
  emergency_contact: {
    name: "John Doe",
    phone: "555-123-4567",
    relationship: "Spouse",
  },
  notes: "Prefers morning appointments",
  photo_url: null,
  blood_type: "O+",
  weight_lbs: "145.5",
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-01"),
};

export const mockNewPatient: NewPatient = {
  caregiver_id: mockCaregiver.id,
  first_name: "New",
  last_name: "Patient",
  email: "new@test.com",
  phone_number: "5555555555",
  date_of_birth: "1985-03-20",
  gender: "male",
  address: {
    street: "456 Oak Ave",
    city: "Somewhere",
    state: "NY",
    zipcode: "67890",
  },
};

export const mockPatientsList = [
  { id: "patient-1", first_name: "Jane", last_name: "Doe" },
  { id: "patient-2", first_name: "Bob", last_name: "Smith" },
  { id: "patient-3", first_name: "Alice", last_name: "Johnson" },
];
