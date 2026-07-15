"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/** Menu exclusivo do realm DEV (Dracula). */
export const DEV_LINKS = [
  { label: "Projetos", href: "/dev" },
  { label: "Laboratório", href: "/dev/laboratorio" },
  { label: "Ferramentas", href: "/dev/ferramentas" },
  { label: "DevLogs", href: "/dev/devlogs" },
  { label: "Ideias", href: "/dev/ideias" },
  { label: "Código", href: "/dev/codigo" },
  { label: "Wiki", href: "/dev/wiki" },
]

export function DevNav() {
  const pathname = usePathname()

  return (
    <nav className="dv-nav">
      <Link href="/dev" className="dv-brand">
        <span className="dv-prompt">❯</span> dev
      </Link>
      {DEV_LINKS.map((link) => {
        const active = link.href === "/dev" ? pathname === "/dev" : pathname.startsWith(link.href)
        return (
          <Link key={link.href} href={link.href} className="dv-navlink" data-active={active}>
            {link.label}
          </Link>
        )
      })}
      <Link href="/" className="dv-navlink" style={{ marginLeft: "auto" }}>
        ← sair
      </Link>
    </nav>
  )
}
