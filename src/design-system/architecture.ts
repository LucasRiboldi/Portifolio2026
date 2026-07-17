import type { RealmId } from "@/lib/realms"

/**
 * A arquitetura de referência do Design System — fonte única.
 *
 * As 16 seções seguem a espinha dorsal que Material, Carbon, Polaris e Ant
 * Design convergiram: do porquê (Introduction) ao histórico (Changelog),
 * passando por fundações, tokens, componentes, patterns e templates.
 *
 * Uma decisão importante: este índice é o MESMO nos três realms, mas cada um
 * o preenche na sua língua. O esqueleto é compartilhado; a carne, não. É o
 * que permite comparar "Motion no Criativo" com "Motion no Anfitrião" e ver
 * que um usa spring e o outro não usa nada — a comparação só existe porque a
 * estrutura é comum.
 *
 * `status` é deliberadamente honesto. Um índice que promete 16 seções e
 * entrega 9 é pior que um que admite o que falta: a sidebar mostra o que
 * está pronto, em obra e planejado, e o leitor não perde tempo clicando em
 * promessa.
 */

export type SectionStatus = "ready" | "wip" | "planned"

export interface DsSection {
  /** Âncora no documento do realm. */
  id: string
  /** Numeração fixa: é como as seções são citadas entre pessoas. */
  n: string
  label: string
  /** Uma linha sobre o que a seção responde. */
  desc: string
  status: SectionStatus
  /** Realms onde a seção já tem conteúdo. Vazio = nenhum ainda. */
  em: RealmId[]
}

export const DS_ARCHITECTURE: DsSection[] = [
  {
    id: "introduction",
    n: "01",
    label: "Introduction",
    desc: "Objetivo, filosofia, princípios, como usar, contribuição e versionamento.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "foundations",
    n: "02",
    label: "Foundations",
    desc: "As decisões visuais de base: cor, tipo, espaço, forma, elevação.",
    status: "ready",
    em: ["creative"],
  },
  {
    id: "tokens",
    n: "03",
    label: "Design Tokens",
    desc: "Os valores atômicos em tabela: HEX, RGB, HSL, CSS var e Tailwind.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "typography",
    n: "04",
    label: "Typography",
    desc: "A escala completa — família, peso, corpo, entrelinha e tracking.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "colors",
    n: "05",
    label: "Colors",
    desc: "Paletas, superfícies, estados e contraste medido sobre o fundo real.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "grid",
    n: "06",
    label: "Grid",
    desc: "Container, colunas, margens, medianiz e breakpoints.",
    status: "ready",
    em: ["creative", "arcane"],
  },
  {
    id: "iconography",
    n: "07",
    label: "Iconography",
    desc: "Grade, tamanhos, peso e área segura dos ícones.",
    status: "planned",
    em: [],
  },
  {
    id: "motion",
    n: "08",
    label: "Motion",
    desc: "Duração, curva e gesto — cada entrada toca com as curvas do realm.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "components",
    n: "09",
    label: "Components",
    desc: "A biblioteca: variantes, estados, anatomia, código e acessibilidade.",
    status: "wip",
    em: ["creative", "developer"],
  },
  {
    id: "patterns",
    n: "10",
    label: "Patterns",
    desc: "Composições resolvidas: login, busca, multi-step, FAQ.",
    status: "wip",
    em: ["creative"],
  },
  {
    id: "templates",
    n: "11",
    label: "Templates",
    desc: "Páginas inteiras montadas com o kit.",
    status: "ready",
    em: ["creative"],
  },
  {
    id: "accessibility",
    n: "12",
    label: "Accessibility",
    desc: "WCAG 2.2, contraste, foco, teclado, leitor de tela e motion reduzido.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "content-design",
    n: "13",
    label: "Content Design",
    desc: "Microcopy: botões, erros, vazios e voz de cada realm.",
    status: "planned",
    em: [],
  },
  {
    id: "brand",
    n: "14",
    label: "Brand",
    desc: "Logo, área de proteção, redução e aplicações.",
    status: "wip",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "resources",
    n: "15",
    label: "Resources",
    desc: "Downloads: SVG, JSON de tokens, config do Tailwind, Storybook.",
    status: "wip",
    em: ["creative"],
  },
  {
    id: "changelog",
    n: "16",
    label: "Changelog",
    desc: "Histórico de versões: o que mudou, quando e por quê.",
    status: "planned",
    em: [],
  },
]

export const STATUS_LABEL: Record<SectionStatus, string> = {
  ready: "pronto",
  wip: "em obra",
  planned: "planejado",
}

/** O índice como o realm o vê: o que já tem conteúdo lá. */
export function sectionsFor(realm: RealmId) {
  return DS_ARCHITECTURE.map(s => ({
    ...s,
    disponivel: s.em.includes(realm),
  }))
}
