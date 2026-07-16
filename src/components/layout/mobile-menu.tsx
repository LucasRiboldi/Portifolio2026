"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { SITE_LINKS, isActive } from "@/lib/nav"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Fecha ao trocar de rota.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Esc fecha + trava o scroll do body enquanto aberto.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <button
        className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="sv-canvas fixed inset-0 z-50 flex flex-col gap-6 p-8" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            className="relative z-[1] self-end text-white/70 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="relative z-[1] flex flex-col gap-6" aria-label="Navegação principal">
            {SITE_LINKS.map(link => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "sv-display text-3xl uppercase transition-colors " +
                    (active ? "text-[var(--sv-yellow)]" : "text-white hover:text-[var(--sv-yellow)]")
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
