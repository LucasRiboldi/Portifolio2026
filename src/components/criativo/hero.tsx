"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import {
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
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text"
import { AuroraText } from "@/components/ui/aurora-text"
import { TiltCard } from "./tilt-card"
import { FUN_STATS, HERO, IMAGEM_TEMPORARIA } from "@/constants/criativo-landing"

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
 *
 * ## A capa dentro da arquitetura da revista
 *
 * A capa assenta nas mesmas medidas dos capítulos (`cp-bleed` e a grelha de 12
 * colunas, aqui em 8+4 — a 7+5 o requadro lateral ficava alto o bastante para
 * empurrar os números do arquivo para fora da dobra) e usa os mesmos requadros
 * (`Panel`, com o mesmo `cp-panel` nas fichas dos números). O que ela não tem
 * é `data-chapter`: a câmara não deve encolher nem dessaturar a capa, porque a
 * capa não é uma página que se vira — é a que está em cima da pilha quando o
 * leitor chega. Encolhê-la ao entrar seria afastar o olho logo no primeiro
 * segundo.
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
      className="cx-parallax k-zone k-zone--multiverso k-grain relative isolate flex min-h-[calc(100vh-var(--k-header-h))] items-center overflow-hidden pb-28 pt-12"
    >
      {/* --- fundo vivo: mesh + grelha reativa + grão (atrás de tudo) ---- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/*
          A GRELHA REATIVA (Magic UI, adaptada em `ui/interactive-grid-pattern`).

          Era o que faltava ao fundo deste herói: mesh, grão, halftone e speed
          lines são todos ESTÁTICOS ou ligados à rolagem — nenhum respondia ao
          cursor. A grelha acende a célula sob o ponteiro e a deixa esfriar
          devagar, o que dá ao fundo a mesma reatividade que os cartões já têm.

          `pointer-events-auto` reverte, só para ela, o `pointer-events-none`
          do contêiner: sem isso a peça não recebe `mouseenter` e o efeito
          inteiro é decoração morta. O contêiner continua transparente ao
          clique — é a grelha que volta a existir para o ponteiro, e ela não
          tem nada clicável.

          16×10 e não os 24×24 do padrão: são 160 retângulos em vez de 576, e
          cada passagem do mouse re-renderiza a lista toda. A malha mais grossa
          também casa melhor com a escala de impressão do realm.

          `xl:block` e escondida abaixo disso: no celular não há cursor para
          acender célula nenhuma, e 160 nós de SVG sem função é peso puro.
        */}
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
        {/* Depois do mesh e antes do grão, de propósito: o mesh é um gradiente
            que cobre a área inteira e engoliria a grelha se ela viesse antes;
            o grão é uma textura translúcida, que passa por cima sem apagar. */}
        <InteractiveGridPattern
          className="pointer-events-auto hidden xl:block"
          squares={[16, 10]}
          width={64}
          height={64}
        />

        <div className="cx-noise" />
      </div>

      {/*
        A ARTE DA CAPA — ao lado do título e por trás dele.

        Ocupa a metade direita do herói, que estava vazia desde que o exemplar
        ganhou largura fixa: a coluna de texto usa ~55% da mancha e o resto era
        só gradiente. A imagem entra atrás (`z-0`, antes da coluna de conteúdo
        que é `z-10`) e sangra para fora pela direita, como arte de capa que o
        corte da revista atravessa.

        `aria-hidden` e sem `alt`: é ilustração de fundo, e o herói já é
        nomeado pelo <h1>. O gradiente à esquerda dissolve a borda dura da
        fotografia por baixo da manchete — sem ele, a letra branca cai sobre a
        arte e perde contraste no meio da palavra.

        Marcador de lugar por enquanto (`IMAGEM_TEMPORARIA`); trocar por arte
        própria é trocar o `src`.
      */}
      <div aria-hidden className="cx-capa">
        <Image
          src={IMAGEM_TEMPORARIA}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 480px"
          className="object-cover object-left-top"
        />
        <span className="cx-capa-veu" />
      </div>

      {/* --- camadas de fundo (parallax de scroll + ponteiro) ---------- */}
      <motion.div aria-hidden className="absolute inset-0 z-0" style={layer(yBack)}>
        <SpeedLines x={74} y={34} color="rgba(18,16,14,0.13)" />
        <Halftone color="rgba(255,255,255,0.4)" step={11} />

        {/* Onomatopeias soltas — profundidade pelo ponteiro (--cx-depth).

            O THWIP! estava em `left-[4%]`, e enquanto a secção media a largura
            da janela isso caía na faixa vazia à esquerda da coluna de texto.
            Com o exemplar em `--cp-mag`, a secção passou a ser a própria
            coluna: 4% de 900px são 36px, e a palavra ia parar por cima da
            manchete. Reancorada à direita, que é onde a arte do herói continua
            livre em qualquer largura — a cor, a rotação, o tamanho e o
            parallax de profundidade não mudaram. */}
        <span
          className="cx-layer absolute right-[8%] top-[13%] hidden xl:block"
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

      <motion.div className="cp-bleed relative z-10" style={layer(yFront)}>
        <div className="cp-grid items-center gap-y-12">
          {/* --- coluna de texto ---------------------------------------- */}
          <div className="cp-col" style={{ "--cp-span-l": 12 } as React.CSSProperties}>
            <motion.div
              initial={reduced ? false : { y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {/*
                O TEXT REVEAL entra AQUI, e não na manchete — e a escolha é a
                decisão de LCP documentada no topo deste arquivo.

                Os componentes de reveal do registry (`text-reveal`,
                `blur-fade`) começam em `opacity: 0` e esperam a hidratação.
                Aplicá-los ao `<h1>`, que é o elemento de LCP, atrasaria a
                pintura do maior texto da tela — exatamente o que o reveal por
                caractere daqui foi escrito para evitar.

                `AnimatedShinyText` não tem esse problema: ele varre o
                `background-position` de um gradiente recortado no texto. A
                letra está pintada no primeiro quadro; o que se move é o
                brilho. O chapéu é o lugar certo para ele — é curto, é
                secundário e não disputa LCP com ninguém.
              */}
              <Caption>
                <AnimatedShinyText>{HERO.kicker}</AnimatedShinyText>
              </Caption>
            </motion.div>

            {/* --- assinatura do autor (anomalia Terra-138) -------------- */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
              initial={reduced ? false : { y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.06 }}
            >
              {/* O teto passou a ser 3,6% da REVISTA (`--cp-mag`), não da
                  janela — ver o comentário do <h1> logo abaixo. */}
              <GlitchTitle as="span" treatment="glitch" className="text-[clamp(1.4rem,3.6vw,calc(var(--cp-mag)*0.036))]">
                {HERO.author}
              </GlitchTitle>
              {/*
                O GRADIENTE (aurora) na etiqueta da anomalia, não na
                assinatura ao lado: aquela já é tratada pelo `GlitchTitle`, e
                dois efeitos de cor no mesmo par de palavras se anulariam —
                o glitch trabalha por deslocamento de canal, o aurora por
                varredura de matiz, e sobrepostos viram ruído.

                Aqui ele tem função: a etiqueta é a linha mais miúda do bloco
                e a que mais some. Cor em movimento devolve a ela o peso que a
                hierarquia tipográfica lhe tirou, sem aumentar o corpo.
              */}
              <AuroraText className="k-kicker text-[9px]">{HERO.authorTag}</AuroraText>
            </motion.div>

            {/*
              O teto do clamp é 9,5% da REVISTA, não da janela.

              `9.5vw` com teto de 7.5rem foi escrito quando a página ocupava a
              largura toda: a fonte crescia junto com o espaço disponível. Com
              o exemplar fixo em `--cp-mag`, a janela continuava a crescer e a
              caixa não — num monitor de 1920 a manchete ia a 120px dentro de
              836px de mancha, "REPOSITÓRIO" transbordava e colidia com a linha
              seguinte.

              `calc(var(--cp-mag)*0.095)` é exatamente o valor que `9.5vw`
              atinge quando a janela mede o mesmo que a revista. Abaixo disso
              nada muda — a curva fluida é a mesma, com os mesmos números, em
              todas as larguras em que o exemplar ainda se adapta. Só deixa de
              crescer no ponto em que a revista também deixa.
            */}
            <h1 id="hero-title" className="mt-5 text-[clamp(2.8rem,9.5vw,calc(var(--cp-mag)*0.095))]" aria-label={`${HERO.titleTop} ${HERO.titleMid} ${HERO.titleGlitch}`}>
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
              <span ref={magPrimary} className="cx-magnetic inline-block">
                <ComicButton href={HERO.primaryCta.href}>{HERO.primaryCta.label}</ComicButton>
              </span>
              <span ref={magSecondary} className="cx-magnetic inline-block">
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
                  {/* `cp-panel` e não `k-panel`: na capa os números são
                      requadros como os do resto da revista, e a moldura tem de
                      ser a mesma que o leitor vai reencontrar nos capítulos. */}
                  <TiltCard max={10} className="cp-panel px-3 py-3 text-center">
                    <Counter to={s.value} suffix={s.suffix} className="k-num block text-3xl sm:text-4xl" />
                    <span className="k-sub mt-1 block text-[10px] leading-tight opacity-70">{s.label}</span>
                  </TiltCard>
                </li>
              ))}
            </motion.ul>
          </div>

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
