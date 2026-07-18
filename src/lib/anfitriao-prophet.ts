/**
 * DAILY PROPHET — conteúdo da primeira página do realm Anfitrião.
 *
 * Jornal inglês do fim do séc. XIX dedicado à criação de jogos de tabuleiro:
 * game design, mecânicas, prototipagem, impressão 3D, miniaturas, print & play.
 */

export const paper = {
  masthead: "Daily Prophet",
  mastheadSub: "Crônica das artes de mesa",
  motto: "Chronicle of the Tabletop Arts — Mechanisms, Prototypes & Kindred Curiosities",
  mottoPt: "Crônica das artes de mesa — mecânicas, protótipos e curiosidades afins",
  established: "Est. MDCCCLXXIV",
  volume: "Vol. XXVI",
  issue: "Nº 1",
  price: "Preço: Três Pence",
  place: "Impresso na Oficina de Terra-2026",
  registry: "Registrado na Estação Geral dos Correios como jornal",
} as const

/** Barra de serviço abaixo do masthead — clima, cotações, efemérides. */
export const servicebar = {
  weather: {
    title: "Clima das Mesas",
    rows: [
      ["manhã", "dados quentes ↑"],
      ["tarde", "blefe encoberto"],
      ["noite", "sorte variável"],
    ] as [string, string][],
  },
  quotes: {
    title: "Cotações da Oficina",
    rows: [
      ["Filamento PLA", "3/6 a libra"],
      ["Cartão 300g", "1/2 a folha"],
      ["Meeple de faia", "9d a grosa"],
    ] as [string, string][],
  },
  ephemeris: {
    title: "Efemérides",
    lines: [
      "Prelo aquecido às V horas",
      "Playtest público — quinta-feira",
      "Fecho da edição à meia-noite",
    ],
  },
}

/** Manchete principal da semana. */
export const lead = {
  kicker: "Edição Especial · Das Bancadas da Oficina",
  headline: "A REGRA QUE DESAPARECE",
  subhead:
    "Como um punhado de cartão, madeira e resina se converte em memória — o relato de uma temporada inteira de protótipos feios e mesas em silêncio",
  standfirst:
    "Do primeiro rascunho a lápis ao protótipo que devora a noite: por que o divertimento precisa ser isolado antes de qualquer ilustração.",
  byline: "por Lucas Riboldi",
  bylineRole: "Game Designer & Editor desta folha",
  dateline: "Da nossa bancada, ao anoitecer",
  caption:
    "Fig. I — Vista da bancada ao anoitecer: gabaritos, meeples cortados à faca e o primeiro protótipo em cartão cru.",
  /** Capitular da abertura, seguida do resto da primeira frase. */
  dropcap: "T",
  openLine:
    "odo jogo começa por uma pergunta, e a pergunta jamais é sobre o tema. Não se indaga se haverá dragões, mercadores ou vapores; indaga-se o que a pessoa sentada à mesa há de sentir no instante exato em que arrisca. Dessa pergunta — e somente dela — nasce a mecânica: a peça, a carta, o dado. O tema vem depois, como o verniz vem depois da madeira.",
  /** Parágrafos antes do olho. */
  bodyBefore: [
    "O processo, adverte-se, é o inverso do que ensina o costume. Primeiro o verbo, depois o adjetivo. Um protótipo honesto é feio de propósito: cartão cru, letra à mão, nenhum ornamento que possa comprar a simpatia do jogador. Isola-se a mecânica para que o divertimento não seja acidente da ilustração — pois o que encanta na prova de fogo há de encantar despido.",
  ],
  /** Parágrafos depois do olho. */
  bodyAfter: [
    "Nos últimos ciclos esta oficina prensou economias de recursos, motores de compra de baralho e laços de decisão tensa, sempre levados à mesa antes de qualquer arte. Dezenas de folhas foram ao cesto. As que sobreviveram não sobreviveram por belas: sobreviveram porque, ao fim da partida, alguém quis contar de volta o que acabara de acontecer.",
    "É esse o ofício declarado, simples de enunciar e ingrato de cumprir — que a regra desapareça, e reste apenas a história que se leva para casa.",
  ],
  pullquote:
    "Um bom protótipo é feio de propósito: para que o divertimento não seja acidente da ilustração.",
}

