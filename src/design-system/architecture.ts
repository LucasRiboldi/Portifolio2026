import type { RealmId } from "@/lib/realms"

/**
 * A arquitetura de referência do Design System — fonte única.
 *
 * As 16 seções canônicas seguem a espinha dorsal que Material, Carbon, Polaris
 * e Ant Design convergiram: do porquê (Introduction) ao histórico (Changelog),
 * passando por fundações, tokens, componentes, patterns e templates. As quatro
 * finais (17–20) são extras deste projeto, não da convenção.
 *
 * A numeração aqui é a ÚNICA fonte: um capítulo no corpo de um realm não
 * inventa o próprio número. Se ele aprofunda uma seção, entra como `subs` da
 * mãe e herda o prefixo (04 → 04.1). Foi assim que se corrigiu o Anfitrião,
 * que rodava uma segunda sequência 01–11 em paralelo e colidia com esta em
 * nove pontos.
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

/**
 * Uma matéria dentro de um caderno.
 *
 * Existe porque um realm pode aprofundar uma seção canônica em capítulos
 * próprios — o Anfitrião abre Typography em "manchete" e "capitular", o
 * Criativo abre Components em seis galerias. Antes esses capítulos viviam no
 * corpo com uma numeração paralela inventada, colidindo com a canônica e
 * ficando de fora do índice. Agora pendem da seção-mãe: `04.1` diz de onde
 * vem, e a sidebar consegue mostrá-los.
 *
 * `em` é por sub-seção, não herdado: o Anfitrião abre Motion em "o silêncio",
 * o _Dev não abre.
 */
