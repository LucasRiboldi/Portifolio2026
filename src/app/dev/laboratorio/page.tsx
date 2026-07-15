import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getLab } from "@/lib/repos/dev"

export const metadata = { title: "Laboratório" }

const STATUS_LABEL: Record<string, string> = {
  wip: "WIP",
  playtest: "Playtest",
  stable: "Estável",
  archived: "Arquivado",
}

export default async function LabPage() {
  const items = await getLab()

  return (
    <div>
      <DevHeader
        fn="lab.run"
        title="Laboratório"
        accent="// experimentos"
        subtitle="Testes de código, componentes, APIs e modelos de IA — protótipos em andamento."
      />
      {items.length === 0 ? (
        <DevEmpty>Nenhum experimento ainda — adicione em /admin/lab.</DevEmpty>
      ) : (
        <div className="dv-grid">
          {items.map((x) => (
            <article key={x.id} className="dv-card">
              <div className="flex items-center justify-between gap-2">
                <h3>{x.title}</h3>
                <span className={`dv-status ${x.status}`}>{STATUS_LABEL[x.status] ?? x.status}</span>
              </div>
              <p>{x.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {x.stack.map((t) => (
                  <span key={t} className="dv-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-4 text-sm">
                {x.demo_url && (
                  <a href={x.demo_url} target="_blank" rel="noreferrer" className="dv-link">
                    ❯ demo
                  </a>
                )}
                {x.repo_url && (
                  <a href={x.repo_url} target="_blank" rel="noreferrer" className="dv-link">
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
