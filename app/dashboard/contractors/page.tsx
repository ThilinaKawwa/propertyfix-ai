import type { Metadata } from "next";
import { HardHat, Phone, Mail } from "lucide-react";
import { listContractors } from "@/lib/db/queries";
import { AddContractorForm } from "@/components/app/add-contractor-form";

export const metadata: Metadata = { title: "Contractors" };

export default async function ContractorsPage() {
  const contractors = await listContractors();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contractors</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your trusted trades. PropertyFix suggests the right one for each job.
          </p>
        </div>
        <AddContractorForm />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {contractors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center sm:col-span-2">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-muted-foreground">
              <HardHat className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium">No contractors yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add contractors so the AI can suggest a match on every ticket.
            </p>
          </div>
        ) : (
          contractors.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium">{c.name}</p>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {c.trade}
                </span>
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {c.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                  </p>
                )}
                {c.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </p>
                )}
                {!c.phone && !c.email && <p>No contact details</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
