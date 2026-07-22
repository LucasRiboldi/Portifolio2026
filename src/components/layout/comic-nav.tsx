"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { SITE_LINKS, isActive } from "@/lib/nav"
import { VibeToggle } from "@/components/providers/vibe-toggle"
import { EASE } from "@/components/comic/motion"

/** Acentos em ciclo, um por item — o mesmo mapa nas duas larguras. */
const ITEM_ACCENTS = ["var(--k-yellow)", "var(--k-cyan)", "var(--k-magenta)", "var(--k-lime)"]

/**
 * Navegação principal — barra inline, sempre à vista.
 *
 * Substituiu o overlay em tela cheia: abrir uma tela só para escolher para onde
 * ir esconde o destino atrás de um clique extra e tira o visitante da página.
 * Aqui os quatro destinos ficam visíveis o tempo todo no desktop, e o indicador
 * de ativo desliza entre eles com `layoutId` — um só elemento animado, em vez
 * de quatro bordas acendendo e apagando.
 *
 * No mobile a lista desce como painel logo abaixo da barra (não cobre a
 * página): o visitante continua vendo onde estava.
 */
export function ComicNav() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)

  // Fecha ao trocar de rota (o clique num link não desmonta o header).
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Esc fecha o painel mobile. Sem trava de scroll nem focus trap: o painel
  // não é modal — a página atrás continua visível e utilizável.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-[1300]">
      {/* Fio de cor da capa — o mesmo arco-íris da zona multiverso. */}
      <div
        aria-hidden
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--k-yellow), var(--k-orange), var(--k-red), var(--k-magenta), var(--k-violet), var(--k-cyan), var(--k-lime))",
        }}
      />

      <div className="border-b-[3px] border-[var(--k-ink)] bg-[var(--k-paper)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-container items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/criativo"
            className="k-title shrink-0 text-2xl text-[var(--k-ink)] transition-transform hover:-rotate-2"
          >
            LR<span className="text-[var(--k-red)]">.</span>
          </Link>

          {/* --- barra segmentada (desktop) ----------------------------- */}
          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-full border-[3px] border-[var(--k-ink)] bg-[var(--k-white)] p-1 shadow-[4px_4px_0_0_var(--k-ink)]">
              {SITE_LINKS.map((link, i) => {
                const active = isActive(pathname, link.href)
                const accent = ITEM_ACCENTS[i % ITEM_ACCENTS.length] ?? "var(--k-yellow)"

                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      title={link.description}
                      className={cn(
                        "k-sub relative block rounded-full px-4 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--k-ink)] lg:text-sm",
                        active ? "text-[var(--k-ink)]" : "text-[var(--k-ink)]/55 hover:text-[var(--k-ink)]",
                      )}
                    >
                      {/* A pílula é um elemento só, partilhado entre os itens:
                          o `layoutId` faz o motion interpolar a posição em vez
                          de desvanecer quatro fundos diferentes. */}
                      {active && (
                        <motion.span
                          aria-hidden
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full border-2 border-[var(--k-ink)]"
                          style={{ background: accent }}
                          transition={
                            reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                          }
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <VibeToggle />

            {/* --- gatilho (só mobile) --------------------------------- */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="nav-mobile"
              aria-label={open ? "Fechar navegação" : "Abrir navegação"}
              className="k-btn k-btn--ghost k-sub px-3 py-2 text-[11px] md:hidden"
            >
              <span>{open ? "Fechar" : "Menu"}</span>
              <motion.span
                aria-hidden
                className="relative block h-3 w-4"
                animate={{ rotate: open ? 180 : 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.3, ease: EASE }}
              >
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[10px] leading-none">
                  ▾
                </span>
              </motion.span>
            </button>
          </div>
        </div>

        {/* --- painel mobile: desce abaixo da barra, não cobre a página --- */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              id="nav-mobile"
              aria-label="Navegação principal"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.34, ease: EASE }}
              className="overflow-hidden border-t-2 border-[var(--k-ink)]/15 md:hidden"
            >
              <ul className="px-4 py-3 sm:px-6">
                {SITE_LINKS.map((link, i) => {
                  const active = isActive(pathname, link.href)
                  const accent = ITEM_ACCENTS[i % ITEM_ACCENTS.length] ?? "var(--k-yellow)"

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-3 transition-colors",
                          active ? "text-[var(--k-ink)]" : "text-[var(--k-ink)]/70",
                        )}
                        style={active ? { background: accent } : undefined}
                      >
                        <span className="k-num w-6 shrink-0 text-xs opacity-50">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="k-sub block text-sm">{link.label}</span>
                          {link.description && (
                            <span className="k-body block truncate text-[11px] opacity-60">
                              {link.description}
                            </span>
                          )}
                        </span>
                        <span aria-hidden className="k-title shrink-0 text-lg opacity-40">
                          →
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
