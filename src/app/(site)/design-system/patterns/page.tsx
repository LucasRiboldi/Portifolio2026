import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, StatusPill, DsCard } from "@/design-system/ds-ui"
import { PATTERNS, MOTION_PATTERNS } from "@/design-system/registry"

export default function PatternsPage() {
  return (
    <div>
      <ComicHeader kicker="05 · Patterns" title="Padrões de" highlight="interface" />
      <DsLead>
        Combinações de componentes que resolvem fluxos recorrentes — login, navegação,
        FAQ, contato — e os padrões de Motion Design que dão vida ao Aranhaverso.
      </DsLead>

      <DsSectionTitle id="ui-patterns">Fluxos & Combinações</DsSectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {PATTERNS.map((p) => (
          <DsCard key={p.name}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="sv-heavy text-sm uppercase tracking-wide text-white">{p.name}</h3>
              <StatusPill status={p.status} />
            </div>
          </DsCard>
        ))}
      </div>

      <DsSectionTitle id="motion">Motion Design</DsSectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {MOTION_PATTERNS.map((m) => (
          <DsCard key={m.name}>
            <h3 className="sv-heavy text-sm uppercase tracking-wide text-white">{m.name}</h3>
            <p className="mt-1 text-xs text-white/60">{m.note}</p>
            <code className="mt-2 inline-block font-mono text-[0.7rem] text-[var(--sv-cyan)]">{m.token}</code>
          </DsCard>
        ))}
      </div>
    </div>
  )
}
