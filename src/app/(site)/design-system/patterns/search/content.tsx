"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvInput } from "@/components/ui/sv-input"
import { SvChip, SvTag } from "@/components/ui/sv-data"
import { SvEmptyState } from "@/components/ui/sv-feedback"

const DATA = [
  { name: "SvButton", cat: "Ação" },
  { name: "SvInput", cat: "Form" },
  { name: "SvModal", cat: "Overlay" },
  { name: "SvToast", cat: "Feedback" },
  { name: "SvTabs", cat: "Dados" },
  { name: "SvPricing", cat: "Seção" },
  { name: "SvTimeline", cat: "Seção" },
  { name: "SvAccordion", cat: "Dados" },
]
const CATS = ["Ação", "Form", "Overlay", "Feedback", "Dados", "Seção"]

export function SearchPatternContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  const [q, setQ] = useState("")
  const [active, setActive] = useState<string[]>([])

  const results = useMemo(
    () =>
      DATA.filter(
        (d) =>
          d.name.toLowerCase().includes(q.toLowerCase()) &&
          (active.length === 0 || active.includes(d.cat))
      ),
    [q, active]
  )

  const toggle = (c: string) => setActive((a) => (a.includes(c) ? a.filter((x) => x !== c) : [...a, c]))

  return (
    <div>
      <Link href="/design-system/patterns" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Patterns
      </Link>
      <ComicHeader as={headingAs} kicker="05 · Pattern" title="Busca &" highlight="filtros" />

      <div className="mt-4 max-w-md">
        <SvInput type="search" placeholder="Buscar componente…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => toggle(c)} aria-pressed={active.includes(c)}>
            <SvChip color={active.includes(c) ? "lime" : "cyan"}>{c}</SvChip>
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs uppercase tracking-wide text-white/40">{results.length} resultado(s)</p>

      {results.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <div key={r.name} className="flex items-center justify-between rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] p-3 shadow-[var(--elevation-1)]">
              <span className="sv-heavy text-sm text-white">{r.name}</span>
              <SvTag color="violet">{r.cat}</SvTag>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <SvEmptyState onoma="POOF!" title="Nada encontrado" description="Tente outra busca ou remova filtros." />
        </div>
      )}
    </div>
  )
}
