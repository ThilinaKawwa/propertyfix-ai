import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

export async function POST(request: Request) {
  const { statusToken, path, mime, name } = await request.json();
  if (!statusToken || !path) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const supabase = createAnonClient();

  const { error } = await supabase.rpc("pf_add_attachment", {
    p_status_token: statusToken,
    p_path: path,
    p_mime: mime ?? null,
  });
  if (error) {
    return NextResponse.json({ error: "Session expired" }, { status: 400 });
  }

  // Log a tenant message so the classifier knows a photo/video was provided.
  await supabase.rpc("pf_add_message", {
    p_status_token: statusToken,
    p_role: "tenant",
    p_content: `[${mime?.startsWith("video") ? "video" : "photo"} attached: ${name ?? "file"}]`,
  });

  return NextResponse.json({ ok: true });
}
