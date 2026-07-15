import Link from "next/link"
import { notFound } from "next/navigation"

import { getPageEntry } from "@/lib/admin/pages-catalog"
import { getPageContent } from "@/lib/repos/page-content"
import { AdminForm, Field } from "@/components/admin/admin-form"
import { savePageContent } from "../../actions"

export default async function EditPage({
  params,
}: {
  params: Promise<{ realm: string; key: string }>
}) {
  const { realm, key: rawKey } = await params
  const key = decodeURIComponent(rawKey)
  const entry = getPageEntry(key)
  if (!entry || entry.key !== key) notFound()

  const current = await getPageContent(key)
  const showHighlight = entry.highlightLabel !== "—"

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/pages/${realm}`}
          className="text-sm hover:underline"
          style={{ color: "var(--mm-text-2)" }}
        >
          ← Páginas
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Editar: {entry.label}</h1>
        <p className="text-sm text-[color:var(--mm-text-2)]">
          Textos do cabeçalho desta página. Vazio = usa o padrão do código.
        </p>
      </div>

      <AdminForm action={savePageContent.bind(null, key)} submitLabel="Salvar página">
        <Field name="kicker" label={entry.kickerLabel} defaultValue={current.kicker} />
        <Field name="title" label="Título" defaultValue={current.title} />
        {showHighlight && (
          <Field name="highlight" label={entry.highlightLabel} defaultValue={current.highlight} />
        )}
        <Field name="subtitle" label="Subtítulo / intro" defaultValue={current.subtitle} textarea />
      </AdminForm>
    </div>
  )
}
