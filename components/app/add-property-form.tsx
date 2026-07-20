"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { addProperty } from "@/lib/actions/agency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AddPropertyForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const state = await addProperty({}, formData);
      if (state.ok) {
        toast.success("Property added");
        formRef.current?.reset();
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
        Add property
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address_line">Address *</Label>
          <Input id="address_line" name="address_line" required placeholder="14 Harbour Court, Bristol BS1 4RN" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit_label">Unit / flat</Label>
          <Input id="unit_label" name="unit_label" placeholder="Flat 2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="landlord_name">Landlord name</Label>
          <Input id="landlord_name" name="landlord_name" placeholder="Chris Owner" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="landlord_email">Landlord email</Label>
          <Input id="landlord_email" name="landlord_email" type="email" placeholder="landlord@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tenant_phone">Tenant WhatsApp number</Label>
          <Input id="tenant_phone" name="tenant_phone" placeholder="+44 7700 900123" />
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Adding a tenant number lets them report via WhatsApp. Landlords with an email get a portal automatically.
      </p>
      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save property
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
