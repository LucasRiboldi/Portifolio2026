import { ToolsGrid } from "@/components/tools/tools-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"
import { tools } from "@/data/tools"

export const metadata = {
  title: "Ferramentas",
}

export default function ToolsPage() {
  return (
    <SvCanvas dimension="neon">
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
