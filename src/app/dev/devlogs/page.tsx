import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getDevlogs } from "@/lib/repos/dev"

export const metadata = { title: "DevLogs" }

export default async function DevlogsPage() {
  const logs = await getDevlogs()

  return (
    <div>
      <DevHeader
        fn="git.log"
        title="DevLogs"
        accent="// diário técnico"
        subtitle="Registro cronológico do desenvolvimento, decisões técnicas e problemas resolvidos."
      />
      {logs.length === 0 ? (
        <DevEmpty>Nenhum devlog ainda — adicione em /admin/devlogs.</DevEmpty>
      ) : (
        <ol className="mt-6 space-y-4">
          {logs.map((l) => (
            <li key={l.id} className="dv-card">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3>{l.title}</h3>
                <time className="text-xs" style={{ color: "var(--d-comment)" }}>
                  {new Date(l.date).toLocaleDateString("pt-BR")}
                </time>
              </div>
              {l.summary && <p>{l.summary}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {l.tags.map((t) => (
                  <span key={t} className="dv-tag">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
