export interface TrailPhase {
  id: string
  title: string
  done: number
  total: number
}

/** Encurta "Fase 1 — Fundamentos" para "Fundamentos". */
function shortTitle(t: string): string {
  const parts = t.split("—")
  return (parts[1] ?? parts[0] ?? t).trim()
}

/**
 * LearnTrail — a "trilha do conhecimento": fluxograma das fases, com o nó
 * atual (primeiro incompleto) pulsando e os conectores preenchidos conforme
 * o progresso. Animação em CSS (respeita prefers-reduced-motion).
 */
export function LearnTrail({ phases }: { phases: TrailPhase[] }) {
  const currentIndex = phases.findIndex((p) => p.total === 0 || p.done < p.total)

  return (
    <div className="learn-trail" role="list" aria-label="Trilha do conhecimento">
      {phases.map((p, i) => {
        const complete = p.total > 0 && p.done === p.total
        const isCurrent = i === currentIndex
        const state = complete ? "done" : isCurrent ? "current" : "todo"
        const pct = p.total ? Math.round((p.done / p.total) * 100) : 0
        return (
          <div key={p.id} className="learn-trail-step">
            {i > 0 && (
              <span
                className="learn-connector"
                aria-hidden
                data-filled={i <= currentIndex || currentIndex === -1}
              />
            )}
            <div className="learn-node" role="listitem" data-state={state}>
              <span className="learn-node-dot">{complete ? "✓" : i + 1}</span>
              <span className="learn-node-body">
                <span className="learn-node-label">{shortTitle(p.title)}</span>
                <span className="learn-node-prog">
                  {p.done}/{p.total} · {pct}%
                </span>
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
