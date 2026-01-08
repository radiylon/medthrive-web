import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-base-200 min-h-screen">
      <Navbar />
      <Toast />
      {children}
    </div>
  );
}
