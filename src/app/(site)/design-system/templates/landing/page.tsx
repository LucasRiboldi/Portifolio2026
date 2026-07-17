import { LandingTemplateContent } from "./content"

export const metadata = { title: "Template · Landing" }

/** Rota fina: o conteudo vive em content.tsx e e reusado pelo documento unico. */
export default function LandingTemplatePage() {
  return <LandingTemplateContent />
}
