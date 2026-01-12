import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { patientFormSchema, PatientFormData } from "@/schemas";
import FormField from "@/components/forms/FormField";
import StateSelectInput from "@/components/forms/StateSelectInput";
import DatePickerInput from "@/components/forms/DatePickerInput";
import PhoneInputField from "@/components/forms/PhoneInputField";
import type { Patient } from "@/db/schema";

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export default function EditPatientModal({ isOpen, onClose, patient }: EditPatientModalProps) {
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    values: patient
      ? {
          first_name: patient.first_name,
          last_name: patient.last_name,
          email: patient.email,
          phone_number: patient.phone_number,
          date_of_birth: patient.date_of_birth,
          gender: patient.gender,
          address: patient.address,
        }
      : undefined,
  });

  const updatePatient = trpc.patient.update.useMutation({
    onSuccess: () => {
      showToast({ message: "Patient updated successfully", type: "success" });
      utils.patient.byId.invalidate({ id: patient?.id });
      utils.patient.list.invalidate();
      onClose();
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const onSubmit = (data: PatientFormData) => {
    if (!patient) return;
    updatePatient.mutate({ id: patient.id, ...data });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !patient) return null;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-4xl w-full">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl mb-4 text-center">Edit Patient</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-2 gap-x-6 gap-y-4">
          <FormField label="First Name" error={errors.first_name?.message} required>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("first_name")}
            />
          </FormField>

          <FormField label="Last Name" error={errors.last_name?.message} required>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("last_name")}
            />
          </FormField>

          <FormField label="Email" error={errors.email?.message} required>
            <input
              type="email"
              className="input input-bordered w-full"
              {...register("email")}
            />
          </FormField>

          <PhoneInputField
            name="phone_number"
            control={control}
            label="Phone Number"
            required
          />

          <DatePickerInput
            name="date_of_birth"
            register={register}
            errors={errors}
            label="Date of Birth"
            required
          />

          <FormField label="Gender" error={errors.gender?.message} required>
            <select className="select select-bordered w-full" {...register("gender")}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </FormField>

          <FormField label="Street" error={errors.address?.street?.message} required>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("address.street")}
            />
          </FormField>

          <FormField label="City" error={errors.address?.city?.message} required>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("address.city")}
            />
          </FormField>

          <StateSelectInput
            name="address.state"
            register={register}
            errors={errors}
            label="State"
            required
          />

          <FormField label="Zipcode" error={errors.address?.zipcode?.message} required>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("address.zipcode")}
            />
          </FormField>

          <div className="modal-action flex justify-end gap-2 mt-8 col-span-2">
            <button
              type="button"
              className="btn btn-outline hover:bg-base-200/50 hover:border-base-content/20 min-w-32 max-w-64 min-h-12"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-32 max-w-64 min-h-12"
              disabled={updatePatient.isPending || !isDirty}
            >
              {updatePatient.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
