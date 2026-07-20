import { createAnonClient } from "@/lib/supabase/anon";
import { generateTriageReply, classifyTicket } from "@/lib/ai/triage";
import type { TicketMessage } from "@/lib/types";

// Twilio-compatible WhatsApp inbound webhook.
// Configure your Twilio WhatsApp number's "When a message comes in" webhook to:
//   POST {NEXT_PUBLIC_SITE_URL}/api/whatsapp/webhook
// Works with the built-in simulator at /dashboard/channels too.

function twiml(message: string) {
  const body = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(
    message,
  )}</Message></Response>`;
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/xml; charset=utf-8" },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const DONE_RE = /\b(done|submit|that'?s all|finished|nothing else|no thanks|that is all)\b/i;

export async function POST(request: Request) {
  const form = await request.formData();
  const from = String(form.get("From") ?? "").replace(/^whatsapp:/i, "").trim();
  const body = String(form.get("Body") ?? "").trim();
  const numMedia = Number(form.get("NumMedia") ?? 0);

  if (!from) return twiml("Sorry, we couldn't read your number. Please contact your agency.");

  const supabase = createAnonClient();

  // Resolve the tenant's phone to a property + open intake ticket.
  const { data: session, error } = await supabase.rpc("pf_whatsapp_get_or_start", {
    p_phone: from,
  });
  if (error || !session?.matched) {
    return twiml(
      "Hi! This number isn't linked to a property yet. Please contact your letting agency so they can set up WhatsApp reporting for you.",
    );
  }

  const statusToken = session.status_token as string;
  const isFirstContact = !body && numMedia === 0;

  if (isFirstContact) {
    return twiml(
      "Hi — I'm your property's maintenance assistant. What issue would you like to report? A short description (and a photo if you can) is perfect.",
    );
  }

  // Record media as a message (full Twilio media ingestion needs Twilio auth — logged for now).
  if (numMedia > 0) {
    const ctype = String(form.get("MediaContentType0") ?? "image");
    await supabase.rpc("pf_add_message", {
      p_status_token: statusToken,
      p_role: "tenant",
      p_content: `[${ctype.startsWith("video") ? "video" : "photo"} attached via WhatsApp]`,
    });
  }

  if (body) {
    await supabase.rpc("pf_add_message", {
      p_status_token: statusToken,
      p_role: "tenant",
      p_content: body,
    });
  }

  const { data: history } = await supabase.rpc("pf_get_messages", {
    p_status_token: statusToken,
  });
  const msgs = (history as TicketMessage[]) ?? [];
  const tenantTurns = msgs.filter((m) => m.role === "tenant").length;

  // Finalize on explicit intent or after enough detail.
  if (DONE_RE.test(body) || tenantTurns >= 4) {
    const classification = await classifyTicket(msgs);
    await supabase.rpc("pf_finalize_ticket", {
      p_status_token: statusToken,
      p_payload: classification,
    });
    return twiml(
      "Thank you — I've logged everything and sent it to your property manager. They'll arrange a contractor and you'll get updates here. 👍",
    );
  }

  const reply = await generateTriageReply(msgs);
  await supabase.rpc("pf_add_message", {
    p_status_token: statusToken,
    p_role: "ai",
    p_content: reply,
  });
  return twiml(reply);
}
