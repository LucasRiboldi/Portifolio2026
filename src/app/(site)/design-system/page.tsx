import Link from "next/link"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsCard, DsLead } from "@/design-system/ds-ui"
import { ArtCircleMark } from "@/components/design-system/art-graphics"
import { REALM_DESIGN, REALM_DESIGN_IDS } from "@/design-system/realms"

/* ------------------------------------------------------------------
   Documento único: cada seção abaixo é a MESMA página que existe na
   sua rota, importada como componente. Compor em vez de copiar — se o
   conteúdo mudar na rota, muda aqui, sem uma segunda cópia para
   divergir em silêncio.
   As páginas-índice (components/, patterns/, templates/) ficam de fora
   de propósito: são grades de links, ou seja, menu.
   ------------------------------------------------------------------ */
import { FoundationsContent } from "./foundations/content"
import { TokensContent } from "./tokens/content"
import { GridContent } from "./grid/content"
import { MotionContent } from "./motion/content"
import { ButtonsContent } from "./components/buttons/content"
import { InputsContent } from "./components/inputs/content"
import { SelectionContent } from "./components/selection/content"
import { DataDisplayContent } from "./components/data-display/content"
import { OverlaysContent } from "./components/overlays/content"
import { FeedbackContent } from "./components/feedback/content"
import { SectionsContent } from "./sections/content"
import { LoginPatternContent } from "./patterns/login/content"
import { SearchPatternContent } from "./patterns/search/content"
import { MultiStepPatternContent } from "./patterns/multi-step/content"
import { FaqPatternContent } from "./patterns/faq/content"
import { LandingTemplateContent } from "./templates/landing/content"
import { DashboardTemplateContent } from "./templates/dashboard/content"
import { ArticleTemplateContent } from "./templates/article/content"
import { PricingTemplateContent } from "./templates/pricing/content"
import { ProfileTemplateContent } from "./templates/profile/content"
import { DocsTemplateContent } from "./templates/docs/content"
import { ChangelogTemplateContent } from "./templates/changelog/content"
import ComingSoonTemplatePage from "./templates/coming-soon/page"
import { AssetsContent } from "./assets/content"
import { OsThemesContent } from "./os/content"
import { LabContent } from "./lab/content"
import { AccessibilityContent } from "./accessibility/content"
import { DocsContent } from "./docs/content"

/** Separador entre capítulos — dá respiro num documento desta altura. */
function Chapter({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16 border-t-[3px] border-black pt-10 first:mt-0 first:border-0 first:pt-0">
      <p className="sv-heavy mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">{n}</span>
        {title}
      </p>
      {children}
    </section>
  )
}

