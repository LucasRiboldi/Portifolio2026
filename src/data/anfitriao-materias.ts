/**
 * AS MATÉRIAS DAS PÁGINAS INTERNAS.
 *
 * Até aqui o jornal tinha uma folha só: a matéria de capa abria, dava três
 * parágrafos e terminava. Não havia para onde continuar — o "continua na
 * pág. II" seria mentira tipográfica, porque a página II não existia.
 *
 * Cada matéria daqui é uma página interna inteira, com a anatomia que o
 * impresso pede: folio, cabeça, olho, capitular, corpo em colunas, intertítulos,
 * gravura com legenda, boxes de apoio, assinatura e pé com créditos. A voz é a
 * mesma da folha — 1920, formal, "esta folha", numeração romana.
 *
 * A relação com a capa é de continuação, não de duplicata: o texto daqui começa
 * onde o da primeira página termina.
 */

export interface MateriaBox {
  title: string
  /** Parágrafos curtos ou itens — o componente decide pela forma. */
  body?: string[]
  rows?: [string, string][]
  items?: string[]
}

export interface MateriaBloco {
  /** Intertítulo que abre o bloco. Ausente no primeiro, que segue a capitular. */
  subhead?: string
  paragraphs: string[]
}

export interface Materia {
  slug: string
  /** Caderno a que pertence — impresso no folio. */
  caderno: string
  /** Página romana onde a matéria "sai". */
  page: string
  kicker: string
  headline: string
  subhead: string
  standfirst: string
  byline: string
  bylineRole: string
  dateline: string
  /** Se veio da capa, o texto do link de retorno. */
  continuaDe?: string
  dropcap: string
  openLine: string
  blocos: MateriaBloco[]
  pullquote: string
  figure: {
    /** Descrição da gravura — o impresso descreve o que a chapa mostraria. */
    caption: string
    credit: string
  }
  boxes: MateriaBox[]
  /** Fecho assinado, como no impresso. */
  sign: string
  /** Metadados de pé de página. */
  colofao: {
    composta: string
    revisao: string
    chapas: string
  }
  /** Chamadas para as outras matérias — o "leia também" do impresso. */
  remissoes: { slug: string; label: string }[]
}

