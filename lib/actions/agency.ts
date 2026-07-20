"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTicketDetail } from "@/lib/db/queries";
import { generateLandlordSummary } from "@/lib/ai/triage";
import { pf_token } from "@/lib/token";

export interface ActionState {
  error?: string;
  ok?: boolean;
}

/** Create the agency + profile on first authenticated use (from signup metadata). */
export async function ensureAgency() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("pf_profiles")
    .select("agency_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.agency_id) return;

  const agencyName = (user.user_metadata?.agency_name as string) ?? "My Agency";
  const fullName = (user.user_metadata?.full_name as string) ?? "";
  await supabase.rpc("pf_bootstrap_agency", {
    p_agency_name: agencyName,
    p_full_name: fullName,
  });
}

async function agencyId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("pf_profiles")
    .select("agency_id")
    .eq("id", user.id)
    .maybeSingle();
  return data?.agency_id ?? null;
}

export async function addProperty(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const aid = await agencyId();
  if (!aid) return { error: "No agency found." };

  const landlordName = String(formData.get("landlord_name") ?? "").trim() || null;
  const landlordEmail = String(formData.get("landlord_email") ?? "").trim() || null;

  // Link (or create) the landlord so they get a portal.
  let landlordId: string | null = null;
  if (landlordEmail) {
    const { data } = await supabase.rpc("pf_upsert_landlord", {
      p_name: landlordName,
      p_email: landlordEmail,
    });
    landlordId = (data as string) ?? null;
  }

  const { error } = await supabase.from("pf_properties").insert({
    agency_id: aid,
    address_line: String(formData.get("address_line") ?? "").trim(),
    unit_label: String(formData.get("unit_label") ?? "").trim() || null,
    landlord_name: landlordName,
    landlord_email: landlordEmail,
    landlord_id: landlordId,
    tenant_phone: String(formData.get("tenant_phone") ?? "").trim() || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/properties");
  revalidatePath("/dashboard/landlords");
  return { ok: true };
}

export async function addContractor(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const aid = await agencyId();
  if (!aid) return { error: "No agency found." };

  const { error } = await supabase.from("pf_contractors").insert({
    agency_id: aid,
    name: String(formData.get("name") ?? "").trim(),
    trade: String(formData.get("trade") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard/contractors");
  return { ok: true };
}

export async function approveDispatch(ticketId: string, contractorId: string) {
  const supabase = await createClient();
  const aid = await agencyId();
  if (!aid) return { error: "No agency found." };

  const dispatchToken = pf_token();
  const { error } = await supabase
    .from("pf_tickets")
    .update({
      status: "dispatched",
      assigned_contractor_id: contractorId || null,
      dispatch_token: dispatchToken,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  await supabase.from("pf_activity_log").insert({
    ticket_id: ticketId,
    agency_id: aid,
    actor: "manager",
    action: "approved_dispatch",
    meta: { contractor_id: contractorId },
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function resolveTicket(ticketId: string) {
  const supabase = await createClient();
  const aid = await agencyId();
  if (!aid) return { error: "No agency found." };

  const detail = await getTicketDetail(ticketId);
  let summary: string | null = null;
  if (detail) {
    summary = await generateLandlordSummary(
      detail.messages,
      detail.ticket.title ?? "Maintenance issue",
    );
  }

  const { error } = await supabase
    .from("pf_tickets")
    .update({
      status: "resolved",
      landlord_summary: summary,
      updated_at: new Date().toISOString(),
    })
    .eq("id", ticketId);
  if (error) return { error: error.message };

  await supabase.from("pf_activity_log").insert({
    ticket_id: ticketId,
    agency_id: aid,
    actor: "manager",
    action: "resolved",
  });

  revalidatePath(`/dashboard/tickets/${ticketId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
