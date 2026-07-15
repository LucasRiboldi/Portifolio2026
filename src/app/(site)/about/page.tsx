import { Mail } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/social-icons"
import { SvCanvas } from "@/components/spiderverse/sv-canvas"
import { ArtOverlay } from "@/components/design-system/art-overlay"
import { SpeechBubble } from "@/components/spiderverse/decor"
import { getSiteConfig } from "@/lib/repos/site-config"

const experience = [
  { year: '2024–hoje', role: 'Product Designer & Dev', company: 'Freelance' },
  { year: '2023–2024', role: 'UI/UX Designer', company: 'Startup X' },
  { year: '2022–2023', role: 'Designer Jr.', company: 'Agência Y' },
]

export const metadata = {
  title: "Sobre",
}

export default async function AboutPage() {
  const siteConfig = await getSiteConfig()
  const socialLinks = [
    { label: 'GitHub', href: siteConfig.github, icon: GithubIcon },
    { label: 'LinkedIn', href: siteConfig.linkedin, icon: LinkedinIcon },
    { label: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: Mail },
  ]
  return (
    <SvCanvas dimension="nouveau">
      <ArtOverlay universe="watercolor" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

        {/* Coluna esquerda */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="sv-panel sv-tilt-3 relative aspect-square w-full overflow-hidden p-0">
            <div
              className="sv-watercolor absolute inset-4"
              style={{ background: 'radial-gradient(circle at 35% 30%, #ff78b4, transparent 60%), radial-gradient(circle at 70% 70%, #78c8ff, transparent 60%), linear-gradient(135deg, #b48cff, #ff78b4)' }}
            />
            <SpeechBubble className="absolute bottom-3 left-3 z-[1]">Olá!</SpeechBubble>
          </div>

          <div className="sv-panel">
            <h2 className="sv-display text-2xl uppercase">{siteConfig.name}</h2>
            <p className="sv-heavy text-xs uppercase tracking-wide opacity-70">{siteConfig.title}</p>
            <p className="mt-1 text-xs opacity-70">{siteConfig.location}</p>
          </div>

          <div className="flex flex-col gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="sv-heavy flex items-center gap-2 text-xs uppercase tracking-wide opacity-80 transition-opacity hover:opacity-100"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-8 md:col-span-2">
          <div className="sv-panel art-paper">
            <h1 className="sv-display mb-4 text-5xl uppercase">
              Olá, sou o <span className="sv-rainbow art-bloom">Lucas</span>
            </h1>
            <div className="flex flex-col gap-4 leading-relaxed opacity-90">
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

          <div className="sv-panel art-paper relative overflow-hidden">
            {/* mancha de aquarela ao fundo */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 opacity-25"
              style={{ filter: "url(#art-rough) blur(4px)", background: "radial-gradient(circle at 40% 40%, #ff78b4, transparent 65%)" }}
            />
            <h2 className="sv-display mb-5 text-2xl uppercase">Experiência</h2>
            {/* trilha aquarela */}
            <div className="relative flex flex-col gap-5 pl-6">
              <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-[3px] rounded" style={{ background: "linear-gradient(180deg,#ff78b4,#b48cff,#78c8ff)", filter: "url(#art-rough)" }} />
              {experience.map((item, i) => (
                <div key={i} className="relative">
                  {/* nó de aquarela com borda molhada */}
                  <span
                    aria-hidden
                    className="absolute -left-[26px] top-1 h-4 w-4 rounded-full border-2 border-black"
                    style={{
                      filter: "url(#art-rough)",
                      background: ["#ff78b4", "#b48cff", "#78c8ff"][i % 3],
                      boxShadow: "0 0 0 4px rgba(255,255,255,0.35)",
                    }}
                  />
                  <p className="sv-heavy text-xs uppercase tracking-wide opacity-60">{item.year}</p>
                  <p className="font-medium">{item.role}</p>
                  <p className="text-xs opacity-70">{item.company}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </SvCanvas>
  )
}
