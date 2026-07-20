import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Bot,
  User,
  ShieldAlert,
  Wrench,
  Clock,
  MapPin,
} from "lucide-react";
import { getTicketDetail } from "@/lib/db/queries";
import { StatusBadge, UrgencyBadge } from "@/components/app/badges";
import { TicketActions } from "@/components/app/ticket-actions";
import { publicUrl, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Ticket" };

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getTicketDetail(id);
  if (!detail) notFound();

  const { ticket, property, messages, attachments, activity, contractors, suggested } =
    detail;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to tickets
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {ticket.title ?? "New maintenance report"}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {property
              ? `${property.unit_label ? property.unit_label + " · " : ""}${property.address_line}`
              : "Unknown property"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={ticket.urgency} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: AI ticket + transcript */}
        <div className="space-y-6">
          {/* AI ticket card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/10 text-primary">
                <Bot className="h-3.5 w-3.5" />
              </span>
              AI triage summary
            </div>
            {ticket.summary && (
              <p className="mt-3 text-sm leading-relaxed">{ticket.summary}</p>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Field icon={Wrench} label="Trade" value={ticket.trade} />
              <Field icon={ShieldAlert} label="Risk" value={ticket.risk} />
              <Field icon={Clock} label="Access" value={ticket.access_notes} />
              <Field
                icon={User}
                label="Suggested contractor"
                value={suggested?.name ?? "No match — add contractors"}
              />
            </dl>
            {ticket.dispatch_message && (
              <div className="mt-4 rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Contractor brief
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">
                  {ticket.dispatch_message}
                </p>
              </div>
            )}
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold">Attachments</h3>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {attachments.map((a) => (
                  <a
                    key={a.path}
                    href={publicUrl(a.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-secondary"
                  >
                    {a.mime?.startsWith("video") ? (
                      <video
                        src={publicUrl(a.path)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={publicUrl(a.path)}
                        alt="Tenant attachment"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold">Conversation</h3>
            <div className="mt-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              )}
              {messages.map((m, i) => {
                const isTenant = m.role === "tenant";
                if (m.role === "system") {
                  return (
                    <p key={i} className="text-center text-xs text-muted-foreground">
                      {m.content}
                    </p>
                  );
                }
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${isTenant ? "flex-row-reverse" : ""}`}
                  >
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                        isTenant
                          ? "bg-signal/10 text-signal"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isTenant ? (
                        <User className="h-3.5 w-3.5" />
                      ) : (
                        <Bot className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
                        isTenant
                          ? "rounded-br-sm bg-signal text-signal-foreground"
                          : "rounded-bl-sm bg-secondary"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: actions + activity */}
        <div className="space-y-6">
          <TicketActions
            ticket={ticket}
            contractors={contractors}
            suggestedId={ticket.suggested_contractor_id}
            site={site}
          />

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold">Audit trail</h3>
            <ol className="mt-4 space-y-4">
              {activity.map((a, i) => (
                <li key={i} className="relative flex gap-3 pl-1">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <div className="text-sm">
                    <p className="font-medium capitalize">
                      {a.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.actor} · {formatDateTime(a.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-3.5 py-2.5">
      <dt className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value ?? "—"}</dd>
    </div>
  );
}
