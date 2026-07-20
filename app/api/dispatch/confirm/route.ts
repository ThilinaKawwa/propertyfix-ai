import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

export async function POST(request: Request) {
  const { dispatchToken } = await request.json();
  if (!dispatchToken) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("pf_confirm_attendance", {
    p_dispatch_token: dispatchToken,
  });
  if (error) {
    return NextResponse.json({ error: "Invalid link" }, { status: 400 });
  }
  return NextResponse.json(data);
}
