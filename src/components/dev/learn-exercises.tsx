import type { Difficulty, LearnExercise } from "@/data/learn"

const ORDER: Difficulty[] = ["básico", "intermediário", "avançado"]

export function LearnExercises({
  exercises,
  done,
  onToggle,
  runHref,
}: {
  exercises: LearnExercise[]
  done: Record<string, boolean>
  onToggle: (id: string) => void
  /** compilador online da linguagem, para "resolver na prática" */
  runHref?: string
}) {
  const groups = ORDER.map((d) => ({ d, items: exercises.filter((e) => e.difficulty === d) })).filter(
    (g) => g.items.length > 0,
  )
  const total = exercises.length
  const solved = exercises.filter((e) => done[e.id]).length

  return (
    <div className="learn-ex">
      <div className="dv-controls">
        <span className="dv-count">
          {solved}/{total} resolvido(s)
        </span>
        {runHref && (
          <a className="dv-link" href={runHref} target="_blank" rel="noreferrer">
            ❯ abrir compilador online
          </a>
        )}
      </div>

      {groups.map((g) => (
        <section key={g.d} className="learn-ex-group">
          <p className="dv-section-title" style={{ textTransform: "capitalize" }}>
            {g.d}
          </p>
          <ul className="learn-list" style={{ marginTop: "0.5rem" }}>
            {g.items.map((ex) => {
              const isDone = !!done[ex.id]
              return (
                <li key={ex.id}>
                  <button
                    type="button"
                    className="learn-item learn-ex-item"
                    role="checkbox"
                    aria-checked={isDone}
                    data-done={isDone}
                    onClick={() => onToggle(ex.id)}
                  >
                    <span className="learn-box" aria-hidden />
                    <span className="learn-ex-body">
                      <span className="learn-ex-title">{ex.title}</span>
                      <span className="learn-ex-prompt">{ex.prompt}</span>
                    </span>
                    <span className="learn-ex-diff" data-diff={ex.difficulty}>
                      {ex.difficulty}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
