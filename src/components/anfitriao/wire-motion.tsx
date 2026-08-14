"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import type { NewsItem } from "@/lib/prophet-wire/types"
import { Plate } from "@/components/anfitriao/wire-column"

/**
 * A FAIXA DO TELÉGRAFO, com movimento.
 *
 * ## Por que as colunas viraram componente de cliente, e as seções não
 *
 * As `<section>` da folha são filhas DIRETAS da grelha de seis colunas do
 * original (o `<main>` é `display: contents` justamente para isso). Embrulhar
 * uma delas num `<motion.div>` acrescentaria uma caixa no meio da grelha e
 * desmancharia a diagramação. As colunas do Wire, não: vivem dentro de
 * `.dpx-wire-grid`, então podem animar sem que a folha se mexa.
 *
 * É também por isso que o movimento desta página mora nos COMPONENTES e não
 * nas zonas — a restrição é de layout, não de gosto.
 *
 * ## O vocabulário do movimento aqui é o do impresso
 *
 * Jornal de 1920 não salta nem pulsa. Os valores são deliberadamente curtos —
 * 3px de elevação, 1,5° de inclinação no recorte — porque o que se quer imitar
 * é papel sendo levantado da mesa, não um cartão de aplicativo. Mola em vez de
 * curva fixa porque papel tem inércia: `stiffness` alto e `damping` alto dão o
 * assentamento seco de uma folha que encosta.
 *
 * ## O que a `procedência` faz aqui
 *
 * Ela MONTA no hover/foco e DESMONTA na saída — é o caso legítimo de
 * `AnimatePresence`, que existe para animar o que sai da árvore. Não esconde
 * nada: a fonte continua impressa no rodapé da coluna, como sempre esteve.
 * A tarja é acréscimo, não substituição — regra da folha é que conteúdo não
 * desaparece atrás de interação.
 *
 * O `layout` no `<article>` é a consequência: a tarja muda a altura da coluna,
 * e sem ele as colunas vizinhas dariam um salto seco. Com ele, a grelha
 * reacomoda em FLIP.
 */

/** Mola única da folha: assentamento seco, sem balanço de brinquedo. */
const PAPEL = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
} as const

/** Entrada: sobe pouco e não apaga texto — a leitura nunca espera o motor. */
const ENTRADA = {
  oculto: { opacity: 0, y: 14 },
  posto: { opacity: 1, y: 0 },
} as const

export function WireGrid({ news }: { news: NewsItem[] }) {
  return (
    <div className="dpx-wire-grid">
      {news.map((n, i) => (
        <WireColumnMotion key={n.slug} news={n} indice={i} />
      ))}
    </div>
  )
}

function WireColumnMotion({ news, indice }: { news: NewsItem; indice: number }) {
  const reduzido = useReducedMotion()
  const [aberta, setAberta] = useState(false)

  /* Movimento reduzido não é "menos": é nenhum. Mas a ÁRVORE tem de ser a
     mesma nos dois casos — `useReducedMotion` só sabe a resposta no cliente, e
     devolver marcação diferente daria erro de hidratação. Por isso o que muda
     são as props, nunca os elementos. */
  return (
    <motion.article
      layout={!reduzido}
      className="dpx-news"
      variants={ENTRADA}
      initial={reduzido ? false : "oculto"}
      whileInView={reduzido ? undefined : "posto"}
      // `once`: a entrada é chegada, não vaivém. Reanimar ao subir a página
      // transformaria a leitura em gangorra.
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        ...PAPEL,
        // Cascata curta: acima de ~250 ms no último item a faixa parece lenta.
        delay: Math.min(indice * 0.06, 0.28),
      }}
      whileHover={reduzido ? undefined : { y: -3, rotate: -0.4 }}
      onHoverStart={() => setAberta(true)}
      onHoverEnd={() => setAberta(false)}
      onFocusCapture={() => setAberta(true)}
      onBlurCapture={() => setAberta(false)}
    >
      <Corpo news={news} />

      <AnimatePresence initial={false}>
        {aberta && (
          <motion.p
            key="procedencia"
            className="dpx-news-wireline"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            // `height` não é propriedade de GPU, e aqui é proposital: é o que
            // o `layout` do artigo precisa medir para reacomodar a grelha. O
            // custo é de uma tarja de uma linha, não de um bloco de leitura.
            transition={reduzido ? { duration: 0 } : PAPEL}
          >
            Do telégrafo — {news.sourceName}
          </motion.p>
        )}
      </AnimatePresence>

      <Procedencia news={news} reduzido={!!reduzido} />
    </motion.article>
  )
}

/** O miolo impresso da coluna — idêntico ao que a versão estática publica. */
function Corpo({ news }: { news: NewsItem }) {
  return (
    <>
      <p>
        <span className="dpx-news-kicker">{news.category}</span>
      </p>
      <h3 className="dpx-news-head">{news.title}</h3>
      {news.subtitle ? <p className="dpx-news-sub">{news.subtitle}</p> : null}

      <figure>
        <Plate image={news.image} sizes="(min-width: 64em) 240px, (min-width: 40em) 45vw, 90vw" />
        {news.image.caption ? <figcaption>{news.image.caption}</figcaption> : null}
      </figure>

      <p className="dpx-news-body">
        <span className="dpx-news-cap">{news.dropcap}</span>
        {news.summary}
      </p>
      {news.note ? <p className="dpx-news-note">{news.note}</p> : null}
    </>
  )
}

/** A fonte, sempre impressa. `whileTap` dá o aviso de que o link saiu. */
function Procedencia({ news, reduzido }: { news: NewsItem; reduzido: boolean }) {
  return (
    <motion.a
      className="dpx-news-source"
      href={news.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={reduzido ? undefined : { x: 2 }}
      whileTap={reduzido ? undefined : { scale: 0.96 }}
      transition={PAPEL}
    >
      {news.sourceName} ↗
    </motion.a>
  )
}
