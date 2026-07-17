import { LabContent } from "./content"

export const metadata = { title: "Lab · Anomalias do Design System" }

/** Rota fina: o conteudo vive em content.tsx e e reusado pelo documento unico. */
export default function LabPage() {
  return <LabContent />
}
