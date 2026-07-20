import { cn } from "@/lib/utils";
import {
  statusClass,
  statusLabel,
  urgencyClass,
  urgencyLabel,
} from "@/lib/format";
import type { TicketStatus, Urgency } from "@/lib/types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusClass[status],
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency | null }) {
  if (!urgency)
    return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        urgencyClass[urgency],
      )}
    >
      {urgencyLabel(urgency)}
    </span>
  );
}
