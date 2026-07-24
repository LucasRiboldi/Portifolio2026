import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { describe, expect, it } from "vitest"

import { collect } from "@/lib/prophet-wire/collector"
import { HttpError, type HttpClient, type HttpResponse } from "@/lib/prophet-wire/http-client"
import { RunLogger } from "@/lib/prophet-wire/logger"
import type { Source } from "@/lib/prophet-wire/types"

/**
 * O Collector precisa ser robusto: uma fonte fora do ar (erro ou status ruim)
 * não pode derrubar a coleta das demais, e cada falha tem de virar `errors` no
 * RunReport. Os testes injetam um HttpClient fake que devolve fixtures ou
 * simula falhas — nenhuma rede é tocada.
 */

const here = dirname(fileURLToPath(import.meta.url))
const rss = readFileSync(join(here, "fixtures", "sample-rss.xml"), "utf-8")

function source(over: Partial<Source> = {}): Source {
  return {
    id: "fonte",
    name: "Fonte",
    url: "https://exemplo.test/feed",
    kind: "rss",
    defaultCategory: "Notícias",
    enabled: true,
    ...over,
  }
}

/** HttpClient roteado por url: função por url decide a resposta ou lança. */
function fakeHttp(routes: Record<string, () => Promise<HttpResponse>>): HttpClient {
  return {
    async get(url) {
      const route = routes[url]
      if (!route) throw new HttpError(`sem rota para ${url}`, url)
      return route()
    },
  }
}

const silent = () => new RunLogger({ echo: false })

describe("collect", () => {
  it("devolve payload ok com o corpo da fonte", async () => {
    const src = source({ id: "a", url: "https://a.test/feed" })
    const http = fakeHttp({ "https://a.test/feed": async () => ({ status: 200, body: rss }) })

    const [payload] = await collect({ http, logger: silent(), sources: [src] })
    expect(payload?.ok).toBe(true)
    expect(payload?.body).toContain("Nova expansão anunciada")
    expect(payload?.source.id).toBe("a")
  })

  it("isola erro por fonte — uma cai, as outras seguem", async () => {
    const boa = source({ id: "boa", url: "https://boa.test/feed" })
    const caida = source({ id: "caida", url: "https://caida.test/feed" })
    const http = fakeHttp({
      "https://boa.test/feed": async () => ({ status: 200, body: rss }),
      "https://caida.test/feed": async () => {
        throw new HttpError("timeout", "https://caida.test/feed")
      },
    })

    const logger = silent()
    const out = await collect({ http, logger, sources: [boa, caida] })

    expect(out).toHaveLength(2)
    expect(out.find((p) => p.source.id === "boa")?.ok).toBe(true)
    const bad = out.find((p) => p.source.id === "caida")
    expect(bad?.ok).toBe(false)
    expect(bad?.status).toBe(0)
    expect(bad?.error).toContain("timeout")
  })

  it("trata status não-2xx como falha (não lança)", async () => {
    const src = source({ id: "erro", url: "https://erro.test/feed" })
    const http = fakeHttp({ "https://erro.test/feed": async () => ({ status: 503, body: "" }) })

    const [payload] = await collect({ http, logger: silent(), sources: [src] })
    expect(payload?.ok).toBe(false)
    expect(payload?.status).toBe(503)
  })

  it("contabiliza fetched e errors no RunReport", async () => {
    const ok = source({ id: "ok", url: "https://ok.test/feed" })
    const bad = source({ id: "bad", url: "https://bad.test/feed" })
    const http = fakeHttp({
      "https://ok.test/feed": async () => ({ status: 200, body: rss }),
      "https://bad.test/feed": async () => ({ status: 500, body: "" }),
    })

    const logger = silent()
    await collect({ http, logger, sources: [ok, bad] })
    const report = logger.finish()
    expect(report.counters.fetched).toBe(1)
    expect(report.counters.errors).toBe(1)
  })

  it("carimba fetchedAt com o relógio injetado", async () => {
    const src = source({ url: "https://t.test/feed" })
    const http = fakeHttp({ "https://t.test/feed": async () => ({ status: 200, body: rss }) })
    const fixed = new Date("2026-07-24T00:00:00.000Z")

    const [payload] = await collect({ http, logger: silent(), sources: [src], now: () => fixed })
    expect(payload?.fetchedAt).toBe(fixed.toISOString())
  })
})
