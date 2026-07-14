import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, StatusPill, DsCard } from "@/design-system/ds-ui"
import { TEMPLATES, BREAKPOINTS } from "@/design-system/registry"

export default function TemplatesPage() {
  return (
    <div>
      <ComicHeader kicker="06 · Templates" title="Layouts" highlight="reutilizáveis" />
      <DsLead>
        Estruturas de página completas montadas a partir de patterns e componentes.
        Todas seguem as regras de responsividade abaixo.
      </DsLead>

      <DsSectionTitle id="templates">Templates de Página</DsSectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {TEMPLATES.map((t) => (
          <DsCard key={t.name}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="sv-heavy text-sm uppercase tracking-wide text-white">{t.name}</h3>
              <div className="flex items-center gap-2">
                {t.href && (
                  <Link href={t.href} className="inline-flex items-center gap-1 rounded border-2 border-[var(--sv-cyan)] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--sv-cyan)] transition-colors hover:bg-[var(--sv-cyan)] hover:text-black">
                    Ver <ArrowRight className="size-3" />
                  </Link>
                )}
                <StatusPill status={t.status} />
              </div>
            </div>
          </DsCard>
        ))}
      </div>

      <DsSectionTitle id="responsive">Responsividade</DsSectionTitle>
      <div className="overflow-x-auto rounded-md border-2 border-black">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-black bg-white/5">
              <th className="px-3 py-2 uppercase tracking-wide text-white/70">Breakpoint</th>
              <th className="px-3 py-2 uppercase tracking-wide text-white/70">min-width</th>
            </tr>
          </thead>
          <tbody>
            {BREAKPOINTS.map((b) => (
              <tr key={b.name} className="border-b border-white/10 last:border-0">
                <td className="px-3 py-2 text-white/80">{b.name}</td>
                <td className="px-3 py-2 font-mono text-[var(--sv-cyan)]">{b.min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
