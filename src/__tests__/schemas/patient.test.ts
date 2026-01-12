import { patientFormSchema } from "@/schemas/patient";

describe("patientFormSchema phone_number validation", () => {
  const phoneSchema = patientFormSchema.shape.phone_number;

  it("accepts valid E.164 US phone numbers", () => {
    // Use 619 area code (San Diego) - 555 area codes are reserved/fictional
    const result = phoneSchema.safeParse("+16195551234");
    expect(result.success).toBe(true);
  });

  it("accepts valid 10-digit US numbers with country code", () => {
    const result = phoneSchema.safeParse("+12025551234");
    expect(result.success).toBe(true);
  });

  it("rejects invalid phone numbers", () => {
    const result = phoneSchema.safeParse("invalid");
    expect(result.success).toBe(false);
    if (!result.success) {
      // Zod v4 uses 'issues' instead of 'errors'
      expect(result.error.issues[0].message).toBe("Valid US phone number required");
    }
  });

  it("rejects empty strings", () => {
    const result = phoneSchema.safeParse("");
    expect(result.success).toBe(false);
  });

  it("rejects partial phone numbers", () => {
    const result = phoneSchema.safeParse("+1555");
    expect(result.success).toBe(false);
  });

  it("rejects phone numbers without country code", () => {
    // The schema expects E.164 format with +1 prefix
    const result = phoneSchema.safeParse("5551234567");
    expect(result.success).toBe(false);
  });

  it("rejects phone numbers with invalid area codes", () => {
    // Area codes cannot start with 0 or 1
    const result = phoneSchema.safeParse("+10551234567");
    expect(result.success).toBe(false);
  });
});
