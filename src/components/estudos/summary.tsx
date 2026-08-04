"use client"

import type { ResumoAula } from "@/data/estudos/tipos"

/**
 * SUMMARY — o fechamento da aula.
 *
 * O checklist é feito de `<li>` com marcador desenhado, não de `<input
 * type=checkbox>`: são itens de conferência de leitura, não estado que se
 * persiste. Estado persistido nesta página é só o que `Progress` conta — dar
 * caixas clicáveis aqui prometeria uma memória que não existe.
 */
export function Summary({ resumo }: { resumo: ResumoAula }) {
  return (
    <section className="es-sumario" aria-label="Resumo da aula">
      <h4>Resumo</h4>

      <div className="es-sumario-grade">
        <div className="es-sum-bloco">
          <h5>Conceitos importantes</h5>
          <ul className="es-lista">
            {resumo.conceitosImportantes.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="es-sum-bloco">
          <h5>Checklist</h5>
          <ul className="es-checklist">
            {resumo.checklist.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="es-sum-bloco">
          <h5>Pontos para revisão</h5>
          <ul className="es-lista">
            {resumo.pontosRevisao.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="es-chaves" aria-label="Palavras-chave">
        {resumo.palavrasChave.map((p) => (
          <li key={p} className="dv-tag">
            {p}
          </li>
        ))}
      </ul>
    </section>
  )
}
