/**
 * THE MEEPLE & ANVIL GAZETTE — conteúdo da primeira página do realm Anfitrião.
 *
 * Jornal inglês do fim do séc. XIX dedicado à criação de jogos de tabuleiro:
 * game design, mecânicas, prototipagem, impressão 3D, miniaturas, print & play.
 * Cada "matéria" e cada verbete do índice aponta para uma seção real do realm —
 * nada aqui é decorativo-morto.
 */

export const paper = {
  masthead: "The Meeple & Anvil",
  mastheadSub: "Gazette",
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
  href: "/anfitriao/redacao",
}

/** Matérias secundárias — cada uma leva a uma seção real. */
export const reports = [
  {
    kicker: "Relatório Especial",
    head: "NEGOCIAÇÕES DE REGRAS FRACASSAM",
    sub: "Comitê de playtest promete nova rodada de ajustes até a próxima edição",
    dropcap: "A",
    body: "assembleia de projetistas rompeu o acordo sobre a curva de dificuldade na noite de quarta. O impasse gira em torno do terceiro turno, onde o motor de recursos dispara e a partida, dizem os presentes, decide-se sozinha. A oficina abriu as bancadas para exame público dos gabaritos.",
    note: "Nota: as atas do playtest seguem disponíveis para consulta.",
    href: "/anfitriao/oficina",
    cta: "Matéria completa",
    page: "pág. 3",
    chart: false,
  },
  {
    kicker: "Do Caderno Técnico",
    head: "ONDE ARRANJAMOS NOVAS MECÂNICAS?",
    sub: "Loops, economias e tensão, catalogados para quem ficou sem núcleo de jogo",
    dropcap: "O",
    body: "s estudiosos do balanceamento apontam para o Caderno das Mecânicas, onde se acham descritos, com verbete e exemplo, os motores que movem a mesa: deckbuilding, alocação de trabalhadores, pressão da sorte e assimetria de facções.",
    note: "Vide também: tabela de raridades, pág. 9.",
    href: "/anfitriao/mecanicas",
    cta: "Ler o caderno",
    page: "págs. 8/9",
    chart: false,
  },
  {
    kicker: "Mercado & Materiais",
    head: "PREÇOS DAS CARTAS DESABAM",
    sub: "Índice de raridade despenca após novo playtest; bancadas abertas à visitação",
    dropcap: "O",
    body: "índice de raridade recuou pelo quarto mês seguido, arrastado pela reimpressão dos protótipos e pela queda do filamento. O Laboratório expõe as peças que causaram o tombo e convida o leitor a examiná-las de perto.",
    note: "Gravura do índice ao lado.",
    href: "/anfitriao/laboratorio",
    cta: "Ver o laboratório",
    page: "págs. 3/4",
    chart: true,
  },
  {
    kicker: "Da Prensa",
    head: "PRINT & PLAY: OS FATOS",
    sub: "Notas de produção, gabaritos e os bastidores das edições independentes",
    dropcap: "A",
    body: "Imprensa do Inventor reúne as notas de produção, os arquivos de recorte, as sangrias e os enganos honestos de quem edita por conta própria. Publicam-se aqui os fatos que o entusiasta precisa conhecer antes de acionar o prelo.",
    note: "Inclui tabela de gramaturas.",
    href: "/anfitriao/imprensa",
    cta: "Ir à imprensa",
    page: "págs. 4/5",
    chart: false,
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
  { label: "Editorial & Redação", href: "/anfitriao/redacao", page: "II" },
  { label: "Oficina do Inventor", href: "/anfitriao/oficina", page: "III" },
  { label: "Laboratório de Protótipos", href: "/anfitriao/laboratorio", page: "IV" },
  { label: "Imprensa & Print-and-Play", href: "/anfitriao/imprensa", page: "V" },
  { label: "Caderno das Mecânicas", href: "/anfitriao/mecanicas", page: "VIII" },
]

/** Cadernos anunciados na barra de seções (mapeados às rotas reais). */
export const sections = [
  { label: "Game Design", href: "/anfitriao/mecanicas" },
  { label: "Board & Card Games", href: "/anfitriao/mecanicas" },
  { label: "RPG de Mesa", href: "/anfitriao/mecanicas" },
  { label: "Prototipagem", href: "/anfitriao/oficina" },
  { label: "Impressão 3D", href: "/anfitriao/oficina" },
  { label: "Miniaturas", href: "/anfitriao/oficina" },
  { label: "Materiais", href: "/anfitriao/imprensa" },
  { label: "Tutoriais", href: "/anfitriao/imprensa" },
  { label: "Reviews", href: "/anfitriao/laboratorio" },
  { label: "História dos Jogos", href: "/anfitriao/redacao" },
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
