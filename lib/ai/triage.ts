import "server-only";
import { generateText, generateObject } from "ai";
import { classificationSchema, type ClassificationOutput } from "./schemas";
import type { TicketMessage } from "@/lib/types";

const MODEL = "anthropic/claude-sonnet-5";
const hasKey = () => Boolean(process.env.AI_GATEWAY_API_KEY);

const TRIAGE_SYSTEM = `You are the maintenance triage assistant for a UK property agency, talking directly to a tenant who has reported a maintenance issue.

Your goals, in order:
1. Be calm, warm and brief. One short reply at a time.
2. Gather the missing facts needed to dispatch a contractor: exactly what/where the problem is, whether it is active/getting worse, any immediate safety steps (e.g. turning off water/electricity), and when a contractor can access the property.
3. Encourage a photo or short video if one hasn't been added.
4. Ask only what's still missing — never re-ask something already answered.

Rules:
- Never promise a specific appointment time or cost.
- Never say a contractor is "on the way" — a manager approves dispatch.
- Keep replies to 1-3 sentences. Use British English.
- Once you have enough to triage (issue, severity, access), reassure the tenant that you've logged it and a manager will arrange a contractor. Do not keep asking questions after that.`;

export async function generateTriageReply(
  history: TicketMessage[],
): Promise<string> {
  if (!hasKey()) return heuristicReply(history);
  try {
    const { text } = await generateText({
      model: MODEL,
      system: TRIAGE_SYSTEM,
      messages: history.map((m) => ({
        role: m.role === "tenant" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    });
    return text.trim() || heuristicReply(history);
  } catch (err) {
    console.error("[triage] falling back to heuristic:", err);
    return heuristicReply(history);
  }
}

export async function classifyTicket(
  history: TicketMessage[],
): Promise<ClassificationOutput> {
  if (!hasKey()) return heuristicClassify(history);
  try {
    const transcript = history
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");
    const { object } = await generateObject({
      model: MODEL,
      schema: classificationSchema,
      system:
        "You classify a UK property maintenance conversation into a structured job ticket. Be decisive and practical.",
      prompt: `Conversation transcript:\n\n${transcript}\n\nProduce the structured job ticket.`,
    });
    return object;
  } catch (err) {
    console.error("[classify] falling back to heuristic:", err);
    return heuristicClassify(history);
  }
}

export async function generateLandlordSummary(
  history: TicketMessage[],
  ticketTitle: string,
): Promise<string> {
  if (!hasKey()) {
    return `Maintenance issue "${ticketTitle}" was reported by the tenant, triaged, and a contractor was dispatched and attended. The job has now been marked as resolved. A full timeline is available in your PropertyFix dashboard.`;
  }
  try {
    const transcript = history
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");
    const { text } = await generateText({
      model: MODEL,
      system:
        "Write a brief, professional update for a landlord about a maintenance job on their property. 2-3 sentences, plain English, reassuring and factual. No greeting or sign-off.",
      prompt: `Job: ${ticketTitle}\n\nTranscript:\n${transcript}`,
    });
    return text.trim();
  } catch {
    return `Maintenance issue "${ticketTitle}" has been handled and resolved. See the PropertyFix dashboard for the full timeline.`;
  }
}

// --- Heuristic fallback (no API key required) ---

const TRADE_RULES: { keywords: string[]; trade: string; risk: string; urgent: boolean }[] = [
  { keywords: ["leak", "water", "sink", "tap", "pipe", "flood", "drip", "toilet", "drain", "boiler pressure"], trade: "Plumber", risk: "Water damage", urgent: true },
  { keywords: ["electric", "socket", "wiring", "spark", "power", "fuse", "trip", "light not"], trade: "Electrician", risk: "Fire risk", urgent: true },
  { keywords: ["heat", "boiler", "radiator", "gas", "cold", "hot water", "carbon"], trade: "Heating / Gas engineer", risk: "No heating", urgent: true },
  { keywords: ["lock", "door won", "key", "break in", "can't get in", "security"], trade: "Locksmith", risk: "Security", urgent: true },
  { keywords: ["roof", "ceiling", "damp", "mould", "gutter"], trade: "Roofer", risk: "Water ingress", urgent: false },
  { keywords: ["window", "glass", "smashed", "cracked pane"], trade: "Glazier", risk: "Security", urgent: false },
  { keywords: ["oven", "fridge", "washing machine", "dishwasher", "appliance", "dryer"], trade: "Appliance repair", risk: "None significant", urgent: false },
  { keywords: ["pest", "mice", "rat", "cockroach", "infest", "wasp"], trade: "Pest control", risk: "Health", urgent: false },
  { keywords: ["door", "cupboard", "shelf", "hinge", "wood", "floorboard"], trade: "Carpenter", risk: "None significant", urgent: false },
];

function heuristicMatch(text: string) {
  const t = text.toLowerCase();
  for (const rule of TRADE_RULES) {
    if (rule.keywords.some((k) => t.includes(k))) return rule;
  }
  return { trade: "Handyperson", risk: "None significant", urgent: false };
}

function heuristicReply(history: TicketMessage[]): string {
  const tenantMsgs = history.filter((m) => m.role === "tenant");
  const hasPhoto = history.some((m) => m.content.includes("[photo") || m.content.includes("[video"));
  const text = tenantMsgs.map((m) => m.content).join(" ").toLowerCase();
  const active = /still|active|getting worse|now|ongoing/.test(text);
  const access = /after|before|available|am|pm|morning|afternoon|evening|weekday|any time|anytime/.test(text);

  if (tenantMsgs.length <= 1) {
    return "I'm sorry to hear that. Is the issue active right now, and is it getting worse? If it's safe, please add a photo or short video so we can see what's happening.";
  }
  if (!hasPhoto) {
    return "Thanks — that's helpful. If you can, please add a photo or short video of the problem. It helps the contractor arrive prepared.";
  }
  if (!access) {
    return "Got it. When would be a good time for a contractor to access the property? For example, a day and a rough time window.";
  }
  if (!active) {
    return "Understood. Just to confirm — is the problem still ongoing right now, or has it settled?";
  }
  return "Thank you — I've logged all of this. A property manager will review it shortly and arrange the right contractor. You'll get an update as soon as it's booked.";
}

function heuristicClassify(history: TicketMessage[]): ClassificationOutput {
  const all = history.map((m) => m.content).join(" ");
  const match = heuristicMatch(all);
  const lower = all.toLowerCase();
  const urgent =
    match.urgent && /still|active|leak|flood|spark|no heat|no hot water|break in|smashed|getting worse/.test(lower);
  const urgency = urgent ? "urgent" : match.risk === "None significant" ? "low" : "medium";

  const accessMatch = all.match(/(after|before|available)[^.!?\n]*/i);
  const access = accessMatch ? accessMatch[0].trim() : "Tenant to confirm access window";

  const firstTenant = history.find((m) => m.role === "tenant")?.content ?? "Maintenance issue reported";
  const title = firstTenant.replace(/[.!?].*$/, "").slice(0, 60);

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    urgency,
    trade: match.trade,
    risk: match.risk,
    access_notes: access,
    summary: `${title}. Reported by tenant via PropertyFix intake.`,
    dispatch_message: `${urgency === "urgent" ? "URGENT: " : ""}${title}. Photos attached where provided. Access: ${access}. Please confirm attendance.`,
  };
}
