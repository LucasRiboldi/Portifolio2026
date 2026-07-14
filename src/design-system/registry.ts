/**
 * REGISTRY — taxonomia completa do Design System.
 * ------------------------------------------------------------
 * Fonte de dados única que descreve TODAS as áreas, componentes,
 * variantes e estados previstos. As páginas de /design-system
 * renderizam a partir daqui, então adicionar um item = adicionar
 * uma linha (nunca editar layout de página).
 *
 * status:
 *   "ready"    → implementado e documentado
 *   "wip"      → em desenvolvimento (Fase 2+)
 *   "planned"  → previsto no roadmap
 */

export type ItemStatus = "ready" | "wip" | "planned"

export interface DsComponent {
  name: string
  variants?: string[]
  states?: string[]
  examples?: string[]
  status: ItemStatus
}

export interface DsGroup {
  id: string
  title: string
  description: string
  items: DsComponent[]
}

/** Estados interativos canônicos (referência transversal). */
export const INTERACTIVE_STATES = [
  "Normal", "Hover", "Focus", "Active/Pressed", "Selected",
  "Disabled", "Loading", "Error", "Success", "Warning", "Info", "Visited",
] as const

/** Breakpoints de responsividade suportados. */
export const BREAKPOINTS = [
  { name: "Mobile", min: "375px" },
  { name: "Large Mobile", min: "425px" },
  { name: "Tablet", min: "768px" },
  { name: "Laptop", min: "1024px" },
  { name: "Desktop", min: "1440px" },
  { name: "Landscape", min: "— (orientação)" },
] as const

/** Critérios de acessibilidade (WCAG 2.2). */
export const A11Y_CRITERIA = [
  { name: "Contraste", note: "≥ 4.5:1 texto normal · ≥ 3:1 texto grande/ícones (WCAG 1.4.3/1.4.11)" },
  { name: "Focus Ring", note: "Sempre visível, ≥ 3:1 vs. fundo, nunca removido sem alternativa (2.4.7/2.4.11)" },
  { name: "ARIA", note: "Roles, states e properties corretos; nome acessível em todo controle" },
  { name: "Keyboard Navigation", note: "Toda ação alcançável e operável por teclado; ordem lógica (2.1.1)" },
  { name: "Skip Links", note: "Link 'pular para conteúdo' no início de cada página (2.4.1)" },
  { name: "Alt Text", note: "Texto alternativo significativo; decorativas com alt vazio (1.1.1)" },
  { name: "Leitores de tela", note: "Estados anunciados (aria-live, aria-busy, aria-invalid)" },
] as const

/* ============================================================
   FOUNDATIONS (Brand Foundation + Style Guide)
   ============================================================ */
export const FOUNDATIONS: DsGroup[] = [
  {
    id: "brand",
    title: "Brand Foundation",
    description: "Identidade visual: logo, princípios e voz do Aranhaverso.",
    items: [
      { name: "Brand Guidelines", status: "ready" },
      { name: "Logo & Marca", status: "wip" },
      { name: "Ícones", status: "wip" },
      { name: "Ilustrações", status: "planned" },
      { name: "Fotografia", status: "planned" },
      { name: "Texturas", status: "wip", examples: ["Halftone", "Ben-Day", "Grain"] },
      { name: "Backgrounds", status: "ready", examples: ["Canvas por dimensão", "Speedlines"] },
      { name: "Ícones Sociais", status: "ready" },
    ],
  },
  {
    id: "style",
    title: "Style Guide",
    description: "Regras visuais fundamentais que derivam dos tokens.",
    items: [
      { name: "Paleta de Cores", status: "ready" },
      { name: "Tipografia", status: "ready" },
      { name: "Grid System", status: "wip" },
      { name: "Espaçamento", status: "ready" },
      { name: "Border Radius", status: "ready" },
      { name: "Sombras (Elevation)", status: "ready" },
      { name: "Gradientes", status: "ready" },
    ],
  },
]

/* ============================================================
   DESIGN TOKENS — categorias
   ============================================================ */
export const TOKEN_CATEGORIES = [
  "Colors", "Typography", "Spacing", "Radius", "Shadow", "Border",
  "Motion", "Opacity", "Blur", "Z-index", "Duration", "Breakpoints",
] as const

/* ============================================================
   UI COMPONENTS
   ============================================================ */
