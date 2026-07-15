import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getProjects } from "@/lib/repos/projects"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Projetos" }

const CATEGORY: Record<string, string> = {
  code: "Código",
  design: "Design",
  art: "Arte",
  image: "Imagem",
}

export default async function DevProjectsPage() {
  const [projects, c] = await Promise.all([getProjects(), getPageContent("dev.projetos")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {projects.length === 0 ? (
        <DevEmpty>Nenhum projeto ainda — adicione em /admin/projects.</DevEmpty>
      ) : (
        <div className="dv-grid">
          {projects.map((p) => (
            <article key={p.id} className="dv-card flex flex-col">
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt={p.title} className="mb-3 aspect-video w-full rounded-lg object-cover" />
              ) : (
                <div
                  className="mb-3 grid aspect-video w-full place-items-center rounded-lg font-mono text-xs"
                  style={{ background: "var(--d-bg)", color: "var(--d-comment)", border: "1px solid var(--d-current)" }}
                >
                  {"</>"} {p.title}
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <h3>{p.title}</h3>
                <span className="dv-tag">{CATEGORY[p.category] ?? p.category}</span>
              </div>
              <p className="flex-1">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="dv-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                {p.featured ? <span className="dv-status done">★ destaque</span> : <span />}
                {p.href && (
                  <a href={p.href} target="_blank" rel="noreferrer" className="dv-link text-sm">
                    ❯ abrir repositório
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
