import type { Metadata } from "next";
import { Landmark, Mail } from "lucide-react";
import { listLandlords } from "@/lib/db/queries";
import { CopyLink, OpenLink } from "@/components/app/copy-link";

export const metadata: Metadata = { title: "Landlords" };

export default async function LandlordsPage() {
  const landlords = await listLandlords();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Landlords</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Each landlord gets a private portal showing their properties, live job status, and summaries.
          Landlords are created automatically when you add a property with a landlord email.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {landlords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <Landmark className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium">No landlords yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a property with a landlord email to create their portal.
            </p>
          </div>
        ) : (
          landlords.map((l) => {
            const url = `${site}/landlord/${l.portal_token}`;
            return (
              <div
                key={l.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium">{l.name ?? l.email}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {l.email}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <CopyLink url={url} label="Copy portal link" />
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
