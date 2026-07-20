import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";
import { generateTriageReply } from "@/lib/ai/triage";
import type { TicketMessage } from "@/lib/types";

export async function POST(request: Request) {
  const { statusToken, content } = await request.json();
  if (!statusToken || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const supabase = createAnonClient();

  // Save tenant message
  const { error: addErr } = await supabase.rpc("pf_add_message", {
    p_status_token: statusToken,
    p_role: "tenant",
    p_content: content,
  });
  if (addErr) {
    return NextResponse.json({ error: "Session expired" }, { status: 400 });
  }

  // Load history and generate AI reply
  const { data: history } = await supabase.rpc("pf_get_messages", {
    p_status_token: statusToken,
  });
  const reply = await generateTriageReply((history as TicketMessage[]) ?? []);

  await supabase.rpc("pf_add_message", {
    p_status_token: statusToken,
    p_role: "ai",
    p_content: reply,
  });

  return NextResponse.json({ reply });
}
