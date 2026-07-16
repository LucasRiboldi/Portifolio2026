"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FolderGit2,
  FlaskConical,
  Wrench,
  Code2,
  GraduationCap,
  type LucideIcon,
} from "lucide-react"

interface DockItem {
  href: string
  label: string
  Icon: LucideIcon
  exact?: boolean
}

const ITEMS: DockItem[] = [
  { href: "/desenvolvedor", label: "início", Icon: Home, exact: true },
  { href: "/desenvolvedor/projetos", label: "projetos", Icon: FolderGit2 },
  { href: "/desenvolvedor/laboratorio", label: "lab", Icon: FlaskConical },
  { href: "/desenvolvedor/ferramentas", label: "tools", Icon: Wrench },
  { href: "/desenvolvedor/codigo", label: "código", Icon: Code2 },
  { href: "/desenvolvedor/learn", label: "learn", Icon: GraduationCap },
]

export function DevRealmDock() {
  const pathname = usePathname()
  return (
    <nav className="dv-dock" aria-label="Navegação dev">
      {ITEMS.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link key={href} href={href} data-active={active} aria-current={active ? "page" : undefined} aria-label={label}>
            <Icon className="size-[18px]" strokeWidth={2} />
            <span className="dock-lbl">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
