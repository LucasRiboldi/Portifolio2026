"use client"

import Link from "next/link"
import { motion, type Variants } from "motion/react"
import { BookOpen, MapPin, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { STORYBOOK_URL } from "@/constants/site"
import { BentoCard } from "./bento-card"
import { ArtArrow } from "@/components/design-system/art-graphics"
import { useSiteConfig } from "@/components/providers/site-config-provider"
import { projects as seedProjects, type Project } from "@/data/projects"
import { tools as seedTools, type Tool } from "@/data/tools"

const pop: Variants = {
  hidden: { opacity: 0, y: 24, rotate: -4, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { delay: i * 0.06, type: "spring", stiffness: 260, damping: 18 },
  }),
}

// Primeiro requadro = elemento LCP: pinta imediatamente (sem opacity:0).
const heroPop: Variants = {
  hidden: { y: 12, scale: 0.98 },
  visible: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
}

/** Recitativo — a caixa amarela de narração no canto do requadro. */
function Recitativo({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "sv-heavy inline-block border-2 border-black bg-[var(--sv-yellow)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-black shadow-[2px_2px_0_0_#000]",
        className
      )}
    >
      {children}
    </span>
  )
}

/** Balão de fala — branco, rabicho para baixo. */
function Balao({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block rounded-2xl border-2 border-black bg-white px-3 py-2 text-xs leading-snug text-black",
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-[9px] left-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-black bg-white"
      />
    </span>
  )
}

/**
 * O MIOLO — uma página de quadrinhos de verdade.
 *
 * A capa (ComicCover) é o lado de fora da revista; isto é o lado de dentro:
 * papel claro, requadros com sarjeta preta, recitativos de narração e leitura
 * sequencial que termina em "CONTINUA...". Cada requadro continua rodando
 * numa dimensão diferente (`sv-dim-*` repinta o `.sv-panel` por contexto),
 * como uma edição impressa por vários desenhistas.
 *
 * Regra herdada da versão anterior: nada de cor cravada no texto
 * (`text-white/70`) — as dimensões claras (manga) pintam o painel de branco;
 * use `opacity-*`, que herda a tinta da dimensão ativa.
 */
interface BentoGridProps {
  projects?: Project[]
  tools?: Tool[]
}

