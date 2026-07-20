import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, FileText } from "lucide-react";
import { createAnonClient } from "@/lib/supabase/anon";
import { Logo } from "@/components/brand";
import { StatusBadge, UrgencyBadge } from "@/components/app/badges";
import { formatDateTime } from "@/lib/format";
import type { TicketStatus, Urgency } from "@/lib/types";

export const metadata: Metadata = {
  title: "Landlord portal",
  robots: { index: false },
};

interface PortalTicket {
  title: string | null;
  status: TicketStatus;
  urgency: Urgency | null;
  trade: string | null;
  summary: string | null;
  landlord_summary: string | null;
  created_at: string;
}
interface PortalProperty {
  address_line: string;
  unit_label: string | null;
  tickets: PortalTicket[];
}
interface PortalData {
  name: string | null;
  email: string;
  properties: PortalProperty[];
}

export default async function LandlordPortal({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("pf_get_landlord_portal", {
    p_token: token,
  });
  if (error || !data) notFound();
  const portal = data as PortalData;

  const totalOpen = portal.properties
    .flatMap((p) => p.tickets)
    .filter((t) => t.status !== "resolved").length;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <div className="flex items-center justify-between">
          <Logo href={null} />
          <span className="text-xs text-muted-foreground">Landlord portal</span>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">
            {portal.name ? `Welcome, ${portal.name}` : "Your properties"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {portal.properties.length} propert
            {portal.properties.length === 1 ? "y" : "ies"} · {totalOpen} active job
            {totalOpen === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-5 space-y-5">
          {portal.properties.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No properties linked yet.
            </div>
          )}
          {portal.properties.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </span>
                <p className="font-medium">
                  {p.unit_label ? `${p.unit_label} · ` : ""}
                  {p.address_line}
                </p>
              </div>

              {p.tickets.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No maintenance issues reported. All good here.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {p.tickets.map((t, j) => (
                    <li key={j} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            {t.title ?? "Maintenance report"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <UrgencyBadge urgency={t.urgency} />
                          <StatusBadge status={t.status} />
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t.landlord_summary ?? t.summary ?? "Being handled by your agency."}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDateTime(t.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Powered by PropertyFix AI · Updates are live
        </p>
      </div>
    </div>
  );
}
