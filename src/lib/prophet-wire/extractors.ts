import type { ParsedItem } from "./parser"

/**
 * Extractors de HTML — para fontes que não publicam feed.
 *
 * ------------------------------------------------------------------
 * POR QUE EXISTE, E POR QUE É O ÚLTIMO RECURSO
 * ------------------------------------------------------------------
 * O caminho normal é RSS/Atom: estruturado, estável, barato. Um extractor lê
 * marcação feita para olhos humanos, então **quebra quando o site muda de
 * layout** — e quebra em silêncio, devolvendo lista vazia em vez de erro.
 *
 * Por isso cada um vive atrás de uma fixture de HTML real em
 * `tests/prophet-wire/fixtures/`: quando a extração parar de achar nada, o
 * teste diz se a culpa é do nosso seletor ou do site.
 *
 * Só escreva um extractor depois de confirmar que não há feed. Para o
 * `uk-games-expo` isso foi medido em 05/08/2026: `/feed/`, `/rss`, `/feed.xml`
 * e `/news/rss.xml` respondem 404, e a página não anuncia `<link
 * rel="alternate">` nenhum.
 */

/** Um extractor recebe o HTML cru e devolve itens no mesmo formato do feed. */
export type Extractor = (html: string, sourceId: string) => ParsedItem[]

/** Decodifica as entidades HTML que aparecem em título e resumo. */
function decodificar(texto: string): string {
  return texto
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&#8217;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&ndash;/g, "–")
}

/** Tira tags, normaliza espaço e decodifica. */
function texto(bruto: string): string {
  return decodificar(bruto.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim()
}

const MESES: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
}

/**
 * `"30 July, 2026"` → `"2026-07-30T00:00:00.000Z"`.
 *
 * Meia-noite UTC porque a listagem não informa hora. Isso torna o item **mais
 * velho** do que talvez seja, nunca mais novo — e errar para o lado velho é o
 * certo aqui: a janela de 24h prefere perder um item recente a republicar um
 * antigo. Devolve `null` no que não reconhecer, e `withinWindow` descarta.
 */
export function dataUkge(bruto: string): string | null {
  const m = /(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})/.exec(bruto.trim())
  if (!m) return null

  const dia = Number(m[1])
  const mes = MESES[m[2]!.toLowerCase()]
  const ano = Number(m[3])
  if (!mes || dia < 1 || dia > 31) return null

  const d = new Date(Date.UTC(ano, mes - 1, dia))
  // Rejeita data impossível que o Date "conserta" sozinho (31 de fevereiro
  // viraria 3 de março sem este confronto).
  if (d.getUTCDate() !== dia || d.getUTCMonth() !== mes - 1) return null
  return d.toISOString()
}

const BASE_UKGE = "https://www.ukgamesexpo.co.uk"

/** Resolve caminho relativo contra o domínio da fonte. */
function absoluta(href: string, base: string): string {
  if (/^https?:\/\//i.test(href)) return href
  return `${base}${href.startsWith("/") ? "" : "/"}${href}`
}

/**
 * UK Games Expo — listagem de `/content/news/`.
 *
 * Cada notícia é um cartão que começa em `div.flex.flex-col.shadow-md` e traz,
 * nesta ordem: link com `<img>`, data em `div.text-gray-500`, título em
 * `<h2><a>`, e resumo em `<p>`.
 *
 * Fatiar pelo `<div>` de abertura, e não casar um regex sobre a página toda,
 * é o que impede o título de um cartão parear com a data do seguinte quando
 * um deles vier sem algum campo.
 */
export const extrairUkge: Extractor = (html, sourceId) => {
  const cartoes = html.split('<div class="flex flex-col shadow-md">').slice(1)

  return cartoes.flatMap((cartao): ParsedItem[] => {
    const titulo = /<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(cartao)
    // Sem título ou sem link não há notícia — cartão de propaganda, por exemplo.
    if (!titulo) return []

    const data = /text-gray-500[^>]*>\s*([^<]+?)\s*<\/div>/i.exec(cartao)
    const resumo = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(cartao)
    const imagem = /<img[^>]*\ssrc="([^"]+)"/i.exec(cartao)

    return [
      {
        sourceId,
        title: texto(titulo[2]!),
        link: absoluta(titulo[1]!, BASE_UKGE),
        publishedAt: data ? dataUkge(data[1]!) : null,
        summary: resumo ? texto(resumo[1]!) : "",
        imageUrl: imagem ? absoluta(imagem[1]!, BASE_UKGE) : null,
      },
    ]
  })
}

/**
 * Extractor por id de fonte. `parsePayload` consulta este mapa antes de
 * desistir de um payload sem `<item>`/`<entry>`.
 */
export const EXTRACTORS: Readonly<Record<string, Extractor>> = {
  "uk-games-expo": extrairUkge,
}
