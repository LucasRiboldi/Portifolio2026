import { ProphetHeader, ProphetEmpty } from "@/components/prophet/prophet-header"
import { getTutorials } from "@/lib/repos/prophet"
import { getPageContent } from "@/lib/repos/page-content"
import { TutorialsView } from "@/components/prophet/tutorials-view"

export const metadata = { title: "Oficina do Inventor" }

export default async function OficinaPage() {
  const [tutorials, c] = await Promise.all([getTutorials(), getPageContent("prophet.oficina")])

  return (
    <div>
      <ProphetHeader kicker={c.kicker} headline={c.title} standfirst={c.subtitle} />
      {tutorials.length === 0 ? (
        <ProphetEmpty>Nenhum tutorial publicado ainda.</ProphetEmpty>
      ) : (
        <TutorialsView tutorials={tutorials} />
      )}
    </div>
  )
}
