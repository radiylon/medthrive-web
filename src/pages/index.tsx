import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import DefaultLayout from "@/layouts/DefaultLayout";
import AddPatientModal from "@/components/modals/AddPatientModal";
import Loading from "@/components/Loading";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: patients, isLoading } = trpc.patient.list.useQuery();

  return (
    <DefaultLayout>
      <div className="container mx-auto p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Patients</h1>
          <button
            className="btn btn-primary min-w-32 max-w-64 min-h-12 w-full sm:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Add Patient
          </button>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center h-12 mt-12">
            <Loading />
          </div>
        )}
        {patients && patients.length === 0 && (
          <div className="flex justify-center items-center h-12">
            <p className="text-lg text-base-content/70">No patients found</p>
          </div>
        )}
        {patients && patients.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {patients.map((patient) => (
              <Link key={patient.id} href={`/patients/${patient.id}`}>
                <div className="card flex flex-col shadow-md w-full sm:min-w-32 sm:max-w-72 bg-base-100 hover:bg-base-100/50 transition-all cursor-pointer items-center justify-center">
                  <div className="card-body">
                    <h2 className="card-title">
                      {patient.first_name} {patient.last_name}
                    </h2>
                    <p className="text-sm text-base-content/70">{patient.id}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DefaultLayout>
  );
}
