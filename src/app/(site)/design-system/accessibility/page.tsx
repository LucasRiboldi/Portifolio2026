import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, DsCard } from "@/design-system/ds-ui"
import { A11Y_CRITERIA, INTERACTIVE_STATES } from "@/design-system/registry"

export default function AccessibilityPage() {
  return (
    <div>
      <ComicHeader kicker="07 · A11y" title="Acessibilidade" highlight="WCAG 2.2" />
      <DsLead>
        Acessibilidade não é opcional. Todo componente do Design System deve atender aos
        critérios abaixo (nível AA). Ver o guia completo em{" "}
        <code className="text-[var(--sv-cyan)]">docs/design-system/accessibility-wcag.md</code>.
      </DsLead>

      <DsSectionTitle id="criteria">Critérios obrigatórios</DsSectionTitle>
      <div className="grid gap-3">
        {A11Y_CRITERIA.map((c) => (
          <DsCard key={c.name}>
            <h3 className="sv-heavy text-sm uppercase tracking-wide text-[var(--sv-lime)]">{c.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/70">{c.note}</p>
          </DsCard>
        ))}
      </div>

      <DsSectionTitle id="states">Estados & leitores de tela</DsSectionTitle>
      <p className="mb-3 text-xs text-white/50">
        Cada estado interativo precisa de um equivalente perceptível e anunciável:
      </p>
      <div className="flex flex-wrap gap-2">
        {INTERACTIVE_STATES.map((s) => (
          <span key={s} className="rounded-md border-2 border-black bg-[var(--sv-ink-2)] px-2.5 py-1 text-xs text-white/80 shadow-[var(--elevation-1)]">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}
