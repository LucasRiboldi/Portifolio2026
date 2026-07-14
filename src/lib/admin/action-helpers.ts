import "server-only"

/**
 * Utilidades para Server Actions do /admin: garante admin, dá acesso ao client
 * autenticado (respeita RLS) e revalida as tags de cache afetadas.
 */
import { revalidateTag } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth/is-admin"
import type { CacheTag } from "@/lib/repos/tags"

export type ActionResult = { ok: true } | { ok: false; error: string }

/** Contexto de uma action admin: usuário validado + supabase autenticado. */
export async function adminContext() {
  await requireAdmin()
  const supabase = await createClient()
  return { supabase }
}

/** Revalida uma ou mais tags de cache do site público. */
export function revalidate(...tags: CacheTag[]) {
  for (const tag of tags) revalidateTag(tag)
}

export function ok(): ActionResult {
  return { ok: true }
}

export function fail(error: string): ActionResult {
  return { ok: false, error }
}
