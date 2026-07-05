import Link from "next/link"
import { SvCanvas, DIMENSIONS } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, Onoma } from "@/components/spiderverse/decor"

export const metadata = { title: "Dimensões" }

const dimClass: Record<string, string> = {
  multiverse: '', neon: 'sv-dim-neon', renaissance: 'sv-dim-renaissance',
  nouveau: 'sv-dim-nouveau', noir: 'sv-dim-noir', punk: 'sv-dim-punk',
  '2099': 'sv-dim-2099', horror: 'sv-dim-horror', manga: 'sv-dim-manga',
  cartoon: 'sv-dim-cartoon', graffiti: 'sv-dim-graffiti', pixel: 'sv-dim-pixel',
  blueprint: 'sv-dim-blueprint', spot: 'sv-dim-spot', lego: 'sv-dim-lego',
  prowler: 'sv-dim-prowler', glitch: 'sv-dim-glitch', portal: 'sv-dim-portal',
  society: 'sv-dim-society', riso: 'sv-dim-riso',
}

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DIMENSIONS.map((d) => (
          <div
            key={d.id}
            className={`sv-canvas ${dimClass[d.id]} group relative overflow-hidden rounded-lg border-[3px] border-black shadow-[5px_5px_0_0_#000]`}
            style={{ minHeight: 220 }}
          >
            <div className="relative z-[1] flex h-full flex-col justify-between p-5">
              <div className="sv-panel sv-shift inline-flex w-fit items-center gap-2 px-3 py-1">
                <span className="sv-heavy text-[10px] uppercase tracking-wide">Terra-{d.earth}</span>
              </div>
              <div>
                <p className="sv-display text-3xl uppercase">{d.label}</p>
                <p className="sv-heavy mt-1 text-[11px] uppercase tracking-wide opacity-75">{d.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/styleguide"
          className="sv-display inline-block border-[3px] border-black bg-[var(--sv-yellow)] px-6 py-3 text-lg uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1"
        >
          → Ver o Style Guide completo
        </Link>
      </div>
    </SvCanvas>
  )
}
