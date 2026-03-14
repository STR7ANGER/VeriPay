import { createClient } from "@supabase/supabase-js";

type SupabaseMode = "anon" | "service";

export function createSupabaseClient(mode: SupabaseMode = "anon") {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key = mode === "service" ? (serviceKey ?? anonKey) : anonKey;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}
