import { ProphetHeader } from "@/components/prophet/prophet-header"
import { getProphetAbout } from "@/lib/repos/prophet"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = { title: "A Redação" }

export default async function RedacaoPage() {
  const [about, c] = await Promise.all([getProphetAbout(), getPageContent("prophet.redacao")])

  return (
    <div>
      <ProphetHeader
        kicker={c.kicker}
        headline={c.title}
        standfirst={about.intro}
        byline={`por ${about.author}`}
      />
      <div className="pr-columns">
        <p className="pr-dropcap" style={{ marginBottom: "0.75rem" }}>
          {about.passion}
        </p>
        <p>{about.proposal}</p>
      </div>
    </div>
  )
}
