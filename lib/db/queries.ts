import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  Agency,
  Contractor,
  Landlord,
  Property,
  Ticket,
  TicketMessage,
  Attachment,
} from "@/lib/types";

export async function getSessionContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, agency: null as Agency | null };

  const { data: profile } = await supabase
    .from("pf_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  let agency: Agency | null = null;
  if (profile?.agency_id) {
    const { data } = await supabase
      .from("pf_agencies")
      .select("*")
      .eq("id", profile.agency_id)
      .maybeSingle();
    agency = data as Agency | null;
  }
  return { user, profile, agency };
}

export async function listTickets(): Promise<Ticket[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pf_tickets")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Ticket[]) ?? [];
}

export async function getDashboardMetrics() {
  const tickets = await listTickets();
  return {
    open: tickets.filter((t) => !["resolved"].includes(t.status)).length,
    pending: tickets.filter((t) => t.status === "pending_approval").length,
    urgent: tickets.filter((t) => t.urgency === "urgent" && t.status !== "resolved")
      .length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    tickets,
  };
}

export async function listProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pf_properties")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Property[]) ?? [];
}

export async function listContractors(): Promise<Contractor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pf_contractors")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Contractor[]) ?? [];
}

export async function listLandlords(): Promise<Landlord[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pf_landlords")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Landlord[]) ?? [];
}

export interface TicketDetail {
  ticket: Ticket;
  property: Property | null;
  messages: TicketMessage[];
  attachments: Attachment[];
  activity: { actor: string; action: string; meta: unknown; created_at: string }[];
  contractors: Contractor[];
  suggested: Contractor | null;
  assigned: Contractor | null;
}

export async function getTicketDetail(id: string): Promise<TicketDetail | null> {
  const supabase = await createClient();
  const { data: ticket } = await supabase
    .from("pf_tickets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!ticket) return null;
  const t = ticket as Ticket;

  const [
    { data: property },
    { data: messages },
    { data: attachments },
    { data: activity },
    contractors,
  ] = await Promise.all([
    supabase.from("pf_properties").select("*").eq("id", t.property_id).maybeSingle(),
    supabase
      .from("pf_ticket_messages")
      .select("role, content, created_at")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("pf_attachments")
      .select("storage_path, mime")
      .eq("ticket_id", id),
    supabase
      .from("pf_activity_log")
      .select("actor, action, meta, created_at")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true }),
    listContractors(),
  ]);

  const suggested =
    contractors.find((c) => c.id === t.suggested_contractor_id) ?? null;
  const assigned =
    contractors.find((c) => c.id === t.assigned_contractor_id) ?? null;

  return {
    ticket: t,
    property: property as Property | null,
    messages: (messages as TicketMessage[]) ?? [],
    attachments:
      ((attachments as { storage_path: string; mime: string | null }[]) ?? []).map(
        (a) => ({ path: a.storage_path, mime: a.mime }),
      ),
    activity: (activity as TicketDetail["activity"]) ?? [],
    contractors,
    suggested,
    assigned,
  };
}
