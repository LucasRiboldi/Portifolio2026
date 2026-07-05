import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"

export const metadata = { title: "Galeria" }

export default function GalleryPage() {
  return (
    <SvCanvas dimension="noir">
      <Onoma className="pointer-events-none absolute right-2 top-0 z-[2] hidden -rotate-6 md:block">
        SNIKT!
      </Onoma>
      <ComicHeader
        kicker="Terra-42 · Noir"
        title="Galeria"
        highlight="P&B"
        subtitle="Alto contraste, granulado, sombras duras — cinema noir dos anos 30."
      />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`sv-panel sv-tilt-${(i % 3) + 1} flex aspect-[4/5] items-end p-4`}
            style={{ background: `repeating-linear-gradient(${45 + i * 15}deg, #000 0 6px, #1a1a1a 6px 12px)` }}
          >
            <span className="sv-display text-xl uppercase text-white">Quadro {i + 1}</span>
          </div>
        ))}
      </div>
    </SvCanvas>
  )
}
