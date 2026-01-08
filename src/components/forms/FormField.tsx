import React from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement<{ className?: string }>;
  className?: string;
}

export default function FormField({
  label,
  error,
  required,
  children,
  className = "",
}: FormFieldProps) {
  // Add input-error class to child when there's an error
  const childWithError = React.cloneElement(children, {
    className: `${children.props.className || ""} ${error ? "input-error" : ""}`.trim(),
  });

  return (
    <div className={`form-control flex flex-col gap-2 ${className}`}>
      <label className="label">
        <span className="label-text">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      {childWithError}
      {error && <span className="text-error text-sm">{error}</span>}
    </div>
  );
}
