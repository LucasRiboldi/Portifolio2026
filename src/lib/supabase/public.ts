import "server-only"

/**
 * Cliente anon SEM cookies/sessão — para leituras públicas cacheáveis
 * (`unstable_cache`). Não depende de request, então pode ser memoizado.
 * Retorna null quando o Supabase não está configurado (repos usam fallback).
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config"

export function createPublicClient() {
  if (!isSupabaseConfigured) return null
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
