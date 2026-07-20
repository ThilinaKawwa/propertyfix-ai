"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { approveDispatch, resolveTicket } from "@/lib/actions/agency";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyLink } from "@/components/app/copy-link";
import { toast } from "sonner";
import type { Contractor, Ticket } from "@/lib/types";

export function TicketActions({
  ticket,
  contractors,
  suggestedId,
  site,
}: {
  ticket: Ticket;
  contractors: Contractor[];
  suggestedId: string | null;
  site: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [contractorId, setContractorId] = useState(
    ticket.assigned_contractor_id ?? suggestedId ?? "",
  );
  // Base UI Select renders the raw value unless given a value->label map, so the
  // trigger would otherwise show the contractor's UUID instead of their name.
  const contractorItems = contractors.map((c) => ({
    value: c.id,
    label: `${c.name} · ${c.trade}`,
  }));

  function onApprove() {
    if (!contractorId) {
      toast.error("Select a contractor first");
      return;
    }
    startTransition(async () => {
      const res = await approveDispatch(ticket.id, contractorId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Dispatched — brief sent to contractor");
        router.refresh();
      }
    });
  }

  function onResolve() {
    startTransition(async () => {
      const res = await resolveTicket(ticket.id);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Marked resolved — landlord summary generated");
        router.refresh();
      }
    });
  }

  // Pre-dispatch: choose contractor + approve
  if (ticket.status === "intake" || ticket.status === "pending_approval") {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold">Approve & dispatch</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Confirm the contractor, then send them the structured brief.
        </p>
        <div className="mt-4 space-y-3">
          <Select
            items={contractorItems}
            value={contractorId}
            onValueChange={(v) => setContractorId(v ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select contractor" />
            </SelectTrigger>
            <SelectContent>
              {contractors.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  No contractors — add one first.
                </div>
              )}
              {contractors.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} · {c.trade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="w-full" onClick={onApprove} disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Approve dispatch
          </Button>
        </div>
      </div>
    );
  }

  // Dispatched / confirmed: show dispatch link + resolve
  if (ticket.status === "dispatched" || ticket.status === "confirmed") {
    const dispatchUrl = `${site}/dispatch/${ticket.dispatch_token}`;
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4" />
          {ticket.status === "confirmed" ? "Contractor confirmed" : "Dispatched"}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Share this contractor link (in production this is sent automatically):
        </p>
        <p className="mt-2 break-all rounded-lg bg-secondary/60 px-3 py-2 font-mono text-xs">
          {dispatchUrl}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyLink url={dispatchUrl} label="Copy contractor link" />
          <Button size="sm" variant="secondary" onClick={onResolve} disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Mark resolved
          </Button>
        </div>
      </div>
    );
  }

  // Resolved
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <CheckCircle2 className="h-4 w-4" />
        Resolved
      </div>
      {ticket.landlord_summary && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground">Landlord summary</p>
          <p className="mt-1 text-sm leading-relaxed">{ticket.landlord_summary}</p>
        </div>
      )}
    </div>
  );
}
