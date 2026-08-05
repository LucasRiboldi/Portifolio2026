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

/**
 * Serialização por host.
 *
 * O Collector saía com `Promise.all` sobre TODAS as fontes. Como três das
 * ativas eram do reddit.com, as três chamadas partiam juntas e as três voltavam
 * **429** — o pipeline reportava "fonte bloqueada" quando o culpado era o nosso
 * próprio paralelismo. Medido em 05/08/2026, com o UA do agregador: sozinha, a
 * mesma URL responde 200.
 *
 * O conserto não pode virar "serializa tudo": uma fonte lenta atrasaria as
 * outras sete. Estes testes fixam as duas metades — mesmo host em fila, hosts
 * diferentes em paralelo — e a ordem de retorno, que é contrato.
 */
describe("collect — cortesia por host", () => {
  /** HttpClient que registra sobreposição real de chamadas por host. */
  function httpQueRegistra(atrasoMs: number) {
    const emVoo = new Map<string, number>()
    const picos = new Map<string, number>()
    const ordem: string[] = []

    const http: HttpClient = {
      async get(url) {
        const host = new URL(url).hostname
        const agora = (emVoo.get(host) ?? 0) + 1
        emVoo.set(host, agora)
        picos.set(host, Math.max(picos.get(host) ?? 0, agora))
        ordem.push(url)
        await new Promise((r) => setTimeout(r, atrasoMs))
        emVoo.set(host, (emVoo.get(host) ?? 1) - 1)
        return { status: 200, body: rss }
      },
    }
    return { http, picos, ordem }
  }

  it("nunca faz duas chamadas simultâneas ao mesmo host", async () => {
    const { http, picos } = httpQueRegistra(5)
    const fontes = [
      source({ id: "r1", url: "https://www.reddit.com/r/a/.rss" }),
      source({ id: "r2", url: "https://www.reddit.com/r/b/.rss" }),
      source({ id: "r3", url: "https://www.reddit.com/r/c/.rss" }),
    ]

    await collect({ http, logger: silent(), sources: fontes })

    // Era 3 antes do conserto — e 3 chamadas juntas é o que gerava o 429.
    expect(picos.get("www.reddit.com")).toBe(1)
  })

  it("mantém hosts diferentes em paralelo", async () => {
    const { http, picos } = httpQueRegistra(15)
    const fontes = [
      source({ id: "a", url: "https://a.test/feed" }),
      source({ id: "b", url: "https://b.test/feed" }),
      source({ id: "c", url: "https://c.test/feed" }),
    ]

    const t0 = Date.now()
    await collect({ http, logger: silent(), sources: fontes })
    const decorrido = Date.now() - t0

    expect([...picos.values()]).toEqual([1, 1, 1])
    // Em fila seriam ~45ms mais duas pausas de 1s. Em paralelo, ~15ms.
    expect(decorrido).toBeLessThan(500)
  })

  it("devolve um item por fonte, na ordem original", async () => {
    // O agrupamento por host embaralha a execução; a ordem de retorno é
    // contrato documentado e é reposta ao final.
    const { http } = httpQueRegistra(1)
    const fontes = [
      source({ id: "r1", url: "https://www.reddit.com/r/a/.rss" }),
      source({ id: "outro", url: "https://outro.test/feed" }),
      source({ id: "r2", url: "https://www.reddit.com/r/b/.rss" }),
    ]

    const res = await collect({ http, logger: silent(), sources: fontes })

    expect(res.map((r) => r.source.id)).toEqual(["r1", "outro", "r2"])
  })
})
