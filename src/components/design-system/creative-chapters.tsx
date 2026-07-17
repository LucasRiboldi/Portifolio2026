import { ArtCircleMark } from "@/components/design-system/art-graphics"

/* ------------------------------------------------------------------
   O corpo do style guide do perfil "O Criativo".
   ------------------------------------------------------------------
   Todo este conteúdo é comic: painéis de tinta grossa, halftone, tilts,
   onomatopeias. Ele nunca foi neutro — sempre foi o Criativo falando.
   Por isso vive aqui, sob o guia do realm, e não numa raiz "corporativa"
   que fingiria servir os três universos igualmente.

   Cada capítulo COMPÕE a página que já serve a rota, em vez de copiar o
   conteúdo dela — fonte única, sem uma segunda cópia para divergir em
   silêncio. As páginas-índice (components/, patterns/, templates/) ficam
   de fora de propósito: são grades de links, ou seja, menu.
   ------------------------------------------------------------------ */
import { FoundationsContent } from "@/app/(site)/design-system/foundations/content"
import { TokensContent } from "@/app/(site)/design-system/tokens/content"
import { GridContent } from "@/app/(site)/design-system/grid/content"
import { MotionContent } from "@/app/(site)/design-system/motion/content"
import { ButtonsContent } from "@/app/(site)/design-system/components/buttons/content"
import { InputsContent } from "@/app/(site)/design-system/components/inputs/content"
import { SelectionContent } from "@/app/(site)/design-system/components/selection/content"
import { DataDisplayContent } from "@/app/(site)/design-system/components/data-display/content"
import { OverlaysContent } from "@/app/(site)/design-system/components/overlays/content"
import { FeedbackContent } from "@/app/(site)/design-system/components/feedback/content"
import { SectionsContent } from "@/app/(site)/design-system/sections/content"
import { LoginPatternContent } from "@/app/(site)/design-system/patterns/login/content"
import { SearchPatternContent } from "@/app/(site)/design-system/patterns/search/content"
import { MultiStepPatternContent } from "@/app/(site)/design-system/patterns/multi-step/content"
import { FaqPatternContent } from "@/app/(site)/design-system/patterns/faq/content"
import { LandingTemplateContent } from "@/app/(site)/design-system/templates/landing/content"
import { DashboardTemplateContent } from "@/app/(site)/design-system/templates/dashboard/content"
import { ArticleTemplateContent } from "@/app/(site)/design-system/templates/article/content"
import { PricingTemplateContent } from "@/app/(site)/design-system/templates/pricing/content"
import { ProfileTemplateContent } from "@/app/(site)/design-system/templates/profile/content"
import { DocsTemplateContent } from "@/app/(site)/design-system/templates/docs/content"
import { ChangelogTemplateContent } from "@/app/(site)/design-system/templates/changelog/content"
import ComingSoonTemplatePage from "@/app/(site)/design-system/templates/coming-soon/page"
import { AssetsContent } from "@/app/(site)/design-system/assets/content"
import { OsThemesContent } from "@/app/(site)/design-system/os/content"
import { LabContent } from "@/app/(site)/design-system/lab/content"
import { AccessibilityContent } from "@/app/(site)/design-system/accessibility/content"
import { DocsContent } from "@/app/(site)/design-system/docs/content"

/**
 * Separador entre capítulos — dá respiro num documento desta altura.
 *
 * `id` não é menu: é âncora. Num documento desta altura, poder mandar a
 * alguém .../creative#tokens é o mínimo. O scroll-margin existe para a
 * navbar fixa não cobrir o título ao saltar.
 */
function Chapter({
  id,
  n,
  title,
  children,
}: {
  id: string
  n: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={`${n} · ${title}`}
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">{n}</span>
        {title}
      </p>
      {children}
    </section>
  )
}

/**
 * Âncora de grupo — o alvo que o índice das 16 seções promete.
 *
 * Os capítulos nasceram como páginas soltas e por isso têm ids próprios
 * (`botoes`, `tpl-landing`). A arquitetura fala em `components`, `templates`.
 * Este wrapper dá o id da seção ao grupo inteiro, sem renomear os capítulos —
 * os dois níveis coexistem: o índice leva ao grupo, o link direto ao capítulo.
 */
function Group({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  )
}

