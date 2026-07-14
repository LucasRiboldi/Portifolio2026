import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, StatusPill, DsCard } from "@/design-system/ds-ui"
import { COMPONENTS, INTERACTIVE_STATES } from "@/design-system/registry"

export default function ComponentsPage() {
  return (
    <div>
      <ComicHeader kicker="04 · UI Components" title="Biblioteca de" highlight="componentes" />
      <DsLead>
        Índice completo dos componentes previstos, com variantes e estados. Cada item
        segue a mesma anatomia (ver <code className="text-[var(--sv-cyan)]">Documentação → Estrutura</code>)
        e cobre os estados interativos canônicos:{" "}
        <span className="text-white/80">{INTERACTIVE_STATES.join(" · ")}</span>.
      </DsLead>

      {COMPONENTS.map((group) => (
        <section key={group.id}>
          <DsSectionTitle id={group.id}>{group.title}</DsSectionTitle>
          <p className="mb-4 text-xs text-white/50">{group.description}</p>
          <div className="grid gap-3">
            {group.items.map((item) => (
              <DsCard key={item.name}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="sv-heavy text-sm uppercase tracking-wide text-white">{item.name}</h3>
                  <StatusPill status={item.status} />
                </div>
                {item.variants && (
                  <TagRow label="Variantes" tags={item.variants} color="var(--sv-magenta)" />
                )}
                {item.examples && (
                  <TagRow label="Exemplos" tags={item.examples} color="var(--sv-lime)" />
                )}
                {item.states && (
                  <TagRow label="Estados" tags={item.states} color="var(--sv-cyan)" />
                )}
              </DsCard>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function TagRow({ label, tags, color }: { label: string; tags: string[]; color: string }) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-white/40">{label}</span>
      {tags.map((t) => (
        <span
          key={t}
          className="rounded border px-1.5 py-0.5 text-[0.65rem] text-white/75"
          style={{ borderColor: `${color}55` }}
        >
          {t}
        </span>
      ))}
    </div>
  )
}
