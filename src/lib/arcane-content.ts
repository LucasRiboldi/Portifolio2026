/**
 * Conteúdo do realm ARCANE — a vertente de Game Design do portfólio,
 * diagramada como um jornal antigo ("The Arcane Gazette").
 * Conteúdo próprio (não é re-skin) — cobre design de jogos de tabuleiro,
 * card games, RPG, mecânicas, lore e world building.
 */

export const gazette = {
  masthead: "The Daily Prophet",
  motto: "A folha mais enfeitiçante do mundo dos jogos — encante, conjure, jogue",
  edition: "Vol. MMXXVI — Nº 1",
  price: "Preço: Um Óbolo de Prata",
  place: "Impresso em Terra-2026",
} as const

export type GazetteArticle = {
  kicker: string
  headline: string
  standfirst: string
  body: string[]
  byline?: string
}

/** Matéria de capa — o projeto de jogo em destaque. */
export const leadArticle: GazetteArticle = {
  kicker: "Edição Especial · Jogos de Tabuleiro",
  headline: "Designer transforma regras em rituais jogáveis",
  standfirst:
    "Do primeiro rascunho ao protótipo na mesa: como sistemas de cartas e economias de recursos viram histórias que os jogadores contam de volta.",
  byline: "por Lucas Riboldi, Game Designer",
  body: [
    "Todo jogo começa com uma pergunta: o que o jogador vai sentir quando arriscar? A partir dela nasce a mecânica — a peça, a carta, o dado — e só depois a temática que a veste. Aqui o processo é inverso ao de um layout: primeiro o verbo, depois o adjetivo.",
    "Nos últimos ciclos, o estúdio prototipou economias de recursos, sistemas de deckbuilding e loops de decisão tensa, sempre testando na mesa antes de qualquer arte. Um bom protótipo é feio de propósito: ele isola a mecânica para que o divertimento não seja um acidente da ilustração.",
    "O objetivo declarado é simples e ambicioso — que a regra desapareça e reste apenas a história que os jogadores levam para casa.",
  ],
}

/** Colunas de serviço — o que a oficina oferece, em linguagem de jornal. */
export const columns: GazetteArticle[] = [
  {
    kicker: "Mecânicas",
    headline: "A arquitetura invisível do divertimento",
    standfirst: "Loops, economias e tensão — o motor por trás de cada turno.",
    body: [
      "Desenho de núcleos de jogo (core loops), curvas de dificuldade, sistemas de recursos e balanceamento por planilha e por playtest. A matemática serve à emoção, não o contrário.",
    ],
  },
  {
    kicker: "Lore & World Building",
    headline: "Mundos que sobrevivem fora da caixa",
    standfirst: "Cosmologias, facções e línguas que dão peso a cada carta.",
    body: [
      "Construção de universos coerentes — geografia, história, panteão e conflitos — que informam mecânicas e arte. Um mundo bem-feito é um gerador infinito de conteúdo jogável.",
    ],
  },
  {
    kicker: "RPG de Mesa",
    headline: "Sistemas para narrar em grupo",
    standfirst: "Fichas enxutas, testes elegantes, mestres empoderados.",
    body: [
      "Criação de sistemas de RPG e aventuras, com foco em regras que aceleram a ficção em vez de travá-la. Da rolagem à resolução, tudo pensado para a mesa fluir.",
    ],
  },
]

/** Barra lateral — "mecânicas em destaque" como um índice de almanaque. */
export const sidebar = {
  title: "No Grimório desta Edição",
  items: [
    { term: "Deckbuilding", note: "construção de baralho em tempo de jogo" },
    { term: "Worker Placement", note: "alocação de trabalhadores e disputa por espaços" },
    { term: "Push Your Luck", note: "tensão de arriscar mais um dado" },
    { term: "Economia de Recursos", note: "conversão, escassez e motores" },
    { term: "Assimetria", note: "facções com regras próprias, equilibradas" },
    { term: "Legacy", note: "campanhas que alteram o jogo permanentemente" },
  ],
}

/** Rodapé de números — "estatísticas" no tom de almanaque antigo. */
export const almanac = [
  { value: "12+", label: "protótipos na mesa" },
  { value: "3", label: "sistemas autorais" },
  { value: "∞", label: "playtests até acertar" },
]
