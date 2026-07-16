import { ProphetHeader, ProphetEmpty } from "@/components/prophet/prophet-header"
import { getPrototypes } from "@/lib/repos/prophet"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Laboratório" }

const STATUS: Record<string, string> = {
  conceito: "Conceito",
  prototipo: "Protótipo",
  playtest: "Em playtest",
  publicado: "Publicado",
}

export default async function LabPage() {
  const [prototypes, c] = await Promise.all([getPrototypes(), getPageContent("prophet.laboratorio")])

  return (
    <div>
      <ProphetHeader kicker={c.kicker} headline={c.title} standfirst={c.subtitle} />
      {prototypes.length === 0 ? (
        <ProphetEmpty>Nenhum protótipo na bancada ainda.</ProphetEmpty>
      ) : (
        <div className="pr-grid">
          {prototypes.map((p) => (
            <article key={p.id} className="pr-card">
              <span className="pr-badge">{STATUS[p.status] ?? p.status}</span>
              <h3 className="mt-2">{p.title}</h3>
              <p>{p.description}</p>
              <p className="pr-byline mt-2">
                {[p.players && `${p.players} jog.`, p.playtime].filter(Boolean).join(" · ")}
              </p>
              <div className="mt-1">
                {p.tags.map((tag) => (
                  <span key={tag} className="pr-tag">
                    {tag}
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
