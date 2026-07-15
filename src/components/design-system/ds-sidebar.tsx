"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DS_NAV } from "@/design-system/registry"

export function DsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-56 lg:shrink-0">
      <div className="mb-4">
        <p className="sv-display text-xl uppercase leading-none">Design System</p>
        <p className="text-[0.7rem] uppercase tracking-widest text-white/40">Design System · v1</p>
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {DS_NAV.map((item) => {
          const active =
            item.href === "/design-system"
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sv-heavy shrink-0 rounded-md px-3 py-1.5 text-xs uppercase tracking-wide transition-all",
                active
                  ? "border-2 border-black bg-[var(--sv-cyan)] text-black shadow-[3px_3px_0_0_#000]"
                  : "text-white/60 hover:-translate-y-0.5 hover:text-[var(--sv-cyan)]"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
