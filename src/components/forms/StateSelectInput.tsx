import { UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
import { US_STATES } from "@/constants/us-states";
import FormField from "./FormField";

interface StateSelectInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  label?: string;
  required?: boolean;
  className?: string;
}

export default function StateSelectInput<T extends FieldValues>({
  name,
  register,
  errors,
  label = "State",
  required = false,
  className = "",
}: StateSelectInputProps<T>) {
  // Navigate nested error paths (e.g., "address.state")
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
      <select className={`select select-bordered w-full ${error?.message ? "select-error" : ""}`} {...register(name)}>
        <option value="">Select state</option>
        {US_STATES.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </FormField>
  );
}
