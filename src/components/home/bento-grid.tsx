"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Mail, MapPin } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons"
import { BentoCard } from "./bento-card"
import { SportsWidget } from "@/components/widgets/sports-widget"
import { siteConfig } from "@/constants/site"
import { projects } from "@/data/projects"
import { tools } from "@/data/tools"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4 },
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

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

      {/* Hero — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={0} initial="hidden" animate="visible" variants={fadeUp}
      >
        <BentoCard className="relative flex h-full min-h-[180px] flex-col justify-between overflow-hidden">
          <div className="gradient-accent-bar absolute left-0 right-0 top-0" />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-orange-500/15 to-violet-500/15" />
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {siteConfig.title}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight">
              {firstName}<br />
              <span className="gradient-text">{rest.join(' ')}</span>
            </h1>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href="/portfolio"
              className="rounded-md px-4 py-2 text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(90deg, #f97316, #ec4899)' }}
            >
              Ver portfólio
            </Link>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub ↗
            </a>
          </div>
        </BentoCard>
      </motion.div>

      {/* Avatar */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard
          className="flex h-full min-h-[180px] items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(139,92,246,0.1))' }}
        >
          <div className="text-center">
            <div
              className="mx-auto mb-2 h-16 w-16 rounded-full"
              style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }}
            />
            <p className="text-xs text-muted-foreground">foto / avatar</p>
          </div>
        </BentoCard>
      </motion.div>

      {/* Localização */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard className="flex h-full min-h-[180px] flex-col justify-center">
          <MapPin className="mb-2 h-5 w-5 text-muted-foreground" />
          <p className="font-semibold">{siteConfig.location}</p>
          <p className="mt-1 text-xs text-muted-foreground">Disponível remoto</p>
        </BentoCard>
      </motion.div>

      {/* Stack */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard className="h-full">
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Stack</p>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Figma', 'Next.js', 'Node.js', 'Firebase'].map(tech => (
              <span
                key={tech}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </BentoCard>
      </motion.div>

      {/* Projetos counter */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard accent="orange" className="flex h-full flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold" style={{ color: '#f97316' }}>
            {projects.length}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">projetos</span>
        </BentoCard>
      </motion.div>

      {/* Ferramentas counter */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
        <BentoCard accent="purple" className="flex h-full flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold" style={{ color: '#8b5cf6' }}>
            {tools.length}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">ferramentas</span>
        </BentoCard>
      </motion.div>

      {/* Destaque */}
      {featuredProject && (
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
          <BentoCard accent="pink" className="flex h-full flex-col justify-center">
            <p className="mb-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">Em destaque</p>
            <p className="text-sm font-bold">{featuredProject.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{featuredProject.category}</p>
          </BentoCard>
        </motion.div>
      )}

      {/* Recentes — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={7} initial="hidden" animate="visible" variants={fadeUp}
      >
        <BentoCard className="h-full">
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Portfólio recente</p>
          <div className="grid grid-cols-3 gap-2">
            {recentProjects.map(p => (
              <div
                key={p.id}
                title={p.title}
                className="h-16 rounded-lg border border-border"
                style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.15))' }}
              />
            ))}
          </div>
          <Link
            href="/portfolio"
            className="mt-3 inline-block text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            → ver todos os projetos
          </Link>
        </BentoCard>
      </motion.div>

      {/* Links sociais — 2 colunas */}
      <motion.div
        className="col-span-2"
        custom={8} initial="hidden" animate="visible" variants={fadeUp}
      >
        <BentoCard className="h-full">
          <p className="mb-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">Links</p>
          <div className="flex flex-col gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">↗</span>
              </a>
            ))}
          </div>
        </BentoCard>
      </motion.div>

      {/* Widget de esportes — réplica do widget da nova aba do Firefox */}
      <motion.div
        className="col-span-2 flex justify-center"
        custom={9} initial="hidden" animate="visible" variants={fadeUp}
      >
        <SportsWidget />
      </motion.div>

    </div>
  )
}
