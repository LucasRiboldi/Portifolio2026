import { ProphetHeader, ProphetEmpty } from "@/components/prophet/prophet-header"
import { getMechanics } from "@/lib/repos/prophet"
import { getPageContent } from "@/lib/repos/page-content"
import { MechanicsView } from "@/components/prophet/mechanics-view"

export const metadata = { title: "Caderno das Mecânicas" }

export default async function MecanicasPage() {
  const [mechanics, c] = await Promise.all([getMechanics(), getPageContent("prophet.mecanicas")])

  return (
    <div>
      <ProphetHeader kicker={c.kicker} headline={c.title} standfirst={c.subtitle} />
      {mechanics.length === 0 ? (
        <ProphetEmpty>O caderno ainda está em branco.</ProphetEmpty>
      ) : (
        <MechanicsView mechanics={mechanics} />
      )}
    </div>
  )
}
