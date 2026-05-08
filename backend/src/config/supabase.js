import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";

let supabaseClient;

function missing(list) {
  return list.join(", ");
}

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const missingVars = [];
  if (!env.supabaseUrl) missingVars.push("SUPABASE_URL");
  if (!env.supabaseAnonKey) missingVars.push("SUPABASE_ANON_KEY");

  if (missingVars.length) {
    throw new Error(
      `Supabase client cannot be created. Missing: ${missing(missingVars)}`
    );
  }

  supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
}

