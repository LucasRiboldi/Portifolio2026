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

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="sv-heavy mr-1 text-[11px] uppercase tracking-wide text-white/50">
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
                "sv-heavy border-2 border-black px-2.5 py-1 text-[10px] uppercase tracking-wide transition-transform hover:-translate-y-0.5",
                on
                  ? "bg-[var(--sv-yellow)] text-black shadow-[3px_3px_0_0_#000]"
                  : "bg-white/10 text-white/70 shadow-[2px_2px_0_0_rgba(0,0,0,0.4)]"
              )}
            >
              {v.label}
            </button>
          )
        })}
      </div>

      <p className="mb-4 text-xs leading-snug text-white/55">{active.desc}</p>

      {/* a classe da variante entra por fora do kit inteiro */}
      <div className={active.className}>{children}</div>
    </div>
  )
}
