import "server-only";
import { createClient } from "@supabase/supabase-js";
import { siteConfig } from "@/lib/site-config";
import type { Database } from "@/types/database";

// Read-only public client.
export const supabasePublic = createClient<Database>(
  siteConfig.supabaseUrl,
  siteConfig.supabaseKey,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
