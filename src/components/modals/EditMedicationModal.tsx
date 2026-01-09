import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { medicationFormSchema, MedicationFormData } from "@/schemas";
import { FormField, DatePickerInput } from "@/components/forms";
import type { Medication } from "@/db/schema";

interface EditMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication | null;
}

export default function EditMedicationModal({ isOpen, onClose, medication }: EditMedicationModalProps) {
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
  });

  // Reset form when medication changes
  useEffect(() => {
    if (medication && isOpen) {
      reset({
        name: medication.name,
        description: medication.description ?? "",
        quantity: medication.quantity,
        is_active: medication.is_active,
        schedule: {
          frequency: medication.schedule.frequency,
          type: medication.schedule.type as "daily" | "weekly",
          start_date: medication.schedule.start_date.split("T")[0],
        },
      });
    }
  }, [medication, isOpen, reset]);

  const updateMedication = trpc.medication.update.useMutation({
    onSuccess: () => {
      showToast({ message: "Medication updated successfully", type: "success" });
      utils.medication.byId.invalidate({ id: medication?.id });
      utils.medication.byPatientId.invalidate({ patientId: medication?.patient_id });
      onClose();
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const onSubmit = (data: MedicationFormData) => {
    if (!medication) return;
    updateMedication.mutate({ id: medication.id, ...data });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !medication) return null;

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
        <h3 className="font-bold text-xl sm:text-2xl mb-4 text-center">Edit Medication</h3>
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
              className="btn btn-outline hover:bg-base-200/50 hover:border-base-content/20 min-w-32 max-w-64 min-h-12 w-full sm:w-auto"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-32 max-w-64 min-h-12 w-full sm:w-auto"
              disabled={updateMedication.isPending || !isDirty}
            >
              {updateMedication.isPending ? "Saving..." : "Save Changes"}
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
