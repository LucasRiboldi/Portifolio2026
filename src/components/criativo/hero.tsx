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
import { Counter } from "@/components/comic/counter"
import { EASE } from "@/components/comic/motion"
import { toChars, toWords, isSpace } from "@/animations/split"
import { useMouseParallax } from "@/hooks/use-mouse-parallax"
import { useMagnetic } from "@/hooks/use-magnetic"
import { TiltCard } from "./tilt-card"
import { FUN_STATS, HERO } from "@/constants/criativo-landing"

/**
 * Capa da edição — o requadro de abertura do multiverso, versão cinematográfica.
 *
 * Camadas de movimento sobrepostas, cada uma na sua fonte:
 * - parallax de SCROLL (`useScroll` sobre o próprio bloco) afasta fundo e frente
 *   conforme a página desce;
 * - parallax de PONTEIRO (`useMouseParallax` → `--px/--py`) dá profundidade viva
 *   às onomatopeias e ao requadro lateral quando o mouse passeia;
 * - o título entra caractere a caractere e o subtítulo palavra a palavra.
 *
 * Decisão de LCP preservada do original: o `<h1>` é o elemento de LCP e não é
 * escondido — os caracteres animam só o `transform` (sobem de `0.5em` e giram),
 * com `opacity: 1` desde o primeiro paint. É um reveal por caractere de verdade,
 * sem o custo de esconder o maior texto da tela até a hidratação. O subtítulo
 * (LCP do mobile) segue a mesma regra: palavras deslizam, nunca apagam.
 *
 * Acessibilidade: os pedaços de texto são `aria-hidden` e o texto real vai no
 * `aria-label` do container — o leitor de tela lê a frase, não letra a letra.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const magPrimary = useMagnetic<HTMLSpanElement>(0.4)
  const magSecondary = useMagnetic<HTMLSpanElement>(0.4)
  useMouseParallax(ref)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  const yBack = useTransform(scrollYProgress, [0, 1], ["0%", "24%"])
  const yFront = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const layer = (y: typeof yBack) => (reduced ? undefined : { y })

  // Caracteres do título: cada linha vira um span acessível (aria-label) com os
  // caracteres decorativos dentro. O contador global dá o atraso em cascata.
  let charIndex = 0
  function TitleLine({ text }: { text: string }) {
    return (
      <span className="k-title k-3d k-3d--deep block" aria-label={text}>
        {toChars(text).map((ch, i) => {
          const delay = 0.1 + charIndex++ * 0.028
          return (
            <motion.span
              key={i}
              aria-hidden
              className="cx-char"
              // Só transform: o LCP pinta no primeiro paint (opacity nunca 0).
              initial={reduced ? false : { y: "0.5em", rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay }}
            >
              {ch}
            </motion.span>
          )
        })}
      </span>
    )
  }

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="cx-parallax k-zone k-zone--multiverso k-grain relative isolate flex min-h-[calc(100vh-var(--k-header-h))] items-center overflow-hidden px-4 pb-28 pt-12 sm:px-6 lg:px-8"
    >
      {/* --- fundo vivo: mesh + grão (atrás de tudo) -------------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="cx-mesh"
          style={
            {
              "--k-a": "var(--k-magenta)",
              "--k-b": "var(--k-yellow)",
              "--k-c": "var(--k-orange)",
              "--k-d": "var(--k-cyan)",
            } as React.CSSProperties
          }
        />
        <div className="cx-noise" />
      </div>

      {/* --- camadas de fundo (parallax de scroll + ponteiro) ---------- */}
      <motion.div aria-hidden className="absolute inset-0 z-0" style={layer(yBack)}>
        <SpeedLines x={74} y={34} color="rgba(18,16,14,0.13)" />
        <Halftone color="rgba(255,255,255,0.4)" step={11} />

        {/* Onomatopeias soltas — profundidade pelo ponteiro (--cx-depth). */}
        <span
          className="cx-layer absolute left-[4%] top-[16%] hidden xl:block"
          style={{ "--cx-depth": 26 } as React.CSSProperties}
        >
          <Onoma accent="lime" className="text-5xl">
            THWIP!
          </Onoma>
        </span>
        <span
          className="cx-layer absolute right-[6%] bottom-[18%] hidden rotate-12 xl:block"
          style={{ "--cx-depth": 40 } as React.CSSProperties}
        >
          <Onoma accent="cyan" className="text-4xl">
            ZAP!
          </Onoma>
        </span>
      </motion.div>

      <motion.div className="relative z-10 mx-auto w-full max-w-container" style={layer(yFront)}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* --- coluna de texto ---------------------------------------- */}
          <div>
            <motion.div
              initial={reduced ? false : { y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Caption>{HERO.kicker}</Caption>
            </motion.div>

            {/* --- assinatura do autor (anomalia Terra-138) -------------- */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
              initial={reduced ? false : { y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.06 }}
            >
              <GlitchTitle as="span" treatment="glitch" className="text-[clamp(1.4rem,3.6vw,2.4rem)]">
                {HERO.author}
              </GlitchTitle>
              <span className="k-kicker text-[9px] text-[var(--k-ink)]/60">{HERO.authorTag}</span>
            </motion.div>

            <h1 id="hero-title" className="mt-5 text-[clamp(2.8rem,9.5vw,7.5rem)]" aria-label={`${HERO.titleTop} ${HERO.titleMid} ${HERO.titleGlitch}`}>
              <TitleLine text={HERO.titleTop} />
              <TitleLine text={HERO.titleMid} />

              <motion.span
                className="mt-1 block"
                initial={reduced ? false : { scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.34 }}
              >
                <GlitchTitle as="span" treatment="glitch">
                  {HERO.titleGlitch}
                </GlitchTitle>
              </motion.span>
            </h1>

            {/* --- subtítulo: palavra a palavra (só transform) ---------- */}
            <p
              className="k-body mt-8 max-w-xl text-base font-medium leading-relaxed text-[var(--k-ink)]/85 sm:text-lg"
              aria-label={HERO.subtitle}
            >
              {toWords(HERO.subtitle).map((tok, i) =>
                isSpace(tok) ? (
                  <span key={i} aria-hidden>
                    {" "}
                  </span>
                ) : (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="cx-word"
                    initial={reduced ? false : { y: "0.6em" }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.44 + i * 0.012 }}
                  >
                    {tok}
                  </motion.span>
                ),
              )}
            </p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={reduced ? false : { y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.54 }}
            >
              <span ref={magPrimary} className="cx-magnetic inline-block" data-cursor="ir">
                <ComicButton href={HERO.primaryCta.href}>{HERO.primaryCta.label}</ComicButton>
              </span>
              <span ref={magSecondary} className="cx-magnetic inline-block" data-cursor="ver">
                <ComicButton href={HERO.secondaryCta.href} variant="ghost">
                  {HERO.secondaryCta.label} →
                </ComicButton>
              </span>
            </motion.div>

            {/* --- números do arquivo ----------------------------------- */}
            <motion.ul
              className="mt-12 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
              initial={reduced ? false : { y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.64 }}
            >
              {FUN_STATS.map((s) => (
                <li key={s.label}>
                  <TiltCard max={10} className="k-panel px-3 py-3 text-center">
                    <Counter to={s.value} suffix={s.suffix} className="k-num block text-3xl sm:text-4xl" />
                    <span className="k-sub mt-1 block text-[10px] leading-tight opacity-70">{s.label}</span>
                  </TiltCard>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* --- requadro lateral (profundidade pelo ponteiro) ---------- */}
          <motion.div
            className="cx-layer relative hidden lg:block"
            style={{ "--cx-depth": 18 } as React.CSSProperties}
            initial={reduced ? false : { x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.95, ease: EASE, delay: 0.25 }}
          >
            <div className="k-panel k-tilt-r relative aspect-[4/5] overflow-hidden" data-cursor="terra-lr">
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

            <Burst accent="yellow" className="absolute -left-10 -top-8 size-28 rotate-[-8deg]">
              <span className="k-title max-w-[70%] text-sm leading-tight">Nada à venda</span>
            </Burst>

            <Bubble thought className="k-tilt-l absolute -bottom-10 -left-6 max-w-[15rem]">
              {HERO.thought}
            </Bubble>
          </motion.div>
        </div>
      </motion.div>

      {/* --- scroll cue novo (trilho de tinta correndo) ---------------- */}
      <motion.span
        aria-hidden
        style={reduced ? undefined : { opacity: fade }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <span className="cx-scroll-cue">
          <span className="cx-scroll-cue__rail" />
          role
        </span>
      </motion.span>
    </section>
  )
}
