import type { Metadata } from "next"

import { designPatterns, type PatternCategoria } from "@/data/dev"
import { CardsPatterns } from "@/components/dev/acervo"
import { DevSection } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Design Patterns",
  description: "Cartões de consulta dos padrões de projeto: problema, solução, exemplo em Java e quando evitar.",
}

/**
 * Cartões de design patterns, agrupados pelas três famílias do GoF.
 *
 * O agrupamento é por categoria e não uma grade única porque a família já diz
 * muito sobre quando o padrão entra na conversa: criacional aparece ao decidir
 * como nasce um objeto, estrutural ao encaixar peças, comportamental ao
 * distribuir responsabilidade. Numa lista achatada essa pista se perde.
 */
const FAMILIAS: { id: PatternCategoria; titulo: string; nota: string }[] = [
  {
    id: "criacional",
    titulo: "Criacionais",
    nota: "Como o objeto nasce — e quem decide a classe concreta.",
  },
  {
    id: "estrutural",
    titulo: "Estruturais",
    nota: "Como as peças se encaixam sem que uma precise mudar pela outra.",
  },
  {
    id: "comportamental",
    titulo: "Comportamentais",
    nota: "Como a responsabilidade se distribui entre os objetos em tempo de execução.",
  },
]

export default function PadroesPage() {
  return (
    <>
      <section className="dv-hero" aria-labelledby="padroes-titulo">
        <p className="term">
          <span className="tok-fn">pattern</span>.<span className="tok-str">match</span>()
          <span className="dv-caret" aria-hidden>
            ▌
          </span>
        </p>
        <h1 id="padroes-titulo">
          Padrões de projeto com o <span className="p">&quot;quando não usar&quot;</span> na frente.
        </h1>
        <p>
          Todo catálogo mostra como aplicar; poucos dizem quando o padrão custa mais do que entrega. Cada
          cartão aqui traz problema, solução, esqueleto em Java, o caso de evitar e onde ele já aparece em
          código que a gente usa todo dia.
        </p>
      </section>

      {FAMILIAS.map((f, i) => {
        const doGrupo = designPatterns.filter((p) => p.categoria === f.id)
        if (doGrupo.length === 0) return null
        return (
          <DevSection
            key={f.id}
            id={f.id}
            index={i + 1}
            title={f.titulo}
            meta={`${doGrupo.length} padrões`}
            note={f.nota}
          >
            <CardsPatterns patterns={doGrupo} />
          </DevSection>
        )
      })}
    </>
  )
}
