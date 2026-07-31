/**
 * PROPHET WIRE — resolução de imagem (Parte 14).
 *
 * A regra do spec, em ordem:
 *   1. usar a imagem oficial da notícia, quando a fonte a entrega;
 *   2. não havendo, pesquisar a imagem oficial;
 *   3. não encontrando, usar a imagem padrão da categoria.
 *
 * O passo 2 depende de um serviço de busca de imagens, que este projeto ainda
 * não tem. Em vez de fingir, ele é uma INTERFACE (`ImageSearcher`) com uma
 * implementação nula — mesmo padrão do `AIClient`: quando não há serviço, o
 * fluxo cai para o passo 3 sem travar. Plugar um buscador de verdade depois não
 * exige tocar em mais nada.
 *
 * Sobre imagens remotas: só aceitamos `https`.
 *
 * Este bloco já afirmou que o navegador do leitor revelava o IP dele ao domínio
 * da fonte. **Não revela** (verificado em produção em 31/07/2026): as artes são
 * renderizadas pelo `next/image` (o `Plate` em `app/anfitriao/page.tsx`), e o
 * otimizador do Next busca a imagem NO SERVIDOR e a serve pelo nosso domínio.
 * A página do anfitrião trazia 43 URLs `/_next/image` e nenhuma apontando para
 * host externo.
 *
 * O que continua verdade é a fragilidade: o dono da imagem pode trocar ou
 * remover o arquivo, e aí a arte some. Baixar e reservir pelo Blob resolveria
 * isso — mas é durabilidade, não privacidade, e não urge.
 */

import type { NewsCategory, NewsImage, NewsItem } from "./types"
import type { Logger } from "./logger"

/** De onde veio a arte — registrado para o painel e para auditoria. */
export type ImageProvenance = "fonte" | "busca" | "categoria" | "gravura"

export interface ResolvedImage extends NewsImage {
  provenance: ImageProvenance
}

/**
 * Contrato de busca de imagem oficial. `search` devolve uma URL ou `null`
 * quando não encontra (ou quando não há serviço configurado).
 */
export interface ImageSearcher {
  search(query: string): Promise<string | null>
}

/** Buscador nulo — o padrão enquanto não houver serviço de busca. */
export class NullImageSearcher implements ImageSearcher {
  async search(): Promise<string | null> {
    return null
  }
}

/**
 * Imagens padrão por categoria.
 *
 * O acervo local tem apenas três fotografias (`tornado`, `mics`, `potions`),
 * herdadas do layout original. Mapear dezesseis categorias em três fotos seria
 * repetição gratuita, então só recebem imagem as categorias em que a foto tem
 * leitura editorial defensável:
 *
 *   mics    — fala pública: anúncios de editora, prêmios, entrevistas;
 *   tornado — comoção e movimento: eventos, mercado, rumores;
 *   potions — objetos sobre a mesa: lançamentos, expansões, reimpressões.
 *
 * As demais ficam com `null` e caem na gravura vazia, que no impresso é um
 * recurso legítimo — a folha nem sempre tinha foto. Quando houver arte própria,
 * basta acrescentar aqui.
 */
export interface DefaultArt {
  src: string
  /**
   * Descrição do que a FOTO mostra — não do que a notícia trata.
   *
   * Isto não é preciosismo: o ALT herdado do item descrevia a ilustração
   * imaginada ("pavilhões de feira enfileirados"), enquanto a foto padrão é um
   * tornado. Quem usa leitor de tela ouviria uma descrição de algo que não está
   * na tela. Imagem genérica exige ALT da imagem genérica.
   */
  alt: string
}

const ART = {
  mics: {
    src: "/dporiginal/images/mics500.jpg",
    alt: "Fotografia de microfones enfileirados numa coletiva de imprensa",
  },
  tornado: {
    src: "/dporiginal/images/tornado508.jpg",
    alt: "Fotografia de um céu tempestuoso sobre campo aberto",
  },
  potions: {
    src: "/dporiginal/images/potions200.jpg",
    alt: "Fotografia de frascos de vidro alinhados sobre uma superfície",
  },
} as const satisfies Record<string, DefaultArt>

export const CATEGORY_IMAGES: Partial<Record<NewsCategory, DefaultArt>> = {
  Editoras: ART.mics,
  Designers: ART.mics,
  Prêmios: ART.mics,
  Eventos: ART.tornado,
  Mercado: ART.tornado,
  Rumores: ART.tornado,
  Lançamentos: ART.potions,
  Expansões: ART.potions,
  Reimpressões: ART.potions,
}

