import { Mail } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons"
import { Container } from "./container"
import { getSiteConfig } from "@/lib/repos/site-config"
import { AdminFooterLink } from "./admin-footer-link"

export async function Footer() {
  const siteConfig = await getSiteConfig()
  return (
    <footer className="border-t-[3px] border-black bg-[var(--sv-ink)]">
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--sv-cyan), var(--sv-lime), var(--sv-yellow), var(--sv-magenta))' }} />
      <Container>
        <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
          <p className="sv-heavy text-xs uppercase tracking-wide text-white/70">
            © 2026 {siteConfig.name} · Todos os multiversos reservados
            <span className="mx-2 text-white/20">·</span>
            <AdminFooterLink />
          </p>
          <div className="flex gap-4">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
