import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import DefaultLayout from "@/layouts/DefaultLayout";
import Loading from "@/components/Loading";
import AddMedicationModal from "@/components/modals/AddMedicationModal";

export default function PatientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <DefaultLayout>
      <div className="container mx-auto p-8 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold">Patient Details</h1>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn gap-1 sm:gap-2 w-fit min-w-fit sm:min-w-32 max-w-64 min-h-8 sm:min-h-12 font-bold text-sm sm:text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-3 h-3 sm:w-4 sm:h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="hidden sm:inline">Back to Patients</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-12 mt-12">
            <Loading />
          </div>
        )}

        {isError && (
          <div className="flex justify-center items-center h-12 mt-12">
            <p className="text-red-600">Error loading patient details. Please try again later.</p>
          </div>
        )}

        {/* Patient Details Card */}
        {!isLoading && patient && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl justify-center">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-sm font-bold text-center text-secondary">Patient ID: {patient.id}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                <div className="card bg-base-200/50">
                  <div className="card-body p-4">
                    <h3 className="text-sm opacity-70 font-bold">Date of Birth</h3>
                    <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="card bg-base-200/50">
                  <div className="card-body p-4">
                    <h3 className="text-sm opacity-70 font-bold">Gender</h3>
                    <p className="font-medium">{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</p>
                  </div>
                </div>
                <div className="card bg-base-200/50">
                  <div className="card-body p-4">
                    <h3 className="text-sm opacity-70 font-bold">Email</h3>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="card bg-base-200/50">
                  <div className="card-body p-4">
                    <h3 className="text-sm opacity-70 font-bold">Phone</h3>
                    <p className="font-medium">{patient.phone_number}</p>
                  </div>
                </div>
                <div className="card bg-base-200/50">
                  <div className="card-body p-4">
                    <h3 className="text-sm opacity-70 font-bold">Address</h3>
                    <p className="font-medium">
                      {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.zipcode}
                    </p>
                  </div>
                </div>
                <div className="card bg-base-200/50">
                  <div className="card-body p-4">
                    <h3 className="text-sm opacity-70 font-bold">Created at</h3>
                    <p className="font-medium">{new Date(patient.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medications Section */}
        {!isLoading && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="card-title text-2xl">Medications</h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success/50"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-base-200"></div>
                      <span>Inactive</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary min-w-32 max-w-64 min-h-12 w-full sm:w-auto"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Add Medication
                  </button>
                </div>
              </div>

              {medications?.length === 0 && (
                <h3 className="text-lg text-center mt-12">No medications found</h3>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 auto-rows-fr">
                {medications?.map((medication) => (
                  <div
                    key={medication.id}
                    className={`card w-full h-full transition-all cursor-pointer ${
                      medication.is_active ? "bg-success/50 hover:bg-success/70" : "bg-base-200 hover:bg-base-200/50"
                    }`}
                    onClick={() => router.push(`/patients/${patientId}/medications/${medication.id}`)}
                  >
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg font-bold">{medication.name}</h3>
                      <p className="text-sm italic">{medication.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AddMedicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DefaultLayout>
  );
}
