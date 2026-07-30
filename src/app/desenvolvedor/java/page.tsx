import type { Metadata } from "next"

import { javaCheatSheets, javaRoadmap } from "@/data/dev"
import { TrilhaJava } from "@/components/dev/acervo"
import { DevSection } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Java",
  description: "Trilha de estudo de Java em oito etapas e folhas de consulta da linguagem.",
}

/**
 * Java — roadmap e índice das folhas de consulta.
 *
 * Roadmap e cheat sheet moram na mesma rota porque respondem perguntas vizinhas
 * ("o que estudar agora" e "como se escreve isto"), e quem chega numa quase
 * sempre quer a outra em seguida. As folhas em si ficam em `/java/[slug]`: são
 * densas, e empilhar as cinco aqui daria uma página de rolagem infinita onde
 * nada é encontrável.
 */
export default function JavaPage() {
  const concluidas = javaRoadmap.filter((e) => e.status === "concluido").length
  const atual = javaRoadmap.find((e) => e.status === "estudando")

  return (
    <>
      <section className="dv-hero" aria-labelledby="java-titulo">
        <p className="term">
          <span className="tok-fn">public class</span> <span className="tok-str">Estudo</span> {"{"}
          <span className="dv-caret" aria-hidden>
            ▌
          </span>
        </p>
        <h1 id="java-titulo">
          Trilha de <span className="g">Java</span>, do zero ao <span className="c">Spring</span>.
        </h1>
        <p>
          Oito etapas com critério de conclusão declarado — sem isso, trilha nenhuma termina. Hoje:{" "}
          {concluidas} de {javaRoadmap.length} concluídas
          {atual && `, estudando "${atual.titulo}"`}.
        </p>
      </section>

      <DevSection
        id="roadmap"
        index={1}
        title="Roadmap"
        meta={`${javaRoadmap.length} etapas`}
        note="A ordem importa: cada etapa assume a anterior resolvida."
      >
        <TrilhaJava etapas={javaRoadmap} />
      </DevSection>

      <DevSection
        id="cheatsheets"
        index={2}
        title="Cheat sheets"
        meta={`${javaCheatSheets.length} folhas`}
        note="Consulta rápida — o que se esquece entre um projeto e outro."
      >
        <div className="dv-objects">
          {javaCheatSheets.map((f) => (
            <article key={f.slug} className="dv-card">
              <div className="dv-panel-head">
                <h3>
                  <a href={`/desenvolvedor/java/${f.slug}`}>{f.titulo}</a>
                </h3>
                <span className="dv-count">{f.itens.length} itens</span>
              </div>
              <p>{f.resumo}</p>
            </article>
          ))}
        </div>
      </DevSection>
    </>
  )
}
