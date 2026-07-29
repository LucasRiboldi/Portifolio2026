/**
 * Ideias — o backlog honesto.
 *
 * Inclui o que provavelmente não vai sair do papel. Um backlog que só guarda
 * o que virou código não é backlog, é currículo — e esconde justamente a
 * informação útil: o que foi considerado e por quê parou.
 *
 * `status` respeita o CHECK da tabela: idea | mvp | building | paused | done.
 */

export interface Idea {
  title: string
  description: string
  status: "idea" | "mvp" | "building" | "paused" | "done"
  tags: string[]
}

export const ideas: Idea[] = [
  {
    title: "Persistência do Prophet Wire",
    description:
      "Migrar o histórico de execuções do agregador para o Supabase. Repositório e run-store já escritos, migration aplicada; falta trocar a implementação em memória e migrar o estado. É o item que destrava mais coisa no roadmap inteiro.",
    status: "building",
    tags: ["supabase", "prophet-wire", "prioridade"],
  },
  {
    title: "Realm arcane — jornal de Game Design",
    description:
      "O terceiro universo tem rota, identidade e tipografia, mas nenhum conteúdo. A ideia é um jornal de 1920 sobre design de jogos: resenhas de mecânicas, colunas sobre economia de jogo, cronologia de gêneros.",
    status: "idea",
    tags: ["conteúdo", "realm", "game-design"],
  },
  {
    title: "Busca unificada no acervo técnico",
    description:
      "Índice único sobre wiki, snippets, devlogs e projetos, com filtro por tipo e tag. Segurado de propósito: busca só ganha valor quando navegar por listagem fica pior do que digitar, e o acervo ainda não chegou lá.",
    status: "idea",
    tags: ["busca", "ux"],
  },
  {
    title: "Página interna de matéria no jornal",
    description:
      "As matérias do Anfitrião abrem só na primeira folha. Falta a leitura longa com diagramação própria — colunas, capitular, quebra de página e continuação, respeitando a gramática visual de 1920.",
    status: "idea",
    tags: ["anfitriao", "editorial", "layout"],
  },
  {
    title: "Exportar a wiki como PDF de época",
    description:
      "Gerar um caderno impresso a partir dos documentos técnicos, diagramado com a identidade do jornal em vez da do laboratório. Piada boa, utilidade duvidosa — fica no backlog até provar que serve para alguma coisa.",
    status: "idea",
    tags: ["pdf", "experimento"],
  },
  {
    title: "Métricas de leitura por documento",
    description:
      "Saber qual documento da wiki é realmente consultado, para decidir o que aprofundar. Pausado por decisão consciente: exigiria rastreamento por visitante, e o custo em privacidade não compensa a curiosidade.",
    status: "paused",
    tags: ["analytics", "privacidade"],
  },
  {
    title: "Camada de tokens do realm dev",
    description:
      "Nomear intenção sobre a paleta Dracula sem renomear nenhuma classe existente, já que o guia de design system documenta os nomes atuais. Entregue com teste que rejeita token que não derive da paleta.",
    status: "done",
    tags: ["design-tokens", "css"],
  },
  {
    title: "Portal de entrada com escolha de universo",
    description:
      "Uma porta antes do site: três logos animados, o visitante escolhe o universo e o navegador lembra. Entregue e no ar, com redirecionamento automático para quem já escolheu.",
    status: "done",
    tags: ["portal", "gsap"],
  },
]
