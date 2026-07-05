import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader } from "@/components/spiderverse/decor"

export const metadata = { title: "Blog" }

export default function BlogPage() {
  return (
    <SvCanvas dimension="noir">
      <ComicHeader
        kicker="Edição especial"
        title="Blog"
        highlight="// em breve"
        subtitle="Artigos sobre design, código e experimentos — próxima edição a caminho."
      />
      <div className="sv-panel sv-tilt-2 max-w-lg p-8">
        <p className="sv-display text-3xl uppercase text-white">Continua…</p>
        <p className="mt-3 text-sm opacity-80">
          Novas histórias em preparação. Volte logo para o próximo número.
        </p>
      </div>
    </SvCanvas>
  )
}
