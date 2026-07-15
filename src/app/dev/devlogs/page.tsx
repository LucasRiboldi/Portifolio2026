import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getDevlogs } from "@/lib/repos/dev"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "DevLogs" }

export default async function DevlogsPage() {
  const [logs, c] = await Promise.all([getDevlogs(), getPageContent("dev.devlogs")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {logs.length === 0 ? (
        <DevEmpty>Nenhum devlog ainda — adicione em /admin/devlogs.</DevEmpty>
      ) : (
        <ol className="dv-timeline">
          {logs.map((l) => (
            <li key={l.id} className="dv-tl-item">
              <time className="dv-tl-date">
                {new Date(l.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </time>
              <h3>{l.title}</h3>
              {l.summary && <p className="dv-prose" style={{ fontStyle: "italic" }}>{l.summary}</p>}
              {l.body && (
                <div className="dv-prose">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{l.body}</ReactMarkdown>
                </div>
              )}
              {l.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {l.tags.map((t) => (
                    <span key={t} className="dv-tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
