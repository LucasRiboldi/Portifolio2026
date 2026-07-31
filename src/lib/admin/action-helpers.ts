import "server-only"

/**
 * Utilidades para Server Actions do /admin: garante admin e revalida as tags de
 * cache afetadas.
 *
 * Antes esta função também devolvia um client Supabase autenticado, e a RLS era
 * a segunda barreira. O Admin SDK ignora Security Rules, então o `requireAdmin()`
 * aqui deixou de ser reforço e passou a ser *a* autorização — motivo pelo qual
 * toda action continua obrigada a chamá-lo antes de qualquer escrita.
 */
import { revalidateTag } from "next/cache"

import { requireAdmin } from "@/lib/auth/is-admin"
import type { CacheTag } from "@/lib/repos/tags"

export type ActionResult = { ok: true } | { ok: false; error: string }

/** Garante que quem chama é o admin. Obrigatório no topo de toda action. */
export async function adminContext() {
  await requireAdmin()
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
