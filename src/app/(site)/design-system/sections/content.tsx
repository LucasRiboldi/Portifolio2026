import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import { SvPricing, SvCTA, SvNewsletter } from "@/components/sections/sv-marketing"
import { SvStats, SvTestimonials, SvLogosGrid } from "@/components/sections/sv-proof"
import { SvTeam, SvTimeline } from "@/components/sections/sv-people"


export function SectionsContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  return (
    <div>
      <ComicHeader as={headingAs} kicker="Fase 3 · Sections" title="Blocos de" highlight="página" />
      <DsLead>
        Seções reutilizáveis e data-driven que combinam componentes em blocos completos —
        prontos para montar landing pages e templates.
      </DsLead>

      <DsSectionTitle id="stats">Statistics</DsSectionTitle>
      <SvStats
        stats={[
          { value: "20+", label: "Dimensões", color: "var(--sv-magenta)" },
          { value: "98%", label: "Acessível", color: "var(--sv-lime)" },
          { value: "40+", label: "Componentes", color: "var(--sv-cyan)" },
          { value: "12", label: "Categorias token", color: "var(--sv-yellow)" },
        ]}
      />

      <DsSectionTitle id="pricing">Pricing Cards</DsSectionTitle>
      <SvPricing
        plans={[
          { name: "Origem", price: "R$0", period: "mês", features: ["1 dimensão", "Tokens base", "Comunidade"], cta: "Começar" },
          { name: "Multiverso", price: "R$49", period: "mês", featured: true, features: ["Dimensões ilimitadas", "Todos os componentes", "Export Figma", "Suporte prioritário"], cta: "Assinar" },
          { name: "Corporativo", price: "Sob consulta", features: ["SSO & auditoria", "SLA dedicado", "Onboarding"], cta: "Falar com vendas" },
        ]}
      />

      <DsSectionTitle id="testimonials">Testimonials</DsSectionTitle>
      <SvTestimonials
        items={[
          { quote: "O melhor design system comic que já usei. Consistente e divertido.", name: "Miles M.", role: "Dev Frontend", color: "var(--sv-magenta)" },
          { quote: "Tokens impecáveis e export pro Figma que funciona de verdade.", name: "Gwen S.", role: "Product Designer", color: "var(--sv-cyan)" },
          { quote: "Acessibilidade e criatividade no mesmo pacote. Raro.", name: "Peter P.", role: "Eng. Manager", color: "var(--sv-lime)" },
        ]}
      />

      <DsSectionTitle id="team">Team</DsSectionTitle>
      <SvTeam
        members={[
          { name: "Lucas Riboldi", role: "Fundador & Dev", color: "var(--sv-magenta)" },
          { name: "Ada Lovelace", role: "Arquiteta", color: "var(--sv-cyan)" },
          { name: "Alan Turing", role: "Pesquisa", color: "var(--sv-violet)" },
          { name: "Grace Hopper", role: "DX", color: "var(--sv-lime)" },
        ]}
      />

      <DsSectionTitle id="timeline">Timeline</DsSectionTitle>
      <SvTimeline
        items={[
          { time: "Fase 1", title: "Fundação", description: "Tokens, arquitetura e docs.", color: "var(--sv-cyan)" },
          { time: "Fase 2", title: "UI Components", description: "Botões, inputs, overlays, feedback…", color: "var(--sv-magenta)" },
          { time: "Fase 3", title: "Seções", description: "Blocos de página reutilizáveis.", color: "var(--sv-yellow)" },
          { time: "Fase 4", title: "Patterns & Templates", description: "Fluxos e layouts completos.", color: "var(--sv-lime)" },
        ]}
      />

      <DsSectionTitle id="logos">Logos Grid / Partners</DsSectionTitle>
      <SvLogosGrid title="Confiado por realidades de todo o multiverso" logos={["Oscorp", "Alchemax", "Daily Bugle", "Horizon", "Stark", "Wayne"]} />

      <DsSectionTitle id="cta">CTA Section</DsSectionTitle>
      <SvCTA title="Pronto para saltar?" subtitle="Comece a construir com o Design System hoje." primary="Começar agora" secondary="Ver docs" />

      <DsSectionTitle id="newsletter">Newsletter</DsSectionTitle>
      <SvNewsletter subtitle="Novidades do multiverso direto no seu e-mail." />
    </div>
  )
}
