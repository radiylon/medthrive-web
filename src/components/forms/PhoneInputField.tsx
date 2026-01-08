"use client";

import PhoneInput from "react-phone-number-input/input";
import { useController, Control, FieldValues, Path } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import FormField from "./FormField";
import "react-phone-number-input/style.css";

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
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      validate: (val: string) => {
        if (!val && !required) return true;
        if (!val && required) return "Phone number is required";
        return isValidPhoneNumber(val, "US") || "Please enter a valid US phone number";
      },
    },
  });

  return (
    <FormField label={label} error={error?.message} required={required} className={className}>
      <PhoneInput
        country="US"
        value={value as string}
        onChange={(newValue) => onChange(newValue || "")}
        onBlur={onBlur}
        className="input input-bordered w-full"
        placeholder="(555) 555-5555"
      />
    </FormField>
  );
}
