import { GalleryGrid } from "@/components/portfolio/gallery-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader } from "@/components/spiderverse/decor"
import { projects } from "@/data/projects"

export const metadata = {
  title: "Portfólio",
}

export default function PortfolioPage() {
  return (
    <SvCanvas dimension="renaissance">
      <ComicHeader
        kicker="Terra-65 · O Abutre"
        title="Portfólio"
        highlight="criativo"
        subtitle="Design, código, arte e imagem — rascunhado à mão, como Da Vinci."
      />
      <GalleryGrid projects={projects} />
    </SvCanvas>
  )
}
