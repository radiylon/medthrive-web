import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
import FormField from "./FormField";

interface DatePickerInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function DatePickerInput<T extends FieldValues>({
  name,
  register,
  errors,
  label = "Date",
  required = false,
  className = "",
}: DatePickerInputProps<T>) {
  // Navigate nested error paths (e.g., "schedule.start_date")
  const getNestedError = () => {
    const parts = (name as string).split(".");
    let current: unknown = errors;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current as { message?: string } | undefined;
  };

  const error = getNestedError();

  return (
    <FormField label={label} error={error?.message} required={required} className={className}>
      <input
        type="date"
        className={`input input-bordered w-full ${error ? "input-error" : ""}`}
        {...register(name)}
      />
    </FormField>
  );
}
