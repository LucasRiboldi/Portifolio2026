import { Container } from "@/components/layout/container"
import { GalleryGrid } from "@/components/portfolio/gallery-grid"
import { projects } from "@/data/projects"

export const metadata = {
  title: "Portfólio",
}

export default function PortfolioPage() {
  return (
    <Container className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Portfólio <span className="gradient-text">criativo</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Design, código, arte e imagem — tudo em um lugar.
        </p>
      </div>
      <GalleryGrid projects={projects} />
    </Container>
  )
}
