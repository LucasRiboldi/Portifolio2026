/**
 * SEED do realm arcano — os quatro cadernos do jornal que nunca tiveram
 * conteúdo (`prophet_tutorials`, `prophet_mechanics`, `prophet_prototypes`,
 * `prophet_resources`).
 *
 * As quatro páginas públicas (`/anfitriao/oficina`, `/mecanicas`,
 * `/laboratorio`, `/imprensa`) já existiam e renderizavam vazias: os leitores
 * fazem `return data ?? []`, sem fallback, e as coleções nunca foram povoadas —
 * nem no Postgres. Este arquivo é o ponto de partida.
 *
 * **Duas regras seguidas ao escrever, que valem manter:**
 *
 *  1. Nada aqui afirma histórico pessoal do autor. Os textos são de ofício —
 *     conceitos de design que existem na literatura da área — e não relatos de
 *     playtests, tiragens ou parcerias que teriam de ser verdade.
 *  2. Nenhum `file_url` aponta para arquivo inexistente. Material sem arquivo
 *     pronto fica com `null`, e a página trata isso.
 *
 * É rascunho para editar no `/admin`, não texto final.
 */

export interface TutorialSeed {
  slug: string
  title: string
  summary: string
  body: string
  difficulty: "iniciante" | "intermediario" | "avancado"
  tags: string[]
}

export interface MechanicSeed {
  slug: string
  title: string
  summary: string
  body: string
  tags: string[]
}

export interface PrototypeSeed {
  title: string
  description: string
  status: "conceito" | "prototipo" | "playtest" | "publicado"
  players: string
  playtime: string
  tags: string[]
}

export interface ResourceSeed {
  title: string
  description: string
  type: "pnp" | "cartas" | "tabuleiro" | "regras" | "outro"
  fileUrl: string | null
}

export const prophetTutorials: TutorialSeed[] = [
  {
    slug: "do-nada-ao-primeiro-playtest",
    title: "Do nada ao primeiro playtest em uma tarde",
    summary:
      "O protótipo mais útil é feio, de papel, e existe hoje. Como sair da ideia para a mesa sem passar por arte, caixa ou regra escrita.",
    difficulty: "iniciante",
    tags: ["prototipagem", "playtest", "processo"],
    body: `## A regra do papel picado

O erro mais comum de quem começa é caprichar. Arte, ícones, caixa — tudo antes
de saber se o jogo funciona. O problema não é o tempo gasto: é o **apego**.
Quem passou seis horas desenhando cartas resiste a jogar fora a mecânica que
elas servem.

Faça o contrário. Papel sulfite cortado, caneta, e nomes provisórios.

## O que precisa existir

Só três coisas:

1. **Uma decisão que o jogador toma repetidamente.** Se não há escolha, é um
   procedimento, não um jogo.
2. **Uma forma de a partida acabar.** Mesmo arbitrária — "acaba na décima
   rodada" resolve por ora.
3. **Uma forma de saber quem foi melhor.** Pontos servem. Refine depois.

## O primeiro teste é sozinho

Jogue contra si mesmo antes de chamar alguém. Você vai descobrir, em quinze
minutos, que metade das regras não fecha. Esse é o teste mais barato que existe
e o único que não gasta a paciência de ninguém.

## Depois, a pergunta certa

Ao levar para a mesa, não pergunte "gostou?". Ninguém responde não. Pergunte:

- Em que momento você não sabia o que fazer?
- Teve alguma jogada óbvia demais?
- Onde você ficou esperando sem fazer nada?

As três apontam defeito estrutural. "Gostei" não aponta nada.`,
  },
  {
    slug: "curva-de-tensao",
    title: "Desenhar a curva de tensão de uma partida",
    summary:
      "Toda partida tem um formato ao longo do tempo. Quando ninguém o desenha de propósito, ele sai por acidente — e costuma sair errado.",
    difficulty: "intermediario",
    tags: ["ritmo", "estrutura", "design"],
    body: `## O problema do meio morto

Muito jogo abre bem e fecha bem. O que apodrece é o miolo: aquele trecho em que
as decisões já estão tomadas, ninguém pode virar o placar e ainda faltam vinte
minutos de procedimento.

## Desenhe antes de consertar

Pegue papel e trace o tempo no eixo horizontal, a tensão no vertical. Marque
onde você **quer** que estejam os picos. Depois jogue e trace a curva real. A
distância entre as duas é a sua lista de tarefas.

## Três alavancas conhecidas

- **Escassez crescente.** Recursos que ficam mais disputados conforme a partida
  avança sobem a tensão sem regra nova.
- **Informação que se revela.** Segurar informação para o meio da partida cria
  um segundo começo.
- **Gatilho de fim variável.** Quando ninguém sabe exatamente a rodada final, o
  miolo deixa de ser previsível.

## O cuidado

Tensão constante cansa tanto quanto tensão nenhuma. Vale de descanso é parte do
desenho, não falha dele — o jogador precisa de um respiro para perceber que o
próximo pico é um pico.`,
  },
  {
    slug: "equilibrio-sem-planilha",
    title: "Equilíbrio sem planilha: o que medir quando não dá para simular",
    summary:
      "Nem todo desequilíbrio aparece em conta. Como usar assimetria, custo de oportunidade e teto de vantagem quando a matemática não fecha sozinha.",
    difficulty: "avancado",
    tags: ["equilibrio", "matematica", "assimetria"],
    body: `## Planilha resolve o que é comparável

Se duas cartas fazem a mesma coisa em quantidades diferentes, a planilha
resolve. O trabalho difícil começa quando as opções não são comparáveis — uma
dá recurso, outra dá tempo, outra nega a jogada do adversário.

## Custo de oportunidade é a moeda real

O preço de uma ação raramente é o que ela cobra. É o que ela **impede**. Uma
ação barata que ocupa o único espaço de construção da rodada pode ser mais cara
que uma ação de preço alto e sem exclusividade.

Ao avaliar, pergunte: o que o jogador deixa de fazer ao escolher isto?

## Assimetria não é desequilíbrio

Facções diferentes não precisam ser equivalentes em poder bruto, e sim ter
**caminhos de vitória distintos com dificuldade parecida**. O erro é medir a
facção pela força e não pela rota.

## Teto de vantagem

Estabeleça, no papel, quanto o líder pode estar à frente antes de a partida
virar procedimento. Depois procure o que produz essa distância. Quase sempre é
um efeito que se retroalimenta — quem está na frente ganha mais do que o
permite continuar na frente.

## O último teste é humano

Nenhuma conta detecta "opção correta óbvia". Isso só aparece quando três
jogadores diferentes escolhem a mesma coisa pelo mesmo motivo, três partidas
seguidas.`,
  },
]