/** Os capítulos que formam o guia completo do Criativo. */
export function CreativeChapters() {
  return (
    <>
      <Chapter id="foundations" n="01" title="Brand Foundation"><FoundationsContent headingAs="h2" /></Chapter>
      <Chapter id="tokens-catalogo" n="02" title="Design Tokens · catálogo completo"><TokensContent headingAs="h2" /></Chapter>
      <Chapter id="grid" n="03" title="Grid & Responsividade"><GridContent headingAs="h2" /></Chapter>
      <Chapter id="motion-ds" n="04" title="Motion (catálogo)"><MotionContent headingAs="h2" /></Chapter>

      <Group id="components">
        <Chapter id="botoes" n="05" title="Componentes · Botões"><ButtonsContent headingAs="h2" /></Chapter>
        <Chapter id="inputs" n="06" title="Componentes · Inputs & Forms"><InputsContent headingAs="h2" /></Chapter>
        <Chapter id="selecao" n="07" title="Componentes · Seleção"><SelectionContent headingAs="h2" /></Chapter>
        <Chapter id="data-display" n="08" title="Componentes · Data Display"><DataDisplayContent headingAs="h2" /></Chapter>
        <Chapter id="overlays" n="09" title="Componentes · Overlays"><OverlaysContent headingAs="h2" /></Chapter>
        <Chapter id="feedback" n="10" title="Componentes · Feedback"><FeedbackContent headingAs="h2" /></Chapter>
      </Group>

      <Chapter id="secoes" n="11" title="Seções de página"><SectionsContent headingAs="h2" /></Chapter>

      <Group id="patterns">
        <Chapter id="pattern-login" n="12" title="Pattern · Login / Auth"><LoginPatternContent headingAs="h2" /></Chapter>
        <Chapter id="pattern-busca" n="13" title="Pattern · Busca & filtros"><SearchPatternContent headingAs="h2" /></Chapter>
        <Chapter id="pattern-multi-step" n="14" title="Pattern · Multi-step"><MultiStepPatternContent headingAs="h2" /></Chapter>
        <Chapter id="pattern-faq" n="15" title="Pattern · FAQ"><FaqPatternContent headingAs="h2" /></Chapter>
      </Group>

      <Group id="templates">
        <Chapter id="tpl-landing" n="16" title="Template · Landing"><LandingTemplateContent headingAs="h2" /></Chapter>
        <Chapter id="tpl-dashboard" n="17" title="Template · Dashboard"><DashboardTemplateContent headingAs="h2" /></Chapter>
        <Chapter id="tpl-artigo" n="18" title="Template · Artigo"><ArticleTemplateContent headingAs="h2" /></Chapter>
        <Chapter id="tpl-pricing" n="19" title="Template · Pricing"><PricingTemplateContent headingAs="h2" /></Chapter>
        <Chapter id="tpl-perfil" n="20" title="Template · Perfil"><ProfileTemplateContent headingAs="h2" /></Chapter>
        <Chapter id="tpl-docs" n="21" title="Template · Documentação"><DocsTemplateContent headingAs="h2" /></Chapter>
        <Chapter id="tpl-changelog" n="22" title="Template · Changelog"><ChangelogTemplateContent headingAs="h2" /></Chapter>
        <Chapter id="tpl-coming-soon" n="23" title="Template · Coming soon"><ComingSoonTemplatePage /></Chapter>
      </Group>

      <Chapter id="resources" n="24" title="Assets & Resources"><AssetsContent headingAs="h2" /></Chapter>
      <Chapter id="retro-os" n="25" title="Retro OS"><OsThemesContent headingAs="h2" /></Chapter>
      <Chapter id="lab" n="26" title="Lab"><LabContent headingAs="h2" /></Chapter>
      <Chapter id="accessibility" n="27" title="Accessibility"><AccessibilityContent headingAs="h2" /></Chapter>
      <Chapter id="documentacao" n="28" title="Documentação"><DocsContent headingAs="h2" /></Chapter>

      <div className="mt-16 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-5 shadow-[var(--elevation-2)]">
        <h3 className="sv-heavy relative mb-2 inline-block text-sm uppercase tracking-wide text-[var(--sv-cyan)]">
          Fim do guia
          <ArtCircleMark className="pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)]" />
        </h3>
        <p className="text-xs leading-relaxed text-white/70">
          Cada capítulo acima também existe na própria rota (
          <code className="text-[var(--sv-cyan)]">/design-system/tokens</code>,{" "}
          <code className="text-[var(--sv-cyan)]">/design-system/templates/landing</code>, …) — úteis
          para linkar direto. Aqui elas são compostas, não copiadas: a fonte é a mesma.
        </p>
      </div>
    </>
  )
}
