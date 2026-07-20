import { NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

export async function POST(request: Request) {
  const { propertyToken } = await request.json();
  if (!propertyToken) {
    return NextResponse.json({ error: "Missing link token" }, { status: 400 });
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc("pf_start_report", {
    p_property_token: propertyToken,
  });
  if (error) {
    return NextResponse.json({ error: "This link is not valid." }, { status: 404 });
  }
  return NextResponse.json(data);
}
