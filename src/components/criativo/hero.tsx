"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import {
  Bubble,
  Burst,
  Caption,
  ComicButton,
  Halftone,
  Onoma,
  SpeedLines,
} from "@/components/comic/atoms"
import { GlitchTitle } from "@/components/comic/glitch-title"
import { PunkName } from "@/components/comic/punk-name"
import { Counter } from "@/components/comic/counter"
import { EASE } from "@/components/comic/motion"
import { FUN_STATS, HERO } from "@/constants/criativo-landing"

/**
 * Capa da edição — o requadro de abertura do multiverso.
 *
 * O parallax é feito com `useScroll` sobre o próprio bloco (não sobre a
 * janela): assim as camadas continuam alinhadas mesmo quando o visitante chega
 * à página já rolado, por âncora ou por restauração de scroll.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  const yBack = useTransform(scrollYProgress, [0, 1], ["0%", "24%"])
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const layer = (y: typeof yBack) => (reduced ? undefined : { y })

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="k-zone k-zone--multiverso k-grain relative isolate flex min-h-[calc(100vh-var(--k-header-h))] items-center overflow-hidden px-4 pb-28 pt-12 sm:px-6 lg:px-8"
    >
      {/* --- camadas de fundo ------------------------------------------- */}
      <motion.div aria-hidden className="absolute inset-0 z-0" style={layer(yBack)}>
        <SpeedLines x={74} y={34} color="rgba(18,16,14,0.13)" />
        <Halftone color="rgba(255,255,255,0.4)" step={11} />

        {/* Onomatopeias soltas — só onde há margem livre. */}
        <Onoma accent="lime" className="absolute left-[4%] top-[16%] hidden text-5xl xl:block">
          THWIP!
        </Onoma>
        <Onoma accent="cyan" className="absolute right-[6%] bottom-[18%] hidden rotate-12 text-4xl xl:block">
          ZAP!
        </Onoma>
      </motion.div>

      <motion.div className="relative z-10 mx-auto w-full max-w-container" style={layer(yFront)}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* --- coluna de texto ---------------------------------------- */}
          <div>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Caption>{HERO.kicker}</Caption>
            </motion.div>

            {/* --- assinatura do autor (anomalia Terra-138) -------------- */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.06 }}
            >
              <PunkName className="text-[clamp(1.4rem,3.6vw,2.4rem)]">{HERO.author}</PunkName>
              <span className="k-kicker text-[9px] text-[var(--k-ink)]/60">{HERO.authorTag}</span>
            </motion.div>

            <h1 id="hero-title" className="mt-5 text-[clamp(2.8rem,9.5vw,7.5rem)]">
              {[HERO.titleTop, HERO.titleMid].map((line, i) => (
                <motion.span
                  key={line}
                  className="k-title k-3d k-3d--deep block"
                  initial={reduced ? false : { opacity: 0, y: 46, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.09 }}
                >
                  {line}
                </motion.span>
              ))}

              <motion.span
                className="mt-1 block"
                initial={reduced ? false : { opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
              >
                <GlitchTitle as="span" treatment="glitch">
                  {HERO.titleGlitch}
                </GlitchTitle>
              </motion.span>
            </h1>

            <motion.p
              className="k-body mt-8 max-w-xl text-base font-medium leading-relaxed text-[var(--k-ink)]/85 sm:text-lg"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.44 }}
            >
              {HERO.subtitle}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.54 }}
            >
              <ComicButton href={HERO.primaryCta.href}>{HERO.primaryCta.label}</ComicButton>
              <ComicButton href={HERO.secondaryCta.href} variant="ghost">
                {HERO.secondaryCta.label} →
              </ComicButton>
            </motion.div>

            {/* --- números do arquivo ----------------------------------- */}
            <motion.ul
              className="mt-12 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.64 }}
            >
              {FUN_STATS.map((s) => (
                <li key={s.label} className="k-panel px-3 py-3 text-center">
                  <Counter to={s.value} suffix={s.suffix} className="k-num block text-3xl sm:text-4xl" />
                  <span className="k-sub mt-1 block text-[10px] leading-tight opacity-70">{s.label}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* --- requadro lateral --------------------------------------- */}
          <motion.div
            className="relative hidden lg:block"
            initial={reduced ? false : { opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.25 }}
          >
            <div className="k-panel k-tilt-r relative aspect-[4/5] overflow-hidden">
              <Halftone color="rgba(255,45,149,0.3)" step={6} />
              <SpeedLines x={50} y={28} color="rgba(18,16,14,0.16)" />

              <span
                aria-hidden
                className="k-title absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-[clamp(2.2rem,4vw,3.6rem)] text-[var(--k-ink)] opacity-15"
              >
                Terra
                <br />
                LR
              </span>

              <div className="absolute inset-x-6 bottom-6 space-y-4">
                <Bubble>{HERO.bubble}</Bubble>
              </div>
            </div>

            {/* Selo de impacto no canto do requadro. */}
            <Burst accent="yellow" className="absolute -left-10 -top-8 size-28 rotate-[-8deg]">
              <span className="k-title max-w-[70%] text-sm leading-tight">Nada à venda</span>
            </Burst>

            <Bubble thought className="k-tilt-l absolute -bottom-10 -left-6 max-w-[15rem]">
              {HERO.thought}
            </Bubble>
          </motion.div>
        </div>
      </motion.div>

      <motion.span
        aria-hidden
        style={reduced ? undefined : { opacity: fade }}
        className="k-kicker absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-[10px] opacity-70"
      >
        role para baixo
      </motion.span>
    </section>
  )
}
