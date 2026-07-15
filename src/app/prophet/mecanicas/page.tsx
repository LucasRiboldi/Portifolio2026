import { ProphetHeader, ProphetEmpty } from "@/components/prophet/prophet-header"
import { getMechanics } from "@/lib/repos/prophet"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "Caderno das Mecânicas" }

export default async function MecanicasPage() {
  const [mechanics, c] = await Promise.all([getMechanics(), getPageContent("prophet.mecanicas")])

  return (
    <div>
      <ProphetHeader kicker={c.kicker} headline={c.title} standfirst={c.subtitle} />
      {mechanics.length === 0 ? (
        <ProphetEmpty>O caderno ainda está em branco.</ProphetEmpty>
      ) : (
        <div className="space-y-6">
          {mechanics.map((m) => (
            <article key={m.id}>
              <h3 className="pr-headline" style={{ fontSize: "1.3rem" }}>
                {m.title}
              </h3>
              <p className="pr-stand">{m.summary}</p>
              <div className="mt-1">
                {m.tags.map((tag) => (
                  <span key={tag} className="pr-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <hr className="pr-rule" />
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
