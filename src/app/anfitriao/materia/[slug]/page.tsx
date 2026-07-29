import "@/styles/anfitriao-materia.css"

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { materias, getMateria, type MateriaBox } from "@/data/anfitriao-materias"
import { paper } from "@/lib/anfitriao-prophet"

/**
 * PÁGINA INTERNA DA FOLHA.
 *
 * Até aqui o jornal tinha uma folha só: a matéria de capa abria, dava três
 * parágrafos e acabava. Um "continua na pág. II" seria mentira tipográfica,
 * porque a página II não existia.
 *
 * A rota herda do layout de `/anfitriao` o brasão, a linha de data e os
 * cadernos — o leitor não muda de jornal ao virar a página. O que muda é a
 * gramática: a capa é vitrine, esta página é leitura corrida.
 *
 * O CSS é importado AQUI, e não no layout do realm: o Next isola folha por
 * segmento, então a diagramação de página interna não pesa na primeira
 * página, que é a rota crítica do realm.
 */

/** Todas as matérias são conhecidas em build — a folha é fechada, não um feed. */
export function generateStaticParams() {
  return materias.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const m = getMateria(slug)
  if (!m) return { title: "Matéria não encontrada" }
  return {
    title: m.headline,
    description: m.standfirst,
    openGraph: { title: m.headline, description: m.standfirst, type: "article" },
  }
}

/** Caixa de apoio — aceita as três formas do impresso: prosa, lista ou tabela. */
function Box({ box }: { box: MateriaBox }) {
  return (
    <aside className="dpx-mat-box">
      <p className="dpx-mat-box-title">{box.title}</p>
      {box.body?.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
      {box.items && (
        <ul>
          {box.items.map((i) => (
            <li key={i.slice(0, 24)}>{i}</li>
          ))}
        </ul>
      )}
      {box.rows && (
        <dl>
          {box.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </aside>
  )
}

export default async function MateriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const m = getMateria(slug)
  if (!m) notFound()

  return (
    /* `dpx-mat` atravessa a grelha de seis colunas do original; `wrapper`
       aplica a medida e as margens da folha. */
    <article className="dpx-mat wrapper">
      {/* Folio: diz ao leitor onde ele está depois de virar a folha —
          informação que na primeira página o cabeçalho já dava. */}
      <div className="dpx-mat-folio">
        <span>
          <b>{m.caderno}</b>
        </span>
        <span>
          {paper.volume} — Página <b>{m.page}</b>
        </span>
        <span>{paper.price}</span>
      </div>

      {/* A manchete é `h2`, não `h1`. A `h1` do documento é o nome do jornal,
          declarada uma única vez no layout do realm (oculta, em
          `.helper-hide`) — a primeira página segue a mesma regra. Num
          impresso é o correto: a publicação é o documento, a matéria é uma
          seção dele. */}
      <header className="dpx-mat-head">
        <p className="dpx-mat-kicker">{m.kicker}</p>
        <h2>{m.headline}</h2>
        <p className="dpx-mat-subhead">{m.subhead}</p>
        <p className="dpx-mat-byline">
          <b>{m.byline}</b> · {m.bylineRole} · <span className="dpx-mat-dateline">{m.dateline}</span>
        </p>
      </header>

      <p className="dpx-mat-standfirst">{m.standfirst}</p>

      <div className="dpx-mat-body">
        {/* Abertura com capitular. A capitular é `aria-hidden` e a letra volta
            no texto acessível: sem isso o leitor de tela anuncia "H" e depois
            "á um estado intermédio", partindo a palavra ao meio. */}
        <p>
          <span className="dpx-mat-dropcap" aria-hidden>
            {m.dropcap}
          </span>
          <span className="sr-only">{m.dropcap}</span>
          {m.openLine}
        </p>

        {m.blocos.map((bloco, i) => (
          <section key={bloco.subhead ?? i}>
            {/* h3 porque a manchete acima é h2 — o intertítulo é subordinado
                a ela, e pular nível achata o outline do documento. */}
            {bloco.subhead && <h3>{bloco.subhead}</h3>}
            {bloco.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}

            {/* As peças de apoio entram NO MEIO da mancha, como no impresso:
                a gravura depois do primeiro bloco, as caixas distribuídas
                pelos seguintes. Empilhá-las no fim deixaria a leitura sem
                respiro e a página com um bloco morto no pé. */}
            {i === 0 && (
              <figure className="dpx-mat-plate">
                <div className="dpx-mat-plate-frame" aria-hidden>
                  Gravura
                </div>
                <figcaption>
                  {m.figure.caption}
                  <span className="dpx-mat-plate-credit">{m.figure.credit}</span>
                </figcaption>
              </figure>
            )}
            {i === 0 && <p className="dpx-mat-pull">{m.pullquote}</p>}
            {m.boxes[i - 1] && <Box box={m.boxes[i - 1]!} />}
          </section>
        ))}

        {/* Caixas que sobraram, quando há mais caixas que blocos. */}
        {m.boxes.slice(Math.max(0, m.blocos.length - 1)).map((b) => (
          <Box key={b.title} box={b} />
        ))}

        <p className="dpx-mat-sign">{m.sign}</p>
      </div>

      <footer className="dpx-mat-foot">
        <h3 className="dpx-mat-box-title">Nesta Edição, Ainda</h3>
        <ul className="dpx-mat-remissoes">
          {m.remissoes.map((r) => (
            <li key={r.slug}>
              <Link href={`/anfitriao/materia/${r.slug}`}>{r.label}</Link>
            </li>
          ))}
        </ul>
        <div className="dpx-mat-colofao">
          <span>{m.colofao.composta}</span>
          <span>{m.colofao.revisao}</span>
          <span>{m.colofao.chapas}</span>
        </div>
        <Link href="/anfitriao" className="dpx-mat-volta">
          ❦ Voltar à primeira página
        </Link>
      </footer>
    </article>
  )
}
