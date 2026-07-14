"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvStats } from "@/components/sections/sv-proof"
import { SvTabs, SvTag } from "@/components/ui/sv-data"
import { SvButton } from "@/components/ui/sv-button"

export default function ProfileTemplatePage() {
  return (
    <div>
      <Link href="/design-system/templates" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>
      <ComicHeader kicker="06 · Template" title="Perfil" highlight="/ conta" />

      {/* header do perfil com screentone */}
      <div className="fx-bolts relative overflow-hidden rounded-xl border-[3px] border-black bg-[linear-gradient(160deg,#241019,#0a0612)] p-6">
        <div className="fx-screentone pointer-events-none absolute inset-0 opacity-15" style={{ ["--st-color" as string]: "rgba(182,255,0,0.6)" } as React.CSSProperties} />
        <div className="relative flex flex-col items-center gap-4 sm:flex-row">
          <span className="grid size-24 shrink-0 place-items-center rounded-full border-[3px] border-black bg-[var(--sv-magenta)] font-[family-name:var(--font-display)] text-4xl text-black shadow-[var(--elevation-3)]">LR</span>
          <div className="text-center sm:text-left">
            <h2 className="sv-display text-3xl uppercase text-white">Lucas Riboldi</h2>
            <p className="text-xs uppercase tracking-wide text-white/50">Product Designer & Dev · Terra-2026</p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:justify-start">
              <SvTag color="cyan">Design System</SvTag><SvTag color="lime">Frontend</SvTag><SvTag color="magenta">Motion</SvTag>
            </div>
          </div>
          <SvButton color="cyan" variant="secondary" size="sm" className="sm:ml-auto">Editar perfil</SvButton>
        </div>
      </div>

      <div className="mt-6">
        <SvStats stats={[
          { value: "42", label: "Projetos", color: "var(--sv-magenta)" },
          { value: "1.2k", label: "Estrelas", color: "var(--sv-yellow)" },
          { value: "89", label: "Seguidores", color: "var(--sv-cyan)" },
          { value: "5", label: "Dimensões", color: "var(--sv-lime)" },
        ]} />
      </div>

      <div className="mt-6">
        <SvTabs tabs={[
          { id: "sobre", label: "Sobre", content: "Designer no cruzamento entre arte e código. Construo design systems e experimentos." },
          { id: "projetos", label: "Projetos", content: "Portfólio de design, código, arte e imagem — cada um em sua dimensão." },
          { id: "atividade", label: "Atividade", content: "Últimos commits, releases e artigos publicados." },
        ]} />
      </div>
    </div>
  )
}
