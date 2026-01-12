import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { CAREGIVER_ID } from "@/constants";
import { patientFormSchema, PatientFormData } from "@/schemas";
import FormField from "@/components/forms/FormField";
import StateSelectInput from "@/components/forms/StateSelectInput";
import DatePickerInput from "@/components/forms/DatePickerInput";
import PhoneInputField from "@/components/forms/PhoneInputField";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValues: PatientFormData = {
  first_name: "",
  last_name: "",
  date_of_birth: "",
  email: "",
  phone_number: "",
  gender: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipcode: "",
  },
};

export default function AddPatientModal({ isOpen, onClose }: AddPatientModalProps) {
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
  });

  const createPatient = trpc.patient.create.useMutation({
    onSuccess: () => {
      showToast({ message: "Patient created successfully", type: "success" });
      utils.patient.list.invalidate();
      onClose();
      reset();
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const onSubmit = (data: PatientFormData) => {
    createPatient.mutate({ ...data, caregiver_id: CAREGIVER_ID });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

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
        <h3 className="font-bold text-2xl mb-4 text-center">Add New Patient</h3>
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
              disabled={createPatient.isPending}
            >
              {createPatient.isPending ? "Adding..." : "Add Patient"}
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
