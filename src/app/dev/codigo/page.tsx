import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getSnippets } from "@/lib/repos/dev"

export const metadata = { title: "Código" }

export default async function SnippetsPage() {
  const snippets = await getSnippets()

  return (
    <div>
      <DevHeader
        fn="snippets.export"
        title="Código"
        accent="// reutilizáveis"
        subtitle="Snippets, componentes reutilizáveis, templates e boilerplates."
      />
      {snippets.length === 0 ? (
        <DevEmpty>Nenhum snippet ainda — adicione em /admin/snippets.</DevEmpty>
      ) : (
        <div className="mt-6 space-y-5">
          {snippets.map((s) => (
            <article key={s.id} className="dv-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3>{s.title}</h3>
                <span className="dv-tag">{s.language}</span>
              </div>
              {s.description && <p>{s.description}</p>}
              {s.code && (
                <pre className="dv-code mt-3">
                  <code>{s.code}</code>
                </pre>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
