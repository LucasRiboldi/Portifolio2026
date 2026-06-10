"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Container } from "./container"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MobileMenu } from "./mobile-menu"

const links = [
  { label: "Portfólio", href: "/portfolio" },
  { label: "Ferramentas", href: "/tools" },
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="gradient-accent-bar" />
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center text-lg font-bold">
            LR<span className="gradient-text">.</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === link.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  )
}
