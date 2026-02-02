import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Ensure these are in your .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Fallback logic: Use Service Role (Backend) -> Anon Key (Client)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
