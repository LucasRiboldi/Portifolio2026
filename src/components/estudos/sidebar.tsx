"use client"

/**
 * SIDEBAR — a navegação interna da disciplina.
 *
 * `<nav>` com lista e `aria-current="true"` no item ativo: é a mesma semântica
 * que o dock do realm usa, e sem ela um leitor de tela ouve vinte e sete links
 * sem saber onde está.
 *
 * A rolagem suave é responsabilidade do CSS (`scroll-behavior`) e não de um
 * `scrollTo` animado à mão — assim `prefers-reduced-motion` a desliga sem que
 * este componente precise saber que ela existe.
 */

export interface ItemSidebar {
  ancora: string
  rotulo: string
  /** Aulas entram recuadas sob "Cronograma". */
  recuado?: boolean
  /** Marcador de aula concluída. */
  concluida?: boolean
}

export function Sidebar({
  itens,
  ativo,
  onIr,
}: {
  itens: readonly ItemSidebar[]
  ativo: string
  onIr: (ancora: string) => void
}) {
  return (
    <nav className="es-sidebar" aria-label="Seções da disciplina">
      <ul>
        {itens.map((i) => (
          <li key={i.ancora}>
            <button
              type="button"
              className="es-side-link"
              data-recuado={i.recuado}
              data-ativo={i.ancora === ativo}
              data-concluida={i.concluida}
              aria-current={i.ancora === ativo ? "true" : undefined}
              onClick={() => onIr(i.ancora)}
            >
              {i.concluida && (
                <span className="es-side-ok" aria-label="concluída">
                  ✓
                </span>
              )}
              <span className="es-side-rot">{i.rotulo}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
