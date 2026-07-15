import { getProphetAbout } from "@/lib/repos/prophet"
import { AdminForm, Field } from "@/components/admin/admin-form"
import { saveProphetAbout } from "./actions"

export default async function ProphetAboutAdmin() {
  const a = await getProphetAbout()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">A Redação</h1>
        <p className="text-sm text-[color:var(--mm-text-2)]">
          Sobre o autor e a proposta do jornal (Daily Prophet).
        </p>
      </header>

      <AdminForm action={saveProphetAbout} submitLabel="Salvar Redação">
        <Field name="author" label="Autor" defaultValue={a.author} />
        <Field name="intro" label="Introdução (chamada)" defaultValue={a.intro} textarea />
        <Field name="passion" label="A paixão por boardgames" defaultValue={a.passion} textarea />
        <Field name="proposal" label="A proposta do site" defaultValue={a.proposal} textarea />
      </AdminForm>
    </div>
  )
}
