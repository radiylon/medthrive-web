import { Check } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";

interface DoseCardProps {
  id: string;
  medicationName: string;
  dosage: string | null;
  patientName: string;
  patientPhotoUrl: string | null;
  patientId: string;
  isTaken: boolean;
  onMarkTaken?: (scheduleId: string) => void;
  isMarking?: boolean;
}

export function DoseCard({
  id,
  medicationName,
  dosage,
  patientName,
  patientPhotoUrl,
  patientId,
  isTaken,
  onMarkTaken,
  isMarking,
}: DoseCardProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
        isTaken
          ? "bg-success/5 border-success/20"
          : "bg-base-100 border-base-200"
      }`}
    >
      <Link href={`/patients/${patientId}`}>
        <Avatar src={patientPhotoUrl} name={patientName} size="md" />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/patients/${patientId}`}
          className="font-semibold text-base-content truncate block hover:underline"
        >
          {patientName}
        </Link>
        <p className="text-sm text-base-content/60 truncate">
          {medicationName}
          {dosage && ` ${dosage}`}
        </p>
      </div>

      {isTaken ? (
        <div className="flex items-center gap-2 text-success">
          <Check className="h-5 w-5" />
        </div>
      ) : (
        onMarkTaken && (
          <button
            onClick={() => onMarkTaken(id)}
            disabled={isMarking}
            className="btn btn-success btn-sm gap-1"
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">{isMarking ? "..." : "Mark"}</span>
          </button>
        )
      )}
    </div>
  );
}
