import { DevHeader, DevEmpty } from "@/components/dev/dev-header"
import { getLab } from "@/lib/repos/dev"
import { getPageContent } from "@/lib/repos/page-content"
import { LabView } from "@/components/dev/lab-view"

export const metadata = { title: "Laboratório" }

export default async function LabPage() {
  const [items, c] = await Promise.all([getLab(), getPageContent("dev.laboratorio")])

  return (
    <div>
      <DevHeader fn={c.kicker} title={c.title} accent={c.highlight} subtitle={c.subtitle} />
      {items.length === 0 ? (
        <DevEmpty>Nenhum experimento ainda — adicione em /admin/lab.</DevEmpty>
      ) : (
        <LabView items={items} />
      )}
    </div>
  )
}
