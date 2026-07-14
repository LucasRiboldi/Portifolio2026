import Link from "next/link"
import { ArrowLeft, LayoutGrid, BarChart3, Users, Settings } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvStats } from "@/components/sections/sv-proof"
import { SvProgress } from "@/components/ui/sv-feedback"
import { SvTag } from "@/components/ui/sv-data"

const ROWS = [
  { name: "SvButton", cat: "Ação", cov: 96, status: "ready" },
  { name: "SvInput", cat: "Form", cov: 91, status: "ready" },
  { name: "SvModal", cat: "Overlay", cov: 84, status: "ready" },
  { name: "SvTabs", cat: "Dados", cov: 78, status: "wip" },
]

export default function DashboardTemplatePage() {
  return (
    <div>
      <Link href="/design-system/templates" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>
      <ComicHeader kicker="06 · Template" title="Layout de" highlight="dashboard" />

      <div className="mt-6 grid gap-4 lg:grid-cols-[180px_1fr]">
        {/* sidebar */}
        <aside className="rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-3 shadow-[var(--elevation-2)]">
          {[
            { icon: LayoutGrid, label: "Visão geral", active: true },
            { icon: BarChart3, label: "Métricas" },
            { icon: Users, label: "Equipe" },
            { icon: Settings, label: "Config" },
          ].map((n) => (
            <div key={n.label} className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm ${n.active ? "bg-[var(--sv-magenta)] font-bold text-white" : "text-white/60"}`}>
              <n.icon className="size-4" /> {n.label}
            </div>
          ))}
        </aside>

        {/* conteúdo */}
        <div className="space-y-5">
          <SvStats
            stats={[
              { value: "42", label: "Componentes", color: "var(--sv-magenta)" },
              { value: "88%", label: "Cobertura", color: "var(--sv-lime)" },
              { value: "12", label: "Tokens", color: "var(--sv-cyan)" },
              { value: "6", label: "Categorias", color: "var(--sv-yellow)" },
            ]}
          />

          <div className="rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-2)]">
            <h3 className="sv-heavy mb-3 text-sm uppercase tracking-wide text-[var(--sv-cyan)]">Cobertura por componente</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-black text-xs uppercase tracking-wide text-white/50">
                    <th className="py-2">Componente</th>
                    <th className="py-2">Categoria</th>
                    <th className="py-2 w-40">Cobertura</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.name} className="border-b border-white/10 last:border-0">
                      <td className="py-2 font-bold text-white">{r.name}</td>
                      <td className="py-2 text-white/60">{r.cat}</td>
                      <td className="py-2"><SvProgress value={r.cov} tone={r.cov > 85 ? "success" : "warning"} /></td>
                      <td className="py-2"><SvTag color={r.status === "ready" ? "lime" : "yellow"}>{r.status}</SvTag></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
