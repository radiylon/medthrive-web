import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, Save } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useToast } from "@/contexts/ToastContext";
import { AppLayout } from "@/layouts/AppLayout";
import { PageHeader } from "@/components/navigation/PageHeader";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { FormField, PhoneInputField } from "@/components/forms";
import { caregiverProfileSchema, CaregiverProfileData } from "@/schemas";

export default function SettingsPage() {
  const { showToast } = useToast();
  const utils = trpc.useUtils();

  const { data: caregiver, isLoading } = trpc.caregiver.current.useQuery();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<CaregiverProfileData>({
    resolver: zodResolver(caregiverProfileSchema),
  });

  // Reset form when caregiver data loads
  useEffect(() => {
    if (caregiver) {
      reset({
        first_name: caregiver.first_name,
        last_name: caregiver.last_name,
        email: caregiver.email,
        phone_number: caregiver.phone_number,
      });
    }
  }, [caregiver, reset]);

  const updateCaregiver = trpc.caregiver.update.useMutation({
    onSuccess: () => {
      showToast({ message: "Profile updated successfully", type: "success" });
      utils.caregiver.current.invalidate();
    },
    onError: (error) => {
      showToast({ message: error.message, type: "error" });
    },
  });

  const onSubmit = (data: CaregiverProfileData) => {
    if (!caregiver) return;
    updateCaregiver.mutate({ id: caregiver.id, ...data });
  };

  const handleReset = () => {
    if (caregiver) {
      reset({
        first_name: caregiver.first_name,
        last_name: caregiver.last_name,
        email: caregiver.email,
        phone_number: caregiver.phone_number,
      });
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      {isLoading && (
        <div className="space-y-6">
          <LoadingSkeleton.Card />
        </div>
      )}

      {!isLoading && caregiver && (
        <div className="max-w-2xl">
          {/* Profile Section */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Profile</h2>
                  <p className="text-sm text-base-content/60">
                    Update your personal information
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <FormField label="Email" error={errors.email?.message} required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10"
                      {...register("email")}
                    />
                  </div>
                </FormField>

                <PhoneInputField
                  name="phone_number"
                  control={control}
                  label="Phone Number"
                  required
                />

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleReset}
                    disabled={!isDirty}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateCaregiver.isPending || !isDirty}
                  >
                    <Save className="h-4 w-4" />
                    {updateCaregiver.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Future sections */}
          <div className="card bg-base-100 shadow-sm mt-6 opacity-50">
            <div className="card-body">
              <h2 className="text-lg font-semibold text-base-content/60">Preferences</h2>
              <p className="text-sm text-base-content/40">
                Default views, notification settings, and more coming soon...
              </p>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