export default function DesignSystemHome() {
  return (
    <div>
      <ComicHeader
        kicker="Design System corporativo"
        title="Consistência do"
        highlight="Design System"
        subtitle="Documento único: tudo em uma página, do token ao template."
      />
      <DsLead>
        Um sistema de design completo — da fundação de marca aos tokens atômicos, componentes,
        patterns, templates e documentação. Está tudo abaixo, no mesmo documento, na ordem em que se
        constrói: primeiro o porquê, depois os átomos, depois as peças, por fim as páginas inteiras.
      </DsLead>

      {/* ---------- Os 3 realms ---------- */}
      <Chapter n="00" title="Design System por realm">
        <DsLead>
          Antes do sistema corporativo: cada universo do projeto tem identidade própria — paleta,
          tipografia, motion e kit. Cada guia é uma página autossuficiente, com seletor de versão e
          registro de motion tocável.
        </DsLead>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {REALM_DESIGN_IDS.map((id) => {
            const d = REALM_DESIGN[id]
            if (!d) return null
            return (
              <Link key={id} href={`/design-system/realms/${id}`} className="group block">
                <DsCard className="h-full transition-transform group-hover:-translate-y-1">
                  <h3 className="sv-display text-2xl uppercase text-[var(--sv-cyan)]">{d.label}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{d.tagline}</p>
                  <span className="sv-heavy mt-3 inline-block text-[10px] uppercase tracking-wide text-[var(--sv-yellow)]">
                    Abrir guia →
                  </span>
                </DsCard>
              </Link>
            )
          })}
        </div>
      </Chapter>

      {/* ---------- Fundação ---------- */}
      <Chapter n="01" title="Brand Foundation"><FoundationsContent headingAs="h2" /></Chapter>
      <Chapter n="02" title="Design Tokens"><TokensContent headingAs="h2" /></Chapter>
      <Chapter n="03" title="Grid & Responsividade"><GridContent headingAs="h2" /></Chapter>
      <Chapter n="04" title="Motion"><MotionContent headingAs="h2" /></Chapter>

      {/* ---------- Componentes ---------- */}
      <Chapter n="05" title="Componentes · Botões"><ButtonsContent headingAs="h2" /></Chapter>
      <Chapter n="06" title="Componentes · Inputs & Forms"><InputsContent headingAs="h2" /></Chapter>
      <Chapter n="07" title="Componentes · Seleção"><SelectionContent headingAs="h2" /></Chapter>
      <Chapter n="08" title="Componentes · Data Display"><DataDisplayContent headingAs="h2" /></Chapter>
      <Chapter n="09" title="Componentes · Overlays"><OverlaysContent headingAs="h2" /></Chapter>
      <Chapter n="10" title="Componentes · Feedback"><FeedbackContent headingAs="h2" /></Chapter>

      {/* ---------- Seções & patterns ---------- */}
      <Chapter n="11" title="Seções de página"><SectionsContent headingAs="h2" /></Chapter>
      <Chapter n="12" title="Pattern · Login / Auth"><LoginPatternContent headingAs="h2" /></Chapter>
      <Chapter n="13" title="Pattern · Busca & filtros"><SearchPatternContent headingAs="h2" /></Chapter>
      <Chapter n="14" title="Pattern · Multi-step"><MultiStepPatternContent headingAs="h2" /></Chapter>
      <Chapter n="15" title="Pattern · FAQ"><FaqPatternContent headingAs="h2" /></Chapter>

      {/* ---------- Templates ---------- */}
      <Chapter n="16" title="Template · Landing"><LandingTemplateContent headingAs="h2" /></Chapter>
      <Chapter n="17" title="Template · Dashboard"><DashboardTemplateContent headingAs="h2" /></Chapter>
      <Chapter n="18" title="Template · Artigo"><ArticleTemplateContent headingAs="h2" /></Chapter>
      <Chapter n="19" title="Template · Pricing"><PricingTemplateContent headingAs="h2" /></Chapter>
      <Chapter n="20" title="Template · Perfil"><ProfileTemplateContent headingAs="h2" /></Chapter>
      <Chapter n="21" title="Template · Documentação"><DocsTemplateContent headingAs="h2" /></Chapter>
      <Chapter n="22" title="Template · Changelog"><ChangelogTemplateContent headingAs="h2" /></Chapter>
      <Chapter n="23" title="Template · Coming soon"><ComingSoonTemplatePage /></Chapter>

      {/* ---------- Apoio ---------- */}
      <Chapter n="24" title="Assets"><AssetsContent headingAs="h2" /></Chapter>
      <Chapter n="25" title="Retro OS"><OsThemesContent headingAs="h2" /></Chapter>
      <Chapter n="26" title="Lab"><LabContent headingAs="h2" /></Chapter>
      <Chapter n="27" title="Acessibilidade"><AccessibilityContent headingAs="h2" /></Chapter>
      <Chapter n="28" title="Documentação"><DocsContent headingAs="h2" /></Chapter>

      <div className="mt-16 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-2)]">
        <h3 className="sv-heavy relative mb-2 inline-block text-sm uppercase tracking-wide text-[var(--sv-cyan)]">
          Fim do documento
          <ArtCircleMark className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)]" />
        </h3>
        <p className="text-xs leading-relaxed text-white/70">
          Cada capítulo acima também existe na própria rota (
          <code className="text-[var(--sv-cyan)]">/design-system/tokens</code>,{" "}
          <code className="text-[var(--sv-cyan)]">/design-system/templates/landing</code>, …) — úteis
          para linkar direto. Aqui elas são compostas, não copiadas: a fonte é a mesma.
        </p>
      </div>
    </div>
  )
}
