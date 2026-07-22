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
      {/* O header passou a ser fixo (o overlay do menu precisa de sair de trás
          dele): o padding devolve ao conteúdo o espaço que a barra ocupava. */}
      <main id="main" className="pt-16">
        {children}
      </main>
      <Footer />
      <SoberDock />
    </>
  )
}
