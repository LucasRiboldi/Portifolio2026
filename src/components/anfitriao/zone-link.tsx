"use client"

/**
 * O SALTO ATÉ UMA ZONA — um comportamento, dois lugares.
 *
 * A folha tem duas rotas para as mesmas doze âncoras: o sumário do menu
 * sanduíche e o índice impresso no rodapé. Elas discordavam. O menu movia o
 * foco de teclado até a seção; o índice só rolava — e quem navegava por Tab a
 * partir do índice continuava preso no rodapé depois de "ir" para a Coleção.
 *
 * Dois caminhos para o mesmo destino com comportamentos diferentes não é
 * escolha de projeto, é divergência. O comportamento mora aqui e os dois
 * consomem.
 *
 * A rolagem suave continua sendo do navegador (`scroll-behavior: smooth` em
 * `dp-original-extras.css`, com `prefers-reduced-motion` cortando). O que
 * este arquivo acrescenta é o FOCO: rolar move os olhos, não o cursor de
 * teclado. `preventScroll` evita que o salto seco do foco dispute o frame com
 * a rolagem suave.
 */

import type { ReactNode } from "react"

/**
 * Leva o cursor de teclado até a zona. As seções são `tabindex="-1"` (ver
 * `page.tsx`), o que as torna focáveis por programa sem entrarem na ordem de
 * Tab. Silencioso quando o `id` não existe: o link continua sendo um `href`
 * real e o navegador resolve a rolagem de qualquer forma.
 */
export function focusZone(id: string) {
  const alvo = document.getElementById(id)
  if (!alvo) return
  // No frame seguinte, para não competir com a saída de um painel que feche.
  requestAnimationFrame(() => alvo.focus({ preventScroll: true }))
}

/**
 * Um link de índice. Só assume o comportamento quando o destino é uma âncora
 * desta página — o índice do rodapé também lista uma rota de verdade
 * (`/anfitriao/laboratorio`), e ali quem navega é o roteador.
 */
export function ZoneLink({
  href,
  children,
  className,
  title,
  onNavigate,
}: {
  href: string
  children: ReactNode
  className?: string
  title?: string
  /** Passo extra do consumidor — o menu usa para fechar o painel. */
  onNavigate?: () => void
}) {
  const ancora = href.startsWith("#")

  return (
    <a
      href={href}
      className={className}
      title={title}
      onClick={() => {
        onNavigate?.()
        if (ancora) focusZone(href.slice(1))
      }}
    >
      {children}
    </a>
  )
}
