/**
 * Navegação do site global (realm Creative) — fonte única de verdade.
 * Consumido por Navbar (desktop) e MobileMenu, para não divergirem.
 */
export interface NavLink {
  label: string
  href: string
}

export const SITE_LINKS: NavLink[] = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Dimensões", href: "/dimensoes" },
  { label: "Style Guide", href: "/design-system/realms/creative" },
  { label: "Design System", href: "/design-system" },
]

/** Regra de "ativo" partilhada por todos os menus: exata na home, prefixo no resto. */
export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
