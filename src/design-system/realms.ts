/**
 * DESIGN SYSTEM POR REALM — fonte única de verdade.
 * ------------------------------------------------------------
 * Cada realm é um universo visual completo. Este arquivo descreve a
 * *identidade* de cada um; `src/lib/realms.ts` continua sendo o registro de
 * navegação/travessia (rota, glifo, tema da transição). Os dois se ligam pelo
 * `RealmId`.
 *
 * O que é COMPARTILHADO (escala tipográfica, spacing, z-index, breakpoints,
 * durações) vive em `./tokens.ts` e NÃO é repetido aqui — repetir três vezes
 * é como a inconsistência começa.
 *
 * O que é POR REALM está aqui: paleta, tipografia, elevação, raio, grelha,
 * assinatura de movimento e o kit de componentes.
 *
 * Renderizado por /design-system/realms/[realm], que exibe cada realm na sua
 * própria linguagem visual aplicando `scope` ao preview.
 */

import type { RealmId } from "@/lib/realms"

export interface Swatch {
  name: string
  /** Var CSS que o código deve usar — nunca o hex cru. */
  token: string
  value: string
  role: string
}

export interface TypeRole {
  role: string
  family: string
  token: string
  /** Classe utilitária que aplica o papel. */
  className: string
  usage: string
}

export interface Spec {
  name: string
  value: string
  use: string
}

export interface KitItem {
  name: string
  /** De onde importar. Vazio = é só classe CSS. */
  from?: string
  className?: string
  variants?: string
  note: string
}

export interface KitGroup {
  group: string
  items: KitItem[]
}

export interface RealmDesign {
  id: RealmId
  label: string
  tagline: string
  /**
   * Classe que ativa o CSS do realm. Os previews precisam dela porque as
   * folhas dos realms são escopadas — sem isso o preview sai com a cara do
   * realm errado.
   */
  scope: string
  css: string[]
  /** O style guide em prosa: o porquê antes do quê. */
  principles: string[]
  palette: Swatch[]
  surfaces: Swatch[]
  typography: TypeRole[]
  elevation: Spec[]
  radius: Spec[]
  grid: Spec[]
  motion: Spec[]
  kit: KitGroup[]
  logo: string
}

/* ============================================================
   CREATIVE — Aranhaverso. Tinta grossa, halftone, tudo torto.
   ============================================================ */