export const COMPONENTS: DsGroup[] = [
  {
    id: "buttons",
    title: "Botões",
    description: "Ações primárias e secundárias em todos os estados.",
    items: [
      {
        name: "Button",
        variants: ["Primary", "Secondary", "Ghost", "Outlined", "Link", "FAB", "Icon Button"],
        states: ["Normal", "Hover", "Active", "Disabled", "Loading", "Focus"],
        status: "ready",
      },
    ],
  },
  {
    id: "inputs",
    title: "Inputs & Forms",
    description: "Campos de formulário com validação e máscaras BR.",
    items: [
      {
        name: "Input",
        variants: ["Text", "Email", "Password", "Textarea", "Number", "Date", "Search", "Phone", "CPF", "CEP", "Select", "Autocomplete"],
        states: ["Normal", "Hover", "Focus", "Error", "Disabled", "Readonly", "Success"],
        status: "ready",
      },
      { name: "Checkbox", states: [...INTERACTIVE_STATES], status: "wip" },
      { name: "Radio Button", states: [...INTERACTIVE_STATES], status: "wip" },
      { name: "Switch", states: [...INTERACTIVE_STATES], status: "wip" },
      { name: "Slider", states: ["Normal", "Hover", "Focus", "Disabled"], status: "planned" },
      { name: "Rating", states: ["Normal", "Hover", "Selected", "Readonly"], status: "planned" },
      { name: "Toggle", states: [...INTERACTIVE_STATES], status: "planned" },
    ],
  },
  {
    id: "data-display",
    title: "Data Display",
    description: "Chips, tags, badges, tabelas e navegação de dados.",
    items: [
      { name: "Chips", status: "wip" },
      { name: "Tags", status: "wip" },
      { name: "Badges", status: "ready" },
      { name: "Pagination", status: "planned" },
      { name: "Breadcrumb", status: "planned" },
      { name: "Tabs", status: "wip" },
      { name: "Accordion", status: "wip" },
      {
        name: "Cards",
        examples: ["Produto", "Equipe", "Notícia", "Serviço", "Blog", "Cases"],
        status: "ready",
      },
    ],
  },
  {
    id: "overlays",
    title: "Overlays",
    description: "Camadas flutuantes: modais, drawers e menus.",
    items: [
      { name: "Modals", status: "wip" },
      { name: "Drawers", status: "wip" },
      { name: "Popover", status: "planned" },
      { name: "Tooltip", status: "wip" },
      { name: "Dropdown", status: "wip" },
      { name: "Context Menu", status: "planned" },
    ],
  },
  {
    id: "navigation",
    title: "Navigation & Layout",
    description: "Estruturas de navegação e seções de página.",
    items: [
      { name: "Navbar", variants: ["Desktop", "Tablet", "Mobile", "Sticky", "Transparent"], status: "ready" },
      { name: "Sidebar", status: "ready" },
      { name: "Footer", status: "ready" },
      { name: "Hero Section", status: "ready" },
      { name: "CTA Sections", status: "wip" },
      { name: "Pricing Cards", status: "planned" },
      { name: "FAQ", status: "wip" },
      { name: "Testimonials", status: "planned" },
      { name: "Timeline", status: "planned" },
      { name: "Statistics", status: "wip" },
      { name: "Logos Grid", status: "planned" },
      { name: "Partners", status: "planned" },
      { name: "Team", status: "planned" },
      { name: "Blog Cards", status: "ready" },
      { name: "Newsletter", status: "wip" },
      { name: "Contact Form", status: "ready" },
    ],
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Comunicação de estado do sistema ao usuário.",
    items: [
      { name: "Alert", status: "wip" },
      { name: "Toast", status: "wip" },
      { name: "Snackbar", status: "planned" },
      { name: "Progress", status: "wip" },
      { name: "Loading", status: "ready" },
      { name: "Skeleton", status: "ready" },
      { name: "Empty State", status: "wip" },
      { name: "404", status: "planned" },
      { name: "500", status: "planned" },
      { name: "Offline", status: "planned" },
    ],
  },
]

/* ============================================================
   PATTERNS · TEMPLATES · MOTION
   ============================================================ */
export const PATTERNS: DsComponent[] = [
  { name: "Login / Auth", status: "planned" },
  { name: "Navegação principal", status: "ready" },
  { name: "FAQ", status: "wip" },
  { name: "Contato", status: "ready" },
  { name: "Formulários multi-step", status: "planned" },
  { name: "Busca & filtros", status: "planned" },
]

export const TEMPLATES: DsComponent[] = [
  { name: "Landing Page", status: "ready" },
  { name: "Portfólio / Grid", status: "ready" },
  { name: "Blog / Artigo", status: "wip" },
  { name: "Dashboard", status: "planned" },
  { name: "Página de erro", status: "planned" },
  { name: "Contato", status: "ready" },
]

export const MOTION_PATTERNS = [
  { name: "Pop / Tilt", token: "--ease-spring", note: "Entrada de painéis comic" },
  { name: "Dimension Swap", token: "--duration-slow", note: "Troca de dimensão do Aranhaverso" },
  { name: "Fade & Rise", token: "--ease-out", note: "Reveal de seção on-scroll" },
  { name: "Glitch", token: "--duration-fast", note: "Aberração cromática / hover disruptivo" },
] as const

/** Navegação lateral do /design-system. */
export const DS_NAV = [
  { href: "/design-system", label: "Visão Geral" },
  { href: "/design-system/foundations", label: "Foundations" },
  { href: "/design-system/tokens", label: "Design Tokens" },
  { href: "/design-system/components", label: "Componentes" },
  { href: "/design-system/patterns", label: "Patterns" },
  { href: "/design-system/templates", label: "Templates" },
  { href: "/design-system/accessibility", label: "Acessibilidade" },
  { href: "/design-system/docs", label: "Documentação" },
] as const
