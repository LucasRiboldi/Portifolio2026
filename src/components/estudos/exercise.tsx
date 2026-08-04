"use client"

import { useState } from "react"

import { NIVEIS, type Exercicio } from "@/data/estudos/tipos"

/**
 * EXERCISE — enunciado, dica, resolução comentada e resposta.
 *
 * Dica, resolução e resposta ficam atrás de `<details>` nativo, cada um o seu.
 * Isso não é economia de espaço: exercício com a resposta à vista não é
 * exercício. E `<details>` já vem com semântica de expansível e com teclado
 * funcionando, o que uma div com `onClick` só teria depois de muito código.
 */
export function Exercise({
  exercicio,
  feito,
  onAlternar,
}: {
  exercicio: Exercicio
  feito: boolean
  onAlternar: (id: string) => void
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <article className="es-ex" data-nivel={exercicio.nivel} data-feito={feito}>
      <header className="es-ex-topo">
        <span className="es-ex-nivel" data-nivel={exercicio.nivel}>
          {NIVEIS[exercicio.nivel]}
        </span>
        <label className="es-ex-check">
          <input
            type="checkbox"
            checked={feito}
            onChange={() => onAlternar(exercicio.id)}
          />
          <span>resolvido</span>
        </label>
      </header>

      <p className="es-ex-enunciado">{exercicio.enunciado}</p>

      <div className="es-ex-ajudas">
        <details className="es-reveal">
          <summary>Dica</summary>
          <p>{exercicio.dica}</p>
        </details>

        <details
          className="es-reveal"
          open={aberto}
          onToggle={(e) => setAberto((e.currentTarget as HTMLDetailsElement).open)}
        >
          <summary>Resolução comentada</summary>
          <BlocoTexto texto={exercicio.resolucao} />
        </details>

        <details className="es-reveal">
          <summary>Resposta</summary>
          <BlocoTexto texto={exercicio.resposta} />
        </details>
      </div>
    </article>
  )
}

/**
 * Texto de resolução com blocos de código.
 *
 * O autor escreve o código entre ``` como escreveria em qualquer lugar; aqui
 * ele vira `<pre>` de verdade, preservando indentação — que é metade do valor
 * de um exemplo de código.
 */
export function BlocoTexto({ texto }: { texto: string }) {
  const partes = texto.split(/```(?:\w+)?\n?/)
  return (
    <>
      {partes.map((parte, i) =>
        // Índices ímpares são o miolo das cercas: abre/fecha se alternam.
        i % 2 === 1 ? (
          <pre key={i} className="es-code">
            <code>{parte.replace(/\n$/, "")}</code>
          </pre>
        ) : (
          parte.trim() && (
            <p key={i} className="es-prosa">
              {parte.trim()}
            </p>
          )
        ),
      )}
    </>
  )
}
