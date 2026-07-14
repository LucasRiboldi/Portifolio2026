"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * VibeToggle — liga/desliga o "Aranhaverso".
 * OFF => modo sóbrio (terminal/dev): mono, paleta calma, sem efeitos comic.
 * Estado persistido em localStorage("vibe") e aplicado como classe .sober no <html>.
 */
export function VibeToggle({ className }: { className?: string }) {
  const [sober, setSober] = useState(false)

  useEffect(() => {
    setSober(document.documentElement.classList.contains("sober"))
  }, [])

  function toggle() {
    const next = !sober
    setSober(next)
    document.documentElement.classList.toggle("sober", next)
    try {
      localStorage.setItem("vibe", next ? "sober" : "aranha")
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={sober}
      aria-label={sober ? "Ligar Aranhaverso" : "Modo sóbrio (dev)"}
      title={sober ? "Ligar Aranhaverso" : "Modo sóbrio (dev)"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border-2 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide transition-all",
        sober
          ? "border-[#2b3238] bg-[#131619] text-[#4ade80] hover:border-[#4ade80]"
          : "border-black bg-[var(--sv-yellow)] text-black shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5",
        className
      )}
    >
      <span aria-hidden>{sober ? "❯_" : "◍"}</span>
      {sober ? "dev" : "Aranha"}
    </button>
  )
}
