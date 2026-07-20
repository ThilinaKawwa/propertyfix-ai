import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  MapPin,
  Wrench,
  ShieldAlert,
  Clock,
  User,
  Camera,
} from "lucide-react";
import { createAnonClient } from "@/lib/supabase/anon";
import { ConfirmButton } from "@/components/dispatch/confirm-button";
import { Logo } from "@/components/brand";
import { publicUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Job dispatch",
  robots: { index: false },
};

interface DispatchData {
  status: string;
  title: string | null;
  urgency: string | null;
  trade: string | null;
  risk: string | null;
  summary: string | null;
  access_notes: string | null;
  dispatch_message: string | null;
  tenant_name: string | null;
  tenant_contact: string | null;
  address: { address_line: string; unit_label: string | null };
  attachments: { path: string; mime: string | null }[];
}

export default async function DispatchPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("pf_get_dispatch", {
    p_dispatch_token: token,
  });
  if (error || !data) notFound();
  const job = data as DispatchData;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="mx-auto max-w-lg px-5 py-8">
        <div className="flex items-center justify-between">
          <Logo href={null} />
          <span className="text-xs text-muted-foreground">Contractor dispatch</span>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              {job.title ?? "Maintenance job"}
            </h1>
            {job.urgency === "urgent" && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                <AlertTriangle className="h-3 w-3" /> Urgent
              </span>
            )}
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {job.address.unit_label ? `${job.address.unit_label} · ` : ""}
            {job.address.address_line}
          </p>

          {job.dispatch_message && (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
              {job.dispatch_message}
            </div>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Field icon={Wrench} label="Trade" value={job.trade} />
            <Field icon={ShieldAlert} label="Risk" value={job.risk} />
            <Field icon={Clock} label="Access" value={job.access_notes} />
            <Field
              icon={User}
              label="Tenant"
              value={job.tenant_name ?? "See access notes"}
            />
          </dl>

          {job.summary && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {job.summary}
            </p>
          )}

          {job.attachments.length > 0 && (
            <div className="mt-5">
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Camera className="h-3.5 w-3.5" /> Photos
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {job.attachments.map((a) => (
                  <a
                    key={a.path}
                    href={publicUrl(a.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary"
                  >
                    {a.mime?.startsWith("video") ? (
                      <video src={publicUrl(a.path)} className="h-full w-full object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={publicUrl(a.path)}
                        alt="Job photo"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <ConfirmButton
              dispatchToken={token}
              initialConfirmed={job.status === "confirmed" || job.status === "resolved"}
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Powered by PropertyFix AI
        </p>
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