export const materias: Materia[] = [
  {
    slug: "a-regra-que-desaparece",
    caderno: "Oficina",
    page: "II",
    kicker: "Continuação da Primeira Página",
    headline: "A REGRA QUE DESAPARECE",
    subhead:
      "Segunda parte do relato: o que acontece entre o protótipo feio e a mesa que emudece — e por que a maioria das folhas vai ao cesto",
    standfirst:
      "Prossegue a exposição iniciada na primeira página. Trata-se agora do intervalo mais ingrato do ofício: aquele em que o jogo já funciona e ainda assim não presta.",
    byline: "por Lucas Riboldi",
    bylineRole: "Game Designer & Editor desta folha",
    dateline: "Da nossa bancada, à segunda vigília",
    continuaDe: "Continuação da matéria de capa",
    dropcap: "H",
    openLine:
      "á um estado intermédio que os manuais não nomeiam e que todo aquele que já cortou cartão conhece de cor: o do jogo que funciona. As regras fecham, ninguém pergunta nada duas vezes, a partida chega ao fim na hora prevista — e, no entanto, ao levantar da mesa, ninguém tem o que contar. Funcionar não é o bastante. É apenas a condição para começar.",
    blocos: [
      {
        paragraphs: [
          "O erro que se comete nessa fronteira é o de tomar a ausência de defeito por presença de virtude. Corrige-se o desequilíbrio, apara-se a regra confusa, encurta-se a duração — e cada correção deixa o jogo mais liso e menos memorável. Alisa-se até o tédio. Esta folha já enterrou quatro protótipos assim, todos impecáveis.",
          "O que falta a esses cadáveres bem-comportados é o momento de tensão: o instante em que a decisão custa. Um jogo sem custo é um passatempo com peças; agrada enquanto dura e evapora ao guardar a caixa.",
        ],
      },
      {
        subhead: "Do silêncio como instrumento de medida",
        paragraphs: [
          "Aprendeu-se nesta oficina a observar menos o que se diz à mesa e mais o que se cala. O silêncio de tédio e o silêncio de cálculo parecem-se de longe e nada têm em comum. O primeiro é frouxo, acompanhado de olhares para a janela; o segundo é tenso, e o corpo se inclina sobre o tabuleiro.",
          "Registramos ambos em caderno próprio, com a hora e a rodada. Ao fim de uma temporada, o caderno diz mais que qualquer questionário: os pontos em que o segundo silêncio aparece são o esqueleto do jogo, e o que estiver fora deles pode ser cortado sem dó.",
          "Foi assim que o protótipo de colocação de peças perdeu um terço das regras entre a quarta e a quinta versão. Nenhuma daquelas regras era má. Todas eram silêncio do primeiro tipo.",
        ],
      },
      {
        subhead: "O cesto e sua aritmética",
        paragraphs: [
          "Contabiliza-se nesta casa quatrocentas e dezessete folhas descartadas. O número consta do quadro de estatísticas publicado na primeira página e costuma causar espanto ao visitante, que o toma por desperdício. É o contrário: é o preço declarado do método.",
          "Cada folha ao cesto é uma hipótese que foi levada à mesa e reprovada por evidência, não por gosto. O desperdício verdadeiro seria o oposto — guardar a hipótese por afeição e descobrir na tiragem que ela não se sustentava.",
        ],
      },
      {
        subhead: "Do tema, enfim",
        paragraphs: [
          "Só depois de estabelecido o esqueleto convém vestir o jogo. E então a escolha do tema deixa de ser ornamento e passa a ser argumento: escolhe-se o tema que explica a mecânica, não o que a decora. Se a mecânica trata de escassez, que o tema seja de escassez; caso contrário, o jogador há de aprender duas coisas incompatíveis ao mesmo tempo e não aprenderá nenhuma.",
          "É neste ponto que o ofício se aproxima da tipografia, arte irmã desta folha: também ali a forma tem de servir ao sentido, e o ornamento que atrapalha a leitura é ornamento a menos, nunca a mais.",
        ],
      },
    ],
    pullquote:
      "Funcionar não é o bastante. É apenas a condição para começar.",
    figure: {
      caption:
        "Fig. II — O caderno de observação aberto na sessão de 14 de maio: à esquerda, a hora; ao centro, a rodada; à direita, a natureza do silêncio.",
      credit: "Chapa da casa",
    },
    boxes: [
      {
        title: "As Quatro Provas da Bancada",
        items: [
          "Prova do cartão cru — o jogo diverte sem ilustração alguma?",
          "Prova do silêncio — os calados são de cálculo ou de tédio?",
          "Prova da segunda partida — alguém pede para repetir sem ser convidado?",
          "Prova do relato — ao levantar da mesa, há história para contar?",
        ],
      },
      {
        title: "Números desta Temporada",
        rows: [
          ["Folhas ao cesto", "CDXVII"],
          ["Protótipos levados à mesa", "XXII"],
          ["Sobreviveram à quarta prova", "III"],
          ["Sessões registradas em caderno", "LXXXVI"],
        ],
      },
    ],
    sign: "— L. R.",
    colofao: {
      composta: "Composta em Vollkorn de corpo 10, entrelinha 14",
      revisao: "Revisão desta folha",
      chapas: "Duas chapas, gravadas na casa",
    },
    remissoes: [
      { slug: "o-preco-do-cartao", label: "Mercado & Materiais: o preço do cartão" },
      { slug: "entrevista-a-mesa-de-quatro", label: "Entrevista: a mesa de quatro" },
    ],
  },
  {
    slug: "o-preco-do-cartao",
    caderno: "Mercado & Materiais",
    page: "III",
    kicker: "Mercado & Materiais",
    headline: "O PREÇO DO CARTÃO E O QUE ELE ENSINA",
    subhead:
      "Índice de raridade recua pelo quarto mês; a reimpressão dos protótipos e a queda do filamento explicam o tombo — e recolocam uma questão antiga sobre o valor do componente",
    standfirst:
      "Levantamento desta folha sobre o custo dos materiais de bancada, com a tabela de preços praticados e uma advertência ao aprendiz apressado.",
    byline: "por Lucas Riboldi",
    bylineRole: "da nossa Redação",
    dateline: "Da praça, em fim de mês",
    dropcap: "R",
    openLine:
      "ecuou pelo quarto mês seguido o índice de raridade das cartas, arrastado por dois movimentos que pouco têm em comum: de um lado, a reimpressão franca dos protótipos, que jogou na praça exemplares antes tidos por escassos; de outro, a queda do filamento, que barateou o marcador impresso e retirou da carta parte da função que ela acumulava.",
    blocos: [
      {
        paragraphs: [
          "O efeito imediato é o alívio de quem prototipa. Um baralho de prova, que há um ano exigia parcimônia, hoje se corta e se recorta sem cerimônia — e a bancada agradece, pois a parcimônia é inimiga declarada da quinta versão.",
          "O efeito mediato é menos simpático e merece registro: barateado o componente, cresce a tentação de resolver por acúmulo o que deveria resolver-se por desenho. Vê-se protótipo com noventa peças onde trinta bastariam, e o excesso não é generosidade — é indecisão materializada em papelão.",
        ],
      },
      {
        subhead: "A tabela e suas armadilhas",
        paragraphs: [
          "Publicamos ao lado os preços correntes, apurados junto às casas da praça. Duas advertências acompanham a tabela.",
          "A primeira: o preço por unidade engana em tiragem curta, onde a preparação pesa mais que o material. Cem cartas custam quase o mesmo que trezentas, e o aprendiz que economiza cortando a tiragem costuma pagar mais caro por carta.",
          "A segunda: o linho custa mais que o liso e vale a diferença apenas quando o baralho é manuseado à exaustão. Em protótipo, o liso basta — e o linho ali é vaidade prematura.",
        ],
      },
      {
        subhead: "Do que não baixou de preço",
        paragraphs: [
          "Não baixou, nem há de baixar, o custo do tempo de mesa. Continua sendo o insumo mais caro desta oficina e o único que não se compra por metro: exige gente sentada, disposta e paciente, em hora que a todos convenha.",
          "É por isso que esta folha insiste em pagar seus playtesters — em pizza e em crédito na caixa, conforme anúncio publicado à página anterior. Quem trata o tempo alheio como gratuito acaba sem mesa.",
        ],
      },
    ],
    pullquote:
      "O excesso de componentes não é generosidade: é indecisão materializada em papelão.",
    figure: {
      caption:
        "Fig. III — Amostras de gramatura dispostas em escada, do cartão de prova ao linho de 330g, com o corte de canto à direita.",
      credit: "Gravura da casa, sobre amostras cedidas",
    },
    boxes: [
      {
        title: "Preços Correntes na Praça",
        rows: [
          ["Cartão de prova, cento", "baixa"],
          ["Liso 300g, cento", "estável"],
          ["Linho 330g, cento", "alta leve"],
          ["Filamento, quilo", "baixa forte"],
          ["Resina, litro", "estável"],
        ],
      },
      {
        title: "Conselho ao Aprendiz",
        body: [
          "Corte primeiro em papel comum. A tesoura é mais barata que o arrependimento, e o cartão bom há de esperar pela terceira versão.",
        ],
      },
    ],
    sign: "— A Redação",
    colofao: {
      composta: "Composta em Vollkorn de corpo 10, entrelinha 14",
      revisao: "Preços apurados junto às casas da praça",
      chapas: "Uma chapa, gravada na casa",
    },
    remissoes: [
      { slug: "a-regra-que-desaparece", label: "Oficina: a regra que desaparece" },
      { slug: "entrevista-a-mesa-de-quatro", label: "Entrevista: a mesa de quatro" },
    ],
  },
  {
    slug: "entrevista-a-mesa-de-quatro",
    caderno: "Entrevista",
    page: "III",
    kicker: "Entrevista desta Edição",
    headline: "“A MESA DIZ A VERDADE ANTES DE VOCÊ QUERER OUVIR”",
    subhead:
      "Conversa com uma playtester de sete temporadas sobre o que se aprende do outro lado da bancada — e sobre o mau costume de o autor explicar a própria regra",
    standfirst:
      "Recebemos em nossa oficina quem já sentou a mais mesas de prova que qualquer outra pessoa desta casa. A conversa foi longa; publica-se o essencial, com os cortes assinalados.",
    byline: "entrevista conduzida por Lucas Riboldi",
    bylineRole: "Editor desta folha",
    dateline: "Na bancada, em tarde de sábado",
    dropcap: "S",
    openLine:
      "ete temporadas de mesa dão a uma pessoa autoridade que nenhum manual confere. Nossa entrevistada pediu que não a nomeássemos — “ponha playtester, que é o ofício” — e concedeu a esta folha uma hora de conversa franca, por vezes incômoda para quem assina os protótipos.",
    blocos: [
      {
        subhead: "Sobre o pior hábito do autor",
        paragraphs: [
          "«O pior é explicar. O autor senta, distribui as peças e começa a contar o que a regra quer dizer. Ora, se precisa contar, a regra não disse. Eu peço sempre: entregue o livrinho e cale-se. O silêncio dele é metade do teste.»",
          "«Já vi autor interromper a partida três vezes para esclarecer. No fim perguntou se tinha ficado claro. Claro ficou — a explicação dele. O jogo, ninguém chegou a jogar.»",
        ],
      },
      {
        subhead: "Sobre o que a mesa percebe primeiro",
        paragraphs: [
          "«A duração. Antes de qualquer coisa, a mesa sente se o jogo é longo demais para o que oferece. E não é questão de relógio: é de promessa. Um jogo de duas horas que promete duas horas de tensão está curto. Um de quarenta minutos que promete e não entrega está longo.»",
          "«Depois vem a decisão que não importa. Aquela jogada em que você escolhe entre três coisas e sabe que dá no mesmo. Uma dessas por partida a gente perdoa. Três, e a mesa desiste — educadamente, continua jogando, mas desistiu.»",
        ],
      },
      {
        subhead: "Sobre a segunda partida",
        paragraphs: [
          "«Só confio na segunda. Na primeira, todo mundo está aprendendo e confunde novidade com prazer. A segunda é que separa: se ninguém propõe a segunda, está respondido, e não adianta perguntar por quê. As pessoas não sabem dizer por que não querem repetir. Elas só não querem.»",
        ],
      },
      {
        subhead: "Sobre o pagamento em pizza",
        paragraphs: [
          "«Aceito e recomendo. Mas o que segura playtester não é a pizza, é ver a versão seguinte. Quando você aponta um problema e três semanas depois ele sumiu do jogo, você entendeu que foi ouvido. Aí volta sempre.»",
          "«O autor que não muda nada perde a mesa em duas temporadas. E vai achar que foi falta de tempo das pessoas.»",
        ],
      },
    ],
    pullquote:
      "Se precisa contar, a regra não disse. Entregue o livrinho e cale-se: o silêncio do autor é metade do teste.",
    figure: {
      caption:
        "Fig. IV — A mesa de quatro em sessão, vista do lugar do observador: o livrinho fechado ao centro, por exigência da entrevistada.",
      credit: "Chapa tomada com licença dos presentes",
    },
    boxes: [
      {
        title: "O Que Ela Pede ao Autor",
        items: [
          "Entregar o livrinho e não explicar nada.",
          "Anotar sem discutir; a defesa vem depois da partida.",
          "Marcar a hora em que a mesa emudece.",
          "Mostrar a versão seguinte a quem apontou o problema.",
        ],
      },
      {
        title: "Nota da Redação",
        body: [
          "A entrevistada revisou as próprias falas antes da composição, conforme praxe desta folha. Os cortes assinalados entre colchetes suprimem apenas repetições.",
        ],
      },
    ],
    sign: "— L. R.",
    colofao: {
      composta: "Composta em Vollkorn de corpo 10, entrelinha 14",
      revisao: "Falas revistas pela entrevistada",
      chapas: "Uma chapa, com licença dos presentes",
    },
    remissoes: [
      { slug: "a-regra-que-desaparece", label: "Oficina: a regra que desaparece" },
      { slug: "o-preco-do-cartao", label: "Mercado & Materiais: o preço do cartão" },
    ],
  },
]

export function getMateria(slug: string) {
  return materias.find((m) => m.slug === slug)
}