export const prophetMechanics: MechanicSeed[] = [
  {
    slug: "alocacao-de-trabalhadores",
    title: "Alocação de trabalhadores",
    summary:
      "Peças limitadas ocupam espaços que se esgotam. A tensão nasce de bloquear o outro, não de otimizar sozinho.",
    tags: ["seleção de ação", "bloqueio", "euro"],
    body: `## Como funciona

Cada jogador tem um número pequeno de peças. Colocá-las em espaços do tabuleiro
concede a ação daquele espaço — e, na forma clássica, **impede** que outro a
use naquela rodada.

## O que a mecânica realmente produz

A decisão interessante não é "qual ação quero", e sim "qual ação quero **antes
que ele pegue**". O bloqueio transforma um problema de otimização individual
num problema de leitura do adversário.

Retirar o bloqueio (espaços ilimitados) não é uma variante menor: muda o gênero
da decisão.

## Onde costuma falhar

- **Espaço dominante.** Se uma posição é sempre a melhor primeira escolha, a
  ordem de turno vira o jogo inteiro.
- **Primeiro jogador sem custo.** A vantagem de escolher primeiro precisa de
  contrapeso, ou a rotação vira arrecadação.
- **Peças demais.** Com muitas peças, a escassez some e o bloqueio deixa de
  doer.

## Ajustes conhecidos

Espaços que melhoram conforme ficam vazios; custo crescente para ocupar espaço
já usado; peças que voltam mais cedo em troca de eficiência menor.`,
  },
  {
    slug: "construcao-de-baralho",
    title: "Construção de baralho",
    summary:
      "O jogador compra as próprias cartas durante a partida. O baralho é ao mesmo tempo recurso, motor e placar.",
    tags: ["baralho", "motor", "economia"],
    body: `## Como funciona

Todos começam com um baralho idêntico e fraco. Durante a partida, compram
cartas para dentro dele. O que foi comprado volta às mãos depois de embaralhado
— então cada compra é uma aposta sobre as rodadas futuras.

## A tensão central: diluição

Toda carta acrescentada **piora a chance** de comprar as outras. É o que faz a
mecânica funcionar: adicionar não é gratuito, e um baralho enxuto e afiado bate
um baralho grande e variado.

Quem projeta esquecendo a diluição produz um jogo em que a estratégia é
"compre tudo".

## Onde costuma falhar

- **Sem remoção.** Sem uma forma de tirar as cartas iniciais fracas, o baralho
  nunca ganha foco.
- **Cartas de ponto que travam.** Pontuar entulhando o baralho é uma tensão
  boa, mas precisa de janela clara para acontecer.
- **Compra dominante.** Se uma carta é sempre o melhor uso do dinheiro, a
  partida vira corrida por ela.

## Variações

Baralho comum a todos (mercado fixo) versus mercado rotativo; baralhos que
funcionam como energia em vez de mão; remoção como recurso escasso.`,
  },
  {
    slug: "forcar-a-sorte",
    title: "Forçar a sorte",
    summary:
      "O jogador escolhe entre parar com o que tem ou arriscar de novo por mais. Simples de ensinar, difícil de equilibrar.",
    tags: ["risco", "azar", "família"],
    body: `## Como funciona

Uma ação pode ser repetida indefinidamente, acumulando ganho — mas cada
repetição carrega a chance de perder tudo o que foi acumulado na vez.

## Por que ensina rápido

A regra cabe em uma frase e a decisão é imediatamente compreensível para quem
nunca jogou. É por isso que aparece tanto em jogo de porta de entrada.

## O que faz ser bom ou raso

A decisão só é interessante quando o jogador tem **informação parcial** sobre o
risco. Se ele não sabe nada, é aposta pura; se sabe tudo, é conta. O ponto doce
está no meio — saber o suficiente para ter opinião e não o bastante para ter
certeza.

## Onde costuma falhar

- **Risco constante.** Se a chance de perder não cresce, parar nunca é
  racional, e a decisão desaparece.
- **Perda leve demais.** Se falhar custa pouco, todo mundo empurra sempre.
- **Tempo morto.** Quem parou cedo fica olhando o outro rolar dados por cinco
  minutos.

## Ajustes conhecidos

Risco que sobe a cada repetição; decisão simultânea para eliminar espera;
consequência parcial em vez de perda total.`,
  },
]

