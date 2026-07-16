import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getWiki } from "@/lib/repos/dev"
import { getPageContent } from "@/lib/repos/page-content"
import { WikiView } from "@/components/dev/wiki-view"

export const metadata = { title: "Wiki" }

export default async function WikiPage() {
  const [pages, c] = await Promise.all([getWiki(), getPageContent("dev.wiki")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {pages.length === 0 ? (
        <DevEmpty>Nenhuma página ainda — adicione em /admin/wiki.</DevEmpty>
      ) : (
        <WikiView pages={pages} />
      )}
    </div>
  )
}
