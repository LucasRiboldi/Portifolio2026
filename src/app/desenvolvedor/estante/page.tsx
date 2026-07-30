import type { Metadata } from "next"

import { certificacoes, livros } from "@/data/dev"
import { Estante, GradeBadges } from "@/components/dev/acervo"
import { DevSection, MetaRow } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Estante",
  description: "Livros de referência de TI — lidos, em leitura e na fila — e badges de certificações.",
}

/**
 * Estante — livros e certificações.
 *
 * Os dois juntos porque respondem a mesma pergunta por caminhos diferentes: em
 * que o estudo foi investido. Separar em duas rotas daria duas páginas curtas
 * que ninguém visitaria duas vezes.
 *
 * A ordem é livros primeiro: é o acervo maior e o que de fato sustenta as
 * decisões técnicas. Certificação é comprovação, e vem depois da matéria.
 */
export default function EstantePage() {
  const lidos = livros.filter((l) => l.status === "lido")
  const lendo = livros.filter((l) => l.status === "lendo")
  const fila = livros.filter((l) => l.status === "fila")
  const obtidas = certificacoes.filter((c) => c.status === "obtida")

  return (
    <>
      <section className="dv-hero" aria-labelledby="estante-titulo">
        <p className="term">
          <span className="tok-fn">import</span> <span className="tok-str">conhecimento</span>
          <span className="dv-caret" aria-hidden>
            ▌
          </span>
        </p>
        <h1 id="estante-titulo">
          O que eu <span className="g">li</span>, o que estou <span className="c">lendo</span> e o que está na{" "}
          <span className="p">fila</span>.
        </h1>
        <p>
          Livro na fila entra com o motivo declarado — sem isso a lista vira desejo, não plano. Nota só
          aparece em livro terminado: avaliar o que não se leu seria inventar.
        </p>
      </section>

      <DevSection
        id="livros"
        index={1}
        title="Livros de referência"
        meta={`${livros.length} títulos`}
        note="Agrupados por estado de leitura, não por assunto — o que importa aqui é o progresso."
      >
        <Estante titulo="Lendo agora" livros={lendo} />
        <Estante titulo="Lidos" livros={lidos} />
        <Estante titulo="Na fila" livros={fila} />
      </DevSection>

      <DevSection
        id="certificacoes"
        index={2}
        title="Certificações"
        meta={`${obtidas.length} de ${certificacoes.length} obtidas`}
        note="Badge sem verificação é enfeite; quem tem página de validação vira link."
      >
        <GradeBadges itens={certificacoes} />
      </DevSection>

      <footer className="dv-section">
        <MetaRow
          items={[
            { k: "lidos", v: lidos.length },
            { k: "lendo", v: lendo.length },
            { k: "na fila", v: fila.length },
            { k: "certificações", v: obtidas.length },
          ]}
        />
      </footer>
    </>
  )
}
