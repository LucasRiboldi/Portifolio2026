import { DocsTemplateContent } from "./content"

export const metadata = { title: "Template · Documentação" }

/** Rota fina: o conteudo vive em content.tsx e e reusado pelo documento unico. */
export default function DocsTemplatePage() {
  return <DocsTemplateContent />
}
