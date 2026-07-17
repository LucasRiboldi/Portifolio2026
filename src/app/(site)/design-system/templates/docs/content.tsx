import Link from "next/link"
import { ArrowLeft, Hash } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvBreadcrumb, SvTag } from "@/components/ui/sv-data"


const NAV = [
  { group: "Começando", items: ["Introdução", "Instalação", "Tokens"] },
  { group: "Componentes", items: ["Botões", "Inputs", "Overlays"] },
  { group: "Guias", items: ["Acessibilidade", "Motion"] },
]

export function DocsTemplateContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  return (
    <div>
      <Link href="/design-system/templates" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>
      <ComicHeader as={headingAs} kicker="06 · Template" title="Documentação" highlight="técnica" />

      <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          {NAV.map((n) => (
            <div key={n.group} className="mb-4">
              <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-white/40">{n.group}</p>
              <ul className="flex flex-col gap-0.5">
                {n.items.map((it, i) => (
                  <li key={it}>
                    <span className={`block rounded px-2 py-1 text-sm ${n.group === "Começando" && i === 2 ? "bg-[var(--sv-cyan)] font-bold text-black" : "text-white/60 hover:text-[var(--sv-cyan)]"}`}>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* conteúdo */}
        <article className="art-paper sv-article max-w-2xl">
          <SvBreadcrumb items={[{ label: "Docs", href: "#" }, { label: "Começando" }, { label: "Tokens" }]} />
          <div className="mt-3 flex items-center gap-2"><SvTag color="lime">Estável</SvTag><span className="text-[0.7rem] text-white/40">Atualizado hoje</span></div>
          <h2 className="group flex items-center gap-2"><Hash className="size-4 text-[var(--sv-cyan)]" /> Design Tokens</h2>
          <p>Tokens são os valores atômicos do sistema — a única fonte de verdade de cor, tipografia, espaçamento, forma e movimento.</p>
          <h2>Três camadas</h2>
          <ul>
            <li><strong>Primitivo</strong> — valor cru (<code>--c-primary-500</code>)</li>
            <li><strong>Semântico</strong> — intenção (<code>--color-primary</code>)</li>
            <li><strong>Componente</strong> — aplicado via Tailwind</li>
          </ul>
          <blockquote>Componentes consomem semânticos, nunca hexadecimais soltos.</blockquote>
          <h2>Export</h2>
          <p>Rode <code>npm run tokens:export</code> para gerar os formatos W3C DTCG e Figma Tokens Studio.</p>
        </article>
      </div>
    </div>
  )
}
