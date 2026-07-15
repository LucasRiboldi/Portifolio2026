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
  /** realms habilitados (controlado pelo admin) */
  enabled: RealmId[]
}

/** Configuração vinda do banco (admin). Cai no default do código se ausente. */
export interface RealmSettings {
  enabled: RealmId[]
  defaultRealm: RealmId
}

const UniverseContext = React.createContext<UniverseContextValue | null>(null)

const MORPH_SWAP_MS = 380 // troca o tema quando o painel cobre a tela
const MORPH_END_MS = 840 // fim da animação

function applyRealm(id: RealmId) {
  const el = document.documentElement
  el.setAttribute("data-realm", id)
  el.classList.toggle("sober", REALMS[id].sober)
}

export function UniverseProvider({
  children,
  settings,
}: {
  children: React.ReactNode
  settings?: RealmSettings
}) {
  // Realms ativos (na ordem canônica do ciclo), com fallback ao código.
  const enabled = React.useMemo<RealmId[]>(() => {
    const list = (settings?.enabled ?? REALM_ORDER).filter((id) =>
      REALM_ORDER.includes(id),
    )
    return list.length ? list : [...REALM_ORDER]
  }, [settings?.enabled])

  const defaultRealm = React.useMemo<RealmId>(() => {
    const d = settings?.defaultRealm ?? DEFAULT_REALM
    return enabled.includes(d) ? d : (enabled[0] ?? DEFAULT_REALM)
  }, [settings?.defaultRealm, enabled])

  const [realm, setRealmState] = React.useState<RealmId>(defaultRealm)
  const [morphing, setMorphing] = React.useState<RealmId | null>(null)
  const timers = React.useRef<number[]>([])

  // Sincroniza o estado React com o que o script anti-FOUC já pintou no <html>.
  // Suporta deep-link `?realm=arcane` — aplica instantaneamente (sem morph)
  // para que cada universo seja compartilhável por URL.
  React.useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("realm")
    // deep-link só vale se o realm estiver habilitado pelo admin
    if (isRealmId(fromUrl) && enabled.includes(fromUrl)) {
      applyRealm(fromUrl)
      setRealmState(fromUrl)
      try {
        localStorage.setItem("realm", fromUrl)
        localStorage.setItem("vibe", fromUrl === "developer" ? "sober" : "aranha")
      } catch {}
    } else {
      const current = document.documentElement.getAttribute("data-realm")
      const resolved =
        isRealmId(current) && enabled.includes(current) ? current : defaultRealm
      // corrige o <html> caso o script anti-FOUC tenha pintado um realm desativado
      if (resolved !== current) applyRealm(resolved)
      setRealmState(resolved)
    }
    return () => timers.current.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setRealm = React.useCallback(
    (next: RealmId) => {
      if (morphing || next === realm || !enabled.includes(next)) return
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
    [morphing, realm, enabled]
  )

  const cycle = React.useCallback(() => {
    // próximo realm HABILITADO no ciclo (respeita on/off do admin)
    const i = enabled.indexOf(realm)
    const next = enabled[(i + 1) % enabled.length]
    if (next) setRealm(next)
  }, [realm, enabled, setRealm])

  const value = React.useMemo(
    () => ({ realm, morphing, setRealm, cycle, enabled }),
    [realm, morphing, setRealm, cycle, enabled]
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
