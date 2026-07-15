import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getIdeas } from "@/lib/repos/dev"
import { getPageContent } from "@/lib/repos/page-content"
import { IdeasView } from "@/components/dev/ideas-view"

export const metadata = { title: "Ideias" }

export default async function IdeasPage() {
  const [ideas, c] = await Promise.all([getIdeas(), getPageContent("dev.ideias")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {ideas.length === 0 ? (
        <DevEmpty>Nenhuma ideia ainda — adicione em /admin/ideas.</DevEmpty>
      ) : (
        <IdeasView ideas={ideas} />
      )}
    </div>
  )
}
