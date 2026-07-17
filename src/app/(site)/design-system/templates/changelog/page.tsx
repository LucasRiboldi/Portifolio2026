import { ChangelogTemplateContent } from "./content"

export const metadata = { title: "Template · Changelog" }

/** Rota fina: o conteudo vive em content.tsx e e reusado pelo documento unico. */
export default function ChangelogTemplatePage() {
  return <ChangelogTemplateContent />
}
