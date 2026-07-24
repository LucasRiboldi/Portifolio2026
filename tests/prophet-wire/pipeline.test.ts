import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { describe, expect, it } from "vitest"

import { runPipeline } from "@/lib/prophet-wire/pipeline"
import { FallbackAIClient, type AIClient } from "@/lib/prophet-wire/ai-client"
import { InMemoryNewsRepository } from "@/lib/prophet-wire/repository"
import type { HttpClient, HttpResponse } from "@/lib/prophet-wire/http-client"
import type { Source } from "@/lib/prophet-wire/types"
import { config } from "@/lib/prophet-wire/config"

/**
 * Teste de integração do orquestrador: costura coleta→parse→normalize→dedup→
 * analyze→generate→publish com fakes (nenhuma rede, IA em fallback). Prova que
 * o pipeline roda de ponta a ponta, deduplica entre execuções e resume tudo no
 * RunReport.
 */

const here = dirname(fileURLToPath(import.meta.url))
const rss = readFileSync(join(here, "fixtures", "sample-rss.xml"), "utf-8")

function source(over: Partial<Source> = {}): Source {
  return { id: "feed", name: "Feed", url: "https://feed.test/rss", kind: "rss", defaultCategory: "Notícias", enabled: true, ...over }
}

function fakeHttp(body: string): HttpClient {
  return { async get(): Promise<HttpResponse> { return { status: 200, body } } }
}

const NOW = new Date("2026-07-24T00:00:00.000Z")
/** Janela larga para abraçar as datas da fixture (23 e 22/07). */
const WINDOW = 72

function deps(over: Partial<Parameters<typeof runPipeline>[0]> = {}) {
  return {
    http: fakeHttp(rss),
    ai: new FallbackAIClient() as AIClient,
    repo: new InMemoryNewsRepository(),
    sources: [source()],
    windowHours: WINDOW,
    now: () => NOW,
    logging: { echo: false as const },
    ...over,
  }
}

describe("runPipeline", () => {
  it("processa a fixture de ponta a ponta e grava no repositório", async () => {
    const repo = new InMemoryNewsRepository()
    const report = await runPipeline(deps({ repo }))

    expect(report.counters.fetched).toBe(1)
    // a fixture tem 2 itens dentro da janela
    expect(await repo.count()).toBe(2)
  })

  it("grava conforme o modo de publicação (rascunho por padrão)", async () => {
    const repo = new InMemoryNewsRepository()
    await runPipeline(deps({ repo }))

    const expectDraft = config.publishMode === "rascunho"
    expect(await repo.listDrafts()).toHaveLength(expectDraft ? 2 : 0)
    expect(await repo.listPublished()).toHaveLength(expectDraft ? 0 : 2)
  })

  it("preenche SEO em cada item (fallback do Generator)", async () => {
    const repo = new InMemoryNewsRepository()
    await runPipeline(deps({ repo }))
    const all = [...(await repo.listDrafts()), ...(await repo.listPublished())]
    expect(all.every((n) => n.slug && n.seoTitle && n.metaDescription)).toBe(true)
  })

  it("deduplica entre execuções — rodar duas vezes não duplica", async () => {
    const repo = new InMemoryNewsRepository()
    await runPipeline(deps({ repo }))
    const first = await repo.count()
    const report2 = await runPipeline(deps({ repo }))
    expect(await repo.count()).toBe(first) // nada novo
    expect(report2.counters.discarded).toBeGreaterThanOrEqual(first)
  })

  it("uma fonte fora do ar não derruba o pipeline", async () => {
    const boom: HttpClient = { async get() { throw new Error("rede caiu") } }
    const report = await runPipeline(deps({ http: boom }))
    expect(report.counters.errors).toBeGreaterThanOrEqual(1)
    // não lançou: devolveu relatório
    expect(report.finishedAt).toBeTruthy()
  })
})
