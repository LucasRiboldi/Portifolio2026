import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { describe, expect, it } from "vitest"

import { parsePayload, withinWindow, parseWithinWindow } from "@/lib/prophet-wire/parser"
import type { RawPayload } from "@/lib/prophet-wire/collector"
import { RunLogger } from "@/lib/prophet-wire/logger"
import type { Source } from "@/lib/prophet-wire/types"

/**
 * O Parser é o único que conhece formatos de feed. Se ele errar a data, a
 * janela de 24h deixa passar notícia velha; se errar o link, o Dedup não
 * consegue casar. Os testes rodam sobre fixtures reais de RSS e Atom.
 */

const here = dirname(fileURLToPath(import.meta.url))
const rss = readFileSync(join(here, "fixtures", "sample-rss.xml"), "utf-8")
const atom = readFileSync(join(here, "fixtures", "sample-atom.xml"), "utf-8")

function source(over: Partial<Source> = {}): Source {
  return { id: "f", name: "F", url: "https://f.test", kind: "rss", defaultCategory: "Notícias", enabled: true, ...over }
}

function payload(body: string, over: Partial<RawPayload> = {}): RawPayload {
  return { source: source(), fetchedAt: "2026-07-24T00:00:00.000Z", ok: true, body, status: 200, ...over }
}

const silent = () => new RunLogger({ echo: false })

describe("parsePayload — RSS", () => {
  it("extrai título, link, data ISO e resumo", () => {
    const items = parsePayload(payload(rss), silent())
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      title: "Nova expansão anunciada para jogo de alocação",
      link: "https://exemplo.test/noticias/expansao-alocacao",
    })
    expect(items[0]?.publishedAt).toBe("2026-07-23T10:00:00.000Z")
    expect(items[0]?.summary).toContain("expansão com novos trabalhadores")
  })
})

describe("parsePayload — Atom", () => {
  it("extrai entry com link alternate, data e imagem media:thumbnail", () => {
    const items = parsePayload(payload(atom, { source: source({ kind: "rss" }) }), silent())
    expect(items).toHaveLength(2)
    expect(items[0]?.link).toBe("https://exemplo.test/atom/solo")
    expect(items[0]?.publishedAt).toBe("2026-07-23T12:00:00.000Z")
    expect(items[0]?.imageUrl).toBe("https://exemplo.test/img/solo.jpg")
  })
})

describe("parsePayload — casos de borda", () => {
  it("payload com falha devolve lista vazia", () => {
    expect(parsePayload(payload("", { ok: false }), silent())).toEqual([])
  })

  it("payload sem item/entry devolve vazio e avisa", () => {
    const items = parsePayload(payload("<html><body>sem feed</body></html>", { source: source({ kind: "html" }) }), silent())
    expect(items).toEqual([])
  })
})

describe("withinWindow", () => {
  const now = new Date("2026-07-24T00:00:00.000Z")

  it("mantém só itens dentro da janela e descarta os antigos", () => {
    const items = parsePayload(payload(atom), silent())
    // solo: 2026-07-23 (dentro de 24h) · promo: 2026-07-10 (fora)
    const kept = withinWindow(items, 24, now, silent())
    expect(kept).toHaveLength(1)
    expect(kept[0]?.link).toBe("https://exemplo.test/atom/solo")
  })

  it("descarta itens sem data e conta discarded", () => {
    const logger = silent()
    const kept = withinWindow(
      [{ sourceId: "f", title: "x", link: "l", publishedAt: null, summary: "", imageUrl: null }],
      24,
      now,
      logger,
    )
    expect(kept).toHaveLength(0)
    expect(logger.finish().counters.discarded).toBe(1)
  })

  it("ignora datas no futuro", () => {
    const future = [{ sourceId: "f", title: "x", link: "l", publishedAt: "2026-08-01T00:00:00Z", summary: "", imageUrl: null }]
    expect(withinWindow(future, 24, now, silent())).toHaveLength(0)
  })
})

describe("parseWithinWindow", () => {
  it("parseia e filtra num passo", () => {
    const now = new Date("2026-07-24T00:00:00.000Z")
    const kept = parseWithinWindow(payload(rss), 48, now, silent())
    // ambos os itens do RSS (23/07 e 22/07) caem dentro de 48h
    expect(kept).toHaveLength(2)
  })
})
