import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, backHref, actions }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3 flex-1">
        {backHref !== undefined && (
          <button
            onClick={handleBack}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-base-content/60 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:ml-auto">{actions}</div>
      )}
    </header>
  );
}
