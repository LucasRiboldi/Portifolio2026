"use server"

import { requireAdmin } from "@/lib/auth/is-admin"
import { seedDatabase } from "@/lib/admin/seed"
import { syncNewContent } from "@/lib/admin/sync-content"
import { revalidate } from "@/lib/admin/action-helpers"
import { CACHE_TAGS } from "@/lib/repos/tags"

/**
 * Todas as tags do site.
 *
 * Seed e sync escrevem em dezesseis tabelas — as três originais, as cinco do
 * realm dev, as sete zonas do criativo e as matérias do jornal. Enquanto a
 * lista de tags era escrita à mão, ela ficou para trás a cada tabela nova: o
 * conteúdo entrava no banco e a página seguia servindo o cache antigo, sem
 * erro nenhum para acusar.
 *
 * Derivar de `CACHE_TAGS` elimina a classe inteira do problema: tabela nova
 * traz tag nova, e a revalidação a inclui sem que ninguém precise lembrar.
 * O custo é revalidar algumas tags que não mudaram, o que é barato — estas
 * duas ações rodam por clique manual, não em requisição de leitor.
 */
const TODAS_AS_TAGS = Object.values(CACHE_TAGS)

export async function runSeedAction() {
  await requireAdmin()
  try {
    const report = await seedDatabase()
    revalidate(...TODAS_AS_TAGS)
    return { ok: true as const, report }
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "Falha no seed." }
  }
}

/**
 * Insere no banco o conteúdo novo que existe em `src/data/*` e ainda não foi
 * publicado. Só adiciona o que falta, nunca atualiza nem apaga.
 */
export async function runSyncContentAction() {
  await requireAdmin()
  try {
    const report = await syncNewContent()
    revalidate(...TODAS_AS_TAGS)
    return { ok: true as const, report }
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : "Falha no sync." }
  }
}
