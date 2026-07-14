/**
 * Logos — 10 lockups da marca "LR" em tratamentos distintos do multiverso.
 * Reutilizáveis; cada um é um bloco pronto para header/rodapé/assinatura.
 */
import * as React from "react"

const box = "grid h-20 place-items-center rounded-md border-[3px] border-black"

export const LOGOS: { name: string; node: React.ReactNode }[] = [
  {
    name: "Rainbow dot",
    node: <span className="font-[family-name:var(--font-display)] text-4xl uppercase text-white">LR<span className="sv-rainbow">.</span></span>,
  },
  {
    name: "Boxed",
    node: <span className="border-[3px] border-black bg-[var(--sv-yellow)] px-3 py-1 font-[family-name:var(--font-display)] text-3xl uppercase text-black shadow-[3px_3px_0_0_#000]">LR</span>,
  },
  {
    name: "Stencil rough",
    node: <span className="fx-marker font-[family-name:var(--font-heavy)] text-4xl uppercase tracking-[0.15em] text-[var(--sv-lime)]">LR</span>,
  },
  {
    name: "Spray",
    node: <span className="fx-spray bg-clip-text font-[family-name:var(--font-display)] text-4xl uppercase text-transparent" style={{ color: "var(--sv-magenta)", WebkitTextStroke: "1px #000" }}>LR</span>,
  },
  {
    name: "Glitch",
    node: <span className="fx-glitch fx-font-glitch text-3xl uppercase text-white" data-text="LR">LR</span>,
  },
  {
    name: "Holo badge",
    node: <span className="grid size-14 place-items-center rounded-full border-[3px] border-black bg-black"><span className="fx-holo font-[family-name:var(--font-display)] text-2xl uppercase">LR</span></span>,
  },
  {
    name: "Ransom",
    node: (
      <span className="fx-ransom text-xl uppercase">
        <span className="fx-ransom-piece bg-[var(--sv-magenta)] text-white -rotate-3">L</span>
        <span className="fx-ransom-piece bg-[var(--sv-cyan)] text-black rotate-2">R</span>
      </span>
    ),
  },
  {
    name: "Bolt",
    node: (
      <span className="flex items-center gap-1 font-[family-name:var(--font-display)] text-4xl uppercase text-white">
        L<svg viewBox="0 0 24 40" className="h-9"><path d="M14 2L5 22h6l-3 16 12-22h-7l5-14Z" fill="var(--sv-yellow)" stroke="#000" strokeWidth="2" strokeLinejoin="round" /></svg>
      </span>
    ),
  },
  {
    name: "Neon",
    node: <span className="fx-neon fx-font-monoton text-2xl uppercase">LR</span>,
  },
  {
    name: "Taped",
    node: <span className="art-tape relative border-[3px] border-black bg-white px-3 py-1 font-[family-name:var(--font-heavy)] text-2xl uppercase text-black">LR</span>,
  },
]

export function LogoGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {LOGOS.map((l) => (
        <div key={l.name} className="flex flex-col items-center gap-2">
          <div className={box + " w-full bg-[var(--sv-ink-2)]"}>{l.node}</div>
          <span className="text-[0.6rem] uppercase tracking-wide text-white/45">{l.name}</span>
        </div>
      ))}
    </div>
  )
}
