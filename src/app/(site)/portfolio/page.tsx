import { GalleryGrid } from "@/components/portfolio/gallery-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader } from "@/components/spiderverse/decor"
import { getProjects } from "@/lib/repos/projects"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = {
  title: "Portfólio",
}

export default async function PortfolioPage() {
  const [projects, c] = await Promise.all([getProjects(), getPageContent("portfolio")])
  return (
    <SvCanvas dimension="renaissance">
      <ArtOverlay universe="painterly" />
      <ComicHeader kicker={c.kicker} title={c.title} highlight={c.highlight} subtitle={c.subtitle} />
      <GalleryGrid projects={projects} />
    </SvCanvas>
  )
}
