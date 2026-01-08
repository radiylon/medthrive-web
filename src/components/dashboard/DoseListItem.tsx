import { Check, Clock } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { DoseStatus } from "@/server/services/ScheduleService";

interface DoseListItemProps {
  id: string;
  medicationName: string;
  dosage: string | null;
  patientName: string;
  patientPhotoUrl: string | null;
  patientId: string;
  scheduledTime: Date;
  status: DoseStatus;
  onMarkTaken?: (scheduleId: string) => void;
  isMarking?: boolean;
}

export function DoseListItem({
  id,
  medicationName,
  dosage,
  patientName,
  patientPhotoUrl,
  patientId,
  scheduledTime,
  status,
  onMarkTaken,
  isMarking,
}: DoseListItemProps) {
  const formattedTime = new Date(scheduledTime).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const statusVariant = status === "taken" ? "taken" : status === "overdue" ? "overdue" : status === "due-now" ? "due-now" : "upcoming";

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
        status === "overdue"
          ? "bg-error/5 border border-error/10"
          : status === "due-now"
          ? "bg-warning/5 border border-warning/10"
          : "bg-base-100 border border-base-200"
      }`}
    >
      <Link href={`/patients/${patientId}`}>
        <Avatar src={patientPhotoUrl} name={patientName} size="md" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base-content truncate">{medicationName}</span>
          {dosage && <span className="text-sm text-base-content/60">({dosage})</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Link href={`/patients/${patientId}`} className="text-sm text-base-content/60 hover:underline truncate">
            {patientName}
          </Link>
          <span className="text-base-content/30">•</span>
          <div className="flex items-center gap-1 text-sm text-base-content/60">
            <Clock className="h-3.5 w-3.5" />
            {formattedTime}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={statusVariant} size="sm">
          {status === "overdue" ? "Overdue" : status === "due-now" ? "Due Now" : status === "taken" ? "Taken" : "Upcoming"}
        </Badge>

        {status !== "taken" && onMarkTaken && (
          <button
            onClick={() => onMarkTaken(id)}
            disabled={isMarking}
            className="btn btn-success btn-sm gap-1"
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">{isMarking ? "Marking..." : "Mark Taken"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
