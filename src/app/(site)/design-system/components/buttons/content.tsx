"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Plus, Play, Download, Zap, Rocket, Star } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle } from "@/design-system/ds-ui"
import { SvButton, type SvColor } from "@/components/ui/sv-button"

const COLORS: SvColor[] = ["magenta", "cyan", "yellow", "lime", "violet", "orange"]
const VARIANTS = ["primary", "secondary", "ghost", "outline", "link"] as const

export function ButtonsContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  const [color, setColor] = useState<SvColor>("magenta")
  const [size, setSize] = useState<"sm" | "md" | "lg">("md")
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)

  return (
    <div>
      <Link
        href="/design-system/components"
        className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]"
      >
        <ArrowLeft className="size-3.5" /> Componentes
      </Link>

      <ComicHeader as={headingAs} kicker="04 · Botões" title="Ações que" highlight="estalam" />

      {/* ------- PLAYGROUND ------- */}
      <DsSectionTitle id="playground">Playground</DsSectionTitle>
      <div className="grid gap-5 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-3)] lg:grid-cols-[1fr_260px]">
        {/* palco */}
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-5 rounded-md border-2 border-dashed border-white/15 bg-black/30 p-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SvButton variant="primary" color={color} size={size} isLoading={loading} disabled={disabled} icon={<Zap />} pop="POW!">
              Primary
            </SvButton>
            <SvButton variant="secondary" color={color} size={size} isLoading={loading} disabled={disabled}>
              Secondary
            </SvButton>
            <SvButton variant="ghost" color={color} size={size} isLoading={loading} disabled={disabled}>
              Ghost
            </SvButton>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <SvButton variant="outline" color={color} size={size} isLoading={loading} disabled={disabled}>
              Outlined
            </SvButton>
            <SvButton variant="link" color={color} size={size} disabled={disabled}>
              Link Button
            </SvButton>
            <SvButton variant="icon" color={color} size={size} isLoading={loading} disabled={disabled} aria-label="Curtir">
              <Heart />
            </SvButton>
            <SvButton variant="fab" color={color} size={size} isLoading={loading} disabled={disabled} aria-label="Adicionar">
              <Plus />
            </SvButton>
          </div>
        </div>

        {/* controles */}
        <div className="flex flex-col gap-4">
          <Control label="Cor">
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={c}
                  aria-pressed={color === c}
                  className={`size-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? "border-white ring-2 ring-[var(--sv-cyan)]" : "border-black"
                  }`}
                  style={{ background: `var(--sv-${c})` }}
                />
              ))}
            </div>
          </Control>

          <Control label="Tamanho">
            <Segmented value={size} options={["sm", "md", "lg"]} onChange={(v) => setSize(v as typeof size)} />
          </Control>

          <Control label="Estados">
            <div className="flex flex-col gap-2">
              <Toggle label="Loading" checked={loading} onChange={setLoading} />
              <Toggle label="Disabled" checked={disabled} onChange={setDisabled} />
            </div>
          </Control>
        </div>
      </div>

      {/* ------- MATRIZ VARIANTE × COR ------- */}
      <DsSectionTitle id="variants">Variantes × Cores</DsSectionTitle>
      <div className="space-y-4">
        {VARIANTS.map((v) => (
          <div key={v} className="flex flex-wrap items-center gap-3">
            <span className="w-20 shrink-0 text-[0.7rem] uppercase tracking-wider text-white/40">{v}</span>
            {COLORS.map((c) => (
              <SvButton key={c} variant={v} color={c} size="sm">
                {c}
              </SvButton>
            ))}
          </div>
        ))}
      </div>

      {/* ------- MATRIZ DE ESTADOS ------- */}
      <DsSectionTitle id="states">Estados</DsSectionTitle>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StateCell label="Normal"><SvButton size="sm" color="magenta">Normal</SvButton></StateCell>
        <StateCell label="Hover" hint="passe o mouse"><SvButton size="sm" color="cyan">Hover</SvButton></StateCell>
        <StateCell label="Focus" hint="use Tab"><SvButton size="sm" color="violet">Focus</SvButton></StateCell>
        <StateCell label="Active" hint="segure o clique"><SvButton size="sm" color="lime">Active</SvButton></StateCell>
        <StateCell label="Loading"><SvButton size="sm" color="orange" isLoading>Loading</SvButton></StateCell>
        <StateCell label="Disabled"><SvButton size="sm" color="magenta" disabled>Disabled</SvButton></StateCell>
      </div>

      {/* ------- USO / FAB row ------- */}
      <DsSectionTitle id="fab">FAB & Icon — em ação</DsSectionTitle>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 shadow-[var(--elevation-2)]">
        <SvButton variant="fab" color="magenta" aria-label="Novo"><Plus /></SvButton>
        <SvButton variant="fab" color="cyan" size="sm" aria-label="Play"><Play /></SvButton>
        <SvButton variant="icon" color="lime" aria-label="Download"><Download /></SvButton>
        <SvButton variant="icon" color="violet" aria-label="Estrela"><Star /></SvButton>
        <SvButton variant="primary" color="yellow" icon={<Rocket />} pop="ZAP!">Deploy</SvButton>
      </div>

      {/* ------- SNIPPET ------- */}
      <DsSectionTitle id="code">Como usar</DsSectionTitle>
      <pre className="overflow-x-auto rounded-md border-2 border-black bg-black/50 p-4 text-xs leading-relaxed text-white/80">
        <code>{`import { SvButton } from "@/components/ui/sv-button"

<SvButton variant="primary" color="magenta" icon={<Rocket />} pop="ZAP!">
  Deploy
</SvButton>

<SvButton variant="fab" color="cyan" aria-label="Novo"><Plus /></SvButton>
<SvButton variant="outline" color="lime" isLoading>Enviando…</SvButton>`}</code>
      </pre>
    </div>
  )
}

/* ---------- controles auxiliares ---------- */
function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white/40">{label}</p>
      {children}
    </div>
  )
}

function Segmented({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border-2 border-black">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`px-3 py-1 text-xs uppercase transition-colors ${
            value === o ? "bg-[var(--sv-cyan)] text-black" : "bg-transparent text-white/60 hover:text-white"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className="flex items-center justify-between gap-3 rounded-md border-2 border-black bg-black/30 px-3 py-1.5 text-xs uppercase text-white/80"
    >
      {label}
      <span className={`relative h-5 w-9 rounded-full border-2 border-black transition-colors ${checked ? "bg-[var(--sv-lime)]" : "bg-white/20"}`}>
        <span className={`absolute top-0.5 size-3 rounded-full bg-black transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  )
}

function StateCell({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border-2 border-black bg-[var(--sv-ink-2)] p-4">
      <div className="flex min-h-[36px] items-center">{children}</div>
      <span className="text-[0.7rem] font-bold uppercase tracking-wide text-white/70">{label}</span>
      {hint && <span className="text-[0.6rem] text-white/35">{hint}</span>}
    </div>
  )
}
