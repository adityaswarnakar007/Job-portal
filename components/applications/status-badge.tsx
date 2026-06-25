import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/validations";
import { STATUS_LABELS } from "@/lib/validations";

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-100 text-blue-800 border-blue-200",
  Interviewing: "bg-amber-100 text-amber-800 border-amber-200",
  Offer: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-100 text-red-800 border-red-200",
};

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
