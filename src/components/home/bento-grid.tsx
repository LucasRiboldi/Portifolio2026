"use client"

import Link from "next/link"
import { motion, type Variants } from "motion/react"
import { BookOpen, MapPin, Zap } from "lucide-react"
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

// Hero = elemento LCP: pinta imediatamente (sem opacity:0), só transform sutil.
// Mantém vida sem atrasar o Largest Contentful Paint.
const heroPop: Variants = {
  hidden: { y: 12, scale: 0.98 },
  visible: {
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
}

/**
 * Cada card do miolo roda numa dimensão diferente do multiverso.
 *
 * As classes `sv-dim-*` funcionam por contexto (`.sv-dim-x .sv-panel {…}`),
 * então basta envolver o card — ele se repinta sozinho. Consequência
 * importante: o texto NÃO pode ter cor cravada (`text-white/70`), senão
 * some nas dimensões claras (manga pinta o painel de branco). Use
 * `opacity-*`, que herda a tinta da dimensão ativa.
 */
interface BentoGridProps {
  projects?: Project[]
  tools?: Tool[]
}

export function BentoGrid({ projects = seedProjects, tools = seedTools }: BentoGridProps) {
  const siteConfig = useSiteConfig()
  const featuredProject = projects.find(p => p.featured)

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">

      {/* MATÉRIA DE CAPA — bloco gigante, 2 colunas.
          A identidade (nome, título, CTAs) vive na ComicCover acima; aqui o
          destaque é o conteúdo da edição, para não repetir o masthead. */}
      <motion.div
        className="col-span-2 row-span-2"
        initial="hidden" animate="visible" variants={heroPop}
      >
        <BentoCard
          className="art-tex-benday flex h-full min-h-[300px] flex-col justify-between"
          accent="magenta"
        >
          <div>
            <span className="sv-sticker sv-sticker-cyan text-sm">matéria de capa</span>
            <h2 className="sv-display mt-4 text-5xl uppercase leading-none sm:text-6xl">
              <span className="sv-rainbow block">
                {featuredProject?.title ?? "Portfólio"}
              </span>
            </h2>
            <p className="sv-heavy mt-4 max-w-sm text-sm uppercase leading-snug tracking-wide opacity-70">
              {featuredProject?.description ?? siteConfig.description}
            </p>
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

      {/* AVATAR — Terra-50101 (Mumbattan): neon, glow */}
      <motion.div className="sv-dim-neon" custom={1} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={2} accent="cyan" className="art-tex-speedlines flex h-full min-h-[140px] items-center justify-center">
          <div className="text-center">
            <div
              className="sv-burst mx-auto mb-2 flex h-20 w-20 items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--sv-magenta), var(--sv-violet))' }}
            >
              <Zap className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <p className="sv-display text-lg uppercase">avatar</p>
            <p className="sv-heavy text-[9px] uppercase tracking-widest opacity-60">Terra-50101</p>
          </div>
        </BentoCard>
      </motion.div>

      {/* LOCALIZAÇÃO — Terra-42 (Noir): P&B, sem cor cravada */}
      <motion.div className="sv-dim-noir" custom={2} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={1} className="art-tex-moire flex h-full min-h-[140px] flex-col justify-center">
          <MapPin className="mb-2 h-6 w-6" strokeWidth={2.5} />
          <p className="sv-heavy text-lg uppercase leading-none">{siteConfig.location}</p>
          <p className="sv-display mt-2 text-base uppercase opacity-80">disponível remoto</p>
          <p className="sv-heavy mt-1 text-[9px] uppercase tracking-widest opacity-50">Terra-42</p>
        </BentoCard>
      </motion.div>

      {/* PROJETOS — Terra-14512 (Manga): screentone, painel branco */}
      <motion.div className="sv-dim-manga" custom={3} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={3} className="art-tex-screentone flex h-full flex-col items-center justify-center text-center">
          <span className="sv-display text-6xl" style={{ WebkitTextStroke: '2px #000' }}>
            {projects.length}
          </span>
          <span className="sv-heavy mt-1 text-xs uppercase tracking-wider opacity-70">projetos</span>
        </BentoCard>
      </motion.div>

      {/* FERRAMENTAS — Terra-1610 (Graffiti): spray, tijolo */}
      <motion.div className="sv-dim-graffiti" custom={4} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={1} className="art-tex-spatter flex h-full flex-col items-center justify-center text-center">
          <span className="sv-display text-6xl" style={{ WebkitTextStroke: '2px #000' }}>
            {tools.length}
          </span>
          <span className="sv-heavy mt-1 text-xs uppercase tracking-wider opacity-70">ferramentas</span>
        </BentoCard>
      </motion.div>

      {/* STORYBOOK — Terra-928 (2099): brutalismo, grid holográfico */}
      <motion.div
        className="sv-dim-2099 col-span-2"
        custom={5} initial="hidden" animate="visible" variants={pop}
      >
        <a
          href={STORYBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group/sb block h-full"
        >
          <BentoCard tilt={1} className="art-tex-misregister flex h-full flex-col justify-between">
            <div>
              <p className="sv-display mb-2 text-2xl uppercase">
                {"// storybook"}
              </p>
              <p className="sv-heavy text-xs uppercase leading-snug tracking-wide opacity-70">
                O catálogo vivo do Design System — 40+ componentes, cada estado
                navegável e testável isoladamente.
              </p>
            </div>
            <span className="sv-display mt-4 inline-flex w-fit items-center gap-2 rounded-md border-[3px] border-black bg-[var(--sv-violet)] px-4 py-1.5 text-base uppercase text-white shadow-[4px_4px_0_0_#000] transition-transform group-hover/sb:-translate-y-1 group-hover/sb:rotate-[-2deg]">
              <BookOpen className="size-4" strokeWidth={2.5} />
              Abrir Storybook ↗
            </span>
          </BentoCard>
        </a>
      </motion.div>

    </div>
  )
}
