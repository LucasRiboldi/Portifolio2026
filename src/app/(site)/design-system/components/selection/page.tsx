"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle } from "@/design-system/ds-ui"
import {
  SvCheckbox, SvRadio, SvRadioGroup, SvSwitch, SvRating, SvSlider,
} from "@/components/ui/sv-choice"

export default function SelectionPage() {
  const [rating, setRating] = useState(3)
  const [power, setPower] = useState(65)

  return (
    <div>
      <Link
        href="/design-system/components"
        className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]"
      >
        <ArrowLeft className="size-3.5" /> Componentes
      </Link>

      <ComicHeader kicker="04 · Seleção" title="Escolhas que" highlight="carimbam" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Demo title="Checkbox">
          <div className="flex flex-col gap-3">
            <SvCheckbox label="Aranha comum" defaultChecked />
            <SvCheckbox label="Sentido aranha" />
            <SvCheckbox label="Indisponível" disabled />
          </div>
        </Demo>

        <Demo title="Radio">
          <SvRadioGroup name="dim">
            <SvRadio label="Neon" defaultChecked />
            <SvRadio label="Noir" />
            <SvRadio label="Punk" />
          </SvRadioGroup>
        </Demo>

        <Demo title="Switch">
          <div className="flex flex-col gap-3">
            <SvSwitch label="Modo multiverso" defaultChecked />
            <SvSwitch label="Halftone" />
            <SvSwitch label="Bloqueado" disabled />
          </div>
        </Demo>

        <Demo title="Rating">
          <div className="flex flex-col items-start gap-2">
            <SvRating value={rating} onChange={setRating} />
            <span className="text-xs text-white/50">{rating} de 5 teias</span>
          </div>
        </Demo>

        <Demo title="Slider" className="sm:col-span-2">
          <SvSlider label="Nível de poder" value={power} onChange={(e) => setPower(+e.target.value)} />
        </Demo>
      </div>

      <DsSectionTitle id="code">Como usar</DsSectionTitle>
      <pre className="overflow-x-auto rounded-md border-2 border-black bg-black/50 p-4 text-xs leading-relaxed text-white/80">
        <code>{`import { SvCheckbox, SvSwitch, SvRating } from "@/components/ui/sv-choice"

<SvCheckbox label="Aceito os termos" />
<SvSwitch label="Modo escuro" defaultChecked />
<SvRating value={rating} onChange={setRating} />`}</code>
      </pre>
    </div>
  )
}

function Demo({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-2)] ${className}`}>
      <p className="sv-heavy mb-4 text-xs uppercase tracking-wide text-[var(--sv-cyan)]">{title}</p>
      {children}
    </div>
  )
}
