/**
 * PROPHET WIRE — Collector (Parte 4).
 *
 * Percorre as fontes ativas do registry e baixa o payload bruto de cada uma
 * (RSS/HTML/JSON, todos como texto). Não interpreta nada — isso é do Parser
 * (Parte 5). Sua responsabilidade é robustez de coleta:
 *
 *   • erro isolado por fonte  — uma fonte fora do ar não derruba a execução;
 *   • timeout                 — herdado do HttpClient;
 *   • rastro nos contadores   — cada falha vira `errors` no RunReport.
 *
 * Recebe suas dependências (HttpClient, Logger, lista de fontes) por injeção,
 * então roda em teste sem tocar a rede.
 */

import type { Source } from "./types"
import type { HttpClient } from "./http-client"
import { HttpError } from "./http-client"
import type { Logger } from "./logger"
import { activeSources } from "./sources"

/** O payload bruto de uma fonte, com o resultado da coleta. */
export interface RawPayload {
  source: Source
  /** Momento da coleta (ISO). */
  fetchedAt: string
  /** `true` se veio corpo com status 2xx. */
  ok: boolean
  /** Corpo bruto quando `ok`; string vazia quando falhou. */
  body: string
  /** Status HTTP observado (0 quando nem chegou a responder). */
  status: number
  /** Mensagem de erro quando `ok` é `false`. */
  error?: string
}

export interface CollectorDeps {
  http: HttpClient
  logger: Logger
  /** Fontes a coletar. Default: as ativas do registry. */
  sources?: readonly Source[]
  /** Timeout por requisição (ms). Repassado ao HttpClient. */
  timeoutMs?: number
  /** Relógio injetável para carimbar `fetchedAt` (testes). */
  now?: () => Date
}

/** Cabeçalho `Accept` adequado ao tipo de fonte. */
function acceptFor(kind: Source["kind"]): string {
  if (kind === "api") return "application/json, application/xml;q=0.9, */*;q=0.8"
  if (kind === "rss") return "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8"
  return "text/html, */*;q=0.8"
}

/**
 * Coleta o payload bruto de cada fonte. Nunca lança: falhas viram `RawPayload`
 * com `ok: false` e são contadas no logger. O chamador recebe SEMPRE um item
 * por fonte, na mesma ordem.
 */
export async function collect(deps: CollectorDeps): Promise<RawPayload[]> {
  const { http, logger } = deps
  const sources = deps.sources ?? activeSources()
  const now = deps.now ?? (() => new Date())

  const results = await Promise.all(
    sources.map(async (source): Promise<RawPayload> => {
      const fetchedAt = now().toISOString()
      try {
        const res = await http.get(source.url, {
          timeoutMs: deps.timeoutMs,
          headers: { Accept: acceptFor(source.kind) },
        })
        if (res.status < 200 || res.status >= 300) {
          logger.warn("fonte respondeu status não-2xx", { source: source.id, status: res.status })
          logger.count("errors")
          return { source, fetchedAt, ok: false, body: "", status: res.status, error: `HTTP ${res.status}` }
        }
        logger.debug("fonte coletada", { source: source.id, bytes: res.body.length })
        logger.count("fetched")
        return { source, fetchedAt, ok: true, body: res.body, status: res.status }
      } catch (err) {
        const message = err instanceof HttpError ? err.message : String(err)
        logger.error("falha ao coletar fonte", { source: source.id, error: message })
        logger.count("errors")
        return { source, fetchedAt, ok: false, body: "", status: 0, error: message }
      }
    }),
  )

  const okCount = results.filter((r) => r.ok).length
  logger.info("coleta concluída", { total: results.length, ok: okCount, falhas: results.length - okCount })
  return results
}
