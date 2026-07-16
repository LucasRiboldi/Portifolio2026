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
  { label: "Ferramentas", href: "/tools" },
  { label: "Skills", href: "/skills" },
  { label: "Blog", href: "/blog" },
  { label: "Dimensões", href: "/dimensoes" },
  { label: "Style Guide", href: "/styleguide" },
  { label: "Design System", href: "/design-system" },
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
]

/** Regra de "ativo" partilhada por todos os menus: exata na home, prefixo no resto. */
export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
