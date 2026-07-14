import { notFound } from "next/navigation"

import { getResource } from "@/lib/admin/resources"
import { listRows } from "@/lib/admin/fetch"
import { ResourceList } from "@/components/admin/resource-list"

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  const config = getResource(resource)
  if (!config) notFound()

  const rows = await listRows(resource)

  return (
    <ResourceList
      slug={config.slug}
      label={config.label}
      singular={config.singular}
      columns={config.columns}
      rows={rows}
    />
  )
}
