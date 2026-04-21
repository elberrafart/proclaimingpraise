import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Bypasses RLS — only use in server-side code (API routes, server actions).
// Requires SUPABASE_SERVICE_ROLE_KEY env var (never expose to the client).
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
