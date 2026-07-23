"use client"

import { useEffect, useRef } from "react"
import { sectionsFor } from "@/design-system/architecture"
import type { RealmId } from "@/lib/realms"

/**
 * Faz o guia do Design System mostrar **uma seção por vez**, dirigido pelo índice.
 *
 * O guia continua sendo um documento único (server component) que renderiza
 * todas as seções em sequência — este wrapper client não o reescreve. Ele lê as
 * âncoras das seções canônicas do índice (`architecture.ts`), agrupa os filhos
 * do container em blocos [início da seção → início da próxima] e esconde todos
 * menos o bloco da seção ativa. A seção ativa vem do `#hash` da URL, então cada
 * link do índice (que já é `href="#id"`) troca o conteúdo e dá link direto.
 *
 * O "container" não é sempre este wrapper: um guia pode embrulhar suas seções
 * num `<div>` só (o _Dev faz isso). `resolveContainer` desce por esses invólucros
 * de filho único até o nível onde as seções são irmãs de verdade — é lá que a
 * partição em blocos faz sentido.
 *
 * Âncoras sem número (kit, catálogo, tokens-realm…) e sub-seções caem dentro do
 * bloco da seção-mãe: selecionar a mãe mostra tudo o que pende dela, e navegar
 * para a âncora exata rola até ela. Assim todo conteúdo é alcançável por um link
 * do índice. O que vier antes da primeira seção (título do realm + lead) fica
 * sempre visível: é a moldura da página, não conteúdo de seção.
 */
export function DsGuideSections({
  realm,
  children,
}: {
  realm: RealmId
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const topIds = sectionsFor(realm)
      .filter((s) => s.disponivel)
      .map((s) => s.id)

    /** O filho direto de `box` que contém (ou é) `el`. */
    function directChildOf(box: HTMLElement, el: HTMLElement): HTMLElement | null {
      let n: HTMLElement | null = el
      while (n && n.parentElement !== box) n = n.parentElement
      return n && n.parentElement === box ? n : null
    }

    /**
     * Desce por invólucros de filho único até o nível em que as âncoras de seção
     * são filhos distintos — o container onde a partição faz sentido.
     */
    function resolveContainer(): HTMLElement {
      let box: HTMLElement = root!
      for (let depth = 0; depth < 6; depth++) {
        const hit = new Set<HTMLElement>()
        for (const id of topIds) {
          const el = document.getElementById(id)
          if (!el) continue
          const child = directChildOf(box, el)
          if (child) hit.add(child)
        }
        // Mais de uma âncora em filhos distintos: é aqui que se particiona.
        if (hit.size > 1) break
        // Todas (ou nenhuma) sob um único filho: desce para dentro dele.
        const only = hit.size === 1 ? [...hit][0]! : (box.children[0] as HTMLElement | undefined)
        if (only && only.children.length) {
          box = only
          continue
        }
        break
      }
      return box
    }

    function apply(hashId: string | null) {
      const container = resolveContainer()
      const kids = Array.from(container.children) as HTMLElement[]

      const starts: { id: string; start: number }[] = []
      for (const id of topIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const child = directChildOf(container, el)
        const idx = child ? kids.indexOf(child) : -1
        if (idx >= 0) starts.push({ id, start: idx })
      }
      starts.sort((a, b) => a.start - b.start)

      if (!starts.length) {
        kids.forEach((k) => (k.hidden = false)) // fallback seguro
        return
      }

      const groups = starts.map((s, i) => ({
        id: s.id,
        start: s.start,
        end: i + 1 < starts.length ? starts[i + 1]!.start : kids.length,
      }))

      // Resolve a seção alvo: a própria (hash = seção canônica), a que contém a
      // âncora (sub-seção / âncora sem número), ou a primeira.
      let target = hashId ? groups.find((g) => g.id === hashId) : undefined
      let anchorEl: HTMLElement | null = null
      if (!target && hashId) {
        anchorEl = document.getElementById(hashId)
        if (anchorEl) {
          const child = directChildOf(container, anchorEl)
          const ci = child ? kids.indexOf(child) : -1
          if (ci >= 0) target = groups.find((g) => ci >= g.start && ci < g.end)
        }
      }
      if (!target) target = groups[0]!

      const prefixEnd = groups[0]!.start
      kids.forEach((k, i) => {
        const visible = i < prefixEnd || (i >= target!.start && i < target!.end)
        k.hidden = !visible
      })

      if (anchorEl && anchorEl.id !== target.id) {
        anchorEl.scrollIntoView({ block: "start" })
      } else {
        window.scrollTo({ top: 0 })
      }
    }

    const currentHash = () => (window.location.hash ? window.location.hash.slice(1) : null)

    apply(currentHash())
    const onHash = () => apply(currentHash())
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [realm])

  return <div ref={ref}>{children}</div>
}
