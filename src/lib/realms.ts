/**
 * THE THREE REALMS — configuração central dos universos.
 *
 * O engine (UniverseProvider) apenas troca `data-realm` no <html> e, para
 * compatibilidade total com o CSS já existente, ativa a classe legada
 * `.sober` no realm "developer" (o antigo modo dev/terminal). Nenhuma
 * identidade duplica código: cada realm só declara seus assets/config.
 *
 * Mapeamento sobre o projeto atual:
 *   creative  → Design System (estado padrão de hoje)
 *   developer → modo dev/terminal (classe .sober existente)
 *   arcane    → realm novo (jornal 1920 / pergaminho) — styles/realms.css
 */

export type RealmId = "creative" | "developer" | "arcane"

export interface Realm {
  id: RealmId
  /** rótulo curto exibido no botão Transform */
  label: string
  /** glifo/ícone textual do realm */
  glyph: string
  /** rota (sub-site) do realm — a troca de universo navega para cá */
  route: string
  /** próximo realm no ciclo do botão Transform */
  next: RealmId
  /** ativa a skin terminal legada (.sober). Só o developer usa. */
  sober: boolean
  /** legenda cinematográfica exibida durante a metamorfose */
  morphLabel: string
  /** descrição para aria-label / título acessível */
  aria: string
}

export const REALMS: Record<RealmId, Realm> = {
  creative: {
    id: "creative",
    label: "Creative",
    glyph: "◍",
    route: "/",
    next: "developer",
    sober: false,
    morphLabel: "◍ recalibrando o multiverso…",
    aria: "Realm criativo (Design System)",
  },
  developer: {
    id: "developer",
    label: "Developer",
    glyph: "❯_",
    route: "/dev",
    next: "arcane",
    sober: true,
    morphLabel: "❯ booting dev environment…",
    aria: "Realm de engenharia (terminal/dev)",
  },
  arcane: {
    id: "arcane",
    label: "Daily Prophet",
    glyph: "⚜",
    route: "/prophet",
    next: "creative",
    sober: false,
    morphLabel: "⚜ selando o pergaminho…",
    aria: "Realm Daily Prophet (jornal de game design)",
  },
}

export const REALM_ORDER: RealmId[] = ["creative", "developer", "arcane"]

export const DEFAULT_REALM: RealmId = "creative"

export function isRealmId(v: unknown): v is RealmId {
  return v === "creative" || v === "developer" || v === "arcane"
}
