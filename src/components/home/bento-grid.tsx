"use client"

import Link from "next/link"
import { motion, type Variants } from "motion/react"
import { Mail, MapPin, Zap } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons"
import { BentoCard } from "./bento-card"
import { ArtArrow } from "@/components/design-system/art-graphics"
import { siteConfig } from "@/constants/site"
import { projects } from "@/data/projects"
import { tools } from "@/data/tools"

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

const socialLinks = [
  { label: 'GitHub', href: siteConfig.github, icon: GithubIcon },
  { label: 'LinkedIn', href: siteConfig.linkedin, icon: LinkedinIcon },
  { label: 'E-mail', href: `mailto:${siteConfig.email}`, icon: Mail },
]

export function BentoGrid() {
  const featuredProject = projects.find(p => p.featured)
  const recentProjects = projects.slice(0, 3)
  const [firstName, ...rest] = siteConfig.name.split(' ')
  const lastName = rest.join(' ')

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">

      {/* HERO — bloco gigante, 2 colunas */}
      <motion.div
        className="col-span-2 row-span-2"
        custom={0} initial="hidden" animate="visible" variants={pop}
      >
        <BentoCard className="flex h-full min-h-[300px] flex-col justify-between sv-dots" accent="magenta">
          <div>
            <span className="sv-sticker sv-sticker-cyan text-sm">
              {siteConfig.title}
            </span>
            <h1 className="sv-display mt-4 text-6xl uppercase sm:text-7xl">
              <span
                className="sv-glitch block"
                data-text={firstName}
              >
                {firstName}
              </span>
              <span className="sv-rainbow block">{lastName}</span>
            </h1>
            <p className="sv-heavy mt-4 max-w-sm text-sm uppercase leading-snug tracking-wide text-white/70">
              {siteConfig.description}
            </p>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <ArtArrow
              className="pointer-events-none absolute -top-11 left-6 hidden h-10 w-14 -scale-x-100 sm:block"
              color="var(--sv-cyan)"
            />
            <Link
              href="/portfolio"
              className="sv-display rounded-md border-[3px] border-black bg-[var(--sv-yellow)] px-5 py-2 text-lg uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-[-2deg]"
            >
              Ver portfólio →
            </Link>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="sv-display rounded-md border-[3px] border-black bg-[var(--sv-cyan)] px-5 py-2 text-lg uppercase text-black shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:rotate-[2deg]"
            >
              GitHub ↗
            </a>
          </div>
        </BentoCard>
      </motion.div>

      {/* AVATAR / spider-emblem */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={2} accent="cyan" className="flex h-full min-h-[140px] items-center justify-center sv-dots-cyan">
          <div className="text-center">
            <div
              className="sv-burst mx-auto mb-2 flex h-20 w-20 items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--sv-magenta), var(--sv-violet))' }}
            >
              <Zap className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <p className="sv-display text-lg uppercase text-[var(--sv-yellow)]">avatar</p>
          </div>
        </BentoCard>
      </motion.div>

      {/* LOCALIZAÇÃO */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={1} accent="lime" className="flex h-full min-h-[140px] flex-col justify-center">
          <MapPin className="mb-2 h-6 w-6 text-[var(--sv-lime)]" strokeWidth={2.5} />
          <p className="sv-heavy text-lg uppercase leading-none">{siteConfig.location}</p>
          <p className="sv-display mt-2 text-base uppercase text-[var(--sv-cyan)]">disponível remoto</p>
        </BentoCard>
      </motion.div>

      {/* PROJETOS counter */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={3} accent="yellow" className="flex h-full flex-col items-center justify-center text-center">
          <span className="sv-display text-6xl text-[var(--sv-yellow)]" style={{ WebkitTextStroke: '2px #000' }}>
            {projects.length}
          </span>
          <span className="sv-heavy mt-1 text-xs uppercase tracking-wider text-white/70">projetos</span>
        </BentoCard>
      </motion.div>

      {/* FERRAMENTAS counter */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={pop}>
        <BentoCard tilt={1} accent="violet" className="flex h-full flex-col items-center justify-center text-center">
          <span className="sv-display text-6xl text-[var(--sv-magenta)]" style={{ WebkitTextStroke: '2px #000' }}>
            {tools.length}
          </span>
          <span className="sv-heavy mt-1 text-xs uppercase tracking-wider text-white/70">ferramentas</span>
        </BentoCard>
      </motion.div>

      {/* STACK — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={5} initial="hidden" animate="visible" variants={pop}
      >
        <BentoCard className="h-full">
          <p className="sv-display mb-3 text-2xl uppercase text-[var(--sv-cyan)]">{"// stack"}</p>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Figma', 'Next.js', 'Node.js', 'Firebase'].map((tech, i) => (
              <span
                key={tech}
                className={
                  "sv-sticker text-sm " +
                  ['', 'sv-sticker-magenta', 'sv-sticker-cyan', 'sv-sticker-lime', '', 'sv-sticker-magenta'][i % 6]
                }
              >
                {tech}
              </span>
            ))}
          </div>
        </BentoCard>
      </motion.div>

      {/* DESTAQUE */}
      {featuredProject && (
        <motion.div
          className="col-span-2"
          custom={6} initial="hidden" animate="visible" variants={pop}
        >
          <BentoCard accent="magenta" tilt={2} className="flex h-full flex-col justify-center sv-dots">
            <span className="sv-sticker sv-sticker-lime text-sm">em destaque</span>
            <p className="sv-display mt-3 text-3xl uppercase leading-none">{featuredProject.title}</p>
            <p className="sv-heavy mt-1 text-xs uppercase tracking-wider text-white/70">{featuredProject.category}</p>
          </BentoCard>
        </motion.div>
      )}

      {/* RECENTES — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={7} initial="hidden" animate="visible" variants={pop}
      >
        <BentoCard className="h-full">
          <p className="sv-display mb-3 text-2xl uppercase text-[var(--sv-yellow)]">{"// portfólio recente"}</p>
          <div className="grid grid-cols-3 gap-3">
            {recentProjects.map((p, i) => (
              <div
                key={p.id}
                title={p.title}
                className="h-20 border-[3px] border-black shadow-[3px_3px_0_0_#000] sv-dots-cyan"
                style={{
                  background: [
                    'linear-gradient(135deg, var(--sv-magenta), var(--sv-orange))',
                    'linear-gradient(135deg, var(--sv-cyan), var(--sv-violet))',
                    'linear-gradient(135deg, var(--sv-lime), var(--sv-yellow))',
                  ][i % 3],
                  transform: `rotate(${[-3, 2, -1][i % 3]}deg)`,
                }}
              />
            ))}
          </div>
          <Link
            href="/portfolio"
            className="sv-underline sv-heavy mt-5 inline-block text-xs uppercase tracking-wider text-white transition-colors hover:text-[var(--sv-magenta)]"
          >
            → ver todos os projetos
          </Link>
        </BentoCard>
      </motion.div>

      {/* LINKS — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={8} initial="hidden" animate="visible" variants={pop}
      >
        <BentoCard accent="cyan" className="h-full">
          <p className="sv-display mb-3 text-2xl uppercase text-[var(--sv-cyan)]">{"// links"}</p>
          <div className="flex flex-col gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="sv-heavy group flex items-center justify-between border-b-[3px] border-black/50 pb-2 text-sm uppercase tracking-wide text-white transition-colors hover:text-[var(--sv-yellow)]"
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {label}
                </span>
                <span className="translate-x-0 transition-transform group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </BentoCard>
      </motion.div>

    </div>
  )
}
