import "server-only"

/**
 * Cliente Supabase para o server (Server Components, Server Actions, Route
 * Handlers). Lê/escreve a sessão via cookies do Next.js 15 (cookies() async).
 */
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Chamado de um Server Component (cookies read-only). O middleware
          // renova a sessão, então é seguro ignorar aqui.
        }
      },
    },
  })
}
