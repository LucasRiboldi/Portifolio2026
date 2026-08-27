import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { describe, expect, it } from "vitest"

import { extrairUkge, dataUkge, extrairPlaidHat, dataPlaidHat, EXTRACTORS } from "@/lib/prophet-wire/extractors"
import { parsePayload } from "@/lib/prophet-wire/parser"
import { RunLogger } from "@/lib/prophet-wire/logger"
import type { RawPayload } from "@/lib/prophet-wire/collector"
import type { Source } from "@/lib/prophet-wire/types"

/**
 * Extractor do UK Games Expo.
 *
 * ------------------------------------------------------------------
 * POR QUE ESTA FONTE PRECISA DE UM
 * ------------------------------------------------------------------
 * Medido em 05/08/2026: `/feed/`, `/rss`, `/feed.xml` e `/news/rss.xml` todos
 * respondem 404, e a página de notícias não anuncia `<link rel="alternate">`.
 * Não há feed — só a listagem em HTML.
 *
 * A fixture é recorte de HTML REAL da página, não marcação inventada. É o que
 * dá valor ao teste: quando o UKGE mudar o layout, a extração para de achar
 * item, e comparar a página nova com esta fixture diz se a culpa é do site ou
 * do nosso seletor.
 */

const here = dirname(fileURLToPath(import.meta.url))
const html = readFileSync(join(here, "fixtures", "ukge-news.html"), "utf-8")
const plaidHatHtml = readFileSync(join(here, "fixtures", "plaidhat-news.html"), "utf-8")

const source: Source = {
  id: "uk-games-expo",
  name: "UK Games Expo",
  url: "https://www.ukgamesexpo.co.uk/content/news/",
  kind: "html",
  defaultCategory: "Eventos",
  enabled: true,
}

describe("dataUkge", () => {
  it("lê o formato da listagem", () => {
    expect(dataUkge("30 July, 2026")).toBe("2026-07-30T00:00:00.000Z")
    expect(dataUkge("15 July, 2026")).toBe("2026-07-15T00:00:00.000Z")
  })

  it("aceita sem vírgula e com espaço sobrando", () => {
    expect(dataUkge("  1 September 2026 ")).toBe("2026-09-01T00:00:00.000Z")
  })

  it("devolve null no que não reconhece", () => {
    // `withinWindow` descarta item sem data — devolver null é o que impede
    // uma data inventada virar notícia "de hoje".
    expect(dataUkge("ontem")).toBeNull()
    expect(dataUkge("")).toBeNull()
    expect(dataUkge("30 Julho, 2026")).toBeNull()
  })

  it("rejeita data impossível em vez de deixar o Date corrigir", () => {
    // Sem o confronto, `Date.UTC(2026, 1, 31)` viraria 3 de março em silêncio.
    expect(dataUkge("31 February, 2026")).toBeNull()
  })
})

