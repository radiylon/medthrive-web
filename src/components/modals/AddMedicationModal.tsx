import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { toLocalDateString } from "@/utils/date";
import { useToast } from "@/contexts/ToastContext";
import { medicationFormSchema, MedicationFormData } from "@/schemas";
import FormField from "@/components/forms/FormField";
import DatePickerInput from "@/components/forms/DatePickerInput";

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getDefaultValues = (): MedicationFormData => ({
  name: "",
  is_active: true,
  description: "",
  quantity: 0,
  schedule: {
    frequency: 2,
    type: "daily",
    start_date: toLocalDateString(),
  },
});

export default function AddMedicationModal({ isOpen, onClose }: AddMedicationModalProps) {
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const router = useRouter();
  const { patientId } = router.query;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: getDefaultValues(),
  });

  const createMedication = trpc.medication.create.useMutation({
    onSuccess: () => {
      showToast({ message: "Medication created successfully", type: "success" });
      utils.medication.byPatientId.invalidate({ patientId: patientId as string });
      onClose();
      reset(getDefaultValues());
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const onSubmit = (data: MedicationFormData) => {
    createMedication.mutate({
      ...data,
      patient_id: patientId as string,
    });
  };

  const handleClose = () => {
    reset(getDefaultValues());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-4xl w-full mx-4 sm:mx-auto">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl sm:text-2xl mb-4 text-center">Add New Medication</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <FormField label="Medication Name" error={errors.name?.message} required>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("name")}
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("description")}
            />
          </FormField>

          <FormField label="Medication Quantity" error={errors.quantity?.message} required>
            <input
              type="number"
              className="input input-bordered w-full"
              {...register("quantity", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Dosage Frequency (example: 2 times/day)"
            error={errors.schedule?.frequency?.message}
            required
          >
            <input
              type="number"
              className="input input-bordered w-full"
              {...register("schedule.frequency", { valueAsNumber: true })}
            />
          </FormField>

          <DatePickerInput
            name="schedule.start_date"
            register={register}
            errors={errors}
            label="Start Date"
            required
          />

          <FormField label="Type" error={errors.schedule?.type?.message} required>
            <select
              className="select select-bordered w-full"
              {...register("schedule.type")}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </FormField>

          <div className="modal-action flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 mt-8 col-span-1 sm:col-span-2">
            <button
              type="button"
              className="btn btn-outline min-w-32 max-w-64 min-h-12 w-full sm:w-auto"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-32 max-w-64 min-h-12 w-full sm:w-auto"
              disabled={createMedication.isPending}
            >
              {createMedication.isPending ? "Adding..." : "Add Medication"}
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
