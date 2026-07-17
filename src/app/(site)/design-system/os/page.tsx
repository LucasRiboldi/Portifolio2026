import { OsThemesContent } from "./content"

export const metadata = { title: "Retro OS · Design System" }

/** Rota fina: o conteudo vive em content.tsx e e reusado pelo documento unico. */
export default function OsThemesPage() {
  return <OsThemesContent />
}
