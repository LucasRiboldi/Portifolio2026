"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { SITE_LINKS, isActive } from "@/lib/nav"
import { VibeToggle } from "@/components/providers/vibe-toggle"
import { EASE } from "@/components/comic/motion"

/**
 * NAV-RIFT — o menu superior "entre-dimensões".
 *
 * Substituiu a barra comic creme, que sumia sobre as dimensões escuras (a
 * visibilidade não funcionava fora do realm Creative). Agora é uma barra
 * escura única, a mesma em todos os realms, com a estética de ANOMALIA do
 * multiverso: links com datamosh no hover, marcador de fenda no ativo, logo
 * com falha e — no compacto — um menu que RASGA a tela como uma fenda
 * dimensional (borda serrilhada, scanlines, camadas RGB).
 *
 * O glitch é só no hover/foco, com um flicker sutil e ocasional na barra;
 * `prefers-reduced-motion` desliga todo o movimento e mantém tudo legível.
 * As classes vivem em `nav-rift.css` (namespace `nrift-`).
 */
export function ComicNav() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)

  // Fecha ao trocar de rota (o clique num link não desmonta o header).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Esc fecha a fenda. Sem trava de scroll nem focus trap: o painel desce
  // abaixo da barra, a página atrás continua visível.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className={cn("nrift-bar", !reduced && "nrift-flicker")}>
      {/* Fio de anomalia — a costura da fenda no topo. */}
      <div aria-hidden className="nrift-seam" />

      <div className="mx-auto flex h-[60px] max-w-container items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/criativo"
          data-text="LR."
          className="nrift-logo k-title shrink-0 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-cyan)]"
        >
          LR<span className="text-[var(--k-red)]">.</span>
        </Link>

        {/* --- links inline (desktop) --------------------------------- */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-6 md:flex lg:gap-8">
          {SITE_LINKS.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                data-text={link.label}
                data-active={active || undefined}
                aria-current={active ? "page" : undefined}
                title={link.description}
                className="nrift-link k-sub text-sm uppercase tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-cyan)]"
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <VibeToggle />

          {/* --- gatilho da fenda (só mobile) ------------------------- */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-rift-panel"
            aria-label={open ? "Fechar a fenda" : "Fenda de navegação"}
            className="nrift-trigger k-sub px-3 py-1.5 text-[11px] uppercase tracking-wide md:hidden"
          >
            <span>{open ? "Fechar" : "Fenda"}</span>
            <span aria-hidden className="text-[13px] leading-none">
              {open ? "✕" : "◢"}
            </span>
          </button>
        </div>
      </div>

      {/* --- a FENDA: painel que rasga a tela abaixo da barra --------- */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="nav-rift-panel"
            aria-label="Navegação principal"
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            exit={reduced ? undefined : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="nrift-panel md:hidden"
          >
            <ul className="relative z-[1] px-4 py-5 sm:px-6">
              {SITE_LINKS.map((link, i) => {
                const active = isActive(pathname, link.href)
                return (
                  <li key={link.href} className="border-b border-white/8 last:border-0">
                    <Link
                      href={link.href}
                      data-text={link.label}
                      data-active={active || undefined}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="nrift-panel-link k-title py-4 text-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-cyan)]"
                    >
                      <span className="mr-3 align-middle text-[11px] not-italic text-white/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
