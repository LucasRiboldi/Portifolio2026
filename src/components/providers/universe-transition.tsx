"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { REALMS, type RealmId } from "@/lib/realms"

/**
 * Universe Transition Engine — orquestra a travessia dimensional ao trocar de
 * realm. `go(realmId)` dispara a animação e navega para a rota do realm no
 * meio dela (quando a tela está coberta), dando a sensação de atravessar
 * dimensões.
 */
interface TransitionCtx {
  go: (id: RealmId) => void
  transitioning: boolean
}

const Ctx = React.createContext<TransitionCtx | null>(null)

// marcos da linha do tempo (ms)
const NAVIGATE_AT = 700
const EXIT_AT = 1200
const DONE_AT = 1650

export function UniverseTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [target, setTarget] = React.useState<RealmId | null>(null)
  const [exit, setExit] = React.useState(false)
  const timers = React.useRef<number[]>([])

  const go = React.useCallback(
    (id: RealmId) => {
      if (target) return // já em travessia
      setTarget(id)
      setExit(false)
      timers.current.push(window.setTimeout(() => router.push(REALMS[id].route), NAVIGATE_AT))
      timers.current.push(window.setTimeout(() => setExit(true), EXIT_AT))
      timers.current.push(
        window.setTimeout(() => {
          setTarget(null)
          setExit(false)
        }, DONE_AT),
      )
    },
    [target, router],
  )

  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const value = React.useMemo(() => ({ go, transitioning: target !== null }), [go, target])

  const theme = target ? REALMS[target].theme : null

  return (
    <Ctx.Provider value={value}>
      {children}
      {target && theme && (
        <div
          className="ut"
          data-exit={exit}
          aria-hidden
          style={
            {
              "--ut-bg": theme.bg,
              "--ut-ink": theme.ink,
              "--ut-accent": theme.accent,
              "--ut-accent2": theme.accent2,
              "--ut-line": theme.line,
              "--ut-font": theme.font,
            } as React.CSSProperties
          }
        >
          <div className="ut-cover" />
          <div className="ut-panel l" />
          <div className="ut-panel r" />
          <div className="ut-halftone" />
          <div className="ut-melt" />
          <div className="ut-grid" />
          <div className="ut-name">
            <span className="glyph">{REALMS[target].glyph}</span>
            {REALMS[target].label}
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

export function useUniverseTransition() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error("useUniverseTransition must be used within provider")
  return ctx
}
