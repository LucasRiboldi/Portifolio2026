import { SkillsGrid } from "@/components/skills/skills-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"

export const metadata = {
  title: "Skills",
}

export default function SkillsPage() {
  return (
    <SvCanvas dimension="neon">
      <Onoma color="cyan" className="pointer-events-none absolute right-2 top-0 z-[2] hidden -rotate-6 md:block">
        POW!
      </Onoma>
      <ComicHeader
        kicker="Arsenal · Claude Code"
        title="Skills"
        highlight="instaladas"
        subtitle="As skills que uso no meu Claude Code — agrupadas por tema, com o comando de cada uma pronto para copiar."
      />
      <SkillsGrid />
    </SvCanvas>
  )
}
