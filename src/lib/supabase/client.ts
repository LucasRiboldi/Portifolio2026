"use client"

/**
 * Cliente Supabase para o browser (Client Components).
 * Usa a anon key — protegido por RLS. Só é criado quando configurado.
 */
import { createBrowserClient } from "@supabase/ssr"

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config"

export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase não configurado (defina NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY).")
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
