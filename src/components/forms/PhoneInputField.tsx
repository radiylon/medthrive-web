"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface PhoneInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
}

// Format phone number as user types: (XXX) XXX-XXXX
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Convert to E.164 format for storage: +1XXXXXXXXXX
function toE164(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  return value;
}

// Convert from E.164 to display format
function fromE164(value: string | null | undefined): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  // Handle +1XXXXXXXXXX format
  if (digits.length === 11 && digits.startsWith("1")) {
    return formatPhoneNumber(digits.slice(1));
  }
  // Handle XXXXXXXXXX format
  if (digits.length === 10) {
    return formatPhoneNumber(digits);
  }
  return value;
}

export default function PhoneInputField<T extends FieldValues>({
  name,
  control,
  label = "Phone Number",
  required = false,
  className = "",
}: PhoneInputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
        <div className={`form-control flex flex-col gap-2 ${className}`}>
          <label className="label">
            <span className="label-text">
              {label}
              {required && <span className="text-error ml-1">*</span>}
            </span>
          </label>
          <input
            ref={ref}
            type="tel"
            value={fromE164(value)}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              const digits = e.target.value.replace(/\D/g, "");
              // Store as E.164 format if complete, otherwise store formatted
              if (digits.length === 10) {
                onChange(toE164(digits));
              } else if (digits.length === 0) {
                onChange("");
              } else {
                onChange(formatted);
              }
            }}
            onBlur={onBlur}
            className={`input input-bordered w-full ${error ? "input-error" : ""}`}
            placeholder="(555) 555-5555"
          />
          {error?.message && <span className="text-error text-sm">{error.message}</span>}
        </div>
      )}
    />
  );
}
