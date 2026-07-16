"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/** Menu exclusivo do realm Daily Prophet (jornal). */
export const PROPHET_LINKS = [
  { label: "Primeira Página", href: "/anfitriao" },
  { label: "Laboratório", href: "/anfitriao/laboratorio" },
]

export function ProphetNav() {
  const pathname = usePathname()
  return (
    <nav className="pr-nav" aria-label="Navegação Daily Prophet">
      {PROPHET_LINKS.map((link) => {
        const active =
          link.href === "/anfitriao" ? pathname === "/anfitriao" : pathname.startsWith(link.href)
        return (
          <Link key={link.href} href={link.href} className="pr-navlink" data-active={active} aria-current={active ? "page" : undefined}>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