/** Extensões que aceitamos como imagem. */
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i

/**
 * Uma URL de imagem é utilizável? Exige https (nada de `http`, `data:` ou
 * `javascript:`) e um caminho que se pareça com arquivo de imagem.
 *
 * Caminhos internos (começando com `/`) são sempre aceitos: são nossos.
 */
export function isUsableImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  const value = url.trim()
  if (!value) return false
  if (value.startsWith("/")) return true

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return false
  }
  if (parsed.protocol !== "https:") return false
  // Alguns CDNs servem imagem sem extensão; aceitamos quando o caminho a tem,
  // e recusamos o resto para não embutir uma página HTML como se fosse arte.
  return IMAGE_EXT.test(parsed.pathname)
}

/** ALT nunca pode ficar vazio — sem ele a notícia é opaca no leitor de tela. */
function ensureAlt(item: NewsItem): string {
  const alt = item.image.alt?.trim()
  if (alt) return alt
  return item.title ? `Ilustração da notícia: ${item.title}` : "Ilustração da notícia"
}

/** Legenda: mantém a existente; se não houver, credita a fonte. */
function ensureCaption(item: NewsItem, provenance: ImageProvenance): string {
  const caption = item.image.caption?.trim()
  if (caption) return caption
  if (provenance === "fonte" || provenance === "busca") {
    return item.sourceName ? `Fig. — Imagem: ${item.sourceName}.` : ""
  }
  return ""
}

export interface ImageResolverDeps {
  logger: Logger
  /** Buscador de imagem oficial. Default: nenhum (`NullImageSearcher`). */
  searcher?: ImageSearcher
}

/**
 * Aplica a cascata do spec e devolve a imagem resolvida, com a proveniência.
 * Nunca lança: uma busca que falhe apenas leva ao próximo passo.
 */
export async function resolveImage(
  item: NewsItem,
  deps: ImageResolverDeps,
): Promise<ResolvedImage> {
  const { logger } = deps
  const searcher = deps.searcher ?? new NullImageSearcher()

  // 1) A imagem que veio da própria notícia.
  if (isUsableImageUrl(item.image.src)) {
    return {
      src: item.image.src,
      alt: ensureAlt(item),
      caption: ensureCaption(item, "fonte"),
      provenance: "fonte",
    }
  }

  if (item.image.src) {
    logger.debug("imagem da fonte recusada", { slug: item.slug, src: item.image.src })
  }

  // 2) Busca da imagem oficial.
  try {
    const query = [item.title, item.publisher].filter(Boolean).join(" ")
    const found = await searcher.search(query)
    if (isUsableImageUrl(found)) {
      logger.debug("imagem obtida por busca", { slug: item.slug })
      return {
        src: found,
        alt: ensureAlt(item),
        caption: ensureCaption(item, "busca"),
        provenance: "busca",
      }
    }
  } catch (err) {
    logger.warn("busca de imagem falhou", { slug: item.slug, error: String(err) })
  }

  // 3) Padrão da categoria. O ALT descreve a FOTO, não a notícia — ver
  //    `DefaultArt.alt` —, e a legenda avisa que a imagem é ilustrativa, para
  //    o leitor não a tomar por registro do fato noticiado.
  const byCategory = CATEGORY_IMAGES[item.category]
  if (byCategory) {
    return {
      src: byCategory.src,
      alt: byCategory.alt,
      /**
       * A legenda escrita para o item é DESCARTADA aqui, de propósito. Ela foi
       * redigida para a arte que a notícia teria ("Os pavilhões de Essen,
       * prontos para a temporada") e, sob uma foto genérica de céu tempestuoso,
       * afirmaria ao leitor que aquilo é um registro do fato. Foto de arquivo
       * se anuncia como tal. A legenda autoral volta a valer no degrau da
       * gravura, onde descreve de fato o que se vê.
       */
      caption: "Imagem ilustrativa.",
      provenance: "categoria",
    }
  }

  // 4) Sem arte: a gravura vazia, que a folha sabe desenhar.
  return {
    src: null,
    alt: ensureAlt(item),
    caption: ensureCaption(item, "gravura"),
    provenance: "gravura",
  }
}

/** Resolve a imagem de um lote, devolvendo os itens já com a arte aplicada. */
export async function resolveImages(
  items: readonly NewsItem[],
  deps: ImageResolverDeps,
): Promise<NewsItem[]> {
  const out: NewsItem[] = []
  for (const item of items) {
    const { provenance, ...image } = await resolveImage(item, deps)
    void provenance
    out.push({ ...item, image })
  }
  return out
}
