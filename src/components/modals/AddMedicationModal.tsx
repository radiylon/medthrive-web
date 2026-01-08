import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  name: string;
  is_active: boolean;
  description: string;
  quantity: number;
  schedule: {
    frequency: number;
    type: "daily" | "weekly";
    start_date: string;
  };
};

const getInitialFormData = (): FormData => ({
  name: "",
  is_active: true,
  description: "",
  quantity: 0,
  schedule: {
    frequency: 2,
    type: "daily",
    start_date: new Date().toISOString().split("T")[0],
  },
});

export default function AddMedicationModal({ isOpen, onClose }: AddMedicationModalProps) {
  const [formData, setFormData] = useState(getInitialFormData());
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const router = useRouter();
  const { patientId } = router.query;

  const createMedication = trpc.medication.create.useMutation({
    onSuccess: () => {
      showToast({ message: "Medication created successfully", type: "success" });
      utils.medication.byPatientId.invalidate({ patientId: patientId as string });
      onClose();
      setFormData(getInitialFormData());
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMedication.mutate({
      ...formData,
      patient_id: patientId as string,
    });
  };

  if (!isOpen) return null;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-4xl w-full mx-4 sm:mx-auto">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl sm:text-2xl mb-4 text-center">Add New Medication</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Medication Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Medication Quantity</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Dosage Frequency (example: 2 times/day)</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={formData.schedule.frequency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, frequency: parseInt(e.target.value) || 1 },
                })
              }
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={formData.schedule.start_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, start_date: e.target.value },
                })
              }
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.schedule.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  schedule: { ...formData.schedule, type: e.target.value as "daily" | "weekly" },
                })
              }
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="modal-action flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 mt-8 col-span-1 sm:col-span-2">
            <button
              type="button"
              className="btn btn-outline hover:bg-base-200/50 min-w-32 max-w-64 min-h-12 rounded-lg w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-32 max-w-64 min-h-12 rounded-lg w-full sm:w-auto"
              disabled={createMedication.isPending}
            >
              {createMedication.isPending ? "Adding..." : "Add Medication"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