export interface DsSubSection {
  /** Âncora no documento. */
  id: string
  /** Derivada da mãe: "04.1", "04.2". */
  n: string
  label: string
  /** Realms onde esta matéria existe. */
  em: RealmId[]
}

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
  /** Capítulos que um realm pendura sob esta seção. */
  subs?: DsSubSection[]
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
    em: ["creative", "developer", "arcane"],
    subs: [{ id: "filetes", n: "02.1", label: "Filetes", em: ["arcane"] }],
  },
  {
    id: "tokens",
    n: "03",
    label: "Design Tokens",
    desc: "Os valores atômicos em tabela: HEX, RGB, HSL, CSS var e Tailwind.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
    subs: [
      { id: "elevacao", n: "03.1", label: "Elevação & Raio", em: ["developer"] },
      { id: "tokens-catalogo", n: "03.1", label: "Catálogo completo", em: ["creative"] },
    ],
  },
  {
    id: "typography",
    n: "04",
    label: "Typography",
    desc: "A escala completa — família, peso, corpo, entrelinha e tracking.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
    subs: [
      { id: "manchete", n: "04.1", label: "Hierarquia da manchete", em: ["arcane"] },
      { id: "capitular", n: "04.2", label: "Capitular", em: ["arcane"] },
    ],
  },
  {
    id: "colors",
    n: "05",
    label: "Colors",
    desc: "Paletas, superfícies, estados e contraste medido sobre o fundo real.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
    subs: [{ id: "sintaxe", n: "05.1", label: "A paleta é um tema de sintaxe", em: ["developer"] }],
  },
  {
    id: "grid",
    n: "06",
    label: "Grid",
    desc: "Container, colunas, margens, medianiz e breakpoints.",
    status: "ready",
    em: ["creative", "arcane", "developer"],
  },
  {
    id: "iconography",
    n: "07",
    label: "Iconography",
    desc: "Grade, tamanhos, peso e área segura dos ícones.",
    status: "wip",
    em: ["developer", "creative", "arcane"],
  },
  {
    id: "motion",
    n: "08",
    label: "Motion",
    desc: "Duração, curva e gesto — cada entrada toca com as curvas do realm.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
    subs: [
      { id: "silencio", n: "08.1", label: "O silêncio", em: ["arcane"] },
      { id: "motion-ds", n: "08.1", label: "Motion (catálogo)", em: ["creative"] },
      { id: "motion-inventario", n: "08.2", label: "Inventário do movimento", em: ["developer"] },
    ],
  },
  {
    id: "components",
    n: "09",
    label: "Components",
    desc: "A biblioteca: variantes, estados, anatomia, código e acessibilidade.",
    status: "wip",
    em: ["creative", "developer", "arcane"],
    subs: [
      { id: "botoes", n: "09.1", label: "Botões", em: ["developer"] },
      { id: "inputs", n: "09.2", label: "Inputs & Forms", em: ["developer"] },
      { id: "selecao", n: "09.3", label: "Seleção", em: ["developer"] },
      { id: "data-display", n: "09.4", label: "Data Display", em: ["developer"] },
      { id: "overlays", n: "09.5", label: "Overlays", em: ["developer"] },
      { id: "feedback", n: "09.6", label: "Feedback", em: ["developer"] },
      { id: "terminal", n: "09.7", label: "Terminal", em: ["developer"] },
      { id: "codigo", n: "09.8", label: "Código & diff", em: ["developer"] },
      { id: "estados-projeto", n: "09.9", label: "Estados de projeto", em: ["developer"] },
      { id: "cartoes", n: "09.10", label: "Cartões, tags e números", em: ["developer"] },
      { id: "vazio", n: "09.11", label: "Vazio", em: ["developer"] },
      { id: "navegacao", n: "09.12", label: "Navegação · topo e dock", em: ["developer"] },
      { id: "bloco-codigo", n: "09.13", label: "Bloco de código", em: ["developer"] },
      { id: "primitivas", n: "09.14", label: "Primitivas de página", em: ["developer"] },
      { id: "kit", n: "09.15", label: "UI Kit", em: ["developer"] },
      { id: "botoes", n: "09.1", label: "Botões", em: ["creative"] },
      { id: "inputs", n: "09.2", label: "Inputs & Forms", em: ["creative"] },
      { id: "selecao", n: "09.3", label: "Seleção", em: ["creative"] },
      { id: "data-display", n: "09.4", label: "Data Display", em: ["creative"] },
      { id: "overlays", n: "09.5", label: "Overlays", em: ["creative"] },
      { id: "feedback", n: "09.6", label: "Feedback", em: ["creative"] },
      { id: "dimensoes", n: "09.7", label: "As dimensões", em: ["creative"] },
      { id: "superficies", n: "09.8", label: "Superfícies e texturas", em: ["creative"] },
      { id: "anomalias", n: "09.9", label: "Anomalias", em: ["creative"] },
      { id: "figura", n: "09.1", label: "A gravura e a legenda", em: ["arcane"] },
      { id: "caixas", n: "09.2", label: "Caixas, olho e breves", em: ["arcane"] },
      { id: "classificados", n: "09.3", label: "Classificados", em: ["arcane"] },
      { id: "reportagens", n: "09.4", label: "Grade de reportagens", em: ["arcane"] },
      { id: "editorial", n: "09.5", label: "O editorial", em: ["arcane"] },
      { id: "servico", n: "09.6", label: "Barra de serviço", em: ["arcane"] },
      { id: "grafico", n: "09.7", label: "Gravura de dados", em: ["arcane"] },
      { id: "marcas", n: "09.8", label: "Carimbo, verbete e pé", em: ["arcane"] },
      { id: "botoes", n: "09.9", label: "Botões", em: ["arcane"] },
      { id: "formulario", n: "09.10", label: "O formulário impresso", em: ["arcane"] },
      { id: "selos", n: "09.11", label: "Selos, carimbos e assinaturas", em: ["arcane"] },
      { id: "letras", n: "09.12", label: "Letras e marcadores", em: ["arcane"] },
      { id: "prensa", n: "09.13", label: "O movimento da prensa", em: ["arcane"] },
      { id: "kit", n: "09.14", label: "UI Kit", em: ["arcane"] },
    ],
  },
  {
    id: "patterns",
    n: "10",
    label: "Patterns",
    desc: "Composições resolvidas: login, busca, multi-step, FAQ.",
    status: "wip",
    em: ["creative", "developer", "arcane"],
    subs: [
      { id: "pattern-login", n: "10.1", label: "Login / Auth", em: ["developer"] },
      { id: "pattern-busca", n: "10.2", label: "Busca & filtros", em: ["developer"] },
      { id: "pattern-multi-step", n: "10.3", label: "Multi-step", em: ["developer"] },
      { id: "pattern-faq", n: "10.4", label: "FAQ", em: ["developer"] },
      { id: "patterns-cmdk", n: "10.5", label: "Command palette", em: ["developer"] },
      { id: "devlog", n: "10.6", label: "Devlog", em: ["developer"] },
      { id: "pattern-login", n: "10.1", label: "Login / Auth", em: ["creative"] },
      { id: "pattern-busca", n: "10.2", label: "Busca & filtros", em: ["creative"] },
      { id: "pattern-multi-step", n: "10.3", label: "Multi-step", em: ["creative"] },
      { id: "pattern-faq", n: "10.4", label: "FAQ", em: ["creative"] },
    ],
  },
  {
    id: "templates",
    n: "11",
    label: "Templates",
    desc: "Páginas inteiras montadas com o kit.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
    subs: [
      { id: "tpl-landing", n: "11.1", label: "Landing", em: ["developer"] },
      { id: "tpl-dashboard", n: "11.2", label: "Dashboard", em: ["developer"] },
      { id: "tpl-artigo", n: "11.3", label: "Artigo", em: ["developer"] },
      { id: "tpl-pricing", n: "11.4", label: "Pricing", em: ["developer"] },
      { id: "tpl-perfil", n: "11.5", label: "Perfil", em: ["developer"] },
      { id: "tpl-docs", n: "11.6", label: "Documentação", em: ["developer"] },
      { id: "tpl-changelog", n: "11.7", label: "Changelog", em: ["developer"] },
      { id: "tpl-coming-soon", n: "11.8", label: "Coming soon", em: ["developer"] },
      { id: "templates-routes", n: "11.9", label: "Lista de rotas", em: ["developer"] },
      { id: "tpl-landing", n: "11.1", label: "Landing", em: ["creative"] },
      { id: "tpl-dashboard", n: "11.2", label: "Dashboard", em: ["creative"] },
      { id: "tpl-artigo", n: "11.3", label: "Artigo", em: ["creative"] },
      { id: "tpl-pricing", n: "11.4", label: "Pricing", em: ["creative"] },
      { id: "tpl-perfil", n: "11.5", label: "Perfil", em: ["creative"] },
      { id: "tpl-docs", n: "11.6", label: "Documentação", em: ["creative"] },
      { id: "tpl-changelog", n: "11.7", label: "Changelog", em: ["creative"] },
      { id: "tpl-coming-soon", n: "11.8", label: "Coming soon", em: ["creative"] },
    ],
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
    status: "wip",
    em: ["developer", "creative", "arcane"],
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
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "changelog",
    n: "16",
    label: "Changelog",
    desc: "Histórico de versões: o que mudou, quando e por quê.",
    status: "wip",
    em: ["developer", "creative", "arcane"],
  },
  // ---- Extras: capítulos que existem no corpo mas ficavam fora do índice.
  // Creative e developer têm os dois um capítulo com o mesmo id — listá-los
  // aqui equaliza os dois sumários.
  {
    id: "secoes",
    n: "17",
    label: "Seções de página",
    desc: "Os blocos que montam uma página: hero, faixa de métricas, CTA.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
    subs: [
      { id: "cabecalho", n: "17.1", label: "O cabeçalho e o nameplate", em: ["arcane"] },
      { id: "expediente", n: "17.2", label: "Expediente, fólio e índice", em: ["arcane"] },
    ],
  },
  {
    id: "retro-os",
    n: "18",
    label: "Retro OS · Temas",
    desc: "Variações de tema — o SO retrô do Criativo, os temas de terminal do _Dev.",
    status: "ready",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "lab",
    n: "19",
    label: "Lab",
    desc: "Experimentos: ferramentas internas antes de virarem componente.",
    status: "wip",
    em: ["creative", "developer", "arcane"],
  },
  {
    id: "documentacao",
    n: "20",
    label: "Documentação",
    desc: "Ponteiros para o código e os docs reais, não prosa duplicada.",
    status: "wip",
    em: ["creative", "developer", "arcane"],
  },
]

export const STATUS_LABEL: Record<SectionStatus, string> = {
  ready: "pronto",
  wip: "em obra",
  planned: "planejado",
}

/**
 * O índice como o realm o vê: o que já tem conteúdo lá.
 *
 * As sub-seções são filtradas pelo mesmo critério das mães — um realm que não
 * abre a seção em matérias recebe `subs: []` e a sidebar não desenha nível
 * nenhum. Uma sub de seção indisponível nunca aparece, mesmo que declare `em`:
 * matéria não se lê sem o caderno.
 */
export function sectionsFor(realm: RealmId) {
  return DS_ARCHITECTURE.map(s => {
    const disponivel = s.em.includes(realm)
    return {
      ...s,
      disponivel,
      subs: disponivel ? (s.subs ?? []).filter(sub => sub.em.includes(realm)) : [],
    }
  })
}
