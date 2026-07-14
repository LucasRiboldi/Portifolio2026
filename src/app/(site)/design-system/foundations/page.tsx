import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, StatusPill, DsCard } from "@/design-system/ds-ui"
import { FOUNDATIONS } from "@/design-system/registry"

export default function FoundationsPage() {
  return (
    <div>
      <ComicHeader kicker="01 + 03 · Brand & Style" title="Fundação de" highlight="marca" />
      <DsLead>
        Brand Foundation e Style Guide: a identidade visual do Aranhaverso e as regras
        que traduzem os Design Tokens em linguagem consistente.
      </DsLead>

      {FOUNDATIONS.map((group) => (
        <section key={group.id}>
          <DsSectionTitle id={group.id}>{group.title}</DsSectionTitle>
          <p className="mb-4 text-xs text-white/50">{group.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <DsCard key={item.name}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="sv-heavy text-sm uppercase tracking-wide text-white">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    {item.href && (
                      <Link href={item.href} className="inline-flex items-center gap-1 rounded border-2 border-[var(--sv-cyan)] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--sv-cyan)] transition-colors hover:bg-[var(--sv-cyan)] hover:text-black">
                        Ver <ArrowRight className="size-3" />
                      </Link>
                    )}
                    <StatusPill status={item.status} />
                  </div>
                </div>
                {item.examples && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.examples.map((e) => (
                      <span key={e} className="rounded border border-white/15 px-1.5 py-0.5 text-[0.65rem] text-white/70">
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </DsCard>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
