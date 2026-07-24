import { describe, expect, it } from "vitest"

import { dedup, titleSimilarity } from "@/lib/prophet-wire/dedup"
import { InMemoryNewsRepository } from "@/lib/prophet-wire/repository"
import { RunLogger } from "@/lib/prophet-wire/logger"
import type { NewsItem } from "@/lib/prophet-wire/types"

/**
 * O Dedup é a barreira contra republicar. Se ele deixar passar um hash já visto,
 * a landing repete notícia; se for agressivo demais, engole novidades. Os testes
 * exercitam as três frentes (hash, link, título similar) e o corte no lote.
 */

function item(over: Partial<NewsItem> = {}): NewsItem {
  return {
    slug: "s",
    hash: "sha256:aaa",
    title: "Título",
    subtitle: "",
    summary: "corpo",
    dropcap: "T",
    note: "",
    category: "Notícias",
    subcategory: "",
    tags: [],
    image: { src: null, alt: "a", caption: "" },
    sourceName: "F",
    sourceUrl: "https://f.test/1",
    publishedAt: "2026-07-23",
    status: "publicado",
    ...over,
  }
}

const silent = () => new RunLogger({ echo: false })

describe("titleSimilarity", () => {
  it("1 para idênticos, alto para quase-iguais, baixo para diferentes", () => {
    expect(titleSimilarity("Wingspan ganha expansão", "Wingspan ganha expansão")).toBe(1)
    expect(titleSimilarity("Wingspan ganha expansão", "Wingspan ganha expansao!")).toBeGreaterThan(0.9)
    expect(titleSimilarity("Wingspan ganha expansão", "GMT anuncia novo wargame")).toBeLessThan(0.4)
  })
})

describe("dedup", () => {
  it("passa itens totalmente inéditos", async () => {
    const repo = new InMemoryNewsRepository()
    const res = await dedup([item({ slug: "a", hash: "sha256:1", sourceUrl: "https://f.test/a" })], repo, silent())
    expect(res.unique).toHaveLength(1)
    expect(res.duplicates).toHaveLength(0)
  })

  it("descarta por hash já no acervo", async () => {
    const repo = new InMemoryNewsRepository([item({ slug: "orig", hash: "sha256:dup" })])
    const res = await dedup([item({ slug: "novo", hash: "sha256:dup", sourceUrl: "https://f.test/z" })], repo, silent())
    expect(res.unique).toHaveLength(0)
    expect(res.duplicates[0]).toMatchObject({ reason: "hash", matched: "orig" })
  })

  it("descarta por mesmo link vindo de outra fonte", async () => {
    const repo = new InMemoryNewsRepository([
      item({ slug: "orig", hash: "sha256:x", sourceUrl: "https://portal.test/n1" }),
    ])
    const res = await dedup(
      [item({ slug: "novo", hash: "sha256:y", sourceUrl: "https://portal.test/n1" })],
      repo,
      silent(),
    )
    expect(res.duplicates[0]).toMatchObject({ reason: "link", matched: "orig" })
  })

  it("descarta por título similar (mesmo assunto redigido diferente)", async () => {
    const repo = new InMemoryNewsRepository([
      item({ slug: "orig", hash: "sha256:x", title: "Wingspan ganha nova expansão nórdica", sourceUrl: "https://a.test/1" }),
    ])
    const res = await dedup(
      [item({ slug: "novo", hash: "sha256:y", title: "Wingspan ganha nova expansao nordica", sourceUrl: "https://b.test/2" })],
      repo,
      silent(),
    )
    expect(res.duplicates[0]?.reason).toBe("titulo-similar")
  })

  it("corta duplicados dentro do próprio lote", async () => {
    const repo = new InMemoryNewsRepository()
    const res = await dedup(
      [
        item({ slug: "a", hash: "sha256:1", sourceUrl: "https://f.test/a" }),
        item({ slug: "b", hash: "sha256:1", sourceUrl: "https://f.test/b" }), // mesmo hash
      ],
      repo,
      silent(),
    )
    expect(res.unique).toHaveLength(1)
    expect(res.duplicates).toHaveLength(1)
  })

  it("conta discarded no RunReport", async () => {
    const repo = new InMemoryNewsRepository([item({ slug: "orig", hash: "sha256:dup" })])
    const logger = silent()
    await dedup([item({ hash: "sha256:dup", sourceUrl: "https://f.test/q" })], repo, logger)
    expect(logger.finish().counters.discarded).toBe(1)
  })
})
