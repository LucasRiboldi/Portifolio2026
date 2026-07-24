/**
 * PROPHET WIRE — Publisher (Parte 11).
 *
 * Grava os itens já gerados no repositório, respeitando o modo de publicação
 * (`config.publishMode`, refletido no `status` que o Normalizer definiu):
 *
 *   • "publicado" → vai direto ao ar (a landing lê `listPublished`);
 *   • "rascunho"  → entra na fila do admin para revisão humana.
 *
 * Não decide duplicidade (isso é do Dedup) nem reescreve (isso é do Generator):
 * só persiste e contabiliza. Falha ao gravar um item não derruba os demais.
 */

import type { NewsItem } from "./types"
import type { NewsRepository } from "./repository"
import type { Logger } from "./logger"

export interface PublishResult {
  /** Itens efetivamente gravados. */
  saved: NewsItem[]
  /** Quantos foram ao ar (status publicado). */
  published: number
  /** Quantos entraram como rascunho. */
  drafted: number
}

/**
 * Persiste cada item via `repo.save`. Erros de gravação são isolados por item,
 * contados em `errors` e não interrompem o lote. Atualiza os contadores
 * `published` no RunReport (rascunhos não contam como publicados).
 */
export async function publish(
  items: readonly NewsItem[],
  repo: NewsRepository,
  logger: Logger,
): Promise<PublishResult> {
  const saved: NewsItem[] = []
  let published = 0
  let drafted = 0

  for (const item of items) {
    try {
      const stored = await repo.save(item)
      saved.push(stored)
      if (stored.status === "publicado") {
        published += 1
        logger.count("published")
        logger.debug("publicado", { slug: stored.slug })
      } else {
        drafted += 1
        logger.debug("gravado como rascunho", { slug: stored.slug })
      }
    } catch (err) {
      logger.error("falha ao gravar item", { slug: item.slug, error: String(err) })
      logger.count("errors")
    }
  }

  logger.info("publicação concluída", { publicados: published, rascunhos: drafted })
  return { saved, published, drafted }
}
