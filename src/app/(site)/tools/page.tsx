import { ToolsGrid } from "@/components/tools/tools-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"
import { getTools } from "@/lib/repos/tools"

export const metadata = {
  title: "Ferramentas",
}

export default async function ToolsPage() {
  const tools = await getTools()
  return (
    <SvCanvas dimension="neon">
      <ArtOverlay universe="cyber" />
      <Onoma color="lime" className="pointer-events-none absolute right-2 top-0 z-[2] hidden rotate-6 md:block">
        ZAP!
      </Onoma>
      <ComicHeader
        kicker="Terra-50101 · Mumbattan"
        title="Ferramentas"
        highlight="criadas"
        subtitle="Web Apps, CLIs, extensões, bots, scripts e plugins que construí."
      />
      <ToolsGrid tools={tools} />
    </SvCanvas>
  )
}
