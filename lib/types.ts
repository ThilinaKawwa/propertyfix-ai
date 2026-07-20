export type TicketStatus =
  | "intake"
  | "pending_approval"
  | "dispatched"
  | "confirmed"
  | "resolved";

export type Urgency = "low" | "medium" | "urgent";

export type MessageRole = "tenant" | "ai" | "system";

export interface Agency {
  id: string;
  name: string;
  created_at: string;
}

export interface Property {
  id: string;
  agency_id: string;
  address_line: string;
  unit_label: string | null;
  landlord_name: string | null;
  landlord_email: string | null;
  landlord_id: string | null;
  tenant_phone: string | null;
  report_token: string;
  created_at: string;
}

export interface Landlord {
  id: string;
  agency_id: string;
  name: string | null;
  email: string;
  portal_token: string;
  created_at: string;
}

export interface Contractor {
  id: string;
  agency_id: string;
  name: string;
  trade: string;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  agency_id: string;
  property_id: string;
  status: TicketStatus;
  urgency: Urgency | null;
  trade: string | null;
  risk: string | null;
  access_notes: string | null;
  summary: string | null;
  title: string | null;
  tenant_name: string | null;
  tenant_contact: string | null;
  suggested_contractor_id: string | null;
  assigned_contractor_id: string | null;
  dispatch_message: string | null;
  landlord_summary: string | null;
  status_token: string;
  dispatch_token: string | null;
  channel: "web" | "whatsapp";
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface Attachment {
  path: string;
  mime: string | null;
}

/** Structured output of AI triage classification. */
export interface Classification {
  title: string;
  urgency: Urgency;
  trade: string;
  risk: string;
  access_notes: string;
  summary: string;
  tenant_name?: string;
  tenant_contact?: string;
  dispatch_message: string;
}
