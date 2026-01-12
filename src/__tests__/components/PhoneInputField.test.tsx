import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInputField from "@/components/forms/PhoneInputField";

// Simple schema for testing - mirrors the patientFormSchema phone validation
const testSchema = z.object({
  phone_number: z.string().refine((val) => isValidPhoneNumber(val, "US"), {
    message: "Valid US phone number required",
  }),
});

type TestFormData = z.infer<typeof testSchema>;

// Test wrapper component that provides react-hook-form context
function TestForm({ onSubmit }: { onSubmit?: (data: TestFormData) => void }) {
  const { control, handleSubmit } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: { phone_number: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit || (() => {}))}>
      <PhoneInputField name="phone_number" control={control} required />
      <button type="submit">Submit</button>
    </form>
  );
}

// Test wrapper with pre-filled value
function TestFormWithValue({ initialValue }: { initialValue: string }) {
  const { control, handleSubmit } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: { phone_number: initialValue },
  });

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <PhoneInputField name="phone_number" control={control} required />
      <button type="submit">Submit</button>
    </form>
  );
}

describe("PhoneInputField", () => {
  it("renders without causing infinite re-renders", async () => {
    // If there's an infinite loop, this test will timeout
    render(<TestForm />);

    // Verify the input is rendered
    expect(screen.getByPlaceholderText("(555) 555-5555")).toBeInTheDocument();
  });

  it("renders with default label", () => {
    render(<TestForm />);

    expect(screen.getByText("Phone Number")).toBeInTheDocument();
  });

  it("shows required indicator when required prop is true", () => {
    render(<TestForm />);

    // The asterisk is rendered in a span with text-error class
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("displays Zod validation error on submit with empty value", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    // Submit without entering anything
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Should show validation error from Zod schema
    await waitFor(() => {
      expect(screen.getByText("Valid US phone number required")).toBeInTheDocument();
    });
  });

  it("displays Zod validation error for invalid phone number", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const input = screen.getByPlaceholderText("(555) 555-5555");

    // Type an incomplete phone number
    await user.type(input, "555");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText("Valid US phone number required")).toBeInTheDocument();
    });
  });

  it("allows typing a full phone number without errors", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<TestForm onSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("(555) 555-5555");

    // Type a valid US phone number (10 digits)
    await user.type(input, "2025551234");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Should submit successfully without validation errors
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });

    // The submitted value should be in E.164 format
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ phone_number: "+12025551234" }),
      expect.anything()
    );
  });

  it("renders correctly with pre-filled E.164 value", () => {
    render(<TestFormWithValue initialValue="+15551234567" />);

    const input = screen.getByPlaceholderText("(555) 555-5555") as HTMLInputElement;
    // The input should have a value (formatted for display)
    expect(input.value).not.toBe("");
  });

  it("clears validation error when valid number is entered", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const input = screen.getByPlaceholderText("(555) 555-5555");

    // Submit to trigger validation error
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Valid US phone number required")).toBeInTheDocument();
    });

    // Type a valid phone number
    await user.type(input, "2025551234");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Error should be cleared after successful submission
    await waitFor(() => {
      expect(screen.queryByText("Valid US phone number required")).not.toBeInTheDocument();
    });
  });
});
