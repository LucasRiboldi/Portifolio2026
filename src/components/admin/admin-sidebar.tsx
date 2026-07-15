"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Sparkles,
  Wrench,
  Layers,
  Settings,
  Image as ImageIcon,
  Mail,
  LogOut,
  Terminal,
  Lightbulb,
  Code2,
  BookOpen,
  FlaskConical,
  type LucideIcon,
} from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Geral",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    section: "Conteúdo",
    items: [
      { href: "/admin/projects", label: "Projetos", icon: FolderKanban },
      { href: "/admin/posts", label: "Blog", icon: FileText },
      { href: "/admin/skills", label: "Skills", icon: Sparkles },
      { href: "/admin/tools", label: "Ferramentas", icon: Wrench },
    ],
  },
  {
    section: "Realm Dev",
    items: [
      { href: "/admin/devlogs", label: "DevLogs", icon: Terminal },
      { href: "/admin/ideas", label: "Ideias", icon: Lightbulb },
      { href: "/admin/snippets", label: "Código", icon: Code2 },
      { href: "/admin/wiki", label: "Wiki", icon: BookOpen },
      { href: "/admin/lab", label: "Laboratório", icon: FlaskConical },
    ],
  },
  {
    section: "Site",
    items: [
      { href: "/admin/realms", label: "Realms", icon: Layers },
      { href: "/admin/site", label: "Site & SEO", icon: Settings },
      { href: "/admin/media", label: "Mídia", icon: ImageIcon },
      { href: "/admin/messages", label: "Mensagens", icon: Mail },
    ],
  },
]

export function AdminSidebar({ login }: { login: string | null }) {
  const pathname = usePathname()

  return (
    <aside
      className="flex w-64 shrink-0 flex-col border-r"
      style={{ background: "var(--mm-surface)", borderColor: "var(--mm-border)" }}
    >
      <div className="flex h-16 items-center gap-2.5 px-6">
        <span
          className="grid size-9 place-items-center rounded-lg font-bold text-white"
          style={{ background: "var(--mm-primary)" }}
        >
          LR
        </span>
        <span className="text-lg font-bold">Admin</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
        {NAV.map((group) => (
          <div key={group.section}>
            <p
              className="px-3 pb-2 text-[0.7rem] font-semibold uppercase tracking-wider"
              style={{ color: "var(--mm-text-2)" }}
            >
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors"
                    style={
                      active
                        ? { background: "var(--mm-primary)", color: "#fff", boxShadow: "0 4px 12px rgba(0,161,255,.3)" }
                        : { color: "var(--mm-text-2)" }
                    }
                  >
                    <Icon className="size-[18px]" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-4" style={{ borderColor: "var(--mm-border)" }}>
        <div className="flex items-center gap-3 rounded-[10px] p-2" style={{ background: "var(--mm-hover)" }}>
          <span
            className="grid size-9 place-items-center rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--mm-secondary)" }}
          >
            {(login ?? "A").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{login ?? "admin"}</p>
            <p className="text-xs" style={{ color: "var(--mm-text-2)" }}>
              Administrador
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="grid size-8 place-items-center rounded-lg transition-colors hover:bg-white"
              style={{ color: "var(--mm-error)" }}
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
