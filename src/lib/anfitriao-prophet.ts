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

/**
 * Zona 6 — MERCADO FINANCEIRO E COMÉRCIO.
 *
 * A praça lida em tiragem: os títulos de maior circulação do ofício, jogos de
 * tabuleiro e de cartas na mesma tábua, como um quadro de cotações.
 *
 * Sobre os números: são as tiragens DECLARADAS PELAS EDITORAS e repetidas na
 * imprensa do ramo — ordem de grandeza, não auditoria. A legenda diz isso na
 * folha, porque um quadro de números sem procedência é ornamento, não notícia.
 */
export const servicebar = {
  weather: {
    title: "Mercado Financeiro e Comércio",
    rows: [
      ["Uno · cartas", "150 mi"],
      ["Catan", "40 mi"],
      ["Ticket to Ride", "15 mi"],
    ] as [string, string][],
  },
  quotes: {
    title: "Cotações da Praça",
    rows: [
      ["Carcassonne", "12 mi"],
      ["Pandemic", "5 mi"],
      ["Wingspan", "1 mi"],
    ] as [string, string][],
  },
  /** Rodapé do quadro — a procedência, impressa junto. */
  marketNote: "Exemplares vendidos, conforme tiragem declarada pelas editoras.",
  ephemeris: {
    title: "Efemérides",
    lines: [
      "Prelo aquecido às V horas",
      "Playtest público — quinta-feira",
      "Fecho da edição à meia-noite",
    ],
  },
}

/**
 * Zona 5 — COLEÇÃO · os premiados.
 *
 * O quadro de láureas do ofício. Todos os registros abaixo são verificáveis
 * nos anais dos próprios prêmios; nenhum foi inventado para encher a coluna, e
 * por isso a lista para em 2024 — o que veio depois entra quando o telégrafo
 * trouxer, não antes.
 */
export const awards = {
  title: "Premiados",
  caption: "O louro alemão e seus pares — os anos que fizeram época",
  head: ["Ano", "Título", "Láurea"],
  rows: [
    { year: "2024", title: "Sky Team", prize: "Spiel des Jahres" },
    { year: "2024", title: "Daybreak", prize: "Kennerspiel" },
    { year: "2023", title: "Dorfromantik", prize: "Spiel des Jahres" },
    { year: "2022", title: "Cascadia", prize: "Spiel des Jahres" },
    { year: "2019", title: "Wingspan", prize: "Kennerspiel" },
    { year: "2018", title: "Azul", prize: "Spiel des Jahres" },
    { year: "2013", title: "Hanabi", prize: "Spiel des Jahres" },
    { year: "2009", title: "Dominion", prize: "Spiel des Jahres" },
    { year: "2004", title: "Ticket to Ride", prize: "Spiel des Jahres" },
    { year: "2001", title: "Carcassonne", prize: "Spiel des Jahres" },
    { year: "1995", title: "Catan", prize: "Spiel des Jahres" },
  ],
}

/**
 * Zona 5 — COLEÇÃO · os fundadores.
 *
 * Não é lista de vendas (essa está no quadro de mercado): é a linhagem. Cada
 * verbete registra o título que INAUGUROU uma família de jogo, com autoria e
 * ano — o que um leitor precisa para entender de onde veio o que joga hoje.
 */
export const lineage = {
  title: "Linhagem do Ofício",
  items: [
    {
      year: "1993",
      title: "Magic: The Gathering",
      author: "Richard Garfield",
      note: "funda o jogo de cartas colecionável; toda a praça de cartas descende daqui",
    },
    {
      year: "1995",
      title: "Catan",
      author: "Klaus Teuber",
      note: "leva o jogo alemão ao mundo e abre a era moderna do tabuleiro",
    },
    {
      year: "2000",
      title: "Carcassonne",
      author: "Klaus-Jürgen Wrede",
      note: "consagra a colocação de peças — e batiza o «meeple»",
    },
    {
      year: "2008",
      title: "Pandemic",
      author: "Matt Leacock",
      note: "firma o jogo cooperativo: a mesa inteira contra o tabuleiro",
    },
    {
      year: "2008",
      title: "Dominion",
      author: "Donald X. Vaccarino",
      note: "inventa a construção de baralho durante a própria partida",
    },
    {
      year: "2019",
      title: "Wingspan",
      author: "Elizabeth Hargrave",
      note: "prova que motor de recursos e tema de história natural convivem",
    },
  ],
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
    title: "Curiosidades do Ofício",
    items: [
      "O «meeple» nasceu no Carcassonne: o nome é invenção de uma jogadora, contração de «my people».",
      "Dados de vinte faces precedem o RPG em dois mil anos: há exemplares no Egito ptolomaico.",
      "O baralho de 52 cartas espelha o ano: 52 semanas, 4 estações, 13 lunações.",
      "«Jogo alemão» virou gênero por causa do prêmio: o Spiel des Jahres premia desde 1979.",
      "O Hanabi ganhou o louro de 2013 sendo um jogo de cartas em que ninguém vê a própria mão.",
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
      { term: "Deckbuilding", note: "construção de baralho durante a partida — ver Dominion" },
      { term: "Draft", note: "escolher uma carta e passar a mão adiante — ver 7 Wonders" },
      { term: "Trick-taking", note: "vaza: cada rodada tem uma carta que vence as outras" },
      { term: "Worker Placement", note: "alocação de trabalhadores e disputa de espaços" },
      { term: "Tile Laying", note: "colocação de peças que formam o tabuleiro ao jogar" },
      { term: "Push Your Luck", note: "a tensão de arriscar mais um dado" },
      { term: "Cooperativo", note: "a mesa inteira contra o jogo — ver Pandemic" },
      { term: "Legacy", note: "campanhas que alteram o jogo em definitivo" },
    ],
  },
}

