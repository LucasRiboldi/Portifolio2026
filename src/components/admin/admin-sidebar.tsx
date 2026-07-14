"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/projects", label: "Projetos" },
  { href: "/admin/posts", label: "Blog" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/tools", label: "Ferramentas" },
  { href: "/admin/realms", label: "Realms" },
  { href: "/admin/site", label: "Site & SEO" },
  { href: "/admin/media", label: "Mídia" },
  { href: "/admin/messages", label: "Mensagens" },
]

export function AdminSidebar({ login }: { login: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-neutral-950 p-4 text-white">
      <div className="px-2 pb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Painel</p>
        <p className="text-lg font-bold">LR Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/10 font-semibold text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        {login && <p className="px-2 pb-2 text-xs text-white/40">@{login}</p>}
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
          >
            ← Ver site
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
