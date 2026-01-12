/**
 * Format phone number as user types: (XXX) XXX-XXXX
 */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Convert 10-digit phone number to E.164 format for storage: +1XXXXXXXXXX
 */
export function toE164(digits: string): string {
  return `+1${digits}`;
}

/**
 * Convert from E.164 format (+1XXXXXXXXXX) to display format: (XXX) XXX-XXXX
 */
export function fromE164(value: string | null | undefined): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  // Handle +1XXXXXXXXXX format
  if (digits.length === 11 && digits.startsWith("1")) {
    return formatPhoneInput(digits.slice(1));
  }
  // Handle XXXXXXXXXX format
  if (digits.length === 10) {
    return formatPhoneInput(digits);
  }
  return value;
}
