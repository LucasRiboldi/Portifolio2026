"use server"

/**
 * Prophet Wire — ações do painel.
 *
 * Por que existem: o agregador coleta em modo rascunho, e até aqui não havia
 * NENHUMA forma de agir sobre o resultado. A tela mostrava "21 aguardando
 * publicação" e nada mais — os itens ficavam presos, sem caminho para o ar nem
 * para o lixo. Coletar sem poder despachar é meio pipeline.
 */
import { revalidatePath } from "next/cache"

import { requireAdmin } from "@/lib/auth/is-admin"
import { defaultRepository } from "@/data/prophet-wire"
import type { NewsStatus } from "@/lib/prophet-wire/types"

export type WireResult = { ok: true } | { ok: false; error: string }

/**
 * A landing lê as notícias sem tag de cache própria (`getFrontNews` chama o
 * repo direto), então não há `revalidateTag` a chamar — o que invalida é o
 * caminho. Se um dia a leitura ganhar tag, troque por `revalidateTag`.
 */
function revalidarVitrine(): void {
  revalidatePath("/anfitriao")
}

async function mudarStatus(slug: string, status: NewsStatus): Promise<WireResult> {
  await requireAdmin()
  if (!slug.trim()) return { ok: false, error: "Notícia sem identificador." }

  try {
    const repo = defaultRepository()
    const item = await repo.findBySlug(slug)
    if (!item) return { ok: false, error: "Notícia não encontrada." }

    await repo.save({ ...item, status })
    revalidarVitrine()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha ao gravar." }
  }
}

/** Manda para a primeira página. */
export async function publicarNoticia(slug: string): Promise<WireResult> {
  return mudarStatus(slug, "publicado")
}

/** Tira do ar sem apagar — volta para a fila de rascunhos. */
export async function despublicarNoticia(slug: string): Promise<WireResult> {
  return mudarStatus(slug, "rascunho")
}

/**
 * Descarta de vez.
 *
 * Some do acervo, e com ele some o `hash` que a deduplicação usa — então uma
 * execução futura pode recoletar a mesma notícia. É o comportamento certo para
 * "apaguei sem querer", e o errado para "não quero ver isto nunca mais". Uma
 * lista de descartados resolveria o segundo caso; não existe hoje.
 */
export async function excluirNoticia(slug: string): Promise<WireResult> {
  await requireAdmin()
  if (!slug.trim()) return { ok: false, error: "Notícia sem identificador." }

  try {
    await defaultRepository().remove(slug)
    revalidarVitrine()
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha ao excluir." }
  }
}
