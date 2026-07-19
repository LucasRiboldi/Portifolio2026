/**
 * Navegação do site global (realm Creative) — fonte única de verdade.
 * Consumido por Navbar (desktop) e MobileMenu, para não divergirem.
 */
export interface NavLink {
  label: string
  href: string
}

/**
 * "Style Guide" saiu do menu: virou conteúdo do Design System, um por perfil
 * (/design-system → escolhe o perfil). Dois itens apontando para dentro do
 * mesmo lugar só dividiam a atenção.
 */
export const SITE_LINKS: NavLink[] = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Cards", href: "/cards" },
  { label: "Dimensões", href: "/dimensoes" },
  { label: "Design System", href: "/design-system" },
]

/** Regra de "ativo" partilhada por todos os menus: exata na home, prefixo no resto. */
export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
