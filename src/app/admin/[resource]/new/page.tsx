import { notFound } from "next/navigation"

import { getResource } from "@/lib/admin/resources"
import { ResourceForm } from "@/components/admin/resource-form"

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  const config = getResource(resource)
  if (!config) notFound()

  // valores iniciais: booleans false, resto vazio
  const initial: Record<string, unknown> = {}
  for (const f of config.fields) {
    initial[f.name] = f.type === "boolean" ? f.name === "published" : ""
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Novo {config.singular.toLowerCase()}</h1>
      <ResourceForm slug={config.slug} singular={config.singular} fields={config.fields} id={null} initial={initial} />
    </div>
  )
}
