import { SectionsContent } from "./content"

export const metadata = { title: "Seções · Design System" }

/** Rota fina: o conteudo vive em content.tsx e e reusado pelo documento unico. */
export default function SectionsPage() {
  return <SectionsContent />
}
