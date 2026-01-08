import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { CAREGIVER_ID } from "@/constants";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData = {
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
  const [formData, setFormData] = useState(initialFormData);
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const createPatient = trpc.patient.create.useMutation({
    onSuccess: () => {
      showToast({ message: "Patient created successfully", type: "success" });
      utils.patient.list.invalidate();
      onClose();
      setFormData(initialFormData);
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPatient.mutate({ ...formData, caregiver_id: CAREGIVER_ID });
  };

  if (!isOpen) return null;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-4xl w-full">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl mb-4 text-center">Add New Patient</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              type="tel"
              pattern="[0-9]*"
              className="input input-bordered w-full"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Date of Birth</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Street</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.address.street}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
              }
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.address.city}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
              }
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">State</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.address.state}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })
              }
              required
            />
          </div>
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text">Zipcode</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.address.zipcode}
              onChange={(e) =>
                setFormData({ ...formData, address: { ...formData.address, zipcode: e.target.value } })
              }
              required
            />
          </div>
          <div className="modal-action flex justify-end gap-2 mt-8 col-span-2">
            <button
              type="button"
              className="btn btn-outline hover:bg-base-200/50 min-w-32 max-w-64 min-h-12 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-32 max-w-64 min-h-12 rounded-lg"
              disabled={createPatient.isPending}
            >
              {createPatient.isPending ? "Adding..." : "Add Patient"}
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
