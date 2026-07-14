"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FolderGit2, Wrench, User, Newspaper, Mail } from "lucide-react"

/**
 * DevDock — menu flutuante exclusivo do modo dev (estilo dock).
 * Renderizado sempre; o CSS (.dev-dock) só o exibe quando .sober está ativo.
 * Itens "elevam" no hover e levam às páginas do portfólio.
 */
const ITEMS = [
  { href: "/", label: "início", Icon: Home },
  { href: "/portfolio", label: "projetos", Icon: FolderGit2 },
  { href: "/tools", label: "ferramentas", Icon: Wrench },
  { href: "/blog", label: "blog", Icon: Newspaper },
  { href: "/about", label: "sobre", Icon: User },
  { href: "/contact", label: "contato", Icon: Mail },
]

export function DevDock() {
  const pathname = usePathname()
  return (
    <nav className="dev-dock" aria-label="Navegação dev">
      {ITEMS.map(({ href, label, Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
        return (
          <Link key={href} href={href} data-active={active} aria-label={label}>
            <Icon className="size-5" strokeWidth={2} />
            <span className="dock-label">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
