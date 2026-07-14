import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, DsCard } from "@/design-system/ds-ui"
import { A11Y_CRITERIA, WCAG_22, INTERACTIVE_STATES } from "@/design-system/registry"
import { ContrastMatrix } from "@/components/design-system/contrast-matrix"

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

      <DsSectionTitle id="wcag22">Novidades do WCAG 2.2</DsSectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {WCAG_22.map((c) => (
          <DsCard key={c.sc}>
            <div className="flex items-center gap-2">
              <span className="rounded border-2 border-[var(--sv-cyan)] px-1.5 py-0.5 font-mono text-[0.65rem] text-[var(--sv-cyan)]">{c.sc}</span>
              <h3 className="sv-heavy text-xs uppercase tracking-wide text-white">{c.name}</h3>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-white/65">{c.note}</p>
          </DsCard>
        ))}
      </div>
      <p className="mt-3 text-xs text-white/45">
        Implementado no projeto: <code className="text-[var(--sv-lime)]">SkipLink</code> (2.4.1),
        foco espesso (2.4.11/13), slider com alternativa por teclado (2.5.7), colar senha permitido (3.3.8).
      </p>

      <DsSectionTitle id="contrast">Contraste (auditoria ao vivo)</DsSectionTitle>
      <p className="mb-3 text-xs text-white/50">
        Razões calculadas dos tokens (WCAG 2.x). O último par mostra deliberadamente uma
        combinação reprovada — a paleta saturada exige atenção.
      </p>
      <ContrastMatrix />

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
