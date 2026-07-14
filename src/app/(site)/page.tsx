import { BentoGrid } from "@/components/home/bento-grid"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { Onoma } from "@/components/spiderverse/decor"

export default function HomePage() {
  return (
    <SvCanvas dimension="multiverse" className="art-grain py-10">
      {/* faixa de halftone losango (retícula plural) */}
      <div
        aria-hidden
        className="art-ht-diamond pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 opacity-30 [mask-image:linear-gradient(to_bottom,#000,transparent)]"
        style={{ "--ht-color": "rgba(0,229,255,0.5)", "--ht-size": "9px" } as React.CSSProperties}
      />

      {/* onomatopeias flutuantes */}
      <Onoma color="magenta" className="pointer-events-none absolute -top-2 right-4 z-[2] hidden rotate-12 sm:block">
        THWIP!
      </Onoma>
      <Onoma color="cyan" className="pointer-events-none absolute bottom-10 -left-2 z-[2] hidden -rotate-6 lg:block">
        BAM!
      </Onoma>

      {/* carimbo narrativo (com propósito: assina a "edição") */}
      <span
        aria-hidden
        className="art-stamp pointer-events-none absolute right-6 top-24 z-[2] hidden text-xs md:inline-flex"
        style={{ color: "var(--sv-lime)" }}
      >
        Terra-2026
      </span>

      <BentoGrid />
    </SvCanvas>
  )
}