export function BentoGrid({ projects = seedProjects, tools = seedTools }: BentoGridProps) {
  const siteConfig = useSiteConfig()
  const featuredProject = projects.find(p => p.featured)

  return (
    <div className="relative border-[3px] border-black bg-[var(--sv-paper)] p-3 shadow-[10px_10px_0_0_#000] sm:p-4">
      {/* cabeça da página, como numa edição impressa */}
      <div className="sv-heavy mb-2 flex items-center justify-between text-[9px] uppercase tracking-widest text-black/60">
        <span>LR Comics · Edição #1</span>
        <span>miolo · pág. 2</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-6">
        {/* ── REQUADRO 1 · matéria de capa (splash largo) ─────────────── */}
        <motion.div
          className="col-span-2 md:col-span-4"
          initial="hidden" animate="visible" variants={heroPop}
        >
          <BentoCard
            className="art-tex-benday flex h-full min-h-[300px] flex-col justify-between rounded-none"
            accent="magenta"
          >
            <div>
              <Recitativo className="-ml-1 -mt-1 rotate-[-1deg]">Nesta edição…</Recitativo>
              <h2 className="sv-display mt-4 text-5xl uppercase leading-none sm:text-6xl">
                <span className="sv-rainbow block">
                  {featuredProject?.title ?? "Portfólio"}
                </span>
              </h2>
              <Balao className="mt-5 max-w-sm rotate-[0.5deg]">
                {featuredProject?.description ?? siteConfig.description}
              </Balao>
            </div>

            <div className="relative mt-6 flex flex-wrap gap-3">
              <ArtArrow
                className="pointer-events-none absolute -top-11 left-6 hidden h-10 w-14 -scale-x-100 sm:block"
                color="var(--sv-cyan)"
              />
              <Link
                href={featuredProject?.href ?? "/portfolio"}
                className="sv-display rounded-md border-[3px] border-black bg-[var(--sv-yellow)] px-5 py-2 text-lg uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-[-2deg]"
              >
                Ler matéria →
              </Link>
              <Link
                href="/portfolio"
                className="sv-display rounded-md border-[3px] border-black bg-[var(--sv-cyan)] px-5 py-2 text-lg uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-[2deg]"
              >
                Todas as edições →
              </Link>
            </div>
          </BentoCard>
        </motion.div>

        {/* ── REQUADRO 2 · o herói — Terra-50101 (Mumbattan) ──────────── */}
        <motion.div className="sv-dim-neon md:col-span-2" custom={1} initial="hidden" animate="visible" variants={pop}>
          <BentoCard accent="cyan" className="art-tex-speedlines h-full min-h-[180px] rounded-none">
            <div className="flex h-full flex-col">
              <Recitativo className="w-fit rotate-[-2deg]">Enquanto isso…</Recitativo>
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div
                  className="sv-burst mx-auto mb-2 flex h-20 w-20 items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--sv-magenta), var(--sv-violet))' }}
                >
                  <Zap className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
                <p className="sv-display text-lg uppercase">o autor</p>
                <p className="sv-heavy text-[9px] uppercase tracking-widest opacity-60">Terra-50101</p>
              </div>
            </div>
          </BentoCard>
        </motion.div>

        {/* ── REQUADRO 3 · cenário — Terra-42 (Noir) ──────────────────── */}
        <motion.div className="sv-dim-noir md:col-span-2" custom={2} initial="hidden" animate="visible" variants={pop}>
          <BentoCard className="art-tex-moire flex h-full min-h-[150px] flex-col justify-center rounded-none">
            <Recitativo className="absolute left-2 top-2 rotate-[1deg]">Em algum lugar de…</Recitativo>
            <MapPin className="mb-2 mt-4 h-6 w-6" strokeWidth={2.5} />
            <p className="sv-heavy text-lg uppercase leading-none">{siteConfig.location}</p>
            <p className="sv-display mt-2 text-base uppercase opacity-80">disponível remoto</p>
            <p className="sv-heavy mt-1 text-[9px] uppercase tracking-widest opacity-50">Terra-42</p>
          </BentoCard>
        </motion.div>

        {/* ── REQUADRO 4 · onomatopeia de projetos — Terra-14512 (Manga) ─ */}
        <motion.div className="sv-dim-manga md:col-span-2" custom={3} initial="hidden" animate="visible" variants={pop}>
          <BentoCard className="art-tex-screentone flex h-full min-h-[150px] flex-col items-center justify-center rounded-none text-center">
            <span className="sv-display text-6xl" style={{ WebkitTextStroke: '2px #000' }}>
              {projects.length}!
            </span>
            <span className="sv-heavy mt-1 text-xs uppercase tracking-wider opacity-70">projetos</span>
          </BentoCard>
        </motion.div>

        {/* ── REQUADRO 5 · onomatopeia de ferramentas — Terra-1610 ─────── */}
        <motion.div className="sv-dim-graffiti md:col-span-2" custom={4} initial="hidden" animate="visible" variants={pop}>
          <BentoCard className="art-tex-spatter flex h-full min-h-[150px] flex-col items-center justify-center rounded-none text-center">
            <span className="sv-display text-6xl" style={{ WebkitTextStroke: '2px #000' }}>
              {tools.length}!
            </span>
            <span className="sv-heavy mt-1 text-xs uppercase tracking-wider opacity-70">ferramentas</span>
          </BentoCard>
        </motion.div>

        {/* ── REQUADRO FINAL · Storybook — Terra-928 (2099) ────────────── */}
        <motion.div
          className="sv-dim-2099 col-span-2 md:col-span-6"
          custom={5} initial="hidden" animate="visible" variants={pop}
        >
          <a
            href={STORYBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/sb block h-full"
          >
            <BentoCard className="art-tex-misregister flex h-full flex-col justify-between rounded-none">
              <div>
                <p className="sv-display mb-2 text-2xl uppercase">
                  {"// storybook"}
                </p>
                <p className="sv-heavy text-xs uppercase leading-snug tracking-wide opacity-70">
                  O catálogo vivo do Design System — 40+ componentes, cada estado
                  navegável e testável isoladamente.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                <span className="sv-display inline-flex w-fit items-center gap-2 rounded-md border-[3px] border-black bg-[var(--sv-violet)] px-4 py-1.5 text-base uppercase text-white shadow-[4px_4px_0_0_#000] transition-transform group-hover/sb:-translate-y-1 group-hover/sb:rotate-[-2deg]">
                  <BookOpen className="size-4" strokeWidth={2.5} />
                  Abrir Storybook ↗
                </span>
                <Recitativo className="rotate-[-1deg]">Continua…</Recitativo>
              </div>
            </BentoCard>
          </a>
        </motion.div>
      </div>

      {/* pé da página */}
      <p className="sv-heavy mt-2 text-center text-[9px] uppercase tracking-widest text-black/50">
        — 2 —
      </p>
    </div>
  )
}
