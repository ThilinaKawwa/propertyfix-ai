import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { createAnonClient } from "@/lib/supabase/anon";
import { Logo } from "@/components/brand";
import { formatDateTime, statusLabel } from "@/lib/format";
import type { TicketStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Report status",
  robots: { index: false },
};

interface StatusData {
  status: TicketStatus;
  urgency: string | null;
  trade: string | null;
  title: string | null;
  summary: string | null;
  created_at: string;
  timeline: { actor: string; action: string; created_at: string }[];
}

const stages: { key: TicketStatus; label: string }[] = [
  { key: "intake", label: "Reported" },
  { key: "pending_approval", label: "Reviewed by AI" },
  { key: "dispatched", label: "Contractor dispatched" },
  { key: "confirmed", label: "Attendance confirmed" },
  { key: "resolved", label: "Resolved" },
];

const order: TicketStatus[] = [
  "intake",
  "pending_approval",
  "dispatched",
  "confirmed",
  "resolved",
];

export default async function StatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("pf_get_status", {
    p_status_token: token,
  });
  if (error || !data) notFound();
  const s = data as StatusData;
  const currentIdx = order.indexOf(s.status);

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-md px-5 py-8">
        <div className="flex items-center justify-between">
          <Logo href={null} />
          <span className="text-xs text-muted-foreground">Report status</span>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {statusLabel[s.status]}
          </span>
          <h1 className="mt-3 text-xl font-semibold tracking-tight">
            {s.title ?? "Your maintenance report"}
          </h1>
          {s.summary && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.summary}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Reported {formatDateTime(s.created_at)}
          </p>

          <ol className="mt-6 space-y-4">
            {stages.map((stage, i) => {
              const done = i <= currentIdx;
              return (
                <li key={stage.key} className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40" />
                  )}
                  <span
                    className={
                      done ? "text-sm font-medium" : "text-sm text-muted-foreground"
                    }
                  >
                    {stage.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          You&apos;ll see updates here as your report progresses.
        </p>
      </div>
    </div>
  );
}
