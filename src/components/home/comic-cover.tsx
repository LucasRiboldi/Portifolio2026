"use client"

import Link from "next/link"
import { useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react"
import { STORYBOOK_URL } from "@/constants/site"
import { useSiteConfig } from "@/components/providers/site-config-provider"
import { projects as seedProjects, type Project } from "@/data/projects"
import { tools as seedTools, type Tool } from "@/data/tools"

/**
 * Chamadas de capa — espelham a navegação real do realm Creative.
 * Mantidas aqui (e não em nav.ts) porque a capa acrescenta copy editorial
 * que só existe neste contexto de revista.
 */
const COVER_LINES = [
  { title: "Portfólio", href: "/portfolio", copy: "Projetos criativos que inspiram e conectam." },
  { title: "Dimensões", href: "/dimensoes", copy: "20 realidades visuais do mesmo multiverso." },
  { title: "Style Guide", href: "/design-system/realms/creative", copy: "Tipografia, cor e ritmo — as regras da edição." },
] as const

interface ComicCoverProps {
  projects?: Project[]
  tools?: Tool[]
}

export function ComicCover({ projects = seedProjects, tools = seedTools }: ComicCoverProps) {
  const siteConfig = useSiteConfig()
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const [firstName, ...rest] = siteConfig.name.split(" ")
  const lastName = rest.join(" ")

  // Parallax 3D: o ponteiro inclina a capa como um objeto físico na mesa.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 140, damping: 18, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [7, -7]), spring)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-5, 5]), spring)

  function handlePointer(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function resetPointer() {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointer}
      onPointerLeave={resetPointer}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1400 }}
      className="cc-cover mx-auto flex max-w-3xl flex-col"
    >
      {/* fundo: linhas de velocidade + aura psicodélica */}
      <span aria-hidden className="cc-speed" />
      <span aria-hidden className="cc-aura" />

      {/* ---------- BANDA SUPERIOR ---------- */}
      <div className="cc-band px-4 py-2 text-right">
        <span className="sv-display text-xs uppercase tracking-[0.12em] sm:text-sm">
          Novos experimentos toda semana
        </span>
      </div>

      {/* ---------- FAIXA DE CHAMADA ---------- */}
      <div className="cc-strip px-4 py-2 pl-4 sm:pl-32">
        <p className="sv-display truncate text-base uppercase text-black sm:text-2xl">
          {siteConfig.description}
        </p>
      </div>

      {/* ---------- CORPO DA CAPA ---------- */}
      <div className="relative flex-1 px-4 pb-4 pt-3 sm:px-6">
        {/* Selo #1 + caixa de edição.
            Mobile: em fluxo, lado a lado. Desktop: ancorados à esquerda como
            na referência, com o masthead correndo ao lado. */}
        <div className="relative z-[5] mb-4 flex items-center gap-3 sm:absolute sm:left-5 sm:top-0 sm:mb-0 sm:block sm:w-36">
          <div className="cc-burst h-20 w-20 shrink-0 sm:h-32 sm:w-32">
            <span
              className="sv-display text-3xl text-[var(--sv-magenta)] sm:text-5xl"
              style={{ WebkitTextStroke: "2px #000" }}
            >
              #1
            </span>
          </div>

          <div className="cc-issue px-3 py-2 sm:mt-2">
            <p className="sv-display text-sm uppercase leading-tight sm:text-base">
              Edição #1
            </p>
            <p className="sv-heavy mt-1 text-[10px] uppercase leading-tight tracking-wide text-white/75 sm:text-xs">
              {projects.length} projetos · {tools.length} ferramentas
            </p>
          </div>
        </div>

        {/* ---------- MASTHEAD ---------- */}
        <header className="relative z-[4] pt-2 sm:pl-40">
          <h1 className="cc-masthead sv-display text-[clamp(2.6rem,11vw,6.5rem)]">
            <span className="relative block">
              <span aria-hidden className="cc-masthead-ghost">{firstName}</span>
              <span aria-hidden className="cc-masthead-ghost cc-masthead-ghost-2">{firstName}</span>
              <span className="cc-masthead-fill block" data-text={firstName}>
                {firstName}
              </span>
            </span>
            {lastName && (
              <span className="relative block">
                <span aria-hidden className="cc-masthead-ghost">{lastName}</span>
                <span aria-hidden className="cc-masthead-ghost cc-masthead-ghost-2">{lastName}</span>
                <span className="cc-masthead-fill block" data-text={lastName}>
                  {lastName}
                </span>
              </span>
            )}
          </h1>

          <p className="sv-heavy mt-3 text-xs uppercase italic tracking-wide text-[var(--sv-paper)]/85 sm:text-base">
            {siteConfig.title}
          </p>
        </header>

        {/* ---------- BURST DO STORYBOOK ---------- */}
        <a
          href={STORYBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group/sb relative z-[5] ml-auto mt-4 block w-fit transition-transform hover:scale-105 sm:absolute sm:right-6 sm:top-28 sm:mt-0"
        >
          <span className="cc-burst cc-burst-yellow h-24 w-24 sm:h-36 sm:w-36">
            <span className="sv-display text-lg uppercase leading-none text-black sm:text-2xl">
              Grátis!
            </span>
            <span className="sv-heavy text-[9px] uppercase leading-tight text-black sm:text-[11px]">
              Storybook
            </span>
          </span>
        </a>

        {/* ---------- CHAMADAS DE CAPA ---------- */}
        <div className="relative z-[4] mt-8 flex items-end justify-between gap-4 sm:mt-16">
          <ul className="max-w-[62%] space-y-4 sm:space-y-5">
            {COVER_LINES.map(line => (
              <li key={line.href}>
                <Link href={line.href} className="group/line block">
                  <p className="cc-line-title sv-display text-lg uppercase leading-none transition-colors group-hover/line:text-[var(--sv-yellow)] sm:text-2xl">
                    {line.title}{" "}
                    <span aria-hidden className="inline-block transition-transform group-hover/line:translate-x-1">
                      →
                    </span>
                  </p>
                  <p className="sv-heavy mt-1 text-[11px] uppercase leading-snug tracking-wide text-[var(--sv-paper)]/75 sm:text-sm">
                    {line.copy}
                  </p>
                </Link>
              </li>
            ))}

            <li>
              <Link href="/design-system" className="group/line block">
                <span className="cc-tag sv-display text-xs uppercase sm:text-sm">Design System</span>
                <span className="cc-tag cc-tag-pop sv-display ml-1 text-xs uppercase sm:text-sm">
                  e Recursos
                </span>
                <p className="sv-heavy mt-1 text-[11px] uppercase leading-snug tracking-wide text-[var(--sv-paper)]/75 sm:text-sm">
                  Tokens, componentes e padrões — a oficina por dentro.
                </p>
              </Link>
            </li>
          </ul>

          {/* código de barras + lombada */}
          <div className="flex items-end gap-2">
            <span className="cc-spine sv-heavy hidden text-[10px] uppercase tracking-wide text-[var(--sv-paper)]/70 sm:block">
              Design é comunicar ideias com criatividade
            </span>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cc-barcode w-16 transition-transform hover:-translate-y-1 sm:w-20"
              aria-label="GitHub"
            >
              <span aria-hidden className="cc-barcode-bars block" />
              <span className="sv-heavy mt-1 block text-center text-[8px] uppercase text-black">
                GitHub ↗
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ---------- BANDA INFERIOR ---------- */}
      <div className="cc-band cc-band-bottom px-4 py-2 text-center">
        <span className="sv-display text-[10px] uppercase tracking-[0.18em] text-[var(--sv-paper)] sm:text-sm">
          Criar <span className="text-[var(--sv-magenta)]">•</span> Inspirar{" "}
          <span className="text-[var(--sv-cyan)]">•</span> Comunicar{" "}
          <span className="text-[var(--sv-lime)]">•</span> Transformar
        </span>
      </div>
    </motion.div>
  )
}
