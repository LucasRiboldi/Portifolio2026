import { Mail } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons"
import { Container } from "@/components/layout/container"
import { siteConfig } from "@/constants/site"

const experience = [
  { year: '2024–hoje', role: 'Product Designer & Dev', company: 'Freelance' },
  { year: '2023–2024', role: 'UI/UX Designer', company: 'Startup X' },
  { year: '2022–2023', role: 'Designer Jr.', company: 'Agência Y' },
]

const socialLinks = [
  { label: 'GitHub', href: siteConfig.github, icon: GithubIcon },
  { label: 'LinkedIn', href: siteConfig.linkedin, icon: LinkedinIcon },
  { label: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
]

export const metadata = {
  title: "Sobre",
}

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div
            className="aspect-square w-full rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #f97316, #8b5cf6)' }}
          />

          <div>
            <h2 className="text-lg font-bold">{siteConfig.name}</h2>
            <p className="text-sm text-muted-foreground">{siteConfig.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{siteConfig.location}</p>
          </div>

          <div className="flex flex-col gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-8 md:col-span-2">
          <div>
            <h1 className="mb-4 text-3xl font-extrabold">
              Olá, sou o <span className="gradient-text">Lucas</span>
            </h1>
            <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground">
              <p>
                Product Designer com foco em interfaces funcionais e bem construídas.
                Trabalho na interseção entre design e código — do Figma ao deploy.
              </p>
              <p>
                Crio ferramentas, componentes e experimentos que resolvem problemas
                reais. Meu interesse principal é simplificar fluxos complexos em
                experiências diretas e eficientes.
              </p>
              <p>
                Quando não estou desenhando interfaces, estou construindo CLIs,
                plugins e automações que tornam o trabalho criativo mais rápido.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Experiência
            </h2>
            <div className="flex flex-col gap-4">
              {experience.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="mt-1.5 w-1 shrink-0 self-stretch rounded-full"
                    style={{ background: 'linear-gradient(180deg, #f97316, #8b5cf6)', minHeight: '40px' }}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.year}</p>
                    <p className="text-sm font-medium">{item.role}</p>
                    <p className="text-xs text-muted-foreground">{item.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Container>
  )
}
