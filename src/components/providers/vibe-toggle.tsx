"use client"

import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { REALMS, type RealmId } from "@/lib/realms"
import { useUniverse } from "@/components/providers/universe-provider"

/**
 * VibeToggle — o botão de troca de universo de THE THREE REALMS.
 *
 * Agora os realms são sub-sites com rota própria (creative "/", developer
 * "/dev", arcane "/prophet"). O botão deriva o realm atual do pathname e
 * NAVEGA para o próximo realm habilitado.
 */
function realmFromPath(pathname: string): RealmId {
  if (pathname.startsWith("/dev")) return "developer"
  if (pathname.startsWith("/prophet")) return "arcane"
  return "creative"
}

export function VibeToggle({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { enabled } = useUniverse()

  const realm = realmFromPath(pathname)
  const i = enabled.indexOf(realm)
  const nextId = enabled[(i + 1) % enabled.length] ?? realm
  const next = REALMS[nextId]
  const canCycle = enabled.length > 1

  return (
    <button
      onClick={() => router.push(next.route)}
      disabled={!canCycle}
      aria-label={`Trocar de universo — próximo: ${next.aria}`}
      title={`Universo → ${next.label}`}
      data-realm-btn={realm}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border-2 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide transition-all disabled:opacity-70",
        realm === "developer" &&
          "border-[#6272a4] bg-[#282a36] text-[#bd93f9] hover:border-[#bd93f9] hover:text-[#ff79c6]",
        realm === "creative" &&
          "border-black bg-[var(--sv-yellow)] text-black shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5",
        realm === "arcane" &&
          "border-[#3a2f1c] bg-[#efe6d0] text-[#2a2118] shadow-[2px_2px_0_0_#2a2118] hover:-translate-y-0.5",
        className,
      )}
    >
      <span aria-hidden>{next.glyph}</span>
      {next.label}
    </button>
  )
}
