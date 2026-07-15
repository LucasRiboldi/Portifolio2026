/**
 * Catálogo de páginas editáveis (Fase 3). Cada página tem um `key` estável e
 * textos-padrão (kicker/title/highlight/subtitle) que servem de fallback quando
 * não há linha em `page_content`. Agrupado por realm para a sidebar do admin.
 *
 * Mapeamento por tipo de cabeçalho:
 *   ComicHeader (creative): kicker · title · highlight · subtitle
 *   DevHeader   (dev):      kicker=fn · title · highlight=accent · subtitle
 *   ProphetHeader (prophet):kicker · title=headline · subtitle=standfirst
 */

export interface PageDefaults {
  kicker: string
  title: string
  highlight: string
  subtitle: string
}

export interface PageEntry extends PageDefaults {
  key: string
  label: string
  /** rótulo do campo "highlight" no admin (varia por realm) */
  highlightLabel: string
  /** rótulo do campo "kicker" no admin (varia por realm) */
  kickerLabel: string
}

export interface PageGroup {
  realm: "creative" | "dev" | "prophet"
  section: string
  pages: PageEntry[]
}

const cx = (kickerLabel: string, highlightLabel: string) => ({ kickerLabel, highlightLabel })

export const PAGE_GROUPS: PageGroup[] = [
  {
    realm: "creative",
    section: "Páginas — Creative",
    pages: [
      { key: "portfolio", label: "Portfólio", kicker: "Terra-65 · O Abutre", title: "Portfólio", highlight: "criativo", subtitle: "Design, código, arte e imagem — rascunhado à mão, como Da Vinci.", ...cx("Kicker", "Destaque") },
      { key: "tools", label: "Ferramentas", kicker: "Terra-50101 · Mumbattan", title: "Ferramentas", highlight: "criadas", subtitle: "Web Apps, CLIs, extensões, bots, scripts e plugins que construí.", ...cx("Kicker", "Destaque") },
      { key: "skills", label: "Skills", kicker: "Arsenal · Claude Code", title: "Skills", highlight: "instaladas", subtitle: "As skills que uso no meu Claude Code — agrupadas por tema, com o comando de cada uma pronto para copiar.", ...cx("Kicker", "Destaque") },
      { key: "blog", label: "Blog", kicker: "Edição especial", title: "Blog", highlight: "noir", subtitle: "Artigos sobre design, código e experimentos.", ...cx("Kicker", "Destaque") },
    ],
  },
  {
    realm: "dev",
    section: "Páginas — Dev",
    pages: [
      { key: "dev.projetos", label: "Projetos", kicker: "projects.map", title: "Projetos", highlight: "// repositórios", subtitle: "Cada projeto com stack, status e link direto para o repositório.", ...cx("Função (fn)", "Comentário") },
      { key: "dev.laboratorio", label: "Laboratório", kicker: "lab.run", title: "Laboratório", highlight: "// experimentos", subtitle: "Testes de código, componentes, APIs e modelos de IA — protótipos em andamento.", ...cx("Função (fn)", "Comentário") },
      { key: "dev.ferramentas", label: "Ferramentas", kicker: "tools.list", title: "Ferramentas", highlight: "// utilitários", subtitle: "Pequenos utilitários que construí para o dia a dia.", ...cx("Função (fn)", "Comentário") },
      { key: "dev.devlogs", label: "DevLogs", kicker: "git.log", title: "DevLogs", highlight: "// diário técnico", subtitle: "Registro cronológico do desenvolvimento, decisões técnicas e problemas resolvidos.", ...cx("Função (fn)", "Comentário") },
      { key: "dev.ideias", label: "Ideias", kicker: "backlog.next", title: "Ideias", highlight: "// backlog", subtitle: "Conceitos, MVPs e experimentos futuros esperando a vez.", ...cx("Função (fn)", "Comentário") },
      { key: "dev.codigo", label: "Código", kicker: "snippets.export", title: "Código", highlight: "// reutilizáveis", subtitle: "Snippets, componentes reutilizáveis, templates e boilerplates.", ...cx("Função (fn)", "Comentário") },
      { key: "dev.wiki", label: "Wiki", kicker: "wiki.open", title: "Wiki", highlight: "// docs", subtitle: "Documentação técnica, anotações, cheatsheets e referências organizadas.", ...cx("Função (fn)", "Comentário") },
    ],
  },
  {
    realm: "prophet",
    section: "Páginas — Daily Prophet",
    pages: [
      { key: "prophet.redacao", label: "A Redação", kicker: "A Redação", title: "Quem assina esta folha", highlight: "", subtitle: "", ...cx("Editoria", "—") },
      { key: "prophet.oficina", label: "Oficina do Inventor", kicker: "Oficina do Inventor", title: "Como se forja um jogo", highlight: "", subtitle: "Tutoriais de criação de boardgames, card games e mecânicas — do rascunho ao protótipo na mesa.", ...cx("Editoria", "—") },
      { key: "prophet.mecanicas", label: "Caderno das Mecânicas", kicker: "Caderno das Mecânicas", title: "O léxico do inventor", highlight: "", subtitle: "Worker placement, deck building, draft, cooperação e outras engrenagens explicadas sem misticismo.", ...cx("Editoria", "—") },
      { key: "prophet.laboratorio", label: "Laboratório", kicker: "Laboratório", title: "Na bancada do inventor", highlight: "", subtitle: "Protótipos, projetos em andamento, playtests e experimentos de mesa.", ...cx("Editoria", "—") },
      { key: "prophet.imprensa", label: "Imprensa do Inventor", kicker: "Imprensa do Inventor", title: "Para imprimir e jogar", highlight: "", subtitle: "Materiais faça-você-mesmo, print & play, cartas, tabuleiros e recursos para download.", ...cx("Editoria", "—") },
    ],
  },
]

const INDEX = new Map<string, PageEntry>()
for (const g of PAGE_GROUPS) for (const p of g.pages) INDEX.set(p.key, p)

export function getPageEntry(key: string): PageEntry | undefined {
  return INDEX.get(key)
}

export function pageDefaults(key: string): PageDefaults {
  const e = INDEX.get(key)
  return e
    ? { kicker: e.kicker, title: e.title, highlight: e.highlight, subtitle: e.subtitle }
    : { kicker: "", title: "", highlight: "", subtitle: "" }
}
