import Link from "next/link";
import type { Metadata } from "next";
import {
  Inbox,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { getDashboardMetrics, listProperties } from "@/lib/db/queries";
import { StatusBadge, UrgencyBadge } from "@/components/app/badges";
import { timeAgo } from "@/lib/format";

export const metadata: Metadata = { title: "Tickets" };

export default async function DashboardPage() {
  const [{ open, pending, urgent, resolved, tickets }, properties] =
    await Promise.all([getDashboardMetrics(), listProperties()]);

  const propMap = new Map(properties.map((p) => [p.id, p]));

  const cards = [
    { label: "Open jobs", value: open, icon: Inbox, tone: "text-foreground" },
    { label: "Awaiting approval", value: pending, icon: Clock3, tone: "text-amber-600" },
    { label: "Urgent", value: urgent, icon: AlertTriangle, tone: "text-red-600" },
    { label: "Resolved", value: resolved, icon: CheckCircle2, tone: "text-primary" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Maintenance tickets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every reported issue, triaged and ready for action.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className={`h-4 w-4 ${c.tone}`} />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">All tickets</h2>
        </div>

        {tickets.length === 0 ? (
          <EmptyState hasProperties={properties.length > 0} />
        ) : (
          <ul className="divide-y divide-border">
            {tickets.map((t) => {
              const prop = propMap.get(t.property_id);
              return (
                <li key={t.id}>
                  <Link
                    href={`/dashboard/tickets/${t.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {t.title ?? "New maintenance report"}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        {t.channel === "whatsapp" && (
                          <MessageCircle className="h-3 w-3 shrink-0 text-primary" />
                        )}
                        <span className="truncate">
                          {prop
                            ? `${prop.unit_label ? prop.unit_label + " · " : ""}${prop.address_line}`
                            : "Unknown property"}{" "}
                          · {timeAgo(t.created_at)}
                        </span>
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <UrgencyBadge urgency={t.urgency} />
                    </div>
                    <StatusBadge status={t.status} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasProperties }: { hasProperties: boolean }) {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
        <Inbox className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-medium">No tickets yet</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        {hasProperties
          ? "Share a property's tenant report link to receive your first AI-triaged ticket."
          : "Add a property first, then share its tenant report link to start receiving tickets."}
      </p>
      <Link
        href={hasProperties ? "/dashboard/properties" : "/dashboard/properties"}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        Go to properties
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
