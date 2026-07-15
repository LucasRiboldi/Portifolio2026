import { getSiteConfig } from "@/lib/repos/site-config"
import { AdminForm, Field } from "@/components/admin/admin-form"
import { saveSiteConfig } from "./actions"

export default async function SitePage() {
  const c = await getSiteConfig()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Site & SEO</h1>
        <p className="text-sm text-[color:var(--mm-text-2)]">Identidade, contato e metadados.</p>
      </header>

      <AdminForm action={saveSiteConfig} submitLabel="Salvar configuração">
        <Field name="name" label="Nome" defaultValue={c.name} />
        <Field name="title" label="Título / cargo" defaultValue={c.title} />
        <Field name="description" label="Descrição" defaultValue={c.description} textarea />
        <Field name="github" label="GitHub" defaultValue={c.github} />
        <Field name="linkedin" label="LinkedIn" defaultValue={c.linkedin} />
        <Field name="email" label="E-mail" defaultValue={c.email} />
        <Field name="location" label="Localização" defaultValue={c.location} />
        <Field name="og_title" label="OpenGraph — título" defaultValue={c.ogTitle ?? ""} />
        <Field name="og_description" label="OpenGraph — descrição" defaultValue={c.ogDescription ?? ""} textarea />
      </AdminForm>
    </div>
  )
}
