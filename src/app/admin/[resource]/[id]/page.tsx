import { notFound } from "next/navigation"

import { getResource } from "@/lib/admin/resources"
import { getRow } from "@/lib/admin/fetch"
import { ResourceForm } from "@/components/admin/resource-form"

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>
}) {
  const { resource, id } = await params
  const config = getResource(resource)
  if (!config) notFound()

  const row = await getRow(resource, id)
  if (!row) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar {config.singular.toLowerCase()}</h1>
      <ResourceForm slug={config.slug} singular={config.singular} fields={config.fields} id={id} initial={row} />
    </div>
  )
}