/** Coluna editorial (opinião da casa). */
export const editorial = {
  title: "Editorial",
  headline: "Contra o culto da caixa bonita",
  body: [
    "Corre entre nós a crença de que o jogo se vende pela tampa. Não negamos o poder da gravura — negamos que ela responda pela partida. Vimos mesas silenciarem diante de componentes suntuosos e explodirem em riso sobre papelão recortado à tesoura.",
    "Que se ilustre, pois — mas depois. A ordem importa. Quem pinta antes de provar não está desenhando um jogo: está desenhando uma esperança.",
  ],
  sign: "— A Redação",
}

/** Matéria secundária — leva ao Laboratório, a única seção que resta. */
export const reports = [
  {
    kicker: "Mercado & Materiais",
    head: "PREÇOS DAS CARTAS DESABAM",
    sub: "Índice de raridade despenca após novo playtest; bancadas abertas à visitação",
    dropcap: "O",
    body: "índice de raridade recuou pelo quarto mês seguido, arrastado pela reimpressão dos protótipos e pela queda do filamento. O Laboratório expõe as peças que causaram o tombo e convida o leitor a examiná-las de perto.",
    note: "Peças em exposição na bancada.",
    href: "/anfitriao/laboratorio",
    cta: "Ver o laboratório",
    page: "págs. 3/4",
  },
]

/** Caixas espalhadas — curiosidades, estatísticas, avisos. */
export const boxes = {
  curio: {
    title: "Curiosidades",
    items: [
      "O «meeple» só ganhou nome em 2000 — antes disso, era apenas «o bonequinho».",
      "Dados de vinte faces precedem o RPG em dois mil anos: há exemplares no Egito ptolomaico.",
      "O baralho de 52 cartas espelha o ano: 52 semanas, 4 estações, 13 lunações.",
    ],
  },
  numbers: {
    title: "Números desta Casa",
    rows: [
      ["Protótipos na mesa", "XII+"],
      ["Sistemas autorais", "III"],
      ["Folhas ao cesto", "CDXVII"],
      ["Playtests até acertar", "∞"],
    ] as [string, string][],
  },
  tip: {
    title: "Conselho ao Aprendiz",
    body: "Corte primeiro em papel comum. A tesoura é mais barata que o arrependimento, e o cartão bom há de esperar pela terceira versão.",
  },
  grimoire: {
    title: "No Índice Técnico",
    items: [
      { term: "Deckbuilding", note: "construção de baralho durante a partida" },
      { term: "Worker Placement", note: "alocação de trabalhadores e disputa de espaços" },
      { term: "Push Your Luck", note: "a tensão de arriscar mais um dado" },
      { term: "Economia de Recursos", note: "conversão, escassez e motores" },
      { term: "Assimetria", note: "facções com regras próprias, equilibradas" },
      { term: "Legacy", note: "campanhas que alteram o jogo em definitivo" },
    ],
  },
}

/** Pequenos anúncios classificados — o tempero do jornal. */
export const ads = [
  {
    head: "RESINA & FILAMENTO",
    body: "Fornecemos PLA, PETG e resina de alta definição para o cavalheiro que imprime suas próprias miniaturas. Amostras mediante carta.",
    sign: "Casa Prometeu — Rua da Bancada, 12",
  },
  {
    head: "CARTÃO DE PRIMEIRA",
    body: "Gramaturas de 250 a 350g, corte e vinco sob medida. Não há protótipo pobre — há cartão mal escolhido.",
    sign: "Prelo & Vinco, Lda.",
  },
  {
    head: "PROCURA-SE",
    body: "Playtesters de constituição robusta e paciência incomum. Paga-se em pizza e em créditos na caixa.",
    sign: "Dirigir-se a esta Redação",
  },
] as const

/** Notícias curtas em telegrama. */
export const briefs = {
  title: "Últimas Notícias",
  items: [
    "MINIATURAS — Nova leva sai do tanque de cura; pintura em lavagem começa segunda.",
    "3D — Bico de 0,2mm restabelecido após entupimento; camadas voltam ao normal.",
    "RPG — Ficha reduzida a meia folha; mestres relatam alívio geral.",
    "CROWDFUNDING — Campanha em estudo; caixa e frete ainda em contas.",
    "TOKENS — Lote de fichas em MDF chega com queimadura de laser; será refeito.",
    "CARTAS — Terceiro corte de baralho aprovado sem emendas.",
  ],
}

/** Índice / seções — o menu incorporado como sumário de jornal. */
export const index = [
  { label: "Laboratório de Protótipos", href: "/anfitriao/laboratorio", page: "IV" },
]

/** Cadernos anunciados na barra de seções (mapeados às rotas reais). */
export const sections = [
  { label: "Reviews", href: "/anfitriao/laboratorio" },
]

