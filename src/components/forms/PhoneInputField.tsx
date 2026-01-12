"use client";

import { useState, useEffect } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { formatPhoneInput, toE164, fromE164 } from "@/utils/phone";

interface PhoneInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  className?: string;
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
      render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
        // Local state for display value (allows showing incomplete numbers while typing)
        const [displayValue, setDisplayValue] = useState(() => fromE164(value));

        // Sync display value when form value changes externally (e.g., form reset)
        useEffect(() => {
          setDisplayValue(fromE164(value));
        }, [value]);

        return (
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
              value={displayValue}
              onChange={(e) => {
                const formatted = formatPhoneInput(e.target.value);
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

                // Always update display for smooth typing UX
                setDisplayValue(formatted);

                // Only update form value when complete (10 digits) or empty
                // This prevents validation errors during typing
                if (digits.length === 10) {
                  onChange(toE164(digits));
                } else if (digits.length === 0) {
                  onChange("");
                }
                // Don't update form value for partial numbers - keeps previous valid value
              }}
              onBlur={onBlur}
              className={`input input-bordered w-full ${error ? "input-error" : ""}`}
              placeholder="(555) 555-5555"
            />
            {error?.message && <span className="text-error text-sm">{error.message}</span>}
          </div>
        );
      }}
    />
  );
}
