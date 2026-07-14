import "server-only"

/**
 * Cliente Supabase com service-role — IGNORA RLS. Uso administrativo apenas
 * (seed, migrações de dados). NUNCA importar em código que roda no client.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import { SUPABASE_URL } from "./config"

export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !serviceKey) {
    throw new Error("Service-role não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).")
  }
  return createSupabaseClient(SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
