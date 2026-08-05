import type { Metadata } from "next"
import Link from "next/link"

import { getDevlogs } from "@/lib/repos/dev"
import { DevSection, MetaRow, TagList } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Devlog",
  description:
    "Registro cronológico do que foi construído neste site: decisões que mudaram o rumo do código, na ordem em que aconteceram.",
}

/**
 * DEVLOG — a rota que faltava.
 *
 * O devlog vivia numa faixa de três entradas na home do realm. Quando a home
 * foi reescrita (05/08/2026) a faixa saiu, e o conteúdo ficou órfão: o /admin
 * editava, nenhuma página mostrava. `tests/admin-integridade.test.ts` acusou
 * na hora — e esta rota é a resposta.
 *
 * ## Por que linha do tempo, e não grade de cartões
 *
 * A ordem CARREGA significado aqui: cada entrada marca uma decisão que mudou o
 * rumo do código, e o valor está em ler a sequência. Uma grade sugere itens
 * intercambiáveis — que é exatamente o que um registro histórico não é. Por
 * isso `<ol>` e a régua vertical de `.dv-timeline`, marcação que já existia no
 * realm e ficou sem uso quando a faixa saiu da home.
 *
 * ## Por que o corpo não vem aqui
 *
 * Cada entrada tem markdown longo. Despejar oito de uma vez daria uma página
 * de rolagem infinita onde nada se acha; o resumo é o que decide se vale
 * abrir. O texto completo mora em `[slug]`, que é também o que torna uma
 * entrada citável por link.
 */
export default async function DevlogPage() {
  const devlogs = await getDevlogs()

  const anos = new Set(devlogs.map((d) => d.date.slice(0, 4)))
  /* O acervo é ordenado do mais recente para o mais antigo (o leitor ordena
     por `date` decrescente), então o marco inicial é o último da lista. */
  const primeiro = devlogs[devlogs.length - 1]

  return (
    <>
      <section className="dv-hero" aria-labelledby="devlog-titulo">
        <p className="term">
          <span className="tok-fn">git</span> log <span className="tok-str">--reverse</span>
          <span className="dv-caret" aria-hidden>
            ▌
          </span>
        </p>
        <h1 id="devlog-titulo">
          O que <span className="g">mudou</span>, <span className="c">quando</span> e{" "}
          <span className="p">por quê</span>.
        </h1>
        <p>
          Cada entrada marca uma decisão que mudou o rumo do código — o erro que a motivou, a correção
          e o que ela custou. Não é changelog: changelog lista o que saiu, isto explica por que saiu
          assim.
        </p>
      </section>

      <DevSection
        id="entradas"
        index={1}
        title="Linha do tempo"
        meta={`${devlogs.length} entrada${devlogs.length === 1 ? "" : "s"}`}
        note="Da mais recente para a mais antiga. O resumo decide se vale abrir; o texto inteiro fica na entrada."
      >
        {devlogs.length === 0 ? (
          <p className="dv-empty">Nenhuma entrada ainda — escreva a primeira em /admin/devlogs.</p>
        ) : (
          <ol className="dv-timeline">
            {devlogs.map((d) => (
              <li key={d.id} className="dv-tl-item">
                <time className="dv-tl-date" dateTime={d.date}>
                  {d.date}
                </time>
                <h3>
                  <Link href={`/desenvolvedor/devlog/${d.slug}`}>{d.title}</Link>
                </h3>
                <p className="dv-prose">{d.summary}</p>
                <TagList items={d.tags ?? []} label={`Assuntos de ${d.title}`} />
              </li>
            ))}
          </ol>
        )}
      </DevSection>

      <footer className="dv-section">
        <MetaRow
          items={[
            { k: "entradas", v: devlogs.length },
            { k: "anos", v: anos.size },
            { k: "primeira", v: primeiro?.date ?? "—" },
          ]}
        />
      </footer>
    </>
  )
}
