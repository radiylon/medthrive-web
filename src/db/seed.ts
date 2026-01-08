import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "./index";
import { caregivers, patients, medications, schedules } from "./schema";
import { scheduleService } from "@/server/services";
import {
  ALLERGIES,
  MEDICAL_CONDITIONS,
  BLOOD_TYPES,
  EMERGENCY_CONTACT_RELATIONSHIPS,
  MEDICATIONS,
} from "./seed-data";

// Helper to pick random items from an array
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper to pick one random item
function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random number in range (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function clearData() {
  console.log("Clearing existing data...");
  await db.delete(schedules);
  await db.delete(medications);
  await db.delete(patients);
  await db.delete(caregivers);
  console.log("Data cleared.");
}

async function seedCaregiver() {
  console.log("Seeding caregiver...");
  const [caregiver] = await db
    .insert(caregivers)
    .values({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone_number: faker.phone.number({ style: "national" }),
    })
    .returning();

  console.log(`Created caregiver: ${caregiver.first_name} ${caregiver.last_name}`);
  return caregiver;
}

async function seedPatient(caregiverId: string) {
  const gender = pickOne(["male", "female"]);
  const hasNotes = Math.random() > 0.5;

  const [patient] = await db
    .insert(patients)
    .values({
      caregiver_id: caregiverId,
      first_name: faker.person.firstName(gender as "male" | "female"),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      phone_number: faker.phone.number({ style: "national" }),
      date_of_birth: faker.date
        .birthdate({ min: 65, max: 85, mode: "age" })
        .toISOString()
        .split("T")[0],
      gender,
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zipcode: faker.location.zipCode("#####"),
      },
      allergies: pickRandom(ALLERGIES, randomInt(0, 4)),
      medical_conditions: pickRandom(MEDICAL_CONDITIONS, randomInt(1, 4)),
      emergency_contact: {
        name: faker.person.fullName(),
        phone: faker.phone.number({ style: "national" }),
        relationship: pickOne(EMERGENCY_CONTACT_RELATIONSHIPS),
      },
      notes: hasNotes ? faker.lorem.sentence() : null,
      photo_url: null,
      blood_type: pickOne(BLOOD_TYPES),
      weight_lbs: faker.number.float({ min: 100, max: 220, fractionDigits: 1 }).toString(),
    })
    .returning();

  console.log(`  Created patient: ${patient.first_name} ${patient.last_name}`);
  return patient;
}

async function seedMedicationsForPatient(patientId: string) {
  const numMedications = randomInt(3, 6);
  const selectedMeds = pickRandom(MEDICATIONS, numMedications);
  let totalSchedules = 0;

  for (const med of selectedMeds) {
    // Calculate quantity from medication's typical frequency and supply days
    const quantity = med.frequency * med.supplyDays;

    const [medication] = await db
      .insert(medications)
      .values({
        patient_id: patientId,
        name: med.name,
        description: med.description,
        dosage: med.dosage,
        quantity,
        is_active: Math.random() > 0.2, // 80% active
        rx_number: `RX-${faker.date.recent().getFullYear()}-${faker.string.numeric(6)}`,
        schedule: {
          frequency: med.frequency,
          type: "daily" as const,
          start_date: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
        },
      })
      .returning();

    // Generate schedules using existing service
    const createdSchedules = await scheduleService.createSchedules(medication);
    totalSchedules += createdSchedules.length;

    console.log(`    Added medication: ${med.name} (${createdSchedules.length} schedules)`);
  }

  return { medications: numMedications, schedules: totalSchedules };
}

async function seed() {
  console.log("\n🌱 Starting seed process...\n");

  try {
    // Clear existing data
    await clearData();

    // Seed caregiver
    const caregiver = await seedCaregiver();

    // Seed 4 patients
    console.log("\nSeeding patients...");
    let totalMedications = 0;
    let totalSchedules = 0;

    for (let i = 0; i < 4; i++) {
      const patient = await seedPatient(caregiver.id);
      const stats = await seedMedicationsForPatient(patient.id);
      totalMedications += stats.medications;
      totalSchedules += stats.schedules;
    }

    // Summary
    console.log("\n✅ Seed completed!");
    console.log("   Summary:");
    console.log(`   - 1 caregiver`);
    console.log(`   - 4 patients`);
    console.log(`   - ${totalMedications} medications`);
    console.log(`   - ${totalSchedules} schedules\n`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
