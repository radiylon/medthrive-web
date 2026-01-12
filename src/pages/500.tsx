import Link from "next/link";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-error" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Server Error</h1>
        <p className="text-base-content/60 mb-8">
          Something went wrong on our end. Please try again later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            aria-label="Reload the page"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link href="/dashboard" className="btn btn-ghost">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
