"use server"

import { requireAdmin } from "@/lib/auth/is-admin"
import { seedDatabase } from "@/lib/admin/seed"
import { syncNewContent } from "@/lib/admin/sync-content"
import { revalidate } from "@/lib/admin/action-helpers"
import { CACHE_TAGS } from "@/lib/repos/tags"

export async function runSeedAction() {
  await requireAdmin()
  try {
    const report = await seedDatabase()
    revalidate(
      CACHE_TAGS.projects,
      CACHE_TAGS.posts,
      CACHE_TAGS.skills,
      CACHE_TAGS.tools,
      CACHE_TAGS.site,
      CACHE_TAGS.realms,
    )
    return { ok: true as const, report }
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "Falha no seed." }
  }
}

/**
 * Insere no banco o conteúdo novo que existe em `src/data/*` e ainda não foi
 * publicado (projetos, ferramentas e posts). Só adiciona o que falta.
 */
export async function runSyncContentAction() {
  await requireAdmin()
  try {
    const report = await syncNewContent()
    revalidate(CACHE_TAGS.projects, CACHE_TAGS.posts, CACHE_TAGS.tools)
    return { ok: true as const, report }
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "Falha no sync." }
  }
}
