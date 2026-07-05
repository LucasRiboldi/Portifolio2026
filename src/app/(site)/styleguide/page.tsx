"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SvCanvas, DIMENSIONS, type Dimension } from "@/components/spiderverse/sv-canvas"
import {
  Panel,
  ComicButton,
  SpeechBubble,
  Onoma,
  ComicHeader,
  CaptionBox,
  BurstBadge,
  HalftoneDivider,
  SplitPanel,
} from "@/components/spiderverse/decor"
import { popTilt, dimSwap } from "@/components/spiderverse/motion"

const palette = [
  ['magenta', '#ff2d95'], ['cyan', '#00e5ff'], ['yellow', '#ffe600'],
  ['orange', '#ff5a1f'], ['violet', '#7b2ff7'], ['lime', '#b6ff00'],
]
const neutrals = [
  ['ink', '#0a0612'], ['ink-2', '#140a24'], ['paper', '#fff8e7'],
  ['spot-blue', '#3c78dc'], ['riso-pink', '#ff48b0'], ['riso-blue', '#0078ff'],
]

const snippet = `import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ComicHeader, ComicButton } from "@/components/spiderverse/decor"

export default function Page() {
  return (
    <SvCanvas dimension="neon">
      <ComicHeader kicker="Terra-50101" title="Título" highlight="colorido" />
      <ComicButton color="cyan">Ação →</ComicButton>
    </SvCanvas>
  )
}`

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="sv-display mb-5 text-3xl uppercase">
        <span className="opacity-50">{"//"}</span> {title}
      </h2>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  const [dim, setDim] = useState<Dimension>('multiverse')

  return (
    <AnimatePresence mode="wait">
      <motion.div key={dim} variants={dimSwap} initial="hidden" animate="visible" exit="exit">
        <SvCanvas dimension={dim}>
          {/* Switcher — tilts between styles live */}
          <ComicHeader
            kicker="Guia de estilo · Aranhaverso"
            title="Style"
            highlight="Guide"
            subtitle="Todos os componentes e as 20 dimensões. Clique numa dimensão para trocar o multiverso ao vivo."
          />

          <div className="flex flex-wrap gap-2">
            {DIMENSIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDim(d.id)}
                className={
                  "sv-heavy border-[3px] border-black px-3 py-1.5 text-[11px] uppercase tracking-wide transition-transform hover:-translate-y-0.5 " +
                  (dim === d.id
                    ? "bg-[var(--sv-yellow)] text-black shadow-[3px_3px_0_0_#000]"
                    : "bg-white/10 text-[var(--c-ink)] shadow-[2px_2px_0_0_rgba(0,0,0,0.4)]")
                }
                title={d.desc}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Live dimension info */}
          <motion.div custom={0} variants={popTilt} initial="hidden" animate="visible" className="mt-6">
            <Panel className="flex flex-wrap items-center gap-4">
              <span className="sv-sticker sv-sticker-cyan text-sm">
                Terra-{DIMENSIONS.find((d) => d.id === dim)?.earth}
              </span>
              <span className="sv-display text-2xl uppercase">
                {DIMENSIONS.find((d) => d.id === dim)?.label}
              </span>
              <span className="sv-heavy text-xs uppercase tracking-wide opacity-70">
                {DIMENSIONS.find((d) => d.id === dim)?.desc}
              </span>
            </Panel>
          </motion.div>

          {/* Painéis + tilts */}
          <Section title="Painéis & tilts">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {([1, 2, 3] as const).map((t) => (
                <Panel key={t} tilt={t} className="min-h-[120px]">
                  <p className="sv-display text-xl uppercase">Tilt {t}</p>
                  <p className="sv-heavy mt-2 text-xs uppercase opacity-70">
                    {'<Panel tilt={' + t + '}>'}
                  </p>
                </Panel>
              ))}
            </div>
          </Section>

          {/* Botões */}
          <Section title="Botões">
            <div className="flex flex-wrap gap-4">
              <ComicButton color="yellow">Amarelo →</ComicButton>
              <ComicButton color="cyan">Ciano →</ComicButton>
              <ComicButton color="magenta">Magenta →</ComicButton>
              <ComicButton color="lime">Lime →</ComicButton>
              <ComicButton color="violet">Violeta →</ComicButton>
              <ComicButton color="orange">Laranja →</ComicButton>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <ComicButton color="cyan" ghost>Ghost ciano</ComicButton>
              <ComicButton color="magenta" ghost>Ghost magenta</ComicButton>
              <ComicButton color="lime" ghost>Ghost lime</ComicButton>
            </div>
          </Section>

          {/* Stickers */}
          <Section title="Stickers">
            <div className="flex flex-wrap items-center gap-4">
              <span className="sv-sticker text-sm">Padrão</span>
              <span className="sv-sticker sv-sticker-magenta text-sm">Magenta</span>
              <span className="sv-sticker sv-sticker-cyan text-sm">Ciano</span>
              <span className="sv-sticker sv-sticker-lime text-sm">Lime</span>
              <span className="sv-sticker sv-sticker-violet text-sm">Violeta</span>
              <span className="sv-sticker sv-sticker-orange text-sm">Laranja</span>
            </div>
          </Section>

          {/* Balões & narração */}
          <Section title="Balões & narração">
            <div className="flex flex-wrap items-center gap-10">
              <SpeechBubble>Olá, multiverso!</SpeechBubble>
              <SpeechBubble spiky>GRITO!</SpeechBubble>
              <SpeechBubble thought>hmm…</SpeechBubble>
              <CaptionBox>Enquanto isso…</CaptionBox>
              <CaptionBox color="cyan">Terra-1610</CaptionBox>
              <CaptionBox color="white">Mais tarde</CaptionBox>
            </div>
          </Section>

          {/* Onomatopeias & estrelas */}
          <Section title="Onomatopeias & estrelas">
            <div className="flex flex-wrap items-center gap-10 pt-4">
              <Onoma color="yellow">POW!</Onoma>
              <Onoma color="cyan">THWIP!</Onoma>
              <Onoma color="magenta">BAM!</Onoma>
              <Onoma color="lime">ZAP!</Onoma>
              <Onoma color="violet">WHAM!</Onoma>
              <Onoma color="orange">SNIKT!</Onoma>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <BurstBadge>NEW!</BurstBadge>
              <BurstBadge color="magenta">WOW!</BurstBadge>
              <BurstBadge color="cyan">#1</BurstBadge>
            </div>
          </Section>

          {/* Tipografia */}
          <Section title="Tipografia & efeitos">
            <div className="flex flex-col gap-4">
              <p className="sv-display text-5xl uppercase">Display · Bangers</p>
              <p className="sv-heavy text-2xl uppercase">Heavy · Archivo Black</p>
              <p className="sv-glitch sv-display text-5xl uppercase" data-text="GLITCH">GLITCH</p>
              <p className="sv-rainbow sv-display text-5xl uppercase">RAINBOW</p>
              <p className="sv-outline-text sv-display text-5xl uppercase">OUTLINE</p>
            </div>
          </Section>

          {/* Mistura de dimensões */}
          <Section title="Mistura de dimensões">
            <p className="sv-heavy mb-5 max-w-2xl text-xs uppercase tracking-wide opacity-70">
              Como nas cenas do filme onde dois universos colidem: painéis divididos,
              dupla-exposição de halftone, fusão de cores e fendas.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <SplitPanel a="sv-dim-neon" b="sv-dim-renaissance">
                <p className="sv-display text-2xl uppercase text-white">Neon × Renascença</p>
                <p className="sv-heavy mt-2 text-[10px] uppercase text-white/80">{'<SplitPanel a b />'}</p>
              </SplitPanel>
              <SplitPanel a="sv-dim-punk" b="sv-dim-2099">
                <p className="sv-display text-2xl uppercase text-white">Punk × 2099</p>
                <p className="sv-heavy mt-2 text-[10px] uppercase text-white/80">colisão de estilos</p>
              </SplitPanel>
              <Panel className="sv-doubleexpose flex min-h-[120px] items-center justify-center">
                <p className="sv-display text-2xl uppercase">Dupla exposição</p>
              </Panel>
              <Panel className="sv-blend flex min-h-[120px] items-center justify-center">
                <p className="sv-rainbow sv-display text-2xl uppercase">Fusão de cores</p>
              </Panel>
            </div>
            <HalftoneDivider />
          </Section>

          {/* Paleta */}
          <Section title="Paleta hiper-saturada">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {palette.map(([name, hex]) => (
                <Panel key={name} className="p-0">
                  <div className="h-16 w-full" style={{ background: hex }} />
                  <div className="p-2">
                    <p className="sv-heavy text-[10px] uppercase">{name}</p>
                    <p className="text-[10px] opacity-70">{hex}</p>
                  </div>
                </Panel>
              ))}
            </div>
            <p className="sv-heavy mb-3 mt-6 text-xs uppercase tracking-wide opacity-70">Neutros & tintas de dimensão</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {neutrals.map(([name, hex]) => (
                <Panel key={name} className="p-0">
                  <div className="h-16 w-full" style={{ background: hex }} />
                  <div className="p-2">
                    <p className="sv-heavy text-[10px] uppercase">{name}</p>
                    <p className="text-[10px] opacity-70">{hex}</p>
                  </div>
                </Panel>
              ))}
            </div>
          </Section>

          {/* Como usar */}
          <Section title="Como usar">
            <Panel className="overflow-x-auto p-0">
              <pre className="p-4 text-[11px] leading-relaxed">
                <code className="font-mono">{snippet}</code>
              </pre>
            </Panel>
          </Section>
        </SvCanvas>
      </motion.div>
    </AnimatePresence>
  )
}
