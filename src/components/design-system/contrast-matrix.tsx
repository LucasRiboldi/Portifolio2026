"use client"

import { color } from "@/design-system/tokens"
import { contrastRatio, wcagLevel, type WcagLevel } from "@/design-system/contrast"

/** Pares texto/fundo relevantes do Design System. */
const PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: "Texto claro / ink 950", fg: color.neutral[50], bg: color.neutral[950] },
  { label: "Texto claro / ink 900", fg: color.neutral[50], bg: color.neutral[900] },
  { label: "Muted 400 / ink 950", fg: color.neutral[400], bg: color.neutral[950] },
  { label: "Ink 950 / magenta 500", fg: color.neutral[950], bg: color.primary[500] },
  { label: "Branco / magenta 500", fg: "#ffffff", bg: color.primary[500] },
  { label: "Ink 950 / cyan 400", fg: color.neutral[950], bg: color.secondary[400] },
  { label: "Ink 950 / yellow 300", fg: color.neutral[950], bg: color.warning[300] },
  { label: "Ink 950 / lime 400", fg: color.neutral[950], bg: color.success[400] },
  { label: "Branco / cyan 400 (RUIM)", fg: "#ffffff", bg: color.secondary[400] },
]

const BADGE: Record<WcagLevel, string> = {
  AAA: "bg-[var(--sv-lime)] text-black",
  AA: "bg-[var(--sv-cyan)] text-black",
  "AA Large": "bg-[var(--sv-yellow)] text-black",
  Fail: "bg-[var(--sv-orange)] text-white",
}

export function ContrastMatrix() {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b-2 border-black bg-white/5 uppercase tracking-wide text-white/60">
            <th className="px-3 py-2">Amostra</th>
            <th className="px-3 py-2">Par</th>
            <th className="px-3 py-2">Razão</th>
            <th className="px-3 py-2">Nível</th>
          </tr>
        </thead>
        <tbody>
          {PAIRS.map((p) => {
            const ratio = contrastRatio(p.fg, p.bg)
            const level = wcagLevel(ratio)
            return (
              <tr key={p.label} className="border-b border-white/10 last:border-0">
                <td className="px-3 py-2">
                  <span className="inline-block rounded px-2 py-1 font-bold" style={{ color: p.fg, background: p.bg }}>Aa</span>
                </td>
                <td className="px-3 py-2 text-white/70">{p.label}</td>
                <td className="px-3 py-2 font-mono text-white/80">{ratio.toFixed(2)}:1</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${BADGE[level]}`}>{level}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
