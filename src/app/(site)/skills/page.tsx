import { SkillsGrid } from "@/components/skills/skills-grid"
import { getSkills } from "@/lib/repos/skills"
import { getPageContent } from "@/lib/repos/page-content"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"

export const metadata = {
  title: "Skills",
}

export default async function SkillsPage() {
  const [skills, c] = await Promise.all([getSkills(), getPageContent("skills")])
  return (
    <SvCanvas dimension="neon">
      <ArtOverlay universe="cyber" />
      <Onoma color="cyan" className="pointer-events-none absolute right-2 top-0 z-[2] hidden -rotate-6 md:block">
        POW!
      </Onoma>
      <ComicHeader kicker={c.kicker} title={c.title} highlight={c.highlight} subtitle={c.subtitle} />
      <SkillsGrid skills={skills} />
    </SvCanvas>
  )
}
