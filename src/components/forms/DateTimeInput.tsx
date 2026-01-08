import { useController, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Calendar, Clock } from "lucide-react";

interface DateTimeInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  showTime?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

export function DateTimeInput<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  showTime = false,
  minDate,
  maxDate,
  className = "",
}: DateTimeInputProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  // Convert datetime-local format to/from the field value
  const getInputValue = (): string => {
    if (!field.value) return "";

    const value = field.value as string | Date;

    if (showTime) {
      // For datetime-local, we need YYYY-MM-DDTHH:MM format
      if (value instanceof Date) {
        return value.toISOString().slice(0, 16);
      }
      // If it's already a string, return as is or convert
      return String(value).slice(0, 16);
    } else {
      // For date only, we need YYYY-MM-DD format
      if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
      }
      return String(value).slice(0, 10);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      field.onChange(null);
      return;
    }

    if (showTime) {
      // datetime-local gives us YYYY-MM-DDTHH:MM
      field.onChange(new Date(value).toISOString());
    } else {
      // date gives us YYYY-MM-DD
      field.onChange(value);
    }
  };

  const inputType = showTime ? "datetime-local" : "date";
  const Icon = showTime ? Clock : Calendar;
  const hasError = !!error;

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 ${hasError ? "text-error" : "text-base-content/40"}`} />
        </div>
        <input
          type={inputType}
          value={getInputValue()}
          onChange={handleChange}
          onBlur={field.onBlur}
          min={minDate}
          max={maxDate}
          className={`input input-bordered w-full pl-10 ${hasError ? "input-error" : ""}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
        />
      </div>
      {error && (
        <label className="label" id={`${name}-error`}>
          <span className="label-text-alt text-error">{error.message}</span>
        </label>
      )}
    </div>
  );
}
