import Link from "next/link"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { DimensionCards } from "@/components/spiderverse/dimension-cards"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"

export const metadata = { title: "Dimensões" }

export default function DimensoesPage() {
  return (
    <SvCanvas dimension="multiverse">
      <Onoma color="cyan" className="pointer-events-none absolute right-2 top-0 z-[2] hidden rotate-6 md:block">
        SNAP!
      </Onoma>
      <ComicHeader
        kicker="Índice do multiverso"
        title="20"
        highlight="dimensões"
        subtitle="Cada portal é um estilo de desenho vivo. Passe o mouse para atravessar."
      />

      <DimensionCards />

      <div className="mt-10">
        <Link
          href="/design-system/realms/creative"
          className="sv-display inline-block border-[3px] border-black bg-[var(--sv-yellow)] px-6 py-3 text-lg uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1"
        >
          → Ver o Style Guide completo
        </Link>
      </div>
    </SvCanvas>
  )
}