describe("extrairUkge", () => {
  const itens = extrairUkge(html, "uk-games-expo")

  it("acha os dois cartões da fixture", () => {
    expect(itens).toHaveLength(2)
  })

  it("extrai título, link absoluto e data", () => {
    expect(itens[0]).toMatchObject({
      sourceId: "uk-games-expo",
      title: "UKGE Directors Head to Gen Con",
      link: "https://www.ukgamesexpo.co.uk/content/news/ukge-directors-head-to-gen-con/",
      publishedAt: "2026-07-30T00:00:00.000Z",
    })
  })

  it("torna o link absoluto — o HTML traz caminho relativo", () => {
    // Relativo quebraria a proveniência: a URL vai para o Firestore e é
    // clicada de fora do site do UKGE.
    for (const item of itens) {
      expect(item.link.startsWith("https://www.ukgamesexpo.co.uk/")).toBe(true)
    }
  })

  it("traz resumo e imagem quando o cartão tem", () => {
    expect(itens[0]!.summary.length).toBeGreaterThan(0)
    expect(itens[0]!.imageUrl).toMatch(/^https?:\/\//)
  })

  it("não pareia campos de cartões diferentes", () => {
    // O corte por cartão existe para isto: um regex sobre a página inteira
    // casaria o título de um com a data do seguinte.
    expect(itens[1]!.title).toBe("UKGE trip to Berlin Brettspiel Con")
    expect(itens[1]!.publishedAt).toBe("2026-07-15T00:00:00.000Z")
  })

  it("ignora bloco sem título em vez de emitir item vazio", () => {
    const sujo = '<div class="flex flex-col shadow-md"><div>propaganda</div></div>'
    expect(extrairUkge(sujo, "uk-games-expo")).toEqual([])
  })

  it("devolve lista vazia — não lança — em HTML irreconhecível", () => {
    expect(extrairUkge("<html><body>nada</body></html>", "uk-games-expo")).toEqual([])
  })
})

describe("parsePayload usa o extractor só quando não há feed", () => {
  const payload = (body: string): RawPayload => ({
    source,
    fetchedAt: new Date().toISOString(),
    ok: true,
    body,
    status: 200,
  })

  it("extrai do HTML quando o payload não tem <item>/<entry>", () => {
    const itens = parsePayload(payload(html), new RunLogger({ echo: false }))
    expect(itens).toHaveLength(2)
    expect(itens[0]!.title).toBe("UKGE Directors Head to Gen Con")
  })

  it("prefere o feed se um dia a fonte publicar um", () => {
    // A ordem é o que dispensa alguém lembrar de desligar o extractor no dia
    // em que o site ganhar RSS.
    const rss = `<rss><channel><item>
      <title>Do feed</title><link>https://x.test/1</link>
      <pubDate>Mon, 04 Aug 2026 10:00:00 +0000</pubDate>
    </item></channel></rss>`

    const itens = parsePayload(payload(rss), new RunLogger({ echo: false }))
    expect(itens).toHaveLength(1)
    expect(itens[0]!.title).toBe("Do feed")
  })

  it("avisa quando o extractor não acha nada — sinal de layout mudado", () => {
    const logger = new RunLogger({ echo: false })
    parsePayload(payload("<html><body>outra coisa</body></html>"), logger)

    const avisos = logger.finish().entries.filter((e) => e.level === "warn")
    expect(avisos.some((a) => a.message.includes("layout da fonte pode ter mudado"))).toBe(true)
  })
})

describe("dataPlaidHat", () => {
  it("lê a data embutida no caminho da URL", () => {
    // A listagem não traz data em texto — só o próprio link tem.
    expect(dataPlaidHat("/news/2026/08/18/the-monolith-is-now-live-on-kickstarter/")).toBe(
      "2026-08-18T00:00:00.000Z",
    )
  })

  it("devolve null sem o padrão /news/AAAA/MM/DD/", () => {
    expect(dataPlaidHat("/news/sobre-nos/")).toBeNull()
    expect(dataPlaidHat("")).toBeNull()
  })

  it("rejeita data impossível em vez de deixar o Date corrigir", () => {
    expect(dataPlaidHat("/news/2026/02/31/x/")).toBeNull()
  })
})

describe("extrairPlaidHat", () => {
  const itens = extrairPlaidHat(plaidHatHtml, "plaid-hat")

  it("acha os quatro cartões da fixture", () => {
    expect(itens).toHaveLength(4)
  })

  it("extrai título, link absoluto, data e imagem", () => {
    expect(itens[0]).toMatchObject({
      sourceId: "plaid-hat",
      title: "The Monolith is Now Live on Kickstarter",
      link: "https://www.plaidhatgames.com/news/2026/08/18/the-monolith-is-now-live-on-kickstarter/",
      publishedAt: "2026-08-18T00:00:00.000Z",
    })
    expect(itens[0]!.imageUrl).toMatch(/^https:\/\/media\.plaidhatgames\.com\//)
  })

  it("não pareia campos de cartões diferentes mesmo com contagem de categorias variável", () => {
    // O quarto cartão tem 4 categorias contra 1 dos outros — se o corte por
    // cartão falhasse, o título dele vazaria pro cartão seguinte (ou vice-versa).
    expect(itens[3]!.title).toBe("New Titles from Plaid Hat Games!")
    expect(itens[3]!.link).toBe("https://www.plaidhatgames.com/news/2026/07/23/new-titles-from-plaid-hat-games/")
  })

  it("devolve lista vazia — não lança — em HTML irreconhecível", () => {
    expect(extrairPlaidHat("<html><body>nada</body></html>", "plaid-hat")).toEqual([])
  })
})

describe("registry", () => {
  it("o id registrado é o mesmo do registry de fontes", () => {
    // Um id torto aqui faria o extractor nunca rodar, em silêncio.
    expect(Object.keys(EXTRACTORS)).toContain("uk-games-expo")
    expect(Object.keys(EXTRACTORS)).toContain("plaid-hat")
  })
})
