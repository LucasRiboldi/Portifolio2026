import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ArtFilters } from "@/components/design-system/art-filters"
import { SkipLink } from "@/components/layout/skip-link"
import { DevDock } from "@/components/dev/dev-dock"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <ArtFilters />
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <DevDock />
    </>
  )
}
