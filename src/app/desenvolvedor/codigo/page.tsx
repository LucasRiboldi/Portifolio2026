import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getSnippets } from "@/lib/repos/dev"
import { getPageContent } from "@/lib/repos/page-content"
import { SnippetsView } from "@/components/dev/snippets-view"

export const metadata = { title: "Código" }

export default async function SnippetsPage() {
  const [snippets, c] = await Promise.all([getSnippets(), getPageContent("dev.codigo")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {snippets.length === 0 ? (
        <DevEmpty>Nenhum snippet ainda — adicione em /admin/snippets.</DevEmpty>
      ) : (
        <SnippetsView snippets={snippets} />
      )}
    </div>
  )
}
