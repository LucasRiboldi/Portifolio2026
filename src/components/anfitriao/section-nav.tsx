"use client"

/**
 * Sumário da edição — o menu oculto da folha.
 *
 * A lista vem de `zones` (`anfitriao-prophet.ts`), a mesma que alimenta o
 * índice do rodapé. Cada zona tem, em `page.tsx`, uma SEÇÃO com o `id`
 * correspondente — não mais uma âncora invisível de 1px. Zona sem seção não
 * rola; seção sem zona não aparece no menu.
 *
 * ------------------------------------------------------------------
 * O QUE ESTE COMPONENTE PRECISA GARANTIR (e antes não garantia)
 * ------------------------------------------------------------------
 * Um menu sobreposto é um pequeno diálogo. As obrigações são conhecidas:
 *
 *   • ESC fecha e devolve o foco ao botão — sem isso o teclado fica preso.
 *   • Clique fora fecha — sem isso o painel só some pelo botão.
 *   • Foco entra no painel ao abrir e circula dentro dele enquanto aberto.
 *   • Setas ↑/↓, Home e End percorrem as entradas, como em qualquer menu.
 *   • O corpo trava a rolagem enquanto o véu está no ar (só no celular, onde
 *     o painel cobre a folha; no desktop ele é um bilhete ao lado do botão e
 *     travar a página seria gratuito).
 *   • A abertura é ANIMADA — e o `hidden` booleano de antes tornava isso
 *     impossível, porque `display:none` não interpola. O painel passa a ser
 *     controlado por atributo de estado, com `@media (prefers-reduced-motion)`
 *     cortando o movimento para quem pediu.
 *
 * ------------------------------------------------------------------
 * A ROLAGEM
 * ------------------------------------------------------------------
 * `scroll-behavior: smooth` no `html` já dá a suavidade. O que faltava era o
 * FOCO: rolar move os olhos, não o cursor de teclado — quem navega por Tab
 * continuava no cabeçalho depois de "ir" para a Coleção. Aqui a seção de
 * destino recebe `focus()` (ela é `tabindex="-1"`), o que alinha as duas
 * navegações. `preventScroll` evita o salto seco do foco competindo com a
 * rolagem suave.
 */

import { useCallback, useEffect, useRef, useState } from "react"

import { zones } from "@/lib/anfitriao-prophet"

/** Abaixo desta largura o painel cobre a folha e a rolagem do corpo trava. */
const VEIL_BREAKPOINT = "(max-width: 47.99em)"

export function SectionNav() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  const close = useCallback((returnFocus = true) => {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }, [])

  /* ── Foco entra no painel ao abrir ── */
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus()
  }, [open])

  /* ── ESC, clique fora e trava de rolagem, enquanto aberto ── */
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false)
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)

    // A trava só vale onde o painel realmente cobre a folha.
    const veil = window.matchMedia(VEIL_BREAKPOINT)
    const previousOverflow = document.body.style.overflow
    if (veil.matches) document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close])

  /** Setas, Home e End percorrem as entradas; Tab circula dentro do painel. */
  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []
    )
    if (items.length === 0) return

    const current = items.indexOf(document.activeElement as HTMLAnchorElement)

    const focusAt = (i: number) => {
      e.preventDefault()
      items[(i + items.length) % items.length]?.focus()
    }

    switch (e.key) {
      case "ArrowDown":
        return focusAt(current + 1)
      case "ArrowUp":
        return focusAt(current - 1)
      case "Home":
        return focusAt(0)
      case "End":
        return focusAt(items.length - 1)
      case "Tab": {
        // Laço de foco: o painel é a única coisa navegável enquanto aberto.
        if (e.shiftKey && current === 0) return focusAt(items.length - 1)
        if (!e.shiftKey && current === items.length - 1) return focusAt(0)
        return
      }
      default:
        return
    }
  }

  /**
   * A rolagem suave é do navegador (`scroll-behavior`); aqui só se acerta o
   * foco de teclado com o destino. O `href` continua real — sem JS o link
   * ainda funciona, e o endereço da zona fica compartilhável.
   */
  const goToZone = (id: string) => {
    close(false)
    const target = document.getElementById(id)
    if (!target) return
    // Depois do fechamento, para não disputar o frame com a saída do painel.
    requestAnimationFrame(() => target.focus({ preventScroll: true }))
  }

  return (
    <div className="dpx-navmenu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="dpx-navmenu-btn"
        aria-expanded={open}
        aria-controls="dpx-navmenu-panel"
        aria-haspopup="true"
        aria-label={open ? "Fechar sumário da edição" : "Abrir sumário da edição"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden />
        <span aria-hidden />
        <span aria-hidden />
      </button>

      {/* Véu — só aparece na faixa em que o painel cobre a folha. Fecha ao
          toque, como qualquer sobreposição. Decorativo: o ESC e o clique-fora
          já cobrem a interação por teclado. */}
      <div className="dpx-navmenu-veil" data-open={open} aria-hidden onClick={() => close(false)} />

      <nav
        id="dpx-navmenu-panel"
        ref={panelRef}
        className="dpx-navmenu-panel"
        aria-label="Sumário da edição"
        data-open={open}
        // `inert` tira do foco e do leitor de tela sem `display:none` —
        // é o que permite animar a saída do painel.
        inert={!open}
        onKeyDown={onPanelKeyDown}
      >
        <p className="dpx-navmenu-title">Sumário desta edição</p>
        <ul>
          {zones.map((z) => (
            <li key={z.id}>
              <a
                href={`#${z.id}`}
                onClick={() => goToZone(z.id)}
                className="dpx-navmenu-link"
              >
                <span>{z.label}</span>
                <span className="dpx-navmenu-page" aria-hidden>
                  {z.page}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
