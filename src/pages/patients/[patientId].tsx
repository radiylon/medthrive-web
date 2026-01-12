import { useState } from "react";
import { useRouter } from "next/router";
import { Plus, Pill, Pencil } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { fromE164 } from "@/utils/phone";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import AddMedicationModal from "@/components/modals/AddMedicationModal";
import EditPatientModal from "@/components/modals/EditPatientModal";

export default function PatientPage() {
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);

  const router = useRouter();
  const { patientId } = router.query;

  const { data: patient, isLoading: patientLoading, error: patientError } = trpc.patient.byId.useQuery(
    { id: patientId as string },
    { enabled: !!patientId }
  );

  const { data: medications, isLoading: medicationsLoading, error: medicationsError } = trpc.medication.byPatientId.useQuery(
    { patientId: patientId as string },
    { enabled: !!patientId }
  );

  const isLoading = patientLoading || medicationsLoading;
  const isError = patientError || medicationsError;

  return (
    <AppLayout>
      <PageHeader
        title={patient ? `${patient.first_name} ${patient.last_name}` : "Patient Details"}
        backHref="/patients"
        actions={
          <div className="flex gap-2">
            <button
              className="btn btn-outline"
              onClick={() => setIsEditPatientModalOpen(true)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setIsAddMedModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              Add Medication
            </button>
          </div>
        }
      />

      {isLoading && (
        <div className="space-y-6">
          <LoadingSkeleton.Card />
          <LoadingSkeleton.Card />
        </div>
      )}

      {isError && (
        <div className="alert alert-error">
          <span>Error loading patient details. Please try again later.</span>
        </div>
      )}

      {/* Patient Details Card */}
      {!isLoading && patient && (
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body">
            <div className="flex items-center gap-4 mb-6">
              <Avatar
                src={patient.photo_url}
                name={`${patient.first_name} ${patient.last_name}`}
                size="xl"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {patient.first_name} {patient.last_name}
                </h2>
                <p className="text-sm text-base-content/60">
                  {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)} | DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="text-xs font-medium text-base-content/50 uppercase tracking-wider mb-1">Email</h3>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-base-content/50 uppercase tracking-wider mb-1">Phone</h3>
                <p className="font-medium">{fromE164(patient.phone_number)}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-base-content/50 uppercase tracking-wider mb-1">Address</h3>
                <p className="font-medium">
                  {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.zipcode}
                </p>
              </div>
              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-base-content/50 uppercase tracking-wider mb-1">Allergies</h3>
                  <p className="font-medium text-error">{patient.allergies.join(", ")}</p>
                </div>
              )}
              {patient.medical_conditions && patient.medical_conditions.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-base-content/50 uppercase tracking-wider mb-1">Medical Conditions</h3>
                  <p className="font-medium">{patient.medical_conditions.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Medications Section */}
      {!isLoading && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Medications</h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
                  <span className="text-base-content/60">Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-base-300"></div>
                  <span className="text-base-content/60">Inactive</span>
                </div>
              </div>
            </div>

            {medications?.length === 0 && (
              <EmptyState
                icon={Pill}
                title="No medications"
                description="Add a medication to start tracking doses"
                actionLabel="Add Medication"
                onAction={() => setIsAddMedModalOpen(true)}
              />
            )}

            {medications && medications.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medications.map((medication) => (
                  <div
                    key={medication.id}
                    className={`card cursor-pointer transition-all hover:shadow-md ${
                      medication.is_active
                        ? "bg-success/10 border border-success/20"
                        : "bg-base-200"
                    }`}
                    onClick={() => router.push(`/patients/${patientId}/medications/${medication.id}`)}
                  >
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${medication.is_active ? "bg-success/20" : "bg-base-300"}`}>
                          <Pill className={`h-5 w-5 ${medication.is_active ? "text-success" : "text-base-content/50"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{medication.name}</h3>
                          {medication.dosage && (
                            <p className="text-sm text-base-content/60">{medication.dosage}</p>
                          )}
                          {medication.description && (
                            <p className="text-sm text-base-content/50 mt-1 line-clamp-2">{medication.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <AddMedicationModal isOpen={isAddMedModalOpen} onClose={() => setIsAddMedModalOpen(false)} />
      <EditPatientModal
        isOpen={isEditPatientModalOpen}
        onClose={() => setIsEditPatientModalOpen(false)}
        patient={patient ?? null}
      />
    </AppLayout>
  );
}
