import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { listProperties } from "@/lib/db/queries";
import { AddPropertyForm } from "@/components/app/add-property-form";
import { CopyLink, OpenLink } from "@/components/app/copy-link";

export const metadata: Metadata = { title: "Properties" };

export default async function PropertiesPage() {
  const properties = await listProperties();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Each property has a unique tenant report link. Share it with tenants — no login needed.
          </p>
        </div>
        <AddPropertyForm />
      </div>

      <div className="mt-8 space-y-3">
        {properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium">No properties yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first property to generate a tenant report link.
            </p>
          </div>
        ) : (
          properties.map((p) => {
            const url = `${site}/report/${p.report_token}`;
            return (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {p.unit_label ? `${p.unit_label} · ` : ""}
                    {p.address_line}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {p.landlord_name ? `Landlord: ${p.landlord_name}` : "No landlord on file"} ·{" "}
                    <span className="font-mono">{url}</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <CopyLink url={url} />
                  <OpenLink url={url} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
