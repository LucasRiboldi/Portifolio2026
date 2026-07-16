"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SITE_LINKS, isActive } from "@/lib/nav"
import { Container } from "./container"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { VibeToggle } from "@/components/providers/vibe-toggle"
import { MobileMenu } from "./mobile-menu"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-black bg-[var(--sv-ink)]/90 backdrop-blur-xl">
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--sv-yellow), var(--sv-magenta), var(--sv-cyan), var(--sv-lime))' }} />
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="sv-display flex items-center text-2xl uppercase text-white">
            LR<span className="sv-rainbow">.</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex" aria-label="Navegação principal">
            {SITE_LINKS.map(link => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "sv-heavy rounded-md px-3 py-1 text-xs uppercase tracking-wide transition-all hover:-translate-y-0.5",
                    active
                      ? "border-2 border-black bg-[var(--sv-yellow)] text-black shadow-[3px_3px_0_0_#000]"
                      : "text-white/70 hover:text-[var(--sv-cyan)]"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <VibeToggle />
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  )
}
