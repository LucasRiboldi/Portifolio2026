/**
 * THE REALMS — registro central dos universos (entidade de primeira classe).
 *
 * Cada realm é um sub-site independente, com rota, layout e tema próprios.
 * O registro abaixo dirige: a troca de universo (navegação), o rótulo/glifo do
 * botão e o **Universe Transition Engine** (cores/tipografia da travessia).
 *
 * Adicionar um universo novo = acrescentar uma entrada aqui + criar seu layout
 * em `app/<rota>/layout.tsx`. Nada mais no engine precisa mudar.
 */

export type RealmId = "creative" | "developer" | "arcane"

/** Tema usado pelo motor de transição (a "cara" da dimensão de destino). */
export interface RealmTheme {
  /** fundo dominante da dimensão */
  bg: string
  /** cor do texto/nome na travessia */
  ink: string
  /** acento primário (halftone, brilho) */
  accent: string
  /** acento secundário (derretimento) */
  accent2: string
  /** cor das linhas do grid */
  line: string
  /** família tipográfica do nome na travessia (CSS font-family) */
  font: string
}

export interface Realm {
  id: RealmId
  /** rótulo curto exibido no botão de troca */
  label: string
  /** glifo/ícone textual do realm */
  glyph: string
  /** rota (sub-site) do realm — a troca de universo navega para cá */
  route: string
  /** próximo realm no ciclo do botão */
  next: RealmId
  /** descrição para aria-label / título acessível */
  aria: string
  /** tema da travessia dimensional */
  theme: RealmTheme
}

export const REALMS: Record<RealmId, Realm> = {
  creative: {
    id: "creative",
    label: "Creative",
    glyph: "◍",
    route: "/",
    next: "developer",
    aria: "Realm criativo (multiverso comic)",
    theme: {
      bg: "#0b0b12",
      ink: "#fff23a",
      accent: "#ff2d95",
      accent2: "#00e5ff",
      line: "rgba(255,255,255,0.14)",
      font: "var(--font-display), system-ui, sans-serif",
    },
  },
  developer: {
    id: "developer",
    label: "Developer",
    glyph: "❯_",
    route: "/dev",
    next: "arcane",
    aria: "Realm de engenharia (Dracula)",
    theme: {
      bg: "#282a36",
      ink: "#50fa7b",
      accent: "#bd93f9",
      accent2: "#8be9fd",
      line: "rgba(139,147,164,0.25)",
      font: "var(--font-mono), ui-monospace, monospace",
    },
  },
  arcane: {
    id: "arcane",
    label: "Daily Prophet",
    glyph: "⚜",
    route: "/prophet",
    next: "creative",
    aria: "Realm Daily Prophet (jornal de game design)",
    theme: {
      bg: "#231f18",
      ink: "#f4ecd8",
      accent: "#9a7b28",
      accent2: "#7c2d12",
      line: "rgba(244,236,216,0.16)",
      font: "var(--font-arcane), Georgia, serif",
    },
  },
}

export const REALM_ORDER: RealmId[] = ["creative", "developer", "arcane"]

export const DEFAULT_REALM: RealmId = "creative"

export function isRealmId(v: unknown): v is RealmId {
  return v === "creative" || v === "developer" || v === "arcane"
}

/** Deriva o realm a partir do pathname (rotas próprias por realm). */
export function realmFromPath(pathname: string): RealmId {
  if (pathname.startsWith("/dev")) return "developer"
  if (pathname.startsWith("/prophet")) return "arcane"
  return "creative"
}
