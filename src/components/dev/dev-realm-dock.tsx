"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  FolderGit2,
  FlaskConical,
  Wrench,
  Terminal,
  Lightbulb,
  Code2,
  BookOpen,
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
  { href: "/dev", label: "início", Icon: Home, exact: true },
  { href: "/dev/projetos", label: "projetos", Icon: FolderGit2 },
  { href: "/dev/laboratorio", label: "lab", Icon: FlaskConical },
  { href: "/dev/ferramentas", label: "tools", Icon: Wrench },
  { href: "/dev/devlogs", label: "devlogs", Icon: Terminal },
  { href: "/dev/ideias", label: "ideias", Icon: Lightbulb },
  { href: "/dev/codigo", label: "código", Icon: Code2 },
  { href: "/dev/learn", label: "learn", Icon: GraduationCap },
  { href: "/dev/wiki", label: "wiki", Icon: BookOpen },
]

export function DevRealmDock() {
  const pathname = usePathname()
  return (
    <nav className="dv-dock" aria-label="Navegação dev">
      {ITEMS.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link key={href} href={href} data-active={active} aria-label={label}>
            <Icon className="size-[18px]" strokeWidth={2} />
            <span className="dock-lbl">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