/** Pequenos anúncios classificados — o tempero do jornal. */
export const ads = [
  {
    head: "BARALHOS SOB MEDIDA",
    body: "Cartas de linho ou liso, 300 a 330g, verso uniforme e canto arredondado. Tiragem curta para protótipo, longa para edição. O baralho é a peça que mais se toca — não se economiza nela.",
    sign: "Prelo & Vinco, Lda. — Rua do Corte, 8",
  },
  {
    head: "RESINA & FILAMENTO",
    body: "Fornecemos PLA, PETG e resina de alta definição para o cavalheiro que imprime suas próprias miniaturas e marcadores. Amostras mediante carta.",
    sign: "Casa Prometeu — Rua da Bancada, 12",
  },
  {
    head: "PROCURA-SE",
    body: "Playtesters de constituição robusta e paciência incomum, para mesas de tabuleiro e de cartas. Paga-se em pizza e em créditos na caixa.",
    sign: "Dirigir-se a esta Redação",
  },
] as const

/** Notícias curtas em telegrama — a bancada e a praça, em linha única. */
export const briefs = {
  title: "Coleção em Telegrama",
  items: [
    "CARTAS — Terceiro corte do baralho aprovado sem emendas; parte para o prelo.",
    "TABULEIRO — Protótipo de colocação de peças chega à quinta versão de mapa.",
    "PREMIADOS — Quadro de láureas atualizado até o louro alemão de 2024.",
    "MINIATURAS — Nova leva sai do tanque de cura; pintura em lavagem começa segunda.",
    "3D — Bico de 0,2mm restabelecido após entupimento; camadas voltam ao normal.",
    "MERCADO — Tiragens declaradas revistas: Uno segue à frente da praça de cartas.",
  ],
}

/**
 * AS ZONAS DA FOLHA — fonte única, em ORDEM DE PÁGINA.
 *
 * Esta lista alimenta as três coisas que precisam concordar entre si: o menu
 * sanduíche (`section-nav.tsx`), o índice impresso no rodapé e o título
 * visível de cada zona. Antes a lista existia duplicada no componente do menu
 * e no índice — duas cópias que já divergiam em nome e em ordem.
 *
 * A REGRA: todo bloco de conteúdo da página pertence a uma destas zonas e
 * carrega a âncora correspondente. Se um bloco novo não couber em nenhuma,
 * acrescenta-se a zona AQUI — e ela aparece no menu e no índice de uma vez.
 *
 * A ordem é a de LEITURA da folha, não a da lista original de referência:
 * "Colunas de Texto", "Ilustrações" e "Editorial" convivem lado a lado dentro
 * da matéria de capa, e um menu que os listasse fora dessa ordem mandaria o
 * leitor para trás a cada clique.
 */
export const zones = [
  { id: "anf-manchete-principal", label: "Manchete Principal", page: "I" },
  { id: "anf-colunas-texto", label: "Colunas de Texto", page: "I" },
  // Editorial antes de Ilustrações: o aside do editorial abre no alto da
  // matéria de capa e a gravura vem mais abaixo. Ordem conferida medindo a
  // posição real de cada âncora na folha, não pela intuição da diagramação.
  { id: "anf-editorial", label: "Editorial", page: "I" },
  { id: "anf-ilustracoes", label: "Ilustrações", page: "I" },
  { id: "anf-noticias-secundarias", label: "Notícias Secundárias", page: "II" },
  { id: "anf-noticias-internacionais", label: "Notícias Internacionais", page: "II" },
  { id: "anf-mercado", label: "Mercado Financeiro e Comércio", page: "II" },
  { id: "anf-colecao", label: "Coleção", page: "III" },
  { id: "anf-anuncios", label: "Anúncios Publicitários", page: "III" },
  { id: "anf-servico", label: "Serviço ao Leitor", page: "IV" },
  { id: "anf-expediente", label: "Expediente", page: "IV" },
  { id: "anf-indice", label: "Índice desta Edição", page: "IV" },
] as const

/**
 * Índice impresso no rodapé — as zonas acima, mais a única rota externa da
 * folha. Não lista a si mesmo (`anf-indice`): um sumário que se cita é ruído.
 */
export const index = [
  ...zones
    .filter((z) => z.id !== "anf-indice")
    .map((z) => ({ label: z.label, href: `#${z.id}`, page: z.page })),
  { label: "Laboratório de Protótipos", href: "/anfitriao/laboratorio", page: "IV" },
]

/** Cadernos anunciados na barra de seções (mapeados às rotas reais). */
export const sections = [
  { label: "Reviews", href: "/anfitriao/laboratorio" },
  { label: "Outras Edições", href: "/portal" },
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
    /**
     * O cupom passou a ser um formulário de verdade (ver `anfitriao/actions.ts`),
     * e assinatura sem endereço de retorno não se despacha. No idioma da folha
     * é o endereço da coruja; no banco é a coluna `email`, obrigatória.
     */
    email: { label: "Endereço para a coruja", placeholder: "para onde despachar a resposta" },
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
    { item: "Feira de Ossos — tabuleiro", players: "2–4", score: "8" },
    { item: "Rota do Sal — tabuleiro", players: "3–5", score: "6" },
    { item: "Casa Torta — cartas", players: "2", score: "9" },
    { item: "Pilha de Vazas — cartas", players: "1–4", score: "5" },
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
