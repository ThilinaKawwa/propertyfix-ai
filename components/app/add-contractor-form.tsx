"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { addContractor } from "@/lib/actions/agency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trades } from "@/lib/content";
import { toast } from "sonner";

export function AddContractorForm() {
  const [open, setOpen] = useState(false);
  const [trade, setTrade] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const state = await addContractor({}, formData);
      if (state.ok) {
        toast.success("Contractor added");
        formRef.current?.reset();
        setTrade("");
        setOpen(false);
      } else if (state.error) {
        toast.error(state.error);
      }
    });
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="h-4 w-4" />
        Add contractor
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <input type="hidden" name="trade" value={trade} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name / company *</Label>
          <Input id="name" name="name" required placeholder="ABC Plumbing Services" />
        </div>
        <div className="space-y-2">
          <Label>Trade *</Label>
          <Select value={trade} onValueChange={(v) => setTrade(v ?? "")} required>
            <SelectTrigger>
              <SelectValue placeholder="Select trade" />
            </SelectTrigger>
            <SelectContent>
              {trades.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" placeholder="07700 900123" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="jobs@abcplumbing.co.uk" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save contractor
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
