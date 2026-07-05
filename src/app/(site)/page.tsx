import { BentoGrid } from "@/components/home/bento-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { Onoma } from "@/components/spiderverse/decor"

export default function HomePage() {
  return (
    <SvCanvas dimension="multiverse" className="py-10">
      {/* onomatopeias flutuantes */}
      <Onoma color="magenta" className="pointer-events-none absolute -top-2 right-4 z-[2] hidden rotate-12 sm:block">
        THWIP!
      </Onoma>
      <Onoma color="cyan" className="pointer-events-none absolute bottom-10 -left-2 z-[2] hidden -rotate-6 lg:block">
        BAM!
      </Onoma>
      <BentoGrid />
    </SvCanvas>
  )
}
