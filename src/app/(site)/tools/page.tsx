import { Container } from "@/components/layout/container"
import { ToolsGrid } from "@/components/tools/tools-grid"
import { tools } from "@/data/tools"

export const metadata = {
  title: "Ferramentas",
}

export default function ToolsPage() {
  return (
    <Container className="py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          Ferramentas <span className="gradient-text">criadas</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Web Apps, CLIs, extensões, bots, scripts e plugins que construí.
        </p>
      </div>
      <ToolsGrid tools={tools} />
    </Container>
  )
}
