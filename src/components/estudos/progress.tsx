"use client"

import type { Estatisticas } from "@/lib/estudos/progresso"

/**
 * PROGRESS — percentual, contagens e barra.
 *
 * `role="progressbar"` com os três `aria-value*`: sem eles a barra é uma div
 * colorida que nenhum leitor de tela sabe ler, e o número que ela representa
 * está desenhado, não escrito.
 */
export function Progress({ stats, hidratado }: { stats: Estatisticas; hidratado: boolean }) {
  // Antes de hidratar, mostra zeros em vez do valor salvo — que ainda não foi
  // lido. Piscar 0% e saltar para 60% é pior que esperar um quadro.
  const s = hidratado
    ? stats
    : { ...stats, concluidas: 0, revisadas: 0, exerciciosFeitos: 0, percentual: 0, restantes: stats.totalAulas }

  return (
    <div className="es-progresso">
      <div className="es-prog-topo">
        <span className="es-prog-pct">{s.percentual}%</span>
        <span className="es-prog-rot">estudado</span>
      </div>
      <div
        className="es-prog-barra"
        role="progressbar"
        aria-valuenow={s.percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso geral da disciplina"
      >
        <span className="es-prog-fill" style={{ width: `${s.percentual}%` }} />
      </div>
      <dl className="es-prog-nums">
        <div>
          <dt>concluídas</dt>
          <dd>
            {s.concluidas}
            <span className="es-prog-de">/{s.totalAulas}</span>
          </dd>
        </div>
        <div>
          <dt>restantes</dt>
          <dd>{s.restantes}</dd>
        </div>
        <div>
          <dt>revisadas</dt>
          <dd>{s.revisadas}</dd>
        </div>
        <div>
          <dt>exercícios</dt>
          <dd>
            {s.exerciciosFeitos}
            <span className="es-prog-de">/{s.totalExercicios}</span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
