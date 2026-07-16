"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { REALMS, REALM_ORDER, DEFAULT_REALM, type RealmId } from "@/lib/realms"

/**
 * UniverseProvider — engine de THE THREE REALMS (baseado em ROTA).
 *
 * Cada realm é um sub-site próprio: creative "/criativo", developer "/desenvolvedor",
 * arcane "/anfitriao". Trocar de universo = navegar para a rota do realm.
 * O provider só expõe os realms habilitados (config do admin) e pinta
 * `data-realm` no <html> conforme a rota (para o CSS que ainda depende disso).
 */

interface UniverseContextValue {
  realm: RealmId
  enabled: RealmId[]
  setRealm: (id: RealmId) => void
  cycle: () => void
}

export interface RealmSettings {
  enabled: RealmId[]
  defaultRealm: RealmId
}

const UniverseContext = React.createContext<UniverseContextValue | null>(null)

function realmFromPath(pathname: string): RealmId {
  if (pathname.startsWith("/desenvolvedor")) return "developer"
  if (pathname.startsWith("/anfitriao")) return "arcane"
  return "creative"
}

export function UniverseProvider({
  children,
  settings,
}: {
  children: React.ReactNode
  settings?: RealmSettings
}) {
  const pathname = usePathname()
  const router = useRouter()

  const enabled = React.useMemo<RealmId[]>(() => {
    const list = (settings?.enabled ?? REALM_ORDER).filter((id) => REALM_ORDER.includes(id))
    return list.length ? list : [...REALM_ORDER]
  }, [settings?.enabled])

  const realm = realmFromPath(pathname)

  // Mantém data-realm no <html> em sincronia com a rota.
  React.useEffect(() => {
    document.documentElement.setAttribute("data-realm", realm)
  }, [realm])

  const setRealm = React.useCallback(
    (id: RealmId) => {
      if (enabled.includes(id)) router.push(REALMS[id].route)
    },
    [enabled, router],
  )

  const cycle = React.useCallback(() => {
    const i = enabled.indexOf(realm)
    const next = enabled[(i + 1) % enabled.length]
    if (next) router.push(REALMS[next].route)
  }, [enabled, realm, router])

  const value = React.useMemo(
    () => ({ realm, enabled, setRealm, cycle }),
    [realm, enabled, setRealm, cycle],
  )

  return <UniverseContext.Provider value={value}>{children}</UniverseContext.Provider>
}

export function useUniverse() {
  const ctx = React.useContext(UniverseContext)
  if (!ctx) throw new Error("useUniverse must be used within <UniverseProvider>")
  return ctx
}

export { REALM_ORDER, DEFAULT_REALM }
