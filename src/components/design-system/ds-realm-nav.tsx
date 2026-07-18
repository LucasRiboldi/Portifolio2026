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

  // Cada realm com chrome próprio tinge o índice na sua língua, para a página
  // inteira falar de um jeito só: o _Dev em roxo/ciano Dracula, o Anfitrião em
  // sépia/ouro sobre a mesa escura da redação. O índice fica na margem (fundo
  // escuro), então usa os tons claros da paleta, não a tinta sobre papel.
  const dev = realm === "developer"
  const arc = realm === "arcane"
  const activeCls = dev
    ? "bg-[var(--d-purple)]/20 text-[var(--d-purple)]"
    : arc
      ? "bg-[#9a7b28]/25 text-[#e8dcbe]"
      : "bg-[var(--sv-cyan)]/15 text-[var(--sv-cyan)]"
  const idleCls = dev
    ? "text-[var(--d-comment)] hover:bg-[var(--d-current)]/40 hover:text-[var(--d-fg)]"
    : arc
      ? "text-[#c9b892]/70 hover:bg-[#9a7b28]/15 hover:text-[#e8dcbe]"
      : "text-white/60 hover:bg-white/5 hover:text-white"
  const wipCls = dev
    ? "text-[var(--d-orange)]/80"
    : arc
      ? "text-[#c8a24a]/80"
      : "text-[var(--sv-yellow)]/70"

  useEffect(() => {
    // Sub-seções entram na observação junto das mães: elas são âncoras reais
    // no documento, e sem observá-las o realce congela na mãe enquanto o
    // leitor já desceu três matérias.
    const alvos = secoes
      .filter(s => s.disponivel)
      .flatMap(s => [s.id, ...s.subs.map(sub => sub.id)])
      .map(id => document.getElementById(id))
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
                  on ? activeCls : idleCls
                )}
              >
                <span className="font-mono text-[9px] opacity-60">{s.n}</span>
                <span className="flex-1 truncate">{s.label}</span>
                {s.status === "wip" && (
                  <span className={cn("text-[8px] uppercase tracking-wide", wipCls)}>
                    obra
                  </span>
                )}
              </a>

              {/* As matérias do caderno. Recuadas e um ponto menores: o índice
                  de jornal também distingue caderno de matéria por recuo. */}
              {s.subs.length > 0 && (
                <ol className="ml-3 border-l border-current/15 pl-1">
                  {s.subs.map(sub => {
                    const subOn = ativa === sub.id
                    return (
                      <li key={sub.id}>
                        <a
                          href={`#${sub.id}`}
                          aria-current={subOn ? "location" : undefined}
                          className={cn(
                            "flex items-baseline gap-2 rounded px-2 py-0.5 text-[10px] transition-colors",
                            subOn ? activeCls : idleCls
                          )}
                        >
                          <span className="font-mono text-[8px] opacity-50">{sub.n}</span>
                          <span className="flex-1 truncate">{sub.label}</span>
                        </a>
                      </li>
                    )
                  })}
                </ol>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
