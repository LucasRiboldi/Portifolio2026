import { Container } from "@/components/layout/container"
import { SportsWidget } from "@/components/widgets/sports-widget"

export const metadata = {
  title: "Sports Widget",
}

export default function SportsWidgetPage() {
  return (
    <Container className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Sports <span className="gradient-text">Widget</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Réplica do widget de esportes da nova aba do Firefox — abas, lista
          agrupada, expandir/colapsar e menu de contexto.
        </p>
      </div>
      <SportsWidget />
    </Container>
  )
}
