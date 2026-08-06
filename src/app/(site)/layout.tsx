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
        {/*
          O EXEMPLAR — a moldura da revista, agora em torno de TODAS as páginas.

          Nasceu em `.cp-page` e valia só para o /criativo e o /criativo/sala.
          O resultado era que o menu levava a três formatos diferentes: 900px
          nos dois fascículos, 1400 no portfólio, cards e dimensões, e 1200
          codificados à mão no design system. Atravessar o menu era mudar de
          site.

          Fica aqui, dentro do `<main>` e depois do padding do cabeçalho: na
          própria `<main>` a borda de topo cairia em y=0, atrás da barra fixa.
        */}
        <div className="k-exemplar">{children}</div>
      </main>
      <Footer />
      <SoberDock />
    </>
  )
}
