"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const links = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Ferramentas", href: "/tools" },
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col gap-6 bg-background p-8">
          <button
            className="self-end text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xl font-semibold transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
