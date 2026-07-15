import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getProjects } from "@/lib/repos/projects"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Projetos" }

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
            <article key={p.id} className="dv-card">
              {p.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="mb-3 aspect-video w-full rounded-lg object-cover"
                />
              )}
              <div className="flex items-center justify-between gap-2">
                <h3>{p.title}</h3>
                {p.featured && <span className="dv-status done">★ destaque</span>}
              </div>
              <p>{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="dv-tag">
                    {t}
                  </span>
                ))}
              </div>
              {p.href && (
                <a href={p.href} target="_blank" rel="noreferrer" className="dv-link mt-3 inline-block text-sm">
                  ❯ abrir repositório
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
