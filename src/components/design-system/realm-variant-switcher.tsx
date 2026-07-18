"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { REALM_VARIANTS, VARIANT_LABEL } from "@/design-system/realm-variants"
import type { RealmId } from "@/lib/realms"

/**
 * Seletor de versão do realm: troca a chapa e reimprime o preview ao vivo.
 *
 * `children` é o kit já renderizado — recebido como elemento, não como
 * render-prop: funções não atravessam a fronteira server/client, e esta
 * página é um server component.
 */
export function RealmVariantSwitcher({
  realm,
  children,
}: {
  realm: RealmId
  children: React.ReactNode
}) {
  const variants = REALM_VARIANTS[realm]
  const first = variants[0]
  const [activeId, setActiveId] = useState(first?.id)
  const active = variants.find(v => v.id === activeId) ?? first

  // Realm sem variantes declaradas: mostra o kit no estado padrão, sem seletor.
  if (!active) return <>{children}</>

  // O Anfitrião vive numa folha clara: os controles brancos-sobre-escuro do
  // comic sumiriam. Aqui eles viram tinta sobre papel — sem sombra de comic.
  const arc = realm === "arcane"
  const labelCls = arc ? "text-[var(--dp-ink-3)]" : "text-white/50"
  const descCls = arc ? "text-[var(--dp-ink-2)]" : "text-white/55"
  const onCls = arc
    ? "border-[var(--dp-rule)] bg-[var(--dp-ink)] text-[var(--dp-paper)]"
    : "border-black bg-[var(--sv-yellow)] text-black shadow-[3px_3px_0_0_#000]"
  const offCls = arc
    ? "border-[var(--dp-rule)] bg-[var(--dp-paper)] text-[var(--dp-ink-2)] hover:bg-[var(--dp-paper-2)]"
    : "border-black bg-white/10 text-white/70 shadow-[2px_2px_0_0_rgba(0,0,0,0.4)]"

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={cn("mr-1 text-[11px] uppercase tracking-wide", arc ? "" : "sv-heavy", labelCls)}>
          {VARIANT_LABEL[realm]}:
        </span>
        {variants.map(v => {
          const on = v.id === active.id
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveId(v.id)}
              aria-pressed={on}
              title={v.desc}
              className={cn(
                "border-2 px-2.5 py-1 text-[10px] uppercase tracking-wide transition-transform hover:-translate-y-0.5",
                arc ? "" : "sv-heavy",
                on ? onCls : offCls
              )}
            >
              {v.label}
            </button>
          )
        })}
      </div>

      <p className={cn("mb-4 text-xs leading-snug", descCls)}>{active.desc}</p>

      {/* a classe da variante entra por fora do kit inteiro */}
      <div className={active.className}>{children}</div>
    </div>
  )
}
