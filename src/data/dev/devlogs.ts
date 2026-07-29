/**
 * Devlogs — o registro cronológico do laboratório.
 *
 * Estas entradas são a memória do projeto: cada uma marca uma decisão que
 * mudou o rumo do código, na ordem em que aconteceu. Ficam aqui, versionadas,
 * porque `src/data/*` é a fonte de verdade histórica do site — o banco recebe
 * cópia pelo sync do /admin, nunca o contrário.
 *
 * Ordem: mais recente primeiro, como a página renderiza.
 */

export interface Devlog {
  slug: string
  title: string
  /** ISO curto. A tabela é `date`, sem hora. */
  date: string
  summary: string
  /** Markdown leve — a página renderiza com `.dv-prose`. */
  body: string
  tags: string[]
}

export const devlogs: Devlog[] = [
  {
    slug: "realm-dev-tres-camadas",
    title: "O realm dev em três camadas: paleta, tokens, HUD",
    date: "2026-07-29",
    summary:
      "786 linhas numa folha só viraram três camadas com responsabilidade separada. Nenhuma classe mudou de nome — o guia de design system documenta todas elas pelo nome.",
    body: `A folha do realm misturava quatro coisas: a paleta Dracula, o layout do canvas, o catálogo de componentes e a feature Learn inteira. Mexer no ritmo vertical exigia caçar literais soltos — \`0.35rem\` aqui, \`1.1rem\` ali, \`1.75rem\` acolá.

## O que mudou

A paleta continua onde estava. O que entrou foi uma camada semântica por cima: \`--dev-surface-1\` em vez de "o roxo escuro", \`--dev-danger\` em vez de "o vermelho". Nenhum token novo inventa cor — todos derivam de \`--d-*\`, e há teste que quebra se alguém tentar.

## O que quase passou batido

O bloco de \`prefers-reduced-motion\` era \`[class*="dv-"] { animation: none !important }\`. Varria o DOM inteiro por substring de classe, atingia qualquer classe futura com "dv-" no nome, e esquecia \`transition\` — as transições continuavam correndo para quem pediu para elas pararem.

E o realm não tinha **nenhuma** indicação de foco. Navegar por teclado era navegar às cegas.`,
    tags: ["css", "design-system", "acessibilidade", "refactor"],
  },
  {
    slug: "diagramacao-que-conhece-os-quadros",
    title: "A tira que fecha: diagramação que sabe quantos quadros tem",
    date: "2026-07-21",
    summary:
      "O motor de quadrinhos parava de funcionar em tiras com número ímpar de painéis. A correção foi ensinar o layout a contar antes de diagramar.",
    body: `A grade de quadrinhos assumia páginas pares. Com cinco painéis, o último esticava e a leitura quebrava — o olho ia para o lugar errado.

## A correção

\`comic-layout.ts\` passou a receber a contagem e escolher a diagramação a partir dela, em vez de aplicar sempre o mesmo gabarito. Cinco painéis agora têm um arranjo próprio, com o quadro de fechamento em largura total.

## Custo

Um módulo novo (\`src/design-system/comic-layout.ts\`) e 110 linhas de teste. Vale: era o tipo de bug que só aparece no conteúdo específico e passa despercebido em revisão.`,
    tags: ["comic", "layout", "css-grid"],
  },
  {
    slug: "prophet-wire-parte-10",
    title: "Prophet Wire: o agregador que ainda não fala com o banco",
    date: "2026-07-14",
    summary:
      "O agregador de notícias do Anfitrião está no ar com repositório em memória. A Parte 10 — persistência em Supabase — destrava seis pendências de uma vez.",
    body: `O Wire lê fontes, normaliza e publica. Tudo isso funciona. O que falta é o estado sobreviver a um deploy.

## Por que é o gargalo

Seis pendências dependem da mesma coisa: histórico de execuções persistido. Sem isso não há deduplicação entre execuções, não há retomada após falha, e o painel mostra sempre uma janela vazia depois de cada build.

## Estado

\`supabase-repository.ts\` e \`supabase-run-store.ts\` já existem, com a migration \`0007_prophet_wire.sql\`. Falta ligar o interruptor e migrar o run-store em memória.`,
    tags: ["supabase", "arquitetura", "prophet-wire"],
  },
  {
    slug: "cls-da-face-titulo",
    title: "Onde estava o CLS: a face-título do jornal",
    date: "2026-06-30",
    summary:
      "O Anfitrião pulava no carregamento. A culpa não era da fonte nem da imagem — era um elemento sem altura reservada no topo da folha.",
    body: `Core Web Vitals acusava CLS acima do limite só na home do Anfitrião. As suspeitas óbvias (fonte de display, imagem de capa) estavam inocentes.

## O culpado

A face-título calculava a própria altura depois da hidratação. Entre o primeiro paint e o cálculo, tudo abaixo dela subia alguns pixels — o suficiente para reprovar.

## Lição

Reserva de espaço não é otimização, é correção. Todo elemento cuja altura depende de JavaScript precisa de uma altura declarada antes.`,
    tags: ["performance", "core-web-vitals", "anfitriao"],
  },
  {
    slug: "hidratacao-travada-loading-raiz",
    title: "\"Carregando...\" para sempre: o loading.tsx da raiz",
    date: "2026-05-18",
    summary:
      "Páginas grandes com SSR ficavam presas no estado de carregamento. A causa era um arquivo de 4 linhas na raiz do app.",
    body: `Sintoma: as páginas mais pesadas do realm dev exibiam "Carregando..." indefinidamente em produção, mas funcionavam em desenvolvimento.

## Diagnóstico

O \`app/loading.tsx\` na raiz forçava um limite de Suspense no topo da árvore. Combinado com o tamanho das páginas, o Next optava por renderizar no cliente — e o fallback nunca era substituído.

## Correção

Remover o loading da raiz. Estados de carregamento passaram a ser declarados por rota, onde há contexto para escrever uma mensagem útil em vez de "Carregando...".`,
    tags: ["next.js", "ssr", "debug"],
  },
  {
    slug: "conteudo-sai-do-codigo",
    title: "O conteúdo saiu do código e foi para o banco",
    date: "2026-02-11",
    summary:
      "Toda publicação exigia um deploy. A migração para Supabase separou o que é código do que é conteúdo — e criou uma armadilha que documentei antes de esquecer.",
    body: `Até aqui, acrescentar um projeto significava editar um array, commitar e esperar o build. Errado: conteúdo não é release.

## O desenho

\`src/data/*\` continua sendo a fonte de verdade histórica e versionada. O Supabase é a fonte de leitura em produção. Um botão no /admin copia o que falta de um para o outro.

## A armadilha

O seed **só popula tabela vazia**. Depois que a tabela tem dados, editar \`src/data/*\` não muda nada em produção — e nada avisa. Foi por isso que o sync incremental existe, e por isso ele compara por chave natural em vez de sobrescrever: conteúdo editado no painel não pode ser atropelado pelo código.`,
    tags: ["supabase", "arquitetura", "cms"],
  },
  {
    slug: "pipeline-de-tokens",
    title: "Um pipeline de tokens que serve Figma e código",
    date: "2025-11-03",
    summary:
      "Os tokens viviam duplicados: uma cópia no Figma, outra no CSS, e as duas divergindo em silêncio. Agora há uma origem e dois destinos.",
    body: `O problema não era técnico, era de processo: ninguém sabia qual das duas cópias estava certa.

## Formato

Um arquivo de origem, dois exportadores — \`tokens:export\` gera o CSS, e o mesmo arquivo alimenta a biblioteca do Figma. \`tokens:check\` roda em CI e falha se as duas divergirem.

## Resultado

Onze meses depois, zero divergências relatadas. O comando que mais rodou foi o \`check\`, não o \`export\` — o valor estava na verificação, não na geração.`,
    tags: ["design-tokens", "figma", "ci"],
  },
  {
    slug: "primeiro-commit",
    title: "Primeiro commit: três universos, um site",
    date: "2025-08-04",
    summary:
      "A premissa do projeto em uma frase — três portais com identidades incompatíveis, compartilhando infraestrutura sem compartilhar estética.",
    body: `A ideia inicial era um portfólio. Descartei na primeira semana: portfólio é um formato resolvido, e resolver de novo o que já está resolvido não ensina nada.

## A premissa

Três ambientes que não se parecem em nada — um jornal de 1920, uma graphic novel e um laboratório de engenharia — rodando na mesma base, com o mesmo banco e o mesmo deploy. O desafio é a infraestrutura ser compartilhada e a estética não vazar entre eles.

## Primeira regra

Cada realm escopa o próprio CSS numa classe raiz. Nada de estilo global além do reset. Essa regra sobreviveu ao projeto inteiro.`,
    tags: ["arquitetura", "marco"],
  },
]
