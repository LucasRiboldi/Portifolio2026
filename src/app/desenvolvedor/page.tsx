import type { Metadata } from "next"

import { getProjects } from "@/lib/repos/projects"
import { getTools } from "@/lib/repos/tools"
import { getSnippets, getLab, getDevlogs } from "@/lib/repos/dev"
import { getSiteConfig } from "@/lib/repos/site-config"
import { GsapDemo } from "@/components/dev/gsap-demo"
import {
  DevSection,
  DevPanel,
  DevPanelHead,
  DevPanelFoot,
  DevExternalLink,
  DevInternalLink,
  StatTile,
  TagList,
  MetaRow,
} from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Início",
  description: "Índice do laboratório: projetos, experimentos, ferramentas, snippets e devlog.",
}

const STACK = ["TypeScript", "React", "Next.js", "Node", "Python", "Supabase", "Tailwind", "Postgres"] as const

const ATALHOS = [
  { href: "/desenvolvedor/ferramentas", t: "Ferramentas", d: "Utilitários que rodam no navegador e utilitários publicados" },
  { href: "/desenvolvedor/codigo", t: "Código", d: "Snippets e boilerplates reutilizáveis, com destaque de sintaxe" },
  { href: "/desenvolvedor/learn", t: "Learn", d: "Trilhas de estudo por linguagem, com exercícios e progresso" },
] as const

export default async function DevHome() {
  const [projects, tools, snippets, lab, site, devlogs] = await Promise.all([
    getProjects(),
    getTools(),
    getSnippets(),
    getLab(),
    getSiteConfig(),
    getDevlogs(),
  ])

  const featured = projects.find((p) => p.featured) ?? projects[0]

  const stats = [
    { n: projects.length, l: "projetos", href: "/desenvolvedor/projetos", color: "var(--dev-ok)" },
    { n: lab.length, l: "experimentos", href: "/desenvolvedor/laboratorio", color: "var(--dev-signal)" },
    { n: snippets.length, l: "snippets", href: "/desenvolvedor/codigo", color: "var(--dev-mark)" },
  ]

  return (
    <>
      {/* Cabeçalho do realm. É o único h1 da página — os blocos abaixo entram
          como <section> com h2, o que antes não acontecia: eram h2 soltos,
          irmãos de <div>, e o outline do documento saía achatado. */}
      <section className="dv-hero" aria-labelledby="dv-hero-titulo">
        <p className="term">
          <span className="tok-fn">const</span> dev = <span className="tok-str">{"{"}</span> nome:{" "}
          <span className="tok-str">&quot;{site.name}&quot;</span> {"}"}
          <span className="dv-caret" aria-hidden>
            ▌
          </span>
        </p>
        <h1 id="dv-hero-titulo">
          Construo <span className="g">produtos</span>, <span className="p">ferramentas</span> e{" "}
          <span className="c">experimentos</span> digitais.
        </h1>
        <p>{site.description}</p>
        <div className="dv-chip-row">
          {STACK.map((s) => (
            <span key={s} className="dv-tag">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Indicadores: contagem + destino. São o índice numérico do acervo. */}
      <nav className="dv-stats" aria-label="Acervo em números">
        {stats.map((s) => (
          <StatTile key={s.l} value={s.n} label={s.l} href={s.href} color={s.color} />
        ))}
      </nav>

      {featured && (
        <DevSection id="destaque" index={1} title="Projeto em destaque" meta={featured.tags[0] ?? "projeto"}>
          <DevPanel>
            <DevPanelHead
              title={featured.title}
              href={featured.slug ? `/desenvolvedor/projetos/${featured.slug}` : undefined}
              badge={<span className="dv-status done">★ destaque</span>}
            />
            <p>{featured.description}</p>
            <TagList items={featured.tags} />
            {(featured.href || featured.slug) && (
              <DevPanelFoot>
                {featured.slug && (
                  <DevInternalLink href={`/desenvolvedor/projetos/${featured.slug}`}>ver README</DevInternalLink>
                )}
                {featured.href && <DevExternalLink href={featured.href}>abrir repositório</DevExternalLink>}
              </DevPanelFoot>
            )}
          </DevPanel>
        </DevSection>
      )}

      {devlogs.length > 0 && (
        <DevSection
          id="devlog"
          index={2}
          title="Devlog"
          meta={`${devlogs.length} entrada${devlogs.length === 1 ? "" : "s"}`}
          note="Registro cronológico do que foi construído, na ordem em que aconteceu."
        >
          {/* <ol> porque a ordem CARREGA significado aqui — é uma linha do
              tempo. O <div> anterior não dizia isso a ninguém. */}
          <ol className="dv-timeline">
            {devlogs.slice(0, 3).map((d) => (
              <li key={d.id} className="dv-tl-item">
                <time className="dv-tl-date">{d.date}</time>
                <h3>{d.title}</h3>
                <p className="dv-prose">{d.summary}</p>
              </li>
            ))}
          </ol>
        </DevSection>
      )}

      <DevSection
        id="stack"
        index={3}
        title="Stack em movimento"
        meta="GSAP · ScrollTrigger"
        note="Demonstração funcional do motor de animação usado no site."
      >
        <GsapDemo />
      </DevSection>

      <DevSection id="explorar" index={4} title="Explorar" meta={`${ATALHOS.length} áreas`}>
        <div className="dv-objects">
          {ATALHOS.map((x) => (
            <DevPanel key={x.href}>
              <DevPanelHead title={x.t} href={x.href} />
              <p>{x.d}</p>
              <DevPanelFoot>
                <DevInternalLink href={x.href}>entrar</DevInternalLink>
              </DevPanelFoot>
            </DevPanel>
          ))}
        </div>
      </DevSection>

      {/* Rodapé de estado: os números que descrevem o acervo inteiro, no fim
          da leitura, com rótulo. Antes o total de ferramentas só aparecia
          escondido dentro de um texto de card. */}
      <footer className="dv-section">
        <MetaRow
          items={[
            { k: "projetos", v: projects.length },
            { k: "experimentos", v: lab.length },
            { k: "snippets", v: snippets.length },
            { k: "ferramentas", v: tools.length },
            { k: "devlogs", v: devlogs.length },
          ]}
        />
      </footer>
    </>
  )
}
