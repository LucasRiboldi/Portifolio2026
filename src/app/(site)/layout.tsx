import { ComicNav } from "@/components/layout/comic-nav"
import { Footer } from "@/components/layout/footer"
import { ArtFilters } from "@/components/design-system/art-filters"
import { SkipLink } from "@/components/layout/skip-link"
import { SoberDock } from "@/components/dev/sober-dock"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <ArtFilters />
      <ComicNav />
      {/* O header é fixo: o padding devolve ao conteúdo o espaço que a barra
          ocupa. O token vem de comic-2026.css, para os dois nunca divergirem. */}
      <main id="main" style={{ paddingTop: "var(--k-header-h)" }}>
        {children}
      </main>
      <Footer />
      <SoberDock />
    </>
  )
}
