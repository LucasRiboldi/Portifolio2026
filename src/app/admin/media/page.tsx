import { MediaManager } from "@/components/admin/media-manager"

export default function MediaPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">Mídia</h1>
        <p className="text-sm text-[color:var(--mm-text-2)]">
          Envie imagens e copie a URL para usar em projetos e capas.
        </p>
      </header>
      <MediaManager />
    </div>
  )
}
