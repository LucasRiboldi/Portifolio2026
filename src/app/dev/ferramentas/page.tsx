import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getTools } from "@/lib/repos/tools"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Ferramentas" }

export default async function DevToolsPage() {
  const [tools, c] = await Promise.all([getTools(), getPageContent("dev.ferramentas")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {tools.length === 0 ? (
        <DevEmpty>Nenhuma ferramenta ainda — adicione em /admin/tools.</DevEmpty>
      ) : (
        <div className="dv-grid">
          {tools.map((t) => (
            <article key={t.id} className="dv-card">
              <div className="flex items-center gap-2">
                <span aria-hidden>{t.emoji}</span>
                <h3>{t.name}</h3>
              </div>
              <p>{t.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.stack.map((s) => (
                  <span key={s} className="dv-tag">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-4 text-sm">
                {t.demoUrl && (
                  <a href={t.demoUrl} target="_blank" rel="noreferrer" className="dv-link">
                    ❯ demo
                  </a>
                )}
                {t.githubUrl && (
                  <a href={t.githubUrl} target="_blank" rel="noreferrer" className="dv-link">
                    ❯ repo
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
