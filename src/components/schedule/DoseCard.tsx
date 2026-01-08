import { Check, Clock } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { DoseStatus } from "@/server/services/ScheduleService";

interface DoseCardProps {
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
  compact?: boolean;
}

export function DoseCard({
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
  compact = false,
}: DoseCardProps) {
  const formattedTime = new Date(scheduledTime).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const statusVariant = status === "taken" ? "taken" : status === "overdue" ? "overdue" : status === "due-now" ? "due-now" : "upcoming";

  const cardClasses = `
    rounded-xl border transition-all
    ${status === "overdue" ? "bg-error/5 border-error/20" : ""}
    ${status === "due-now" ? "bg-warning/5 border-warning/20" : ""}
    ${status === "taken" ? "bg-success/5 border-success/20" : ""}
    ${status === "upcoming" ? "bg-base-100 border-base-200" : ""}
  `;

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 ${cardClasses}`}>
        <Link href={`/patients/${patientId}`}>
          <Avatar src={patientPhotoUrl} name={patientName} size="sm" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{medicationName}</p>
          <p className="text-xs text-base-content/60 truncate">{patientName}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-base-content/60">
          <Clock className="h-3 w-3" />
          {formattedTime}
        </div>
        {status !== "taken" && onMarkTaken && (
          <button
            onClick={() => onMarkTaken(id)}
            disabled={isMarking}
            className="btn btn-success btn-xs btn-circle"
            title="Mark Taken"
          >
            <Check className="h-3 w-3" />
          </button>
        )}
        {status === "taken" && (
          <Check className="h-4 w-4 text-success" />
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 ${cardClasses}`}>
      <div className="flex items-start gap-3">
        <Link href={`/patients/${patientId}`}>
          <Avatar src={patientPhotoUrl} name={patientName} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold truncate">{medicationName}</span>
            {dosage && <span className="text-sm text-base-content/60">({dosage})</span>}
          </div>
          <Link href={`/patients/${patientId}`} className="text-sm text-base-content/60 hover:underline">
            {patientName}
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-sm text-base-content/60">
              <Clock className="h-4 w-4" />
              {formattedTime}
            </div>
            <Badge variant={statusVariant} size="sm">
              {status === "overdue" ? "Overdue" : status === "due-now" ? "Due Now" : status === "taken" ? "Taken" : "Upcoming"}
            </Badge>
          </div>
        </div>
        {status !== "taken" && onMarkTaken && (
          <button
            onClick={() => onMarkTaken(id)}
            disabled={isMarking}
            className="btn btn-success btn-sm"
          >
            <Check className="h-4 w-4" />
            {isMarking ? "..." : "Mark"}
          </button>
        )}
      </div>
    </div>
  );
}