export const prophetPrototypes: PrototypeSeed[] = [
  {
    title: "Caderno de conceitos — bloqueio e escassez",
    description:
      "Espaço reservado para o primeiro protótipo com alocação de trabalhadores: peças poucas, espaços que melhoram enquanto ninguém os toma. Ainda no papel — sem regras fechadas nem playtest.",
    status: "conceito",
    players: "2–4",
    playtime: "45 min",
    tags: ["alocação", "conceito"],
  },
  {
    title: "Caderno de conceitos — baralho que encolhe",
    description:
      "Ideia a explorar: construção de baralho em que remover cartas é a ação central, e não a acessória. A pergunta em aberto é o que substitui a compra como motor de progresso.",
    status: "conceito",
    players: "2",
    playtime: "30 min",
    tags: ["baralho", "conceito"],
  },
  {
    title: "Caderno de conceitos — risco com informação parcial",
    description:
      "Forçar a sorte em que o jogador compra informação sobre o próprio risco antes de decidir. Anotado para testar quando houver componente disponível.",
    status: "conceito",
    players: "3–5",
    playtime: "20 min",
    tags: ["risco", "conceito"],
  },
]

export const prophetResources: ResourceSeed[] = [
  {
    title: "Folha de registro de playtest",
    description:
      "Modelo de uma página para anotar durante a partida: momento de dúvida, jogada óbvia, tempo parado. As três perguntas que apontam defeito estrutural. Arquivo ainda não disponível.",
    type: "regras",
    fileUrl: null,
  },
  {
    title: "Baralho em branco para prototipagem",
    description:
      "Grade de cartas em tamanho padrão para imprimir, recortar e escrever à mão. Pensado para o primeiro protótipo, aquele que precisa ser feio. Arquivo ainda não disponível.",
    type: "pnp",
    fileUrl: null,
  },
  {
    title: "Gabarito de curva de tensão",
    description:
      "Eixo de tempo e tensão para desenhar a curva pretendida antes da partida e a real depois. A distância entre as duas é a lista de tarefas. Arquivo ainda não disponível.",
    type: "outro",
    fileUrl: null,
  },
]