const creative: RealmDesign = {
  id: "creative",
  label: "O Criativo",
  tagline: "Multiverso comic — tinta grossa, halftone e nada perfeitamente reto.",
  scope: "",
  css: [
    "spiderverse.css",
    "spiderverse-dimensions.css",
    "sv-effects.css",
    "sv-artdirection.css",
    "sv-punk.css",
    "sv-surfaces.css",
  ],
  principles: [
    "Contorno preto sempre. É o que segura a página inteira — sem ele a cor satura e some.",
    "Nada alinhado a 0°. Os tilts (.sv-tilt-1/2/3) existem para o layout parecer colado à mão.",
    "A sombra é dura, não difusa: deslocamento sólido em preto, nunca blur. Isso é impressão, não elevação de UI.",
    "Cor é acento, não fundo. O papel é escuro; a saturação entra em pedaços pequenos.",
    "Halftone e grão são textura de impressão — decoram, mas nunca competem com o texto.",
  ],
  palette: [
    { name: "Magenta", token: "--sv-magenta", value: "#ff2d95", role: "Acento primário, destaque, hover" },
    { name: "Cyan", token: "--sv-cyan", value: "#00e5ff", role: "Acento secundário, foco, links" },
    { name: "Yellow", token: "--sv-yellow", value: "#ffe600", role: "Chamada para ação, números" },
    { name: "Orange", token: "--sv-orange", value: "#ff5a1f", role: "Alerta, calor, gradientes" },
    { name: "Violet", token: "--sv-violet", value: "#7b2ff7", role: "Profundidade, gradientes" },
    { name: "Lime", token: "--sv-lime", value: "#b6ff00", role: "Sucesso, carimbos" },
  ],
  surfaces: [
    { name: "Ink", token: "--sv-ink", value: "#0a0612", role: "Fundo dominante" },
    { name: "Ink 2", token: "--sv-ink-2", value: "#140a24", role: "Superfície elevada, painéis" },
    { name: "Paper", token: "--sv-paper", value: "#fff8e7", role: "Texto e superfícies claras" },
  ],
  typography: [
    {
      role: "Display",
      family: "Bangers",
      token: "--font-display",
      className: "sv-display",
      usage: "Títulos, onomatopeias, números grandes. Sempre em CAIXA ALTA.",
    },
    {
      role: "Heavy",
      family: "Archivo Black",
      token: "--font-heavy",
      className: "sv-heavy",
      usage: "Rótulos, kickers, texto de apoio em caixa alta. Peso sem grito.",
    },
    {
      role: "Body",
      family: "Geist",
      token: "--font-sans",
      className: "font-sans",
      usage: "Texto corrido. O único papel que não é caixa alta.",
    },
    {
      role: "Mono",
      family: "JetBrains Mono / SF Mono",
      token: "--font-mono",
      className: "font-mono",
      usage: "Código, tokens, valores.",
    },
  ],
  elevation: [
    { name: "elevation.1", value: "2px 2px 0 0 #000", use: "Stickers, chips" },
    { name: "elevation.2", value: "4px 4px 0 0 #000", use: "Botões, painéis padrão" },
    { name: "elevation.3", value: "6px 6px 0 0 #000", use: "Painéis em destaque, FAB" },
    { name: "elevation.4", value: "8px 8px 0 0 #000", use: "Hero, overlays" },
    { name: "elevation.5", value: "10px 10px 0 0 #000", use: "Modal" },
  ],
  radius: [
    { name: "radius.none", value: "0", use: "Painéis recortados, scraps" },
    { name: "radius.md", value: "0.5rem", use: "Botões, cards — o padrão" },
    { name: "radius.full", value: "9999px", use: "Pílulas, chips, FAB" },
  ],
  grid: [
    { name: "Container", value: "max-w-container", use: "Largura máxima do conteúdo (.sv-canvas)" },
    { name: "Bento", value: "grid-cols-2 md:grid-cols-4", use: "Home — blocos de 1, 2 ou 4 colunas" },
    { name: "Cards", value: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", use: "Listagens (portfólio, galeria)" },
    { name: "Gutter", value: "gap-5 md:gap-6", use: "Respiro entre blocos" },
  ],
  motion: [
    { name: "pop", value: "spring · stiffness 260 · damping 18", use: "Entrada de cards — o salto de quadrinho" },
    { name: "heroPop", value: "spring · sem fade", use: "Elemento LCP: só transform, nunca opacity 0" },
    { name: "tilt no hover", value: "-translate-y-1 rotate-[-2deg]", use: "Botões e cards ganham vida ao passar o mouse" },
    { name: "ease.spring", value: "cubic-bezier(0.34,1.56,0.64,1)", use: "Padrão do realm — sempre passa do ponto e volta" },
  ],
  kit: [
    {
      group: "Botões",
      items: [
        {
          name: "SvButton",
          from: "@/components/ui/sv-button",
          variants: "primary · secondary · ghost · outline · link · fab · icon",
          note: "Tamanhos sm/md/lg, formatos box/pill. Cor via prop color.",
        },
      ],
    },
    {
      group: "Inputs",
      items: [
        { name: "SvInput", from: "@/components/ui/sv-input", note: "Com máscaras (masks) e estados de erro." },
        { name: "SvTextarea", from: "@/components/ui/sv-input", note: "Texto longo." },
        { name: "SvSelect", from: "@/components/ui/sv-input", note: "Seleção única." },
        { name: "SvCheckbox · SvRadio · SvSwitch", from: "@/components/ui/sv-choice", note: "Escolha binária e múltipla." },
        { name: "SvSlider · SvRating", from: "@/components/ui/sv-choice", note: "Faixa e nota." },
      ],
    },
    {
      group: "Chips & navegação",
      items: [
        { name: "SvChip", from: "@/components/ui/sv-data", note: "Pílula dismissível, cor configurável." },
        { name: "SvTag", from: "@/components/ui/sv-data", note: "Rótulo estático." },
        { name: "SvTabs", from: "@/components/ui/sv-data", note: "Sticker marca a aba ativa. role=tablist." },
        { name: "SvBreadcrumb · SvPagination", from: "@/components/ui/sv-data", note: "Navegação secundária." },
        { name: "SvAccordion", from: "@/components/ui/sv-data", note: "Disclosure com spring." },
      ],
    },
    {
      group: "Feedback",
      items: [
        { name: "SvAlert", from: "@/components/ui/sv-feedback", note: "Mensagem inline." },
        { name: "SvProgress", from: "@/components/ui/sv-feedback", note: "Barra de progresso." },
        { name: "SvEmptyState", from: "@/components/ui/sv-feedback", note: "Vazio com propósito." },
        { name: "SvToaster · useToast", from: "@/components/ui/sv-feedback", note: "Notificação efêmera." },
      ],
    },
    {
      group: "Superfícies & decoração",
      items: [
        { name: ".sv-panel", className: "sv-panel", variants: "cyan · lime · violet · yellow", note: "Painel com contorno e sombra dura." },
        { name: ".sv-sticker", className: "sv-sticker", variants: "cyan · lime · magenta · orange · violet", note: "Etiqueta colada." },
        { name: ".sv-bubble", className: "sv-bubble", variants: "spiky · thought", note: "Balão de fala." },
        { name: ".sv-onoma", className: "sv-onoma", variants: "cyan · lime · magenta · orange · violet · pop", note: "Onomatopeia." },
        { name: ".sv-tilt-1/2/3", className: "sv-tilt-1", note: "Inclinação — o layout nunca é reto." },
        { name: ".sv-dots · .sv-lines · .sv-grain", className: "sv-dots", note: "Texturas de impressão." },
        { name: ".sv-glitch · .sv-rainbow", className: "sv-glitch", note: "Efeitos de texto." },
      ],
    },
  ],
  logo: "RealmLogoMini com aberração cromática (mundos paralelos). Classes .rl / .rl-cri em realm-logo.css.",
}

/* ============================================================
   DEVELOPER — Dracula. Terminal, monoespaçado, sem ornamento.
   ============================================================ */

const developer: RealmDesign = {
  id: "developer",
  label: "O _Dev",
  tagline: "Dracula — terminal, monoespaçado e nenhum ornamento que não informe.",
  scope: "dracula",
  css: ["dracula.css", "dev-mode.css", "sober.css"],
  principles: [
    "Monoespaçado é a voz. Se o texto não é código, ainda assim é lido por quem lê código.",
    "Contraste vem do Dracula, não de invenção: a paleta é canônica e não se ajusta a gosto.",
    "Sombra é discreta e difusa — o oposto do Creative. Aqui a profundidade é sutil, não impressa.",
    "Cor carrega significado, não decoração: verde é sucesso, vermelho é erro, comentário é apagado.",
    "Sem tilt, sem grão, sem halftone. O alinhamento é reto porque a leitura é técnica.",
  ],
  palette: [
    { name: "Green", token: "--d-green", value: "#50fa7b", role: "Sucesso, destaque primário, prompt" },
    { name: "Cyan", token: "--d-cyan", value: "#8be9fd", role: "Links, tipos, informação" },
    { name: "Purple", token: "--d-purple", value: "#bd93f9", role: "Palavras-chave, acento" },
    { name: "Pink", token: "--d-pink", value: "#ff79c6", role: "Operadores, funções" },
    { name: "Orange", token: "--d-orange", value: "#ffb86c", role: "Parâmetros, alerta" },
    { name: "Yellow", token: "--d-yellow", value: "#f1fa8c", role: "Strings" },
    { name: "Red", token: "--d-red", value: "#ff5555", role: "Erro, destrutivo" },
  ],
  surfaces: [
    { name: "Background", token: "--d-bg", value: "#282a36", role: "Fundo dominante" },
    { name: "Background 2", token: "--d-bg-2", value: "#21222c", role: "Superfície recuada, topbar" },
    { name: "Current Line", token: "--d-current", value: "#44475a", role: "Bordas, seleção, divisores" },
    { name: "Foreground", token: "--d-fg", value: "#f8f8f2", role: "Texto principal" },
    { name: "Comment", token: "--d-comment", value: "#6272a4", role: "Texto secundário, metadados" },
  ],
  typography: [
    {
      role: "Mono",
      family: "JetBrains Mono",
      token: "--d-mono",
      className: "font-mono",
      usage: "Tudo. Títulos, corpo, rótulos — o realm inteiro é monoespaçado.",
    },
    {
      role: "Título",
      family: "JetBrains Mono",
      token: "--d-mono",
      className: "dv-title",
      usage: "Hero e títulos de página. Peso, não fonte diferente.",
    },
    {
      role: "Seção",
      family: "JetBrains Mono",
      token: "--d-mono",
      className: "dv-section-title",
      usage: "Divisor de seção, com marca de comentário.",
    },
  ],
  elevation: [
    { name: "card", value: "nenhuma — borda 1px --d-current", use: "Cards: separação por borda, não por sombra" },
    { name: "dock", value: "0 6px 24px rgba(0,0,0,0.45)", use: "Dock flutuante e overlays" },
  ],
  radius: [
    { name: "--d-radius", value: "12px", use: "Cards e superfícies — o padrão do realm" },
    { name: "tag/chip", value: "999px", use: "Tags e pílulas" },
    { name: "tab", value: "9px", use: "Abas" },
    { name: "code", value: "8px", use: "Blocos de código e snippets" },
  ],
  grid: [
    { name: ".dv-container", value: "max-width 1120px", use: "Largura do conteúdo (padding inferior p/ o dock)" },
    { name: ".dv-grid", value: "repeat(auto-fill, minmax(280px, 1fr))", use: "Cards — colunas fluidas, sem breakpoint" },
    { name: ".dv-stats", value: "grid de contadores", use: "Números da home" },
    { name: "Gutter", value: "1rem", use: "Respiro entre cards" },
  ],
  motion: [
    { name: "caret", value: "blink em passos", use: "Cursor do terminal — a assinatura do realm" },
    { name: "hover de card", value: "borda muda de cor, sem transform", use: "Discreto: nada salta" },
    { name: "GSAP demo", value: "timeline", use: "Stack em movimento na home" },
    { name: "ease.out", value: "cubic-bezier(0,0,0.2,1)", use: "Padrão — entra e assenta, sem passar do ponto" },
  ],
  kit: [
    {
      group: "Superfícies",
      items: [
        { name: ".dv-card", className: "dv-card", note: "Card padrão: borda 1px, raio 12px, sem sombra." },
        { name: ".dv-hero", className: "dv-hero", note: "Bloco de abertura com o prompt." },
        { name: ".dv-stat · .dv-stats", className: "dv-stat", note: "Contador ligado a uma rota." },
        { name: ".dv-empty", className: "dv-empty", note: "Estado vazio." },
      ],
    },
    {
      group: "Navegação",
      items: [
        { name: ".dv-dock", className: "dv-dock", note: "Dock flutuante inferior — a navegação do realm." },
        { name: ".dv-topbar · .dv-head", className: "dv-topbar", note: "Topo grudado ao rolar." },
        { name: ".dv-tabs · .dv-tab", className: "dv-tab", note: "Abas com borda, raio 9px." },
        { name: ".dv-link · .dv-navlink", className: "dv-link", note: "Links." },
      ],
    },
    {
      group: "Dados",
      items: [
        { name: ".dv-tag", className: "dv-tag", note: "Pílula de stack/tecnologia." },
        { name: ".dv-chip-row", className: "dv-chip-row", note: "Linha de tags." },
        { name: ".dv-status", className: "dv-status", note: "Estado do projeto (done/wip)." },
        { name: ".dv-code · .dv-snippet", className: "dv-code", note: "Bloco de código." },
        { name: ".dv-timeline · .dv-tl-item", className: "dv-timeline", note: "Linha do tempo." },
      ],
    },
    {
      group: "Entrada",
      items: [
        { name: ".dv-search", className: "dv-search", note: "Campo de busca." },
        { name: ".dv-filter", className: "dv-filter", note: "Filtro por categoria." },
        { name: ".dv-tool-field · .dv-tool-out", className: "dv-tool-field", note: "Entrada/saída das ferramentas." },
      ],
    },
  ],
  logo: "RealmLogoMini com cursor de terminal piscando. Classes .rl / .rl-dev em realm-logo.css.",
}

/* ============================================================
   ARCANE — jornal de 1920. Pergaminho, serifa, molduras.
   ============================================================ */

const arcane: RealmDesign = {
  id: "arcane",
  label: "O Anfitrião",
  tagline: "Daily Prophet — jornal antigo: pergaminho, tinta e composição em colunas.",
  scope: "prophet dp",
  css: ["prophet.css", "daily-prophet.css", "daily-prophet-ui.css", "fonts-arcane.css"],
  principles: [
    "É papel, não tela. Tudo que existe aqui existiria numa folha impressa em 1920.",
    "A composição manda: colunas, fios e capitulares. O texto justificado é a estrutura, não enfeite.",
    "Sem cor de acento. A hierarquia vem do peso, do corpo e do fio — sépia e ouro só pontuam.",
    "Nada de sombra: papel não tem elevação. Profundidade é moldura e fio duplo.",
    "Serifada sempre. A sans só apareceria se o jornal tivesse um anúncio moderno — e não tem.",
  ],
  palette: [
    { name: "Sépia", token: "--dp-sepia", value: "#7a5c34", role: "Links, acento discreto" },
    { name: "Ocre", token: "--dp-ocre", value: "#8a6a2f", role: "Destaque secundário" },
    { name: "Ouro", token: "--dp-gold", value: "#9a7b28", role: "Capitulares, brasão, pontuação nobre" },
    { name: "Fio", token: "--dp-rule", value: "#2a2216", role: "Fios, molduras e divisores" },
  ],
  surfaces: [
    { name: "Papel", token: "--dp-paper", value: "#e8dcbe", role: "Fundo — a folha" },
    { name: "Papel 2", token: "--dp-paper-2", value: "#ded0ac", role: "Caixas, anúncios, recuos" },
    { name: "Tinta", token: "--dp-ink", value: "#1c1710", role: "Texto principal" },
    { name: "Tinta 2", token: "--dp-ink-2", value: "#43382a", role: "Texto secundário" },
    { name: "Tinta 3", token: "--dp-ink-3", value: "#6b5c45", role: "Legendas, metadados" },
  ],
  typography: [
    {
      role: "Corpo",
      family: "Iowan Old Style / Palatino",
      token: "--dp-body",
      className: "dp-lead-body",
      usage: "Texto corrido, justificado e hifenizado. O padrão da folha.",
    },
    {
      role: "Manchete",
      family: "Playbill / Bookman Old Style",
      token: "--dp-head",
      className: "dp-bighead",
      usage: "Manchetes e títulos de matéria.",
    },
    {
      role: "Nameplate",
      family: "Headline One / Rockwell",
      token: "--dp-wood",
      className: "dp-nameplate",
      usage: "O nome do jornal no masthead — tipo de madeira.",
    },
    {
      role: "Gótica",
      family: "UnifrakturCook / Old English",
      token: "--dp-black",
      className: "dp-amp",
      usage: "Blackletter — reservada a ornamentos do cabeçalho.",
    },
  ],
  elevation: [
    { name: "nenhuma", value: "0", use: "Papel não tem sombra. Separação é fio e moldura." },
    { name: ".dp-plate", value: "moldura: borda 1px + padding 3px", use: "Figuras — o quadro impresso" },
    { name: ".dp-box--heavy", value: "borda reforçada", use: "Caixa de destaque no rail" },
  ],
  radius: [
    { name: "0", value: "0", use: "Tudo. Papel cortado a guilhotina não tem canto redondo." },
  ],
  grid: [
    { name: ".dp-sheet", value: "max-width 1180px", use: "A folha — largura da página impressa" },
    { name: ".dp-grid", value: "coluna esquerda / miolo / rail", use: "Grelha editorial de 3 colunas" },
    { name: ".dp-col--rail", value: "coluna estreita à direita", use: "Números, telegramas e anúncios" },
    { name: ".dp-reports", value: "até 4 colunas", use: "Matérias secundárias no pé" },
    { name: ".dp-columns", value: "column-count", use: "Texto corrido em colunas de jornal" },
  ],
  motion: [
    { name: "quase nenhum", value: "—", use: "Papel não anima. O realm é deliberadamente estático." },
    { name: "hover de link", value: "cor → sépia + sublinhado", use: "Único feedback interativo" },
    { name: "ink settle (arcane)", value: "letra a letra via CSS", use: "Só no masthead do Arcane na home Creative" },
  ],
  kit: [
    {
      group: "Cabeçalho",
      items: [
        { name: ".dp-masthead · .dp-nameplate", className: "dp-nameplate", note: "Nome do jornal e subtítulo." },
        { name: ".dp-dateline", className: "dp-dateline", note: "Volume, data e preço." },
        { name: ".dp-sections", className: "dp-sections", note: "Barra de cadernos." },
        { name: ".dp-motto", className: "dp-motto", note: "Lema bilíngue." },
      ],
    },
    {
      group: "Matéria",
      items: [
        { name: ".dp-bighead · .dp-kicker · .dp-subhead", className: "dp-bighead", note: "Manchete, chapéu e linha fina." },
        { name: ".dp-cap", className: "dp-cap", note: "Capitular — abre a matéria." },
        { name: ".dp-pull", className: "dp-pull", note: "Olho / citação destacada." },
        { name: ".dp-byline", className: "dp-byline", note: "Assinatura e dateline." },
        { name: ".dp-figure · .dp-plate · .dp-figcaption", className: "dp-plate", note: "Figura emoldurada + legenda." },
      ],
    },
    {
      group: "Caixas & fios",
      items: [
        { name: ".dp-box · .dp-box--heavy", className: "dp-box", note: "Caixa lateral." },
        { name: ".dp-ad", className: "dp-ad", note: "Classificado." },
        { name: ".dp-rule · --hair · --double", className: "dp-rule", note: "Fios: fino, capilar e duplo." },
        { name: ".dp-orn", className: "dp-orn", note: "Ornamento tipográfico (❦ ❧)." },
        { name: ".dp-stamp", className: "dp-stamp", note: "Carimbo." },
      ],
    },
    {
      group: "Rodapé & índice",
      items: [
        { name: ".dp-index · .dp-index-item", className: "dp-index", note: "Índice com linha pontilhada." },
        { name: ".dp-colophon", className: "dp-colophon", note: "Expediente — abriga o acesso ao admin." },
        { name: ".dp-foot · .dp-folio", className: "dp-foot", note: "Pé de página com folio." },
      ],
    },
    {
      group: "Páginas internas (.pr-*)",
      items: [
        { name: ".pr-container · .pr-grid", className: "pr-container", note: "Layout das páginas internas do realm." },
        { name: ".pr-card · .pr-card-link", className: "pr-card", note: "Card de conteúdo." },
        { name: ".pr-portrait", className: "pr-portrait", note: "Campo de imagem — 16/9, padrão do projeto." },
        { name: ".pr-badge · .pr-filter", className: "pr-badge", note: "Selo e filtros." },
      ],
    },
  ],
  logo: "RealmLogoMini com selo girando e o d20. Classes .rl / .rl-anf em realm-logo.css.",
}

/** Registro dos três realms. */
export const REALM_DESIGN: Record<RealmId, RealmDesign> = {
  creative,
  developer,
  arcane,
}

export const REALM_DESIGN_IDS = Object.keys(REALM_DESIGN) as RealmId[]
