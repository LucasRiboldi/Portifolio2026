/**
 * PROPHET WIRE — orquestrador do pipeline (Parte 11).
 *
 * Costura os módulos numa execução diária, na ordem do spec:
 *
 *   collect → parse+janela → normalize → dedup → analyze → generate → publish
 *
 * Recebe TODAS as dependências por injeção (HttpClient, AIClient, repositório,
 * fontes, relógio). Cada etapa já isola seus próprios erros e alimenta o mesmo
 * `RunLogger`, então o `RunReport` devolvido resume a execução inteira
 * (pesquisadas, descartadas, publicadas, erros, duração) — exatamente o que o
 * Scheduler (Parte 12) registra e o admin (Parte 13) exibe.
 */

import type { Source } from "./types"
import type { HttpClient } from "./http-client"
import type { AIClient } from "./ai-client"
import type { NewsRepository } from "./repository"
import { RunLogger, type RunReport } from "./logger"
import { config } from "./config"
import { collect } from "./collector"
import { parseWithinWindow } from "./parser"
import { normalizeBatch } from "./normalizer"
import { dedup } from "./dedup"
import { analyzeBatch } from "./analyzer"
import { generateBatch } from "./generator"
import { publish } from "./publisher"

export interface PipelineDeps {
  http: HttpClient
  ai: AIClient
  repo: NewsRepository
  /** Fontes a coletar. Default: as ativas do registry (via Collector). */
  sources?: readonly Source[]
  /** Janela de coleta em horas. Default: `config.collectWindowHours`. */
  windowHours?: number
  /** Relógio injetável (testes / carimbo de execução). */
  now?: () => Date
  /** Nível mínimo de log e eco no console. */
  logging?: { minLevel?: "debug" | "info" | "warn" | "error"; echo?: boolean }
}

/**
 * Executa o pipeline completo uma vez e devolve o relatório da execução.
 * Nunca lança: cada etapa já degrada isoladamente; um erro global inesperado
 * ainda é capturado e vira `errors` no relatório.
 */
export async function runPipeline(deps: PipelineDeps): Promise<RunReport> {
  const now = deps.now ?? (() => new Date())
  const windowHours = deps.windowHours ?? config.collectWindowHours
  const logger = new RunLogger({
    echo: deps.logging?.echo ?? true,
    minLevel: deps.logging?.minLevel ?? "info",
    clock: { now },
  })

  try {
    logger.info("pipeline iniciado", { windowHours, publishMode: config.publishMode })

    // 1) coleta bruta das fontes
    const payloads = await collect({ http: deps.http, logger, sources: deps.sources, now })

    // 2) parse + janela de 24h, mantendo o vínculo item↔fonte
    const pairs = payloads.flatMap((payload) =>
      parseWithinWindow(payload, windowHours, now(), logger).map((item) => ({
        item,
        source: payload.source,
      })),
    )
    logger.info("itens dentro da janela", { total: pairs.length })

    // 3) normaliza para NewsItem bruto (slugs únicos no lote)
    const normalized = normalizeBatch(pairs, { now: now() })

    // 4) remove duplicados contra o acervo e dentro do lote
    const { unique } = await dedup(normalized, deps.repo, logger)

    // 5) enriquece com IA (ou mantém bruto no fallback)
    const analyzed = await analyzeBatch(unique, { ai: deps.ai, logger })

    // 6) reescreve em PT-BR + SEO (ou fallback determinístico)
    const generated = await generateBatch(analyzed, { ai: deps.ai, logger })

    // 7) grava conforme o modo de publicação
    await publish(generated, deps.repo, logger)

    logger.info("pipeline concluído")
  } catch (err) {
    logger.error("falha global no pipeline", { error: String(err) })
    logger.count("errors")
  }

  return logger.finish()
}