/** Expediente do rodapé — abriga o acesso administrativo incorporado. */
export const colophon = {
  title: "Expediente",
  lines: [
    ["Editor-Chefe & Projetista", "Lucas Riboldi"],
    ["Composição", "à mão, em corpo 9"],
    ["Papel", "avergoado, 90 gramas"],
    ["Tiragem", "uma folha, sob demanda"],
  ] as [string, string][],
  /** Este verbete é o link secreto para o admin. */
  pressLabel: "Tipografia & Prelo",
  pressValue: "Oficina Riboldi",
  notice:
    "Toda a matéria desta folha é composta e revista nesta casa. Reprodução permitida mediante citação da fonte.",
  registry: "Nº MMXXVI·01 — Terra-2026",
}

/* ------------------------------------------------------------------
   Conteúdo acrescentado ao aplicar o próprio Design System à folha.
   ------------------------------------------------------------------
   A auditoria mostrou que esta página usava 51% do sistema que o guia
   documenta — faltava justamente a camada de interface (botões, campos,
   selos, tabela, assinatura) escrita depois.

   O critério para trazer cada peça não foi cobrir o catálogo: foi ser
   editorialmente legítimo numa primeira página de 1920. Cupom de assinatura,
   quadro de cotações e gravura de tiragem existiam de verdade; abas de
   caderno e botão destrutivo, não.
   ------------------------------------------------------------------ */

/** O cupom de assinatura — a folha impressa pedia para recortar e enviar. */
export const coupon = {
  title: "Cupom de Assinatura",
  standfirst:
    "Preencha, recorte pela linha pontilhada e entregue no balcão da oficina — ou remeta pelo correio.",
  fields: {
    name: { label: "Nome de quem assina", placeholder: "como deve sair no rótulo" },
    place: { label: "Praça e rua", placeholder: "onde a folha há de chegar" },
    note: { label: "Recado ao expedidor", help: "Opcional. Duas linhas bastam." },
  },
  cadence: {
    legend: "Periodicidade",
    options: [
      { id: "manha", label: "Edição da manhã", default: true },
      { id: "semanal", label: "Apanhado de sábado" },
    ],
  },
  extras: {
    legend: "Cadernos avulsos",
    options: [
      { id: "classificados", label: "Classificados", default: true },
      { id: "oficina", label: "Caderno da oficina" },
    ],
  },
  submit: "Assinar esta folha",
  reset: "Limpar",
  fineprint: "A assinatura corre por doze edições. Cancela-se por carta, sem multa.",
}

/**
 * Quadro de playtests — a tabela da primeira página.
 *
 * A primeira versão era um quadro de cotações e foi descartada por dois
 * motivos, ambos reais: DUPLICAVA as "Cotações da Oficina" que já estão na
 * barra de serviço no alto, e as suas quatro colunas transbordavam 38px da
 * coluna estreita (250 numa caixa de 220). Três colunas curtas cabem, e o
 * assunto — o que foi à mesa e como saiu — é o desta folha.
 */
export const playtests = {
  caption: "Bancada da quinzena — sessões e veredito",
  head: ["Protótipo", "Jog.", "Nota"],
  rows: [
    { item: "Feira de Ossos", players: "2–4", score: "8" },
    { item: "Rota do Sal", players: "3–5", score: "6" },
    { item: "Casa Torta", players: "2", score: "9" },
    { item: "Pilha de Cartas", players: "1–4", score: "5" },
  ],
}

/** Tiragem por ano — a gravura de dados, em traço de nanquim. */
export const circulation = {
  caption: "Tiragem desta casa, 1908–1926. Fonte: livro de expedição.",
  aria:
    "Tiragem por ano: 1908, doze mil; 1912, dezoito mil; 1918, quinze mil; 1922, vinte e seis mil; 1926, trinta e um mil.",
  points: "22,52 60,38 98,45 136,22 174,12",
  years: [
    ["22", "1908"],
    ["60", "1912"],
    ["98", "1918"],
    ["136", "1922"],
    ["174", "1926"],
  ] as [string, string][],
  top: "31m",
  bottom: "10m",
}

/** A rubrica do editor, ao pé do editorial. */
/** O número da edição, isolado — o carimbo precisa dele sem a praça junto. */
export const registryNumber = "Nº MMXXVI·01"

export const signature = {
  autograph: "L. Riboldi",
  name: "Lucas Floriano Riboldi",
  role: "Editor-chefe e compositor desta casa",
}
