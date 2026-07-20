import { createClient } from "@supabase/supabase-js";

// Stateless anon client for public token flows (RPC-gated). No cookies.
export function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
