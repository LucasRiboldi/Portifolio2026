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

/** Pausa entre duas chamadas ao mesmo host. Curta — é cortesia, não recuo. */
const PAUSA_MESMO_HOST_MS = 1_000

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Host da URL, para agrupar. URL inválida vira balde próprio em vez de estourar. */
function hostDe(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
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

  async function buscar(source: Source): Promise<RawPayload> {
    {
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
    }
  }

  /**
   * Serializa por host, mantendo hosts diferentes em paralelo.
   *
   * Antes era `Promise.all` sobre todas as fontes: três URLs do reddit.com
   * saíam ao mesmo tempo e as três voltavam **429**. Não era bloqueio ao
   * agregador — era o nosso próprio paralelismo pedindo demais de uma vez.
   *
   * Serializar tudo custaria caro (uma fonte lenta atrasaria as 8). Serializar
   * por host resolve o caso real sem esse preço: hosts com uma fonte só, que
   * são a maioria, seguem tão rápidos quanto antes.
   */
  const porHost = new Map<string, Source[]>()
  for (const source of sources) {
    const host = hostDe(source.url)
    const grupo = porHost.get(host)
    if (grupo) grupo.push(source)
    else porHost.set(host, [source])
  }

  const porId = new Map<string, RawPayload>()
  await Promise.all(
    [...porHost.values()].map(async (grupo) => {
      for (const [i, source] of grupo.entries()) {
        // Só entre chamadas ao MESMO host, e nunca antes da primeira.
        if (i > 0) await esperar(PAUSA_MESMO_HOST_MS)
        porId.set(source.id, await buscar(source))
      }
    }),
  )

  // O contrato é "um item por fonte, na mesma ordem" — o agrupamento acima
  // embaralha, então a ordem original é reposta aqui.
  const results = sources.map((s) => porId.get(s.id)!)

  const okCount = results.filter((r) => r.ok).length
  logger.info("coleta concluída", { total: results.length, ok: okCount, falhas: results.length - okCount })
  return results
}
