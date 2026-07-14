import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ArtFilters } from "@/components/design-system/art-filters"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ArtFilters />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
