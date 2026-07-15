import { ProphetHeader } from "@/components/prophet/prophet-header"
import { getProphetAbout } from "@/lib/repos/prophet"

export const metadata = { title: "A Redação" }

export default async function RedacaoPage() {
  const about = await getProphetAbout()

  return (
    <div>
      <ProphetHeader
        kicker="A Redação"
        headline="Quem assina esta folha"
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
