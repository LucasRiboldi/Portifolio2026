"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { SITE_LINKS, isActive } from "@/lib/nav"
import { VibeToggle } from "@/components/providers/vibe-toggle"
import { EASE } from "@/components/comic/motion"
import { Halftone, SpeedLines } from "@/components/comic/atoms"

/** Acentos em ciclo, um por item do menu. */
const ITEM_ACCENTS = ["var(--k-yellow)", "var(--k-cyan)", "var(--k-magenta)", "var(--k-blue)"]

/**
 * Navegação principal: header mínimo + overlay em tela cheia.
 *
 * Substituiu a barra com os links inline. Numa página que aposta tudo na
 * manchete, uma fileira de links no topo compete com ela por atenção; o
 * overlay tira a navegação do caminho e, quando chamado, dá a cada destino o
 * espaço de um requadro inteiro.
 *
 * Acessibilidade: o overlay é um diálogo modal — trava o scroll, fecha no
 * Esc, prende o foco enquanto aberto e devolve-o ao botão ao fechar.
 */
export function ComicNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Fecha ao trocar de rota (o clique num link não desmonta o header).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    // Copiado agora: no cleanup, `triggerRef.current` já pode apontar para
    // outro nó (ou nenhum), e o foco voltaria para o sítio errado.
    const trigger = triggerRef.current

    // Foco entra no painel para o leitor de ecrã não continuar na página atrás.
    panel?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      if (e.key !== "Tab" || !panel) return

      // Focus trap: o Tab circula apenas dentro do overlay.
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      trigger?.focus()
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1300] border-b border-white/10 bg-[var(--k-black)]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/criativo"
            className="k-title text-2xl tracking-tight text-white transition-colors hover:text-[var(--k-yellow)]"
          >
            LR<span className="text-[var(--k-red)]">.</span>
          </Link>

          <div className="flex items-center gap-4">
            <VibeToggle />

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="k-sub group flex items-center gap-3 border border-white/15 px-4 py-2 text-xs text-white transition-colors hover:border-[var(--k-yellow)] hover:text-[var(--k-yellow)]"
            >
              <span className="hidden sm:inline">{open ? "Fechar" : "Menu"}</span>
              <span aria-hidden className="relative block h-3 w-5">
                <motion.span
                  className="absolute left-0 h-px w-full bg-current"
                  animate={open ? { top: "50%", rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.32, ease: EASE }}
                />
                <motion.span
                  className="absolute left-0 h-px w-full bg-current"
                  animate={open ? { bottom: "50%", rotate: -45 } : { bottom: 0, rotate: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.32, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Navegação principal"
            className="k-grain fixed inset-0 z-[1290] overflow-y-auto bg-[var(--k-black)] pb-16 pt-24 outline-none"
            initial={reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Halftone color="rgba(255,255,255,0.08)" step={6} />
            <SpeedLines x={80} y={20} color="rgba(0,229,255,0.08)" />

            <nav className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-8">
              <ul>
                {SITE_LINKS.map((link, i) => {
                  const active = isActive(pathname, link.href)
                  const accent = ITEM_ACCENTS[i % ITEM_ACCENTS.length] ?? "var(--k-cyan)"

                  return (
                    <motion.li
                      key={link.href}
                      className="border-b border-white/10"
                      initial={reduced ? false : { opacity: 0, y: 34 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.12 + i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        style={{ "--k-accent": accent } as React.CSSProperties}
                        className="group flex items-center gap-5 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-accent)] sm:gap-8 sm:py-8"
                      >
                        <span className="k-num w-10 shrink-0 text-sm text-white/25 sm:text-base">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={cn(
                              "k-title block text-[clamp(2.2rem,7vw,5.5rem)] transition-colors duration-300",
                              active ? "text-[var(--k-accent)]" : "text-white group-hover:text-[var(--k-accent)]",
                            )}
                          >
                            {link.label}
                          </span>
                          {link.description && (
                            <span className="k-body mt-2 block max-w-md text-xs text-white/40 sm:text-sm">
                              {link.description}
                            </span>
                          )}
                        </span>

                        {/* Requadro-preview: acende na cor do item no hover. */}
                        <span
                          aria-hidden
                          className="relative hidden h-24 w-40 shrink-0 overflow-hidden border-2 border-black bg-white/[0.03] opacity-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-focus-visible:opacity-100 lg:block"
                          style={{ boxShadow: `0 0 32px -6px ${accent}` }}
                        >
                          <Halftone color={accent} step={5} />
                          <span
                            className="k-title absolute inset-0 flex items-center justify-center text-4xl"
                            style={{ color: accent, opacity: 0.35 }}
                          >
                            {link.label.charAt(0)}
                          </span>
                        </span>

                        <span
                          aria-hidden
                          className="k-title shrink-0 text-2xl text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--k-accent)] sm:text-4xl"
                        >
                          →
                        </span>
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>

              <motion.p
                className="k-kicker mt-12 text-[10px] text-white/25"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                Lucas Riboldi · Edição #2026 · Esc para fechar
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
