import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getIdeas } from "@/lib/repos/dev"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Ideias" }

const STATUS_LABEL: Record<string, string> = {
  idea: "Ideia",
  mvp: "MVP",
  building: "Em construção",
  paused: "Pausado",
  done: "Concluído",
}

export default async function IdeasPage() {
  const [ideas, c] = await Promise.all([getIdeas(), getPageContent("dev.ideias")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {ideas.length === 0 ? (
        <DevEmpty>Nenhuma ideia ainda — adicione em /admin/ideas.</DevEmpty>
      ) : (
        <div className="dv-grid">
          {ideas.map((i) => (
            <article key={i.id} className="dv-card">
              <div className="flex items-center justify-between gap-2">
                <h3>{i.title}</h3>
                <span className={`dv-status ${i.status}`}>{STATUS_LABEL[i.status] ?? i.status}</span>
              </div>
              <p>{i.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {i.tags.map((t) => (
                  <span key={t} className="dv-tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
