"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { sectionsFor, STATUS_LABEL } from "@/design-system/architecture"
import type { RealmId } from "@/lib/realms"

/**
 * Índice lateral do guia de um realm.
 *
 * A sidebar voltou por necessidade, não por gosto: Material, Carbon e Polaris
 * têm índice fixo porque documentação deste porte não se lê em rolagem cega.
 * Mas ela não é um menu de rotas — é o sumário DESTE documento: cada item é
 * uma âncora, e o realce acompanha a leitura.
 *
 * Itens de seções que ainda não existem neste realm aparecem apagados e não
 * clicáveis. Prometer link que não leva a lugar nenhum é pior que admitir a
 * lacuna.
 */
export function DsRealmNav({ realm }: { realm: RealmId }) {
  const secoes = sectionsFor(realm)
  const [ativa, setAtiva] = useState<string | null>(null)

  useEffect(() => {
    const alvos = secoes
      .filter(s => s.disponivel)
      .map(s => document.getElementById(s.id))
      .filter((e): e is HTMLElement => Boolean(e))

    if (!alvos.length) return

    // rootMargin recorta a faixa de cima (navbar) e o rodapé: a seção "ativa"
    // é a que ocupa a banda de leitura, não a que apenas encostou na tela.
    const obs = new IntersectionObserver(
      entries => {
        const visivel = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visivel) setAtiva(visivel.target.id)
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    )

    alvos.forEach(a => obs.observe(a))
    return () => obs.disconnect()
  }, [secoes])

  return (
    <nav
      aria-label="Índice do guia"
      className="lg:sticky lg:top-24 lg:h-fit lg:w-56 lg:shrink-0"
    >
      <p className="sv-heavy mb-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
        Índice
      </p>
      <ol className="space-y-0.5">
        {secoes.map(s => {
          const on = ativa === s.id
          if (!s.disponivel) {
            return (
              <li key={s.id}>
                <span
                  title={`${s.desc} — ${STATUS_LABEL[s.status]} neste realm`}
                  className="flex cursor-default items-baseline gap-2 rounded px-2 py-1 text-[11px] text-white/25"
                >
                  <span className="font-mono text-[9px]">{s.n}</span>
                  <span className="flex-1 truncate">{s.label}</span>
                  <span className="text-[8px] uppercase tracking-wide">
                    {STATUS_LABEL[s.status]}
                  </span>
                </span>
              </li>
            )
          }
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "location" : undefined}
                title={s.desc}
                className={cn(
                  "flex items-baseline gap-2 rounded px-2 py-1 text-[11px] transition-colors",
                  on
                    ? "bg-[var(--sv-cyan)]/15 text-[var(--sv-cyan)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="font-mono text-[9px] opacity-60">{s.n}</span>
                <span className="flex-1 truncate">{s.label}</span>
                {s.status === "wip" && (
                  <span className="text-[8px] uppercase tracking-wide text-[var(--sv-yellow)]/70">
                    obra
                  </span>
                )}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
