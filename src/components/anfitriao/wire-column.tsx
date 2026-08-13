import Image from "next/image"

import type { NewsItem } from "@/lib/prophet-wire/types"

/**
 * A GRAVURA — o clichê da folha.
 *
 * ------------------------------------------------------------------
 * POR QUE ESTA PEÇA EXISTE
 * ------------------------------------------------------------------
 * A mesma lógica — "arte real quando houver, moldura vazia quando não" —
 * estava escrita três vezes na página, cada cópia com um conjunto diferente
 * de atributos. Aqui ela é uma peça só.
 *
 * ------------------------------------------------------------------
 * A MOLDURA TEM TAMANHO FIXO, E ISSO É DECISÃO EDITORIAL
 * ------------------------------------------------------------------
 * A arte vem do agregador: URL remota, proporção desconhecida até baixar. Um
 * `<img>` sem dimensão declarada reserva zero altura e empurra a coluna
 * inteira quando a imagem chega — o salto de layout (CLS).
 *
 * A saída não é adivinhar a proporção de cada foto: é a que o impresso já
 * usa. No jornal o clichê é um ESPAÇO RESERVADO na diagramação, de medida
 * fixa, e a foto é recortada para caber nele. Aqui a moldura declara a
 * proporção (`aspect-ratio`) e a arte preenche por `object-fit: cover`.
 *
 * Três coisas caem juntas com isso:
 *   • Não há salto: a altura existe antes de a arte chegar.
 *   • A moldura vazia e a foto ocupam EXATAMENTE o mesmo bloco — a folha se
 *     diagrama igual, com ou sem arte disponível.
 *   • A gravura redonda passa a ser um círculo de verdade. Antes o
 *     `border-radius: 50%` era aplicado sobre a imagem na sua proporção
 *     original: foto não quadrada saía elipse.
 */
export function Plate({
  image,
  sizes,
  shape = "landscape",
}: {
  image: NewsItem["image"]
  /** Largura de exibição por faixa — é o que decide qual arquivo o
      otimizador entrega. Em px porque a folha tem largura máxima: `vw`
      superestimaria em tela grande e baixaria arte maior que a necessária. */
  sizes: string
  shape?: "landscape" | "round"
}) {
  return (
    <div className={`dpx-plate dpx-plate--${shape}`}>
      {image.src ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="dpx-plate-art" />
      ) : (
        <div className="dpx-news-plate" role="img" aria-label={image.alt} />
      )}
    </div>
  )
}

/** Gravura de uma notícia da faixa do Wire, com a sua legenda. */
export function NewsPlate({ news }: { news: NewsItem }) {
  return (
    <figure>
      <Plate image={news.image} sizes="(min-width: 64em) 240px, (min-width: 40em) 45vw, 90vw" />
      {news.image.caption ? <figcaption>{news.image.caption}</figcaption> : null}
    </figure>
  )
}

/** Uma coluna de notícia da faixa automática. */
export function WireColumn({ news }: { news: NewsItem }) {
  return (
    <article className="dpx-news">
      <p>
        <span className="dpx-news-kicker">{news.category}</span>
      </p>
      <h3 className="dpx-news-head">{news.title}</h3>
      {news.subtitle ? <p className="dpx-news-sub">{news.subtitle}</p> : null}

      <NewsPlate news={news} />

      <p className="dpx-news-body">
        <span className="dpx-news-cap">{news.dropcap}</span>
        {news.summary}
      </p>
      {news.note ? <p className="dpx-news-note">{news.note}</p> : null}

      <a
        className="dpx-news-source"
        href={news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {news.sourceName} ↗
      </a>
    </article>
  )
}
