import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";
import { classifyTicket } from "@/lib/ai/triage";
import type { TicketMessage } from "@/lib/types";

export async function POST(request: Request) {
  const { statusToken } = await request.json();
  if (!statusToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const supabase = createAnonClient();

  const { data: history, error } = await supabase.rpc("pf_get_messages", {
    p_status_token: statusToken,
  });
  if (error) {
    return NextResponse.json({ error: "Session expired" }, { status: 400 });
  }

  const classification = await classifyTicket((history as TicketMessage[]) ?? []);

  const { error: finErr } = await supabase.rpc("pf_finalize_ticket", {
    p_status_token: statusToken,
    p_payload: classification,
  });
  if (finErr) {
    return NextResponse.json({ error: "Could not submit" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
