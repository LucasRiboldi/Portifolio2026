import Link from "next/link"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsCard, DsLead } from "@/design-system/ds-ui"
import { DS_NAV } from "@/design-system/registry"
import { ArtCircleMark } from "@/components/design-system/art-graphics"

const HIERARCHY = [
  { n: "01", title: "Brand Foundation", desc: "Logo, cores, tipografia e ícones — a identidade Aranhaverso.", href: "/design-system/foundations" },
  { n: "02", title: "Design Tokens", desc: "Cores, espaçamentos, sombras, bordas, motion — valores atômicos.", href: "/design-system/tokens" },
  { n: "03", title: "Style Guide", desc: "Regras visuais que traduzem os tokens em identidade.", href: "/design-system/foundations" },
  { n: "04", title: "UI Components", desc: "Botões, forms, cards, overlays, navegação e feedback.", href: "/design-system/components" },
  { n: "05", title: "Patterns", desc: "Combinações de componentes: login, navegação, FAQ, contato.", href: "/design-system/patterns" },
  { n: "06", title: "Templates", desc: "Layouts de página reutilizáveis.", href: "/design-system/templates" },
  { n: "07", title: "Acessibilidade", desc: "WCAG 2.2: contraste, foco, ARIA, teclado, leitores de tela.", href: "/design-system/accessibility" },
  { n: "08", title: "Documentação", desc: "Convenções, uso, boas práticas e exemplos.", href: "/design-system/docs" },
]

export default function DesignSystemHome() {
  return (
    <div>
      <ComicHeader
        kicker="Design System corporativo"
        title="Consistência do"
        highlight="Aranhaverso"
      />
      <DsLead>
        Um sistema de design completo — da fundação de marca aos tokens atômicos,
        componentes, patterns, templates e documentação. Construído para garantir
        consistência visual, acelerar o desenvolvimento e facilitar a colaboração
        entre design e código.
      </DsLead>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {HIERARCHY.map((h) => (
          <Link key={h.n} href={h.href} className="group block">
            <DsCard className="h-full transition-transform group-hover:-translate-y-1">
              <div className="flex items-start gap-3">
                <span className="sv-display text-3xl text-[var(--sv-magenta)]">{h.n}</span>
                <div>
                  <h3 className="sv-heavy text-sm uppercase tracking-wide text-white">{h.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{h.desc}</p>
                </div>
              </div>
            </DsCard>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-2)]">
        <h3 className="sv-heavy relative mb-2 inline-block text-sm uppercase tracking-wide text-[var(--sv-cyan)]">
          Fase 1 · Fundação entregue
          <ArtCircleMark className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)]" />
        </h3>
        <p className="text-xs leading-relaxed text-white/70">
          Esta é a fundação navegável do Design System: arquitetura de rotas, camada
          completa de <strong>Design Tokens</strong> (CSS vars + Tailwind + export
          Figma/JSON), documentação de convenções e o índice de todos os componentes
          previstos. As próximas fases implementam cada componente e estado a partir
          deste índice.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DS_NAV.slice(1).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md border border-white/15 px-2.5 py-1 text-[0.7rem] uppercase tracking-wide text-white/60 transition-colors hover:border-[var(--sv-cyan)] hover:text-[var(--sv-cyan)]"
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
