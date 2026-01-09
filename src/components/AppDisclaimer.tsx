import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "medthrive-disclaimer-dismissed";

export function AppDisclaimer() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    setIsDismissed(dismissed === "true");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-content px-4 py-3 text-center">
      <p>
        <strong>DISCLAIMER:</strong> This is a demo app. All information
        displayed is fictional and for illustrative purposes only.
      </p>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-80"
        aria-label="Dismiss banner"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
