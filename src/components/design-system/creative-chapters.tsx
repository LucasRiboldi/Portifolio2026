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
 * Cabeçalho de um caderno que só tem matérias — o alvo que o índice promete.
 *
 * Os capítulos nasceram como páginas soltas e por isso têm ids próprios
 * (`botoes`, `tpl-landing`). A arquitetura fala em `components`, `templates`.
 * Este wrapper dá o id da seção ao grupo inteiro, sem renomear os capítulos —
 * os dois níveis coexistem: o índice leva ao grupo, o link direto ao capítulo.
 *
 * Era um `<section>` mudo. Enquanto os capítulos tinham numeração plana
 * própria (06, 07, 08…) ninguém sentia falta; ao virarem 09.1, 09.2, 09.3 o
 * buraco ficou visível — a sidebar apontava "09 Components" para um ponto sem
 * título nenhum. Agora imprime o próprio cabeçalho.
 */
function Group({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string
  n: string
  title: string
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={`${n} · ${title}`}
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">{n}</span>
        {title}
      </p>
      {lead && <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">{lead}</p>}
      {children}
    </section>
  )
}

/**
 * Uma matéria dentro do caderno — o segundo nível do índice.
 *
 * Mesma peça que o `SubChapter` do _Dev e do Anfitrião, na língua do Criativo:
 * o caderno abre com filete preto de 3px, a matéria com um de 2px em ciano, e
 * o número vem de `architecture.ts` com o prefixo da mãe.
 */
function SubChapter({
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
      className="mt-10 scroll-mt-24 border-l-[3px] border-[var(--sv-cyan)]/40 pl-4"
    >
      <p className="sv-heavy mb-5 text-[10px] uppercase tracking-[0.2em] text-[var(--sv-cyan)]">
        <span className="sv-display mr-2 text-lg text-[var(--sv-yellow)]">{n}</span>
        {title}
      </p>
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------
   OS CAPÍTULOS, UM A UM. A ordem quem monta é `creative-guide.tsx`.
   ------------------------------------------------------------------
   Este arquivo rodava 01–31, uma sequência inventada sem NENHUMA relação
   com architecture.ts: "Brand Foundation" era 01 (canônico 02),
   Accessibility era 28 (canônico 12), Resources 25 (15), Retro OS 26 (18).
   Praticamente todo número divergia do que a sidebar mostrava ao lado do
   mesmo link.

   Os capítulos que aprofundam uma seção viram matérias e herdam o prefixo
   da mãe (09 → 09.1). Quem somar um capítulo aqui declara antes em
   architecture.ts — não escolhe o próprio número.
   ------------------------------------------------------------------ */

export function CreativeFoundations() {
  return <Chapter id="foundations" n="02" title="Brand Foundation"><FoundationsContent headingAs="h2" /></Chapter>
}

export function CreativeTokensCatalogo() {
  return <SubChapter id="tokens-catalogo" n="03.1" title="Design Tokens · catálogo completo"><TokensContent headingAs="h2" /></SubChapter>
}

export function CreativeGrid() {
  return <Chapter id="grid" n="06" title="Grid & Responsividade"><GridContent headingAs="h2" /></Chapter>
}

/** Iconografia mora com as fundações — logo após a grelha, como no índice. */
export function CreativeIconographyChapter() {
  return <Chapter id="iconography" n="07" title="Iconography"><CreativeIconography /></Chapter>
}

export function CreativeMotionCatalogo() {
  return <SubChapter id="motion-ds" n="08.1" title="Motion (catálogo)"><MotionContent headingAs="h2" /></SubChapter>
}

export function CreativeComponents() {
  return (
      <Group
        id="components"
        n="09"
        title="Components"
        lead="A biblioteca do Criativo em seis galerias, cada uma compondo a página que já serve a rota — fonte única, sem segunda cópia para divergir em silêncio."
      >
        <SubChapter id="botoes" n="09.1" title="Componentes · Botões"><ButtonsContent headingAs="h2" /></SubChapter>
        <SubChapter id="inputs" n="09.2" title="Componentes · Inputs & Forms"><InputsContent headingAs="h2" /></SubChapter>
        <SubChapter id="selecao" n="09.3" title="Componentes · Seleção"><SelectionContent headingAs="h2" /></SubChapter>
        <SubChapter id="data-display" n="09.4" title="Componentes · Data Display"><DataDisplayContent headingAs="h2" /></SubChapter>
        <SubChapter id="overlays" n="09.5" title="Componentes · Overlays"><OverlaysContent headingAs="h2" /></SubChapter>
        <SubChapter id="feedback" n="09.6" title="Componentes · Feedback"><FeedbackContent headingAs="h2" /></SubChapter>
      </Group>
  )
}

export function CreativePatterns() {
  return (
      <Group
        id="patterns"
        n="10"
        title="Patterns"
        lead="Composições que já vêm resolvidas: autenticação, busca, formulário em etapas e FAQ. Não são telas — são arranjos que se repetem."
      >
        <SubChapter id="pattern-login" n="10.1" title="Pattern · Login / Auth"><LoginPatternContent headingAs="h2" /></SubChapter>
        <SubChapter id="pattern-busca" n="10.2" title="Pattern · Busca & filtros"><SearchPatternContent headingAs="h2" /></SubChapter>
        <SubChapter id="pattern-multi-step" n="10.3" title="Pattern · Multi-step"><MultiStepPatternContent headingAs="h2" /></SubChapter>
        <SubChapter id="pattern-faq" n="10.4" title="Pattern · FAQ"><FaqPatternContent headingAs="h2" /></SubChapter>
      </Group>
  )
}

export function CreativeTemplates() {
  return (
      <Group
        id="templates"
        n="11"
        title="Templates"
        lead="Páginas inteiras montadas com o kit — as oito que o portfólio realmente usa. Template aqui não é maquete: é a página que existe."
      >
        <SubChapter id="tpl-landing" n="11.1" title="Template · Landing"><LandingTemplateContent headingAs="h2" /></SubChapter>
        <SubChapter id="tpl-dashboard" n="11.2" title="Template · Dashboard"><DashboardTemplateContent headingAs="h2" /></SubChapter>
        <SubChapter id="tpl-artigo" n="11.3" title="Template · Artigo"><ArticleTemplateContent headingAs="h2" /></SubChapter>
        <SubChapter id="tpl-pricing" n="11.4" title="Template · Pricing"><PricingTemplateContent headingAs="h2" /></SubChapter>
        <SubChapter id="tpl-perfil" n="11.5" title="Template · Perfil"><ProfileTemplateContent headingAs="h2" /></SubChapter>
        <SubChapter id="tpl-docs" n="11.6" title="Template · Documentação"><DocsTemplateContent headingAs="h2" /></SubChapter>
        <SubChapter id="tpl-changelog" n="11.7" title="Template · Changelog"><ChangelogTemplateContent headingAs="h2" /></SubChapter>
        <SubChapter id="tpl-coming-soon" n="11.8" title="Template · Coming soon"><ComingSoonTemplatePage /></SubChapter>
      </Group>
  )
}

export function CreativeAccessibility() {
  return <Chapter id="accessibility" n="12" title="Accessibility"><AccessibilityContent headingAs="h2" /></Chapter>
}

/** Voz e microcopy fecham com a acessibilidade. */
export function CreativeContentDesignChapter() {
  return <Chapter id="content-design" n="13" title="Content Design"><CreativeContentDesign /></Chapter>
}

export function CreativeResources() {
  return <Chapter id="resources" n="15" title="Assets & Resources"><AssetsContent headingAs="h2" /></Chapter>
}

/** O histórico fecha os 16 canônicos — a última edição da coleção. */
export function CreativeChangelogChapter() {
  return <Chapter id="changelog" n="16" title="Changelog"><CreativeChangelog /></Chapter>
}

/* ---- 17–20 · os extras do índice ---- */

export function CreativeSecoes() {
  return <Chapter id="secoes" n="17" title="Seções de página"><SectionsContent headingAs="h2" /></Chapter>
}

export function CreativeRetroOs() {
  return <Chapter id="retro-os" n="18" title="Retro OS"><OsThemesContent headingAs="h2" /></Chapter>
}

export function CreativeLab() {
  return <Chapter id="lab" n="19" title="Lab"><LabContent headingAs="h2" /></Chapter>
}

export function CreativeDocumentacao() {
  return <Chapter id="documentacao" n="20" title="Documentação"><DocsContent headingAs="h2" /></Chapter>
}

/** O fecho do guia — o cartão que explica que cada capítulo também é rota. */
export function CreativeFim() {
  return (
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
  )
}

/** Painel comic — tinta grossa, borda preta, sombra impressa. */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-4 shadow-[var(--elevation-2)] ${className}`}
    >
      {children}
    </div>
  )
}

/* ---------------- 29 · Iconography (comic) ---------------- */

/**
 * A iconografia do Criativo não é um set neutro de SVGs: são marcas de quadrinho
 * — estrela de ação, balão, ponto de halftone, "thwip". Peso grosso, canto reto,
 * área segura generosa para a tinta não encostar na borda do painel.
 */
const COMIC_MARKS = [
  { g: "★", nome: "Ação", papel: "Destaque, clique, impacto" },
  { g: "✦", nome: "Brilho", papel: "Novo, em destaque" },
  { g: "❯", nome: "Avança", papel: "Navegação, próximo" },
  { g: "◉", nome: "Halftone", papel: "Textura, profundidade impressa" },
  { g: "✕", nome: "Fecha", papel: "Descartar, cancelar" },
  { g: "✚", nome: "Adiciona", papel: "Criar, incluir" },
  { g: "☰", nome: "Menu", papel: "Painéis, índice" },
  { g: "✺", nome: "Thwip", papel: "Onomatopeia — a voz do gesto" },
]

function CreativeIconography() {
  return (
    <>
      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/70">
        Ícone aqui é marca de quadrinho: traço grosso (2–3px), canto reto e área segura larga para a
        tinta não encostar na moldura. Grade de <strong>24px</strong>, escala em 16/24/32. Onde o
        _Dev usa glifo de terminal, o Criativo usa o gesto desenhado.
      </p>
      <Panel>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COMIC_MARKS.map((m) => (
            <div key={m.nome} className="rounded-md border-2 border-black bg-[var(--sv-ink)] p-3 text-center">
              <span className="sv-display block text-3xl text-[var(--sv-yellow)]">{m.g}</span>
              <span className="sv-heavy mt-2 block text-[11px] uppercase text-white">{m.nome}</span>
              <span className="mt-0.5 block text-[10px] leading-snug text-white/55">{m.papel}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-white/60">
          <span><strong className="text-[var(--sv-cyan)]">Grade</strong> 24px</span>
          <span><strong className="text-[var(--sv-cyan)]">Traço</strong> 2–3px, preto</span>
          <span><strong className="text-[var(--sv-cyan)]">Área segura</strong> 2px em volta</span>
          <span><strong className="text-[var(--sv-cyan)]">Tamanhos</strong> 16 · 24 · 32</span>
        </div>
      </Panel>
    </>
  )
}

/* ---------------- 30 · Content Design (comic) ---------------- */

/** A voz do Criativo é alta e direta: verbo forte, exclamação, zero jargão frio. */
const COMIC_VOZ = [
  { evite: "Operação concluída com sucesso.", prefira: "BOOM! Feito." },
  { evite: "Nenhum resultado foi encontrado.", prefira: "Nada por aqui… ainda!" },
  { evite: "Ocorreu um erro inesperado.", prefira: "Opa — algo escapou. Tenta de novo?" },
  { evite: "Clique no botão para prosseguir.", prefira: "Bora — é só um clique." },
  { evite: "Carregando, por favor aguarde.", prefira: "Segura aí…" },
]

function CreativeContentDesign() {
  return (
    <>
      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/70">
        O Criativo fala como um quadrinho: frase curta, verbo forte, exclamação sem medo. Nunca frio
        nem burocrático — cada microcopy tem energia. Onde o _Dev escreve como o compilador, aqui se
        escreve como o balão de fala.
      </p>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-white/40">
                <th className="py-1 pr-4 font-normal">✕ evite</th>
                <th className="py-1 font-normal">✓ prefira</th>
              </tr>
            </thead>
            <tbody>
              {COMIC_VOZ.map((v) => (
                <tr key={v.prefira} className="border-t border-white/10 align-top">
                  <td className="py-2 pr-4 text-white/45 line-through">{v.evite}</td>
                  <td className="sv-heavy py-2 text-[var(--sv-lime)]">{v.prefira}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

/* ---------------- 31 · Changelog (comic) ---------------- */

/** O histórico do Criativo é uma coleção de edições — cada versão, uma "issue". */
const COMIC_ISSUES = [
  { ed: "#4", tag: "v0.4.0", titulo: "Portal dos 3 multiversos", nota: "Capa nova, três universos, um gate." },
  { ed: "#3", tag: "v0.3.0", titulo: "Design System em 3 realms", nota: "Cada perfil ganhou o seu guia." },
  { ed: "#2", tag: "v0.2.0", titulo: "Spiderverse art direction", nota: "Halftone, tilt e tinta grossa." },
  { ed: "#1", tag: "v0.1.0", titulo: "Edição de estreia", nota: "O primeiro traço no papel." },
]

function CreativeChangelog() {
  return (
    <>
      <p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/70">
        Versão aqui é <strong>edição</strong>: cada lançamento é uma issue da coleção, com número,
        capa e a manchete do que mudou. Onde o _Dev lê um <code>git log</code>, o Criativo folheia a
        pilha de quadrinhos.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {COMIC_ISSUES.map((it) => (
          <Panel key={it.ed}>
            <div className="flex items-baseline justify-between">
              <span className="sv-display text-2xl text-[var(--sv-magenta)]">{it.ed}</span>
              <span className="sv-heavy rounded border-2 border-black bg-[var(--sv-ink)] px-2 py-0.5 text-[10px] text-[var(--sv-yellow)]">
                {it.tag}
              </span>
            </div>
            <p className="sv-heavy mt-2 text-sm uppercase text-[var(--sv-cyan)]">{it.titulo}</p>
            <p className="mt-1 text-xs leading-snug text-white/60">{it.nota}</p>
          </Panel>
        ))}
      </div>
    </>
  )
}
