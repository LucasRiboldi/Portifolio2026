import { describe, expect, it } from "vitest"

import {
  resolveImage,
  resolveImages,
  isUsableImageUrl,
  NullImageSearcher,
  CATEGORY_IMAGES,
  type ImageSearcher,
} from "@/lib/prophet-wire/image-resolver"
import { RunLogger } from "@/lib/prophet-wire/logger"
import type { NewsItem } from "@/lib/prophet-wire/types"

/**
 * A cascata de imagem tem quatro degraus e cada um só deve ser alcançado
 * quando o anterior falha. Erros aqui são visíveis na folha: notícia sem arte,
 * ou pior, uma URL hostil embutida como se fosse arte.
 */

function item(over: Partial<NewsItem> = {}): NewsItem {
  return {
    slug: "s",
    hash: "sha256:a",
    title: "Editora anuncia expansão",
    subtitle: "",
    summary: "corpo",
    dropcap: "E",
    note: "",
    category: "Notícias",
    subcategory: "",
    tags: [],
    image: { src: null, alt: "", caption: "" },
    sourceName: "BGG",
    sourceUrl: "https://bgg.test/1",
    publishedAt: "2026-07-23",
    status: "publicado",
    ...over,
  }
}

const silent = () => new RunLogger({ echo: false })

describe("isUsableImageUrl", () => {
  it("aceita https com extensão de imagem e caminhos internos", () => {
    expect(isUsableImageUrl("https://x.test/a.jpg")).toBe(true)
    expect(isUsableImageUrl("https://x.test/a.png?v=2")).toBe(true)
    expect(isUsableImageUrl("/dporiginal/images/mics500.jpg")).toBe(true)
  })

  it("recusa protocolos inseguros ou perigosos", () => {
    expect(isUsableImageUrl("http://x.test/a.jpg")).toBe(false)
    expect(isUsableImageUrl("javascript:alert(1)")).toBe(false)
    expect(isUsableImageUrl("data:image/svg+xml;base64,AAAA")).toBe(false)
  })

  it("recusa vazio, lixo e URL sem cara de imagem", () => {
    expect(isUsableImageUrl(null)).toBe(false)
    expect(isUsableImageUrl("")).toBe(false)
    expect(isUsableImageUrl("   ")).toBe(false)
    expect(isUsableImageUrl("não é url")).toBe(false)
    expect(isUsableImageUrl("https://x.test/artigo")).toBe(false)
  })
})

describe("resolveImage — cascata", () => {
  it("1º degrau: usa a imagem da própria fonte", async () => {
    const r = await resolveImage(
      item({ image: { src: "https://x.test/oficial.jpg", alt: "arte", caption: "" } }),
      { logger: silent() },
    )
    expect(r.provenance).toBe("fonte")
    expect(r.src).toBe("https://x.test/oficial.jpg")
  })

  it("2º degrau: busca quando a fonte não trouxe imagem", async () => {
    const searcher: ImageSearcher = { async search() { return "https://x.test/achada.png" } }
    const r = await resolveImage(item(), { logger: silent(), searcher })
    expect(r.provenance).toBe("busca")
    expect(r.src).toBe("https://x.test/achada.png")
  })

  it("3º degrau: cai no padrão da categoria", async () => {
    const r = await resolveImage(item({ category: "Eventos" }), { logger: silent() })
    expect(r.provenance).toBe("categoria")
    expect(r.src).toBe(CATEGORY_IMAGES["Eventos"]?.src)
  })

  it("imagem de categoria descreve a FOTO, não a notícia, e avisa que é ilustrativa", async () => {
    // O ALT do item falava de pavilhões de feira; a foto padrão é um céu
    // tempestuoso. Quem usa leitor de tela precisa ouvir o que está na tela.
    const r = await resolveImage(
      item({
        category: "Eventos",
        image: {
          src: null,
          alt: "Pavilhões de feira enfileirados sob bandeiras",
          caption: "Fig. — Os pavilhões de Essen, prontos para a temporada.",
        },
      }),
      { logger: silent() },
    )
    expect(r.alt).toBe(CATEGORY_IMAGES["Eventos"]?.alt)
    expect(r.alt).not.toContain("Pavilhões")
    // A legenda autoral é descartada: sob foto de arquivo ela afirmaria que
    // aquilo retrata o fato noticiado.
    expect(r.caption).toBe("Imagem ilustrativa.")
    expect(r.caption).not.toContain("Essen")
  })

  it("a legenda autoral é preservada no degrau da gravura", async () => {
    const r = await resolveImage(
      item({
        category: "Notícias",
        image: { src: null, alt: "arca de moedas", caption: "Fig. — A arca comum." },
      }),
      { logger: silent() },
    )
    expect(r.provenance).toBe("gravura")
    expect(r.caption).toBe("Fig. — A arca comum.")
    expect(r.alt).toBe("arca de moedas")
  })

  it("4º degrau: gravura vazia quando a categoria não tem arte", async () => {
    const r = await resolveImage(item({ category: "Notícias" }), { logger: silent() })
    expect(r.provenance).toBe("gravura")
    expect(r.src).toBeNull()
  })

  it("descarta imagem da fonte inválida e segue a cascata", async () => {
    const r = await resolveImage(
      item({ category: "Eventos", image: { src: "http://inseguro.test/a.jpg", alt: "", caption: "" } }),
      { logger: silent() },
    )
    expect(r.provenance).toBe("categoria")
  })

  it("não quebra se o buscador lançar", async () => {
    const searcher: ImageSearcher = { async search() { throw new Error("api fora") } }
    const r = await resolveImage(item({ category: "Eventos" }), { logger: silent(), searcher })
    expect(r.provenance).toBe("categoria")
  })

  it("o buscador nulo sempre leva ao degrau seguinte", async () => {
    const r = await resolveImage(item({ category: "Prêmios" }), {
      logger: silent(),
      searcher: new NullImageSearcher(),
    })
    expect(r.provenance).toBe("categoria")
  })
})

describe("resolveImage — acessibilidade", () => {
  it("nunca devolve ALT vazio", async () => {
    const r = await resolveImage(item({ image: { src: null, alt: "", caption: "" } }), {
      logger: silent(),
    })
    expect(r.alt.trim().length).toBeGreaterThan(0)
    expect(r.alt).toContain("Editora anuncia expansão")
  })

  it("preserva o ALT existente", async () => {
    const r = await resolveImage(item({ image: { src: null, alt: "meu alt", caption: "" } }), {
      logger: silent(),
    })
    expect(r.alt).toBe("meu alt")
  })

  it("credita a fonte na legenda quando a arte veio dela", async () => {
    const r = await resolveImage(
      item({ image: { src: "https://x.test/a.jpg", alt: "a", caption: "" } }),
      { logger: silent() },
    )
    expect(r.caption).toContain("BGG")
  })

  it("preserva legenda já escrita", async () => {
    const r = await resolveImage(
      item({ image: { src: "https://x.test/a.jpg", alt: "a", caption: "Fig. I — original" } }),
      { logger: silent() },
    )
    expect(r.caption).toBe("Fig. I — original")
  })
})

describe("resolveImages", () => {
  it("aplica a arte no lote sem vazar o campo de proveniência", async () => {
    const out = await resolveImages([item({ category: "Eventos" }), item({ slug: "b" })], {
      logger: silent(),
    })
    expect(out).toHaveLength(2)
    expect(out[0]?.image.src).toBe(CATEGORY_IMAGES["Eventos"]?.src)
    expect("provenance" in (out[0]?.image ?? {})).toBe(false)
  })
})
