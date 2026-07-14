"use client"

import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * VibeToggle — liga/desliga o "Aranhaverso" com metamorfose animada.
 * OFF => modo dev (terminal). Persistido em localStorage("vibe") como
 * classe .sober no <html>. A troca dispara um overlay de transição.
 */
export function VibeToggle({ className }: { className?: string }) {
  const [sober, setSober] = useState(false)
  const [morph, setMorph] = useState<null | "dev" | "aranha">(null)

  useEffect(() => {
    setSober(document.documentElement.classList.contains("sober"))
  }, [])

  const toggle = useCallback(() => {
    if (morph) return
    const next = !sober
    const dir = next ? "dev" : "aranha"
    setMorph(dir)
    document.documentElement.classList.add("morphing")

    // troca o tema quando o painel cobre a tela (~meio da animação)
    window.setTimeout(() => {
      setSober(next)
      document.documentElement.classList.toggle("sober", next)
      try {
        localStorage.setItem("vibe", next ? "sober" : "aranha")
      } catch {}
    }, 380)

    window.setTimeout(() => {
      setMorph(null)
      document.documentElement.classList.remove("morphing")
    }, 840)
  }, [sober, morph])

  return (
    <>
      <button
        onClick={toggle}
        role="switch"
        aria-checked={sober}
        aria-label={sober ? "Ligar Aranhaverso" : "Modo dev"}
        title={sober ? "Ligar Aranhaverso" : "Modo dev"}
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

      {morph && (
        <div className={cn("vibe-morph-overlay", morph === "dev" ? "to-dev" : "to-aranha")} aria-hidden>
          <div className="vibe-morph-panel">
            <span className="vibe-morph-label">
              {morph === "dev" ? "❯ booting dev environment…" : "◍ recalibrando multiverso…"}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
