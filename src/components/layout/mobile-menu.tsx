"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const links = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Ferramentas", href: "/tools" },
  { label: "Skills", href: "/skills" },
  { label: "Blog", href: "/blog" },
  { label: "Dimensões", href: "/dimensoes" },
  { label: "Style Guide", href: "/styleguide" },
  { label: "Design System", href: "/design-system" },
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
        <div className="sv-canvas fixed inset-0 z-50 flex flex-col gap-6 p-8">
          <button
            className="relative z-[1] self-end text-white/70 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-6 w-6" />
          </button>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="sv-display relative z-[1] text-3xl uppercase text-white transition-colors hover:text-[var(--sv-yellow)]"
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
