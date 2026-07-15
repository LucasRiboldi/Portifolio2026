import { ToolsGrid } from "@/components/tools/tools-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"
import { getTools } from "@/lib/repos/tools"
import { getPageContent } from "@/lib/repos/page-content"

export const metadata = {
  title: "Ferramentas",
}

export default async function ToolsPage() {
  const [tools, c] = await Promise.all([getTools(), getPageContent("tools")])
  return (
    <SvCanvas dimension="neon">
      <ArtOverlay universe="cyber" />
      <Onoma color="lime" className="pointer-events-none absolute right-2 top-0 z-[2] hidden rotate-6 md:block">
        ZAP!
      </Onoma>
      <ComicHeader kicker={c.kicker} title={c.title} highlight={c.highlight} subtitle={c.subtitle} />
      <ToolsGrid tools={tools} />
    </SvCanvas>
  )
}
