import { GalleryGrid } from "@/components/portfolio/gallery-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader } from "@/components/spiderverse/decor"
import { getProjects } from "@/lib/repos/projects"

export const metadata = {
  title: "Portfólio",
}

export default async function PortfolioPage() {
  const projects = await getProjects()
  return (
    <SvCanvas dimension="renaissance">
      <ArtOverlay universe="painterly" />
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
