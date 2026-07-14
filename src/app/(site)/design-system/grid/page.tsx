"use client"

import { useState } from "react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import tokens from "@/design-system/tokens"

export default function GridPage() {
  const [cols, setCols] = useState(12)
  const [overlay, setOverlay] = useState(true)

  return (
    <div>
      <ComicHeader kicker="01 · Foundations" title="Grid" highlight="system" />
      <DsLead>
        12 colunas, gutter e container derivados dos tokens. Ajuste as colunas e ligue
        o overlay para ver a estrutura por trás de cada tela.
      </DsLead>

      {/* controles */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
          Colunas
          <input type="range" min={2} max={12} value={cols} onChange={(e) => setCols(+e.target.value)} className="sv-slider h-2 w-40" />
          <span className="font-mono text-[var(--sv-cyan)]">{cols}</span>
        </label>
        <button
          onClick={() => setOverlay((o) => !o)}
          aria-pressed={overlay}
          className={`sv-heavy rounded-md border-2 border-black px-3 py-1.5 text-xs uppercase tracking-wide ${overlay ? "bg-[var(--sv-cyan)] text-black" : "text-white/60"}`}
        >
          Overlay {overlay ? "on" : "off"}
        </button>
      </div>

      {/* grid demo */}
      <DsSectionTitle id="columns">Colunas & Gutter</DsSectionTitle>
      <div className="relative rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }, (_, i) => (
            <div
              key={i}
              className="h-24 rounded border-2 border-black text-center"
              style={{ background: overlay ? "color-mix(in srgb, var(--sv-magenta) 22%, transparent)" : "var(--sv-ink)" }}
            >
              <span className="block pt-9 font-mono text-[0.65rem] text-white/60">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* exemplo de layout real */}
      <DsSectionTitle id="layout">Layout composto</DsSectionTitle>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-12">
        <Cell span="col-span-4 lg:col-span-8" label="principal · 8" color="var(--sv-cyan)" />
        <Cell span="col-span-4" label="lateral · 4" color="var(--sv-lime)" />
        <Cell span="col-span-2 lg:col-span-4" label="4" color="var(--sv-magenta)" />
        <Cell span="col-span-2 lg:col-span-4" label="4" color="var(--sv-violet)" />
        <Cell span="col-span-4" label="4" color="var(--sv-yellow)" />
      </div>

      {/* baseline de spacing */}
      <DsSectionTitle id="baseline">Baseline (4px)</DsSectionTitle>
      <div className="flex flex-wrap items-end gap-3">
        {Object.entries(tokens.spacing).map(([k, v]) => (
          <div key={k} className="text-center">
            <div style={{ width: v, height: v }} className="mx-auto min-h-[4px] min-w-[4px] bg-[var(--sv-cyan)]" />
            <span className="mt-1 block font-mono text-[0.6rem] text-white/50">{k}</span>
          </div>
        ))}
      </div>

      {/* container */}
      <DsSectionTitle id="container">Containers</DsSectionTitle>
      <div className="space-y-2">
        {Object.entries({ sm: "640px", md: "768px", lg: "1024px", xl: "1200px" }).map(([k, v]) => (
          <div key={k} className="flex items-center gap-3">
            <span className="w-10 font-mono text-xs text-[var(--sv-cyan)]">{k}</span>
            <div className="h-6 rounded border-2 border-black bg-[var(--sv-magenta)]/40" style={{ width: `min(100%, ${v})` }} />
            <span className="font-mono text-[0.7rem] text-white/40">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Cell({ span, label, color }: { span: string; label: string; color: string }) {
  return (
    <div className={`${span} grid h-20 place-items-center rounded border-2 border-black text-xs font-bold uppercase text-black`} style={{ background: color }}>
      {label}
    </div>
  )
}
