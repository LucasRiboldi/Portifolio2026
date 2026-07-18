import Link from "next/link"

import { getProjects } from "@/lib/repos/projects"
import { getTools } from "@/lib/repos/tools"
import { getSnippets, getLab, getDevlogs } from "@/lib/repos/dev"
import { getSiteConfig } from "@/lib/repos/site-config"
import { GsapDemo } from "@/components/dev/gsap-demo"

export const metadata = { title: "Dev" }

const STACK = ["TypeScript", "React", "Next.js", "Node", "Python", "Supabase", "Tailwind", "Postgres"]

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
    { n: projects.length, l: "projetos", href: "/desenvolvedor/projetos", color: "var(--d-green)" },
    { n: lab.length, l: "experimentos", href: "/desenvolvedor/laboratorio", color: "var(--d-cyan)" },
    { n: snippets.length, l: "snippets", href: "/desenvolvedor/codigo", color: "var(--d-pink)" },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="dv-hero">
        <p className="term">
          <span className="tok-fn">const</span> dev = <span className="tok-str">{"{"}</span> nome:{" "}
          <span className="tok-str">&quot;{site.name}&quot;</span> {"}"}
          <span className="dv-caret">▌</span>
        </p>
        <h1>
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

      {/* Stats */}
      <div className="dv-stats">
        {stats.map((s) => (
          <Link key={s.l} href={s.href} className="dv-stat">
            <div className="n" style={{ color: s.color }}>
              {s.n}
            </div>
            <div className="l">{s.l}</div>
          </Link>
        ))}
      </div>

      {/* Projeto em destaque */}
      {featured && (
        <>
          <h2 className="dv-section-title">Projeto em destaque</h2>
          <article className="dv-card">
            <div className="flex items-center justify-between gap-2">
              <h3>{featured.title}</h3>
              <span className="dv-status done">★ destaque</span>
            </div>
            <p>{featured.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {featured.tags.map((t) => (
                <span key={t} className="dv-tag">
                  {t}
                </span>
              ))}
            </div>
            {featured.href && (
              <a href={featured.href} target="_blank" rel="noreferrer" className="dv-link mt-3 inline-block text-sm">
                ❯ abrir repositório
              </a>
            )}
          </article>
        </>
      )}

      {/* Devlog — últimas entradas na linha do tempo */}
      {devlogs.length > 0 && (
        <>
          <h2 className="dv-section-title">Devlog</h2>
          <div className="dv-timeline">
            {devlogs.slice(0, 3).map((d) => (
              <article key={d.id} className="dv-tl-item">
                <div className="dv-tl-date">{d.date}</div>
                <h3>{d.title}</h3>
                <p className="dv-prose">{d.summary}</p>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Demo de motion — GSAP */}
      <h2 className="dv-section-title">Stack em movimento</h2>
      <GsapDemo />

      {/* Acesso rápido */}
      <h2 className="dv-section-title">Explorar</h2>
      <div className="dv-grid" style={{ marginTop: "0.5rem" }}>
        {[
          { href: "/desenvolvedor/ferramentas", t: "Ferramentas", d: `${tools.length} utilitários do dia a dia` },
          { href: "/desenvolvedor/codigo", t: "Código", d: "Snippets e boilerplates reutilizáveis" },
          { href: "/desenvolvedor/learn", t: "Learn", d: "Trilhas para aprender linguagens (C, Java…)" },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="dv-card">
            <h3 style={{ fontSize: "1rem" }}>{x.t} →</h3>
            <p>{x.d}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
