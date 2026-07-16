"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/** Menu exclusivo do realm Daily Prophet (jornal). */
export const PROPHET_LINKS = [
  { label: "Primeira Página", href: "/prophet" },
  { label: "A Redação", href: "/prophet/redacao" },
  { label: "Oficina do Inventor", href: "/prophet/oficina" },
  { label: "Caderno das Mecânicas", href: "/prophet/mecanicas" },
  { label: "Laboratório", href: "/prophet/laboratorio" },
  { label: "Imprensa do Inventor", href: "/prophet/imprensa" },
]

export function ProphetNav() {
  const pathname = usePathname()
  return (
    <nav className="pr-nav" aria-label="Navegação Daily Prophet">
      {PROPHET_LINKS.map((link) => {
        const active =
          link.href === "/prophet" ? pathname === "/prophet" : pathname.startsWith(link.href)
        return (
          <Link key={link.href} href={link.href} className="pr-navlink" data-active={active} aria-current={active ? "page" : undefined}>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
