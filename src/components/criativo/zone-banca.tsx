import type { Comic } from "@/lib/repos/criativo"
import { Bubble, Onoma, Stars } from "@/components/comic/atoms"
import { ComicBook } from "@/components/comic/comic-book"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { spanVars } from "@/design-system/comic-layout"
import { panelGridClass } from "@/components/layout/comic/panel-grid"
import { ZONES } from "@/constants/criativo-landing"

/** Rótulo e cor de cada status — a etiqueta colada na capa. */
const STATUS: Record<string, { label: string; bg: string }> = {
  lendo: { label: "Lendo agora", bg: "var(--k-red)" },
  lido: { label: "Lido", bg: "var(--k-blue)" },
  fila: { label: "Na fila", bg: "var(--k-violet)" },
  largado: { label: "Larguei", bg: "var(--k-ink)" },
}

/**
 * Capítulo 03 · Banca — as capas na prateleira.
 *
 * Aqui os exemplares não são requadros: são livros. Cada um tem contracapa,
 * miolo de três folhas e uma capa que abre alguns graus sobre a lombada quando
 * o ponteiro chega ({@link ComicBook}). Um requadro plano servia para catalogar;
 * a estante devia parecer que dá para pegar num deles — que é a diferença entre
 * uma lista de leituras e uma banca.
 *
 * Sem `Panel`, e de propósito: a moldura de tinta faria dois contornos à volta
 * da mesma capa e mataria a espessura do volume. A ligação ao sistema fica na
 * grelha (dois quadros por livro, seis por fila) e na tinta da própria capa.
 *
 * A legenda vai por baixo, como a etiqueta da prateleira — e não dentro de um
 * rodapé, que voltaria a fechar o livro numa caixa.
 */
/** Colunas ocupadas por exemplar — lombadas têm todas a mesma largura. */
const LOMBADA = 2

export function ZoneBanca({ comics }: { comics: Comic[] }) {
  const { id, ...meta } = ZONES.banca

  /**
   * Coluna onde a primeira lombada começa, para a estante ficar centrada.
   * Só vale enquanto a fila couber numa tira: passando disso, a grelha quebra
   * a linha sozinha e o deslocamento deixaria a segunda fila torta.
   */
  const ocupa = comics.length * LOMBADA
  const recuo = ocupa < 12 ? Math.floor((12 - ocupa) / 2) + 1 : undefined

  return (
    <Chapter id={id} palette={id} scene="skew" {...meta}>
      {/*
        A banca é prateleira, não grelha editorial: os livros têm largura
        igual porque são lombadas, e por isso este é o único capítulo que
        não passa por `compose()` — impor larguras diferentes a exemplares
        do mesmo tamanho desfaria a leitura de "estante".

        O que se corrige é outra coisa: cinco lombadas de 2/12 somam 10, e as
        duas colunas que sobravam ficavam TODAS à direita — a estante parecia
        interrompida a três quartos. Centrada, a folga divide-se pelas duas
        margens e lê-se como o que é: uma prateleira com espaço nas pontas.
      */}
      <RevealGroup as="ul" className={panelGridClass({ className: "justify-center gap-y-12" })}>
        {comics.map((c, i) => (
          <RevealItem
            key={c.id}
            as="li"
            variants={PANEL_IN}
            className="cp-col"
            style={{
              ...spanVars({ base: 2, sm: 2, lg: LOMBADA }),
              ...(i === 0 && recuo ? { gridColumnStart: recuo } : {}),
            }}
          >
            <ComicBook
              title={c.title}
              cover={c.cover_image}
              sticker={STATUS[c.status] ?? STATUS.lendo}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
            >
              <h3 className="k-title text-lg leading-tight">{c.title}</h3>
              <p className="k-sub mt-1 text-[10px] opacity-65">
                {c.author}
                {c.publisher && ` · ${c.publisher}`}
              </p>
              <Stars value={c.rating} className="mt-2 block" />
              {c.note && <p className="k-body mt-2 text-xs leading-relaxed opacity-75">{c.note}</p>}
            </ComicBook>
          </RevealItem>
        ))}
      </RevealGroup>

      <Bubble className="k-tilt-l mt-12 max-w-md">
        A pilha da cabeceira cresce mais rápido do que eu leio. Está sob controle.
      </Bubble>

      <Onoma
        accent="blue"
        className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block"
      >
        FLIP!
      </Onoma>
    </Chapter>
  )
}
