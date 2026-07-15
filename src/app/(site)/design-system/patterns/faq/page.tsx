import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsLead } from "@/design-system/ds-ui"
import { SvAccordion } from "@/components/ui/sv-data"

export default function FaqPatternPage() {
  return (
    <div>
      <Link href="/design-system/patterns" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Patterns
      </Link>
      <ComicHeader kicker="05 · Pattern" title="Perguntas" highlight="frequentes" />
      <DsLead>Pattern de FAQ construído sobre o SvAccordion — um item aberto por vez, acessível por teclado.</DsLead>

      <div className="mt-6 max-w-2xl">
        <SvAccordion
          items={[
            { id: "1", title: "O que é o Design System?", content: "Um design system comic-first construído sobre design tokens, com componentes, patterns e templates prontos." },
            { id: "2", title: "Posso usar em produção?", content: "Sim. Todos os componentes têm estados, acessibilidade WCAG 2.2 AA e build validado." },
            { id: "3", title: "Como exporto os tokens para o Figma?", content: "Rode npm run tokens:export — gera design-tokens.figma.json (Tokens Studio) e o formato W3C DTCG." },
            { id: "4", title: "Funciona com tema claro?", content: "Sim. É dark-first, com override .light para superfícies e texto." },
            { id: "5", title: "Como contribuo com um novo componente?", content: "Crie em src/components/ui/, registre em registry.ts e siga docs/design-system/component-structure.md." },
          ]}
        />
      </div>
    </div>
  )
}
