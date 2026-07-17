"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle } from "@/design-system/ds-ui"
import { Badge } from "@/components/ui/badge"
import {
  SvChip, SvTag, SvPagination, SvBreadcrumb, SvTabs, SvAccordion,
} from "@/components/ui/sv-data"

export function DataDisplayContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  const [chips, setChips] = useState(["React", "TypeScript", "Tailwind", "Next.js"])
  const [page, setPage] = useState(1)

  return (
    <div>
      <Link href="/design-system/components" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Componentes
      </Link>
      <ComicHeader as={headingAs} kicker="04 · Data Display" title="Dados com" highlight="atitude" />

      <DsSectionTitle id="chips">Chips & Tags</DsSectionTitle>
      <div className="mb-4 flex flex-wrap gap-2">
        {chips.map((c, i) => (
          <SvChip key={c} color={(["magenta", "cyan", "lime", "violet"] as const)[i % 4]} onRemove={() => setChips((cs) => cs.filter((x) => x !== c))}>
            {c}
          </SvChip>
        ))}
        {chips.length === 0 && <span className="text-xs text-white/40">Todos removidos — recarregue a página.</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        <SvTag color="magenta">Novo</SvTag>
        <SvTag color="cyan">Beta</SvTag>
        <SvTag color="lime">Estável</SvTag>
        <Badge>Badge shadcn</Badge>
      </div>

      <DsSectionTitle id="breadcrumb">Breadcrumb</DsSectionTitle>
      <SvBreadcrumb items={[{ label: "Início", href: "/" }, { label: "Design System", href: "/design-system" }, { label: "Data Display" }]} />

      <DsSectionTitle id="pagination">Pagination</DsSectionTitle>
      <SvPagination page={page} total={6} onChange={setPage} />
      <p className="mt-2 text-xs text-white/40">Página {page} de 6</p>

      <DsSectionTitle id="tabs">Tabs</DsSectionTitle>
      <SvTabs
        tabs={[
          { id: "over", label: "Visão", content: "Conteúdo da aba Visão geral." },
          { id: "spec", label: "Specs", content: "Especificações técnicas do componente." },
          { id: "a11y", label: "A11y", content: "Notas de acessibilidade e ARIA." },
        ]}
      />

      <DsSectionTitle id="accordion">Accordion</DsSectionTitle>
      <SvAccordion
        items={[
          { id: "1", title: "O que é o Design System?", content: "Um design system comic-first construído sobre tokens." },
          { id: "2", title: "Como uso os tokens?", content: "Via classes Tailwind mapeadas ou CSS vars diretas." },
          { id: "3", title: "É acessível?", content: "Sim — todos os componentes seguem WCAG 2.2 AA." },
        ]}
      />
    </div>
  )
}
