import { Caption, ComicButton, Halftone, PulseRings, SpeedLines } from "@/components/comic/atoms"
import { GlitchTitle } from "@/components/comic/glitch-title"
import { PANEL_IN } from "@/components/comic/motion"
import { Reveal } from "@/components/comic/reveal"
import { OUTRO } from "@/constants/criativo-landing"

/**
 * Contracapa da edição.
 *
 * Volta à paleta do multiverso do hero para fechar o ciclo: depois de oito
 * dimensões com cores próprias, repetir a capa é o que dá a sensação de ter
 * terminado a revista em vez de simplesmente parar de rolar.
 */
export function Outro() {
  return (
    <section
      aria-labelledby="outro-title"
      className="k-zone k-zone--multiverso k-grain relative overflow-hidden px-4 py-28 text-center sm:px-6 sm:py-36 lg:px-8"
    >
      <SpeedLines x={50} y={42} color="rgba(18,16,14,0.12)" />
      <Halftone color="rgba(255,255,255,0.35)" step={10} />
      <PulseRings className="left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <Reveal variants={PANEL_IN} className="relative mx-auto max-w-3xl">
        <Caption>{OUTRO.kicker}</Caption>

        <h2 id="outro-title" className="mt-7 text-[clamp(2.4rem,7vw,5.5rem)]">
          <span className="k-title k-3d k-3d--deep block">{OUTRO.title}</span>
          <GlitchTitle as="span" treatment="glitch" className="mt-2 block text-[0.55em]">
            {OUTRO.glitch}
          </GlitchTitle>
        </h2>

        <p className="k-body mx-auto mt-8 max-w-xl text-base font-medium leading-relaxed text-[var(--k-ink)]/85 sm:text-lg">
          {OUTRO.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ComicButton href={OUTRO.primaryCta.href} className="px-8 py-4 text-base">
            {OUTRO.primaryCta.label}
          </ComicButton>
          <ComicButton href={OUTRO.secondaryCta.href} variant="ghost" className="px-8 py-4 text-base">
            {OUTRO.secondaryCta.label}
          </ComicButton>
        </div>
      </Reveal>
    </section>
  )
}
