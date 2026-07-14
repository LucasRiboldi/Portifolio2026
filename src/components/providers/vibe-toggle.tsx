"use client"

import { cn } from "@/lib/utils"
import { REALMS } from "@/lib/realms"
import { useUniverse } from "@/components/providers/universe-provider"

/**
 * VibeToggle — o botão "Transform" de THE THREE REALMS.
 *
 * Cicla creative → developer → arcane → creative disparando a metamorfose
 * cinematográfica. Toda a lógica (estado, morph, persistência) vive no
 * UniverseProvider; aqui é só a UI acessível. Rótulo/skin mudam por realm.
 */
export function VibeToggle({ className }: { className?: string }) {
  const { realm, morphing, cycle } = useUniverse()
  const current = REALMS[realm]
  const next = REALMS[current.next]

  return (
    <button
      onClick={cycle}
      disabled={!!morphing}
      aria-label={`Transformar universo — próximo: ${next.aria}`}
      title={`Transform → ${next.label}`}
      data-realm-btn={realm}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border-2 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide transition-all disabled:opacity-70",
        realm === "developer" &&
          "border-[#2b3238] bg-[#131619] text-[#4ade80] hover:border-[#4ade80]",
        realm === "creative" &&
          "border-black bg-[var(--sv-yellow)] text-black shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5",
        realm === "arcane" &&
          "border-[#3a2f1c] bg-[#efe6d0] text-[#2a2118] shadow-[2px_2px_0_0_#2a2118] hover:-translate-y-0.5",
        className
      )}
    >
      <span aria-hidden>{current.glyph}</span>
      {current.label}
    </button>
  )
}
