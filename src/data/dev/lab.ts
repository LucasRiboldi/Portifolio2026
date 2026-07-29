/**
 * Laboratório — experimentos.
 *
 * Diferença deliberada para `projects`: projeto é coisa que se usa,
 * experimento é coisa que se aprende. Um experimento pode ser arquivado sem
 * culpa, e vários aqui foram — o que não deu certo também é registro.
 *
 * `status` respeita o CHECK da tabela: wip | playtest | stable | archived.
 */

export interface LabExperiment {
  title: string
  description: string
  status: "wip" | "playtest" | "stable" | "archived"
  stack: string[]
  demoUrl?: string
  repoUrl?: string
}

export const labExperiments: LabExperiment[] = [
  {
    title: "comic-layout — diagramação por contagem de quadros",
    description:
      "Motor que escolhe a diagramação da tira a partir do número de painéis, em vez de aplicar um gabarito fixo. Resolve o caso ímpar, que esticava o último quadro e quebrava a ordem de leitura. Em produção no realm criativo desde julho.",
    status: "stable",
    stack: ["TypeScript", "CSS Grid", "Vitest"],
  },
  {
    title: "Prophet Wire — agregador de notícias",
    description:
      "Coleta, normaliza e diagrama notícias externas no formato do jornal de 1920. Roda de ponta a ponta, mas o histórico de execuções ainda vive em memória: o estado não sobrevive a um deploy. A persistência em Supabase é a próxima peça.",
    status: "wip",
    stack: ["Next.js", "Supabase", "Zod", "Server Actions"],
  },
  {
    title: "Camada de tokens do realm dev",
    description:
      "Prova de que dá para acrescentar uma camada semântica sobre uma paleta existente sem renomear uma única classe — requisito porque o guia de design system documenta os nomes atuais. Validado por teste que rejeita qualquer token que não derive da paleta.",
    status: "stable",
    stack: ["CSS", "Design Tokens", "Vitest"],
  },
  {
    title: "Foil holográfico derivado do nome do arquivo",
    description:
      "As cartas ganham o brilho holográfico a partir do nome da face, não de uma flag. Elegante e frágil na mesma medida: trocar a extensão da imagem desliga o efeito em silêncio. Documentado no troubleshooting depois de quebrar duas vezes.",
    status: "playtest",
    stack: ["CSS", "AVIF", "Canvas"],
  },
  {
    title: "Portal de entrada com gate em localStorage",
    description:
      "Três logos animados e uma escolha de universo que o navegador lembra. O redirecionamento automático evita que o visitante recorrente passe pela porta toda vez. Chave: lr.portal.v1.",
    status: "stable",
    stack: ["Next.js", "GSAP", "localStorage"],
  },
  {
    title: "Cursor customizado do realm criativo",
    description:
      "Cursor desenhado em canvas seguindo o mouse com atraso elástico. Bonito em tela grande, inutilizável em toque, e caro em repaint. Removido do realm em julho de 2026 — fica aqui como registro do que não compensou.",
    status: "archived",
    stack: ["Canvas", "requestAnimationFrame"],
  },
  {
    title: "Engenharia reversa do widget de esportes do Firefox",
    description:
      "Reconstrução do widget da nova aba a partir do DOM real: abas de resultados e próximos jogos, agrupamento, placares e bandeiras. Serviu de estudo de acessibilidade em componente denso — virou projeto e saiu do laboratório.",
    status: "stable",
    stack: ["React", "TypeScript", "CSS Modules"],
    demoUrl: "/sports-widget",
  },
  {
    title: "Renderização de molduras SVG do Daily Prophet",
    description:
      "Tentativa de gerar as molduras ornamentais do jornal por SVG paramétrico em vez de imagem fatiada. O traço fica limpo em qualquer resolução, mas o custo de path em páginas com muitas caixas ficou alto demais. Pausado à espera de uma simplificação do traçado.",
    status: "archived",
    stack: ["SVG", "TypeScript"],
  },
]
