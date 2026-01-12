import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { SearchInput } from "@/components/forms/SearchInput";
import { Avatar } from "@/components/ui/Avatar";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import AddPatientModal from "@/components/modals/AddPatientModal";

export default function PatientsListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: patients, isLoading } = trpc.patient.list.useQuery();

  const filteredPatients = patients?.filter((patient) => {
    if (!searchQuery) return true;
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <AppLayout>
      <PageHeader
        title="Patients"
        subtitle={patients ? `${patients.length} patients` : undefined}
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Add Patient
          </button>
        }
      />

      <div className="mb-6">
        <SearchInput
          placeholder="Search patients..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="max-w-md"
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton.Card key={i} />
          ))}
        </div>
      )}

      {!isLoading && filteredPatients?.length === 0 && (
        <EmptyState
          title={searchQuery ? "No patients found" : "No patients yet"}
          description={
            searchQuery
              ? "Try adjusting your search terms"
              : "Add your first patient to get started"
          }
          actionLabel={searchQuery ? undefined : "Add Patient"}
          onAction={searchQuery ? undefined : () => setIsModalOpen(true)}
        />
      )}

      {!isLoading && filteredPatients && filteredPatients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPatients.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="card-body flex-row items-center gap-4">
                  <Avatar
                    src={patient.photo_url}
                    name={`${patient.first_name} ${patient.last_name}`}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base-content truncate">
                      {patient.first_name} {patient.last_name}
                    </h2>
                    <p className="text-sm text-base-content/60 truncate">
                      {patient.active_medication_count === 1
                        ? "1 active medication"
                        : `${patient.active_medication_count} active medications`}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </AppLayout>
  );
}
