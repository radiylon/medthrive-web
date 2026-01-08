// Curated medical data for realistic seeding

export const ALLERGIES = [
  "Penicillin",
  "Sulfa",
  "Aspirin",
  "Latex",
  "Peanuts",
  "Shellfish",
  "Iodine",
  "NSAIDs",
  "Codeine",
  "Morphine",
];

export const MEDICAL_CONDITIONS = [
  "Hypertension",
  "Type 2 Diabetes",
  "Arthritis",
  "COPD",
  "Atrial Fibrillation",
  "Osteoporosis",
  "Chronic Kidney Disease",
  "Heart Failure",
  "Hypothyroidism",
  "Glaucoma",
  "Asthma",
  "Depression",
];

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const EMERGENCY_CONTACT_RELATIONSHIPS = [
  "Spouse",
  "Son",
  "Daughter",
  "Sibling",
  "Friend",
  "Neighbor",
];

export const MEDICATIONS = [
  { name: "Metformin", dosage: "500mg", description: "Blood sugar control", supplyDays: 90, frequency: 2 },
  { name: "Lisinopril", dosage: "10mg", description: "Blood pressure control", supplyDays: 90, frequency: 1 },
  { name: "Amlodipine", dosage: "5mg", description: "Blood pressure control", supplyDays: 90, frequency: 1 },
  { name: "Atorvastatin", dosage: "20mg", description: "Cholesterol management", supplyDays: 90, frequency: 1 },
  { name: "Omeprazole", dosage: "20mg", description: "Acid reflux prevention", supplyDays: 30, frequency: 1 },
  { name: "Levothyroxine", dosage: "50mcg", description: "Thyroid hormone replacement", supplyDays: 90, frequency: 1 },
  { name: "Gabapentin", dosage: "300mg", description: "Nerve pain relief", supplyDays: 30, frequency: 3 },
  { name: "Hydrochlorothiazide", dosage: "25mg", description: "Diuretic for blood pressure", supplyDays: 90, frequency: 1 },
  { name: "Sertraline", dosage: "50mg", description: "Mood stabilization", supplyDays: 90, frequency: 1 },
  { name: "Warfarin", dosage: "5mg", description: "Blood thinner", supplyDays: 30, frequency: 1 },
  { name: "Furosemide", dosage: "40mg", description: "Diuretic for fluid retention", supplyDays: 30, frequency: 2 },
  { name: "Pantoprazole", dosage: "40mg", description: "Stomach acid reduction", supplyDays: 90, frequency: 1 },
  { name: "Metoprolol", dosage: "25mg", description: "Heart rate control", supplyDays: 90, frequency: 2 },
  { name: "Losartan", dosage: "50mg", description: "Blood pressure control", supplyDays: 90, frequency: 1 },
  { name: "Prednisone", dosage: "10mg", description: "Anti-inflammatory", supplyDays: 14, frequency: 1 },
];

export const SCHEDULE_TYPES = ["daily", "weekly"] as const;
