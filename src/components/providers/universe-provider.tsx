"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  REALMS,
  REALM_ORDER,
  DEFAULT_REALM,
  isRealmId,
  type RealmId,
} from "@/lib/realms"

/**
 * UniverseProvider — o "Experience Engine" central de THE THREE REALMS.
 *
 * Responsabilidades:
 *  - manter o realm atual (creative | developer | arcane)
 *  - aplicar o realm no <html> via `data-realm` (+ classe legada `.sober`
 *    no developer, para reaproveitar todo o CSS terminal já existente)
 *  - orquestrar a metamorfose cinematográfica (overlay + `.morphing`)
 *  - persistir em localStorage("realm")
 *
 * Nenhuma identidade visual vive aqui: cada realm é só configuração
 * (lib/realms.ts) + CSS (styles/*.css). Sem duplicação de código.
 */

interface UniverseContextValue {
  realm: RealmId
  /** realm alvo enquanto a metamorfose acontece (senão null) */
  morphing: RealmId | null
  setRealm: (id: RealmId) => void
  /** avança para o próximo realm no ciclo (botão Transform) */
  cycle: () => void
}

const UniverseContext = React.createContext<UniverseContextValue | null>(null)

const MORPH_SWAP_MS = 380 // troca o tema quando o painel cobre a tela
const MORPH_END_MS = 840 // fim da animação

function applyRealm(id: RealmId) {
  const el = document.documentElement
  el.setAttribute("data-realm", id)
  el.classList.toggle("sober", REALMS[id].sober)
}

export function UniverseProvider({ children }: { children: React.ReactNode }) {
  const [realm, setRealmState] = React.useState<RealmId>(DEFAULT_REALM)
  const [morphing, setMorphing] = React.useState<RealmId | null>(null)
  const timers = React.useRef<number[]>([])

  // Sincroniza o estado React com o que o script anti-FOUC já pintou no <html>.
  // Suporta deep-link `?realm=arcane` — aplica instantaneamente (sem morph)
  // para que cada universo seja compartilhável por URL.
  React.useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("realm")
    if (isRealmId(fromUrl)) {
      applyRealm(fromUrl)
      setRealmState(fromUrl)
      try {
        localStorage.setItem("realm", fromUrl)
        localStorage.setItem("vibe", fromUrl === "developer" ? "sober" : "aranha")
      } catch {}
    } else {
      const current = document.documentElement.getAttribute("data-realm")
      setRealmState(isRealmId(current) ? current : DEFAULT_REALM)
    }
    return () => timers.current.forEach((t) => window.clearTimeout(t))
  }, [])

  const setRealm = React.useCallback(
    (next: RealmId) => {
      if (morphing || next === realm) return
      setMorphing(next)
      document.documentElement.classList.add("morphing")

      timers.current.push(
        window.setTimeout(() => {
          applyRealm(next)
          setRealmState(next)
          try {
            localStorage.setItem("realm", next)
            // mantém a chave legada coerente para scripts antigos
            localStorage.setItem("vibe", next === "developer" ? "sober" : "aranha")
          } catch {}
        }, MORPH_SWAP_MS)
      )

      timers.current.push(
        window.setTimeout(() => {
          setMorphing(null)
          document.documentElement.classList.remove("morphing")
        }, MORPH_END_MS)
      )
    },
    [morphing, realm]
  )

  const cycle = React.useCallback(() => {
    setRealm(REALMS[realm].next)
  }, [realm, setRealm])

  const value = React.useMemo(
    () => ({ realm, morphing, setRealm, cycle }),
    [realm, morphing, setRealm, cycle]
  )

  return (
    <UniverseContext.Provider value={value}>
      {children}
      <TransitionOverlay target={morphing} />
    </UniverseContext.Provider>
  )
}

export function useUniverse() {
  const ctx = React.useContext(UniverseContext)
  if (!ctx) throw new Error("useUniverse must be used within <UniverseProvider>")
  return ctx
}

/** Overlay único da metamorfose — montado uma vez na raiz. */
function TransitionOverlay({ target }: { target: RealmId | null }) {
  if (!target) return null
  return (
    <div className={cn("vibe-morph-overlay", `to-${target}`)} aria-hidden>
      <div className="vibe-morph-panel">
        <span className="vibe-morph-label">{REALMS[target].morphLabel}</span>
      </div>
    </div>
  )
}

// Ordem exportada para conveniência de consumidores (ex.: seletor de realm).
export { REALM_ORDER }
