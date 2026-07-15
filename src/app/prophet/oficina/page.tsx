import { ProphetHeader, ProphetEmpty } from "@/components/prophet/prophet-header"
import { getTutorials } from "@/lib/repos/prophet"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Oficina do Inventor" }

const DIFF: Record<string, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
}

export default async function OficinaPage() {
  const [tutorials, c] = await Promise.all([getTutorials(), getPageContent("prophet.oficina")])

  return (
    <div>
      <ProphetHeader kicker={c.kicker} headline={c.title} standfirst={c.subtitle} />
      {tutorials.length === 0 ? (
        <ProphetEmpty>Nenhum tutorial publicado ainda.</ProphetEmpty>
      ) : (
        <div className="pr-grid">
          {tutorials.map((t) => (
            <article key={t.id} className="pr-card">
              <span className="pr-badge">{DIFF[t.difficulty] ?? t.difficulty}</span>
              <h3 className="mt-2">{t.title}</h3>
              <p>{t.summary}</p>
              <div className="mt-2">
                {t.tags.map((tag) => (
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
