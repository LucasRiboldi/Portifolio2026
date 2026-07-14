import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, DsCard } from "@/design-system/ds-ui"

const DOCS = [
  { file: "README.md", title: "Arquitetura & Hierarquia", desc: "Estrutura do Design System e como estender." },
  { file: "naming-conventions.md", title: "Convenção de Nomenclatura", desc: "BEM + Tailwind + tokens: como nomear tudo." },
  { file: "component-structure.md", title: "Estrutura de Componentes", desc: "Anatomia, pastas, CVA e API de props." },
  { file: "states-and-variants.md", title: "Estados & Variantes", desc: "Matriz de estados interativos canônicos." },
  { file: "responsiveness.md", title: "Responsividade", desc: "Breakpoints, grid e regras mobile-first." },
  { file: "accessibility-wcag.md", title: "Acessibilidade (WCAG)", desc: "Checklist AA por componente." },
  { file: "tokens.md", title: "Design Tokens", desc: "Camadas, sincronização e export Figma/JSON." },
  { file: "roadmap.md", title: "Roadmap por Fases", desc: "O que vem depois da fundação." },
]

export default function DocsPage() {
  return (
    <div>
      <ComicHeader kicker="08 · Docs" title="Documentação" highlight="técnica" />
      <DsLead>
        A documentação vive em <code className="text-[var(--sv-cyan)]">docs/design-system/</code>{" "}
        (uma fonte de verdade por tópico). Abaixo, o mapa dos guias.
      </DsLead>

      <DsSectionTitle id="guides">Guias</DsSectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {DOCS.map((d) => (
          <DsCard key={d.file}>
            <h3 className="sv-heavy text-sm uppercase tracking-wide text-white">{d.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/60">{d.desc}</p>
            <code className="mt-2 inline-block font-mono text-[0.7rem] text-[var(--sv-cyan)]">
              docs/design-system/{d.file}
            </code>
          </DsCard>
        ))}
      </div>
    </div>
  )
}
