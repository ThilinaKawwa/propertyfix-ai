import type { TicketStatus, Urgency } from "./types";

export const statusLabel: Record<TicketStatus, string> = {
  intake: "In intake",
  pending_approval: "Pending approval",
  dispatched: "Dispatched",
  confirmed: "Contractor confirmed",
  resolved: "Resolved",
};

export const statusClass: Record<TicketStatus, string> = {
  intake: "bg-muted text-muted-foreground border-transparent",
  pending_approval: "bg-amber-100 text-amber-800 border-amber-200",
  dispatched: "bg-signal/10 text-signal border-signal/20",
  confirmed: "bg-accent text-accent-foreground border-transparent",
  resolved: "bg-primary/10 text-primary border-primary/20",
};

export const urgencyClass: Record<Urgency, string> = {
  low: "bg-muted text-muted-foreground border-transparent",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
};

export function urgencyLabel(u: Urgency | null | undefined) {
  if (!u) return "—";
  return u.charAt(0).toUpperCase() + u.slice(1);
}

export function timeAgo(date: string) {
  const d = new Date(date).getTime();
  const diff = Date.now() - d;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function publicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/pf-attachments/${path}`;
}
