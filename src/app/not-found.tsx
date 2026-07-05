import Link from "next/link"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { Onoma } from "@/components/spiderverse/decor"

export default function NotFound() {
  return (
    <SvCanvas dimension="horror" className="flex items-center">
      <div className="mx-auto max-w-xl text-center">
        <Onoma color="magenta" className="mb-6 block text-7xl sm:text-8xl">
          GLITCH!
        </Onoma>
        <h1 className="sv-glitch sv-display text-8xl uppercase" data-text="404">404</h1>
        <p className="sv-heavy mt-4 text-sm uppercase tracking-wide opacity-80">
          Esta dimensão colapsou. A página não existe neste universo.
        </p>
        <Link
          href="/"
          className="sv-display mt-8 inline-block border-[3px] border-[#8b0000] bg-[rgba(139,0,0,0.2)] px-6 py-3 text-lg uppercase text-[#ff5a5a] shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1"
        >
          ← Voltar ao multiverso
        </Link>
      </div>
    </SvCanvas>
  )
}
