"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { REALMS, realmFromPath } from "@/lib/realms"
import { useUniverse } from "@/components/providers/universe-provider"
import { useUniverseTransition } from "@/components/providers/universe-transition"
import { RealmLogoMini } from "@/components/realms/realm-logo-mini"

/**
 * VibeToggle — o botão de troca de universo de THE THREE REALMS.
 *
 * Agora os realms são sub-sites com rota própria (creative "/criativo", developer
 * "/desenvolvedor", arcane "/anfitriao"). O botão deriva o realm atual do pathname e
 * NAVEGA para o próximo realm habilitado.
 *
 * O botão veste a característica do realm de DESTINO (não a do atual) e mostra o
 * logo animado dele, como nos painéis do portal: assim cada destino é reconhecível
 * antes do clique.
 */
export function VibeToggle({ className }: { className?: string }) {
  const pathname = usePathname()
  const { enabled } = useUniverse()
  const { go, transitioning } = useUniverseTransition()

  const realm = realmFromPath(pathname)
  const i = enabled.indexOf(realm)
  const nextId = enabled[(i + 1) % enabled.length] ?? realm
  const next = REALMS[nextId]
  const canCycle = enabled.length > 1

  return (
    <button
      onClick={() => go(nextId)}
      disabled={!canCycle || transitioning}
      aria-label={`Trocar de universo — próximo: ${next.aria}`}
      title={`Universo → ${next.label}`}
      data-realm-btn={nextId}
      className={cn(
        "inline-flex items-center gap-1.5 border-2 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide transition-all disabled:opacity-70",
        // _DEV — terminal Dracula, cantos retos
        nextId === "developer" &&
          "rounded-md border-[#6272a4] bg-[#282a36] text-[#f8f8f2] hover:border-[#50fa7b] hover:text-[#50fa7b]",
        // CRIATIVO — comic, contorno preto e sombra dura
        nextId === "creative" &&
          "rounded-md border-black bg-[var(--sv-yellow)] text-black shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5",
        // ANFITRIÃO — papel envelhecido e tinta sépia
        nextId === "arcane" &&
          "rounded-none border-[#3a2f1c] bg-[#e8dcbe] text-[#2a2118] shadow-[2px_2px_0_0_#2a2118] hover:-translate-y-0.5",
        className,
      )}
    >
      <RealmLogoMini realm={nextId} />
      {next.label}
    </button>
  )
}
