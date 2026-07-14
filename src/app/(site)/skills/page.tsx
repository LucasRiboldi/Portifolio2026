import { SkillsGrid } from "@/components/skills/skills-grid"
import { getSkills } from "@/lib/repos/skills"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"

export const metadata = {
  title: "Skills",
}

export default async function SkillsPage() {
  const skills = await getSkills()
  return (
    <SvCanvas dimension="neon">
      <ArtOverlay universe="cyber" />
      <Onoma color="cyan" className="pointer-events-none absolute right-2 top-0 z-[2] hidden -rotate-6 md:block">
        POW!
      </Onoma>
      <ComicHeader
        kicker="Arsenal · Claude Code"
        title="Skills"
        highlight="instaladas"
        subtitle="As skills que uso no meu Claude Code — agrupadas por tema, com o comando de cada uma pronto para copiar."
      />
      <SkillsGrid skills={skills} />
    </SvCanvas>
  )
}
