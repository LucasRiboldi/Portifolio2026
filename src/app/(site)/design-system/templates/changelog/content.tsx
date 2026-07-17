import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvTag } from "@/components/ui/sv-data"


const RELEASES = [
  { v: "v1.5", date: "14 jul 2026", accent: "magenta", tags: ["Lab", "Assets"], items: ["Expansão Spider-Punk: 11 efeitos, 14 ilustrações, 10 logos", "16 motions e 14 ícones próprios"] },
  { v: "v1.4", date: "14 jul 2026", accent: "cyan", tags: ["Blog", "Grid"], items: ["Blog funcional file-based (markdown)", "Grid System documentado + demo"] },
  { v: "v1.3", date: "13 jul 2026", accent: "lime", tags: ["Direção de Arte"], items: ["Camada .art-* (texturas, halftones, contornos)", "Universo visual por rota"] },
  { v: "v1.2", date: "13 jul 2026", accent: "yellow", tags: ["Templates", "Patterns"], items: ["Login, busca, multi-step, FAQ", "Dashboard e artigo"] },
  { v: "v1.0", date: "12 jul 2026", accent: "violet", tags: ["Fundação"], items: ["Design Tokens (CSS + TS + export)", "40+ componentes"] },
] as const

export function ChangelogTemplateContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  return (
    <div className="fx-grain relative">
      <Link href="/design-system/templates" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>
      <ComicHeader as={headingAs} kicker="06 · Template" title="Changelog" highlight="// releases" />

      <ol className="relative ml-3 border-l-[3px] border-white/15">
        {RELEASES.map((r) => (
          <li key={r.v} className="relative mb-8 pl-6 last:mb-0">
            <span aria-hidden className="absolute -left-[11px] top-1 size-5 rounded-full border-[3px] border-black" style={{ background: `var(--sv-${r.accent})`, filter: "url(#art-rough)" }} />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-[family-name:var(--font-display)] text-2xl uppercase" style={{ color: `var(--sv-${r.accent})` }}>{r.v}</span>
              <span className="text-[0.7rem] uppercase tracking-wide text-white/40">{r.date}</span>
              {r.tags.map((t) => <SvTag key={t} color={r.accent}>{t}</SvTag>)}
            </div>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-white/70">
              {r.items.map((it) => <li key={it} className="before:mr-2 before:text-[var(--sv-cyan)] before:content-['▸']">{it}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
