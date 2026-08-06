import type { Accent } from "@/components/comic/atoms"
import type { Treatment } from "@/components/comic/glitch-title"
import type { ChapterId } from "@/design-system/comic-layout"

/**
 * Copy da landing /criativo — o multiverso pessoal do Lucas Riboldi.
 *
 * Não é página de venda: é oficina e arquivo. Tudo que ele testa, desenha,
 * quebra, lê, assiste e ouve fica registrado aqui, cada assunto numa dimensão
 * visual própria.
 *
 * Vive em `constants/` e não em `data/`: `data/` guarda os seeds das tabelas do
 * Supabase, e o que está aqui é texto editorial da página, versionado junto
 * com o código.
 */

/**
 * Imagem de reserva de toda a revista.
 *
 * Um único ponto para o marcador de lugar: a arte comic do realm Creative,
 * gerada para o multiverso e livre de direitos. Enquanto não houver capa
 * própria, é ela que ocupa o requadro — no herói, nos cartões e nas lâminas da
 * galeria. Trocar o marcador por outro é trocar esta linha, e não caçar
 * `/realms/creative.png` por seis ficheiros.
 */
export const IMAGEM_TEMPORARIA = "/realms/creative.png"

export const HERO = {
  kicker: "Edição #2026 · Terra-LR",
  /** Assinatura do autor na capa, na anomalia Terra-138 · Punk. */
  author: "Lucas Riboldi",
  authorTag: "Terra-138 · Punk · ANOMALIAS",
  /** Manchete em três tempos: as duas primeiras em letragem, a terceira glitch. */
  titleTop: "Um grande",
  titleMid: "repositório",
  titleGlitch: "de ideias",
  subtitle:
    "Aqui é o Lucas. Este lugar não vende nada — é onde eu deixo registrado o que ando desenhando, programando, editando, lendo, assistindo e ouvindo. Cada seção é uma dimensão diferente do mesmo multiverso: o meu.",
  bubble: "Cuidado: nada aqui foi finalizado. É de propósito.",
  thought: "Se um experimento não cabe numa página, vira uma dimensão nova.",
  primaryCta: { label: "Descer pro multiverso", href: "#atelie" },
  secondaryCta: { label: "As 20 dimensões", href: "/dimensoes" },
} as const

/** Metadados de cada zona — cabeçalho, numeração e assinatura "Terra-XXX". */
export interface ZoneMeta {
  id: ChapterId
  titleId: string
  index: string
  earth: string
  kicker: string
  title: string
  subtitle: string
  /** Sem valor, a `Zone` aplica letras 3D — o tratamento padrão da página. */
  treatment?: Treatment
}

/**
 * Metadados de todas as zonas — as da capa e as da Sala.
 *
 * A numeração é a ORDEM DE LEITURA de cada página, não um identificador
 * global: a revista tem cinco capítulos (01–05) e a Sala, que é outro
 * fascículo, recomeça em 01. Rádio, videoteca e tirinhas mudaram de página em
 * 06/08/2026 e por isso mudaram de número — quem numerava 05, 06 e 08 na capa
 * agora numera 01, 02 e 03 na Sala.
 */
export const ZONES: Record<Exclude<ChapterId, "multiverso">, ZoneMeta> = {
  atelie: {
    id: "atelie",
    titleId: "z-atelie",
    index: "01",
    earth: "Terra-1610 · Spray",
    kicker: "O ateliê",
    title: "Artes & imagens",
    subtitle:
      "Ilustração, vetor, pixel, colagem e edição de imagem. Muita coisa aqui nasceu de um teste que deu errado e ficou bonito assim mesmo.",
  },
  oficina: {
    id: "oficina",
    titleId: "z-oficina",
    index: "02",
    earth: "Terra-BYTE · Blueprint",
    kicker: "A oficina",
    title: "Sites & componentes",
    subtitle:
      "O que eu construo em código: interfaces, componentes, experimentos de CSS e coisas que só existem para responder a pergunta “será que dá?”.",
    // Fundo azul-blueprint → título cromado (metal frio, tecnologia).
    treatment: "chrome",
  },
  banca: {
    id: "banca",
    titleId: "z-banca",
    index: "03",
    earth: "Terra-616 · Banca",
    kicker: "A banca",
    title: "O que ando lendo",
    subtitle:
      "Quadrinhos na cabeceira, na fila e os que já foram. Metade do que aparece no resto do site começou numa destas páginas.",
    // Fundo creme de jornal → letra vermelha de contorno duro (tinta de banca).
    treatment: "letter",
  },
  cine: {
    id: "cine",
    titleId: "z-cine",
    index: "04",
    earth: "Terra-42 · Projeção",
    kicker: "O cine",
    title: "Sessão da madrugada",
    subtitle:
      "Filmes que mexeram com o jeito que eu enxergo cor, enquadramento e ritmo. Sem crítica — só anotação de quem estava olhando o fundo da cena.",
    // Fundo escuro de projeção → neon (a marquise do cinema).
    treatment: "neon",
  },
  /* ── Fascículo "A sala" (/criativo/sala) ───────────────────────────── */
  radio: {
    id: "radio",
    titleId: "z-radio",
    index: "01",
    earth: "Terra-1969 · Onda",
    kicker: "A rádio",
    title: "Trilha sonora",
    subtitle:
      "A zona mais barulhenta do multiverso. Dá play e o visualizador reage ao som de verdade.",
    treatment: "rainbow",
  },
  videoteca: {
    id: "videoteca",
    titleId: "z-videoteca",
    index: "02",
    earth: "Terra-VHS · Fita",
    kicker: "A videoteca",
    title: "Fita rodando",
    subtitle:
      "Making of, timelapse e registro em movimento das coisas que não cabem numa imagem parada.",
    // Fundo verde-VHS escuro → separação RGB (o erro de rastreio da fita).
    treatment: "offset",
  },
  /* ── De volta à capa ────────────────────────────────────────────────── */
  mural: {
    id: "mural",
    titleId: "z-mural",
    index: "05",
    earth: "Terra-CORTIÇA · Papel",
    kicker: "O mural",
    title: "Recados & bilhetes",
    subtitle:
      "Anotações, lembretes e recados pregados na parede. É o mais perto de um blog que este lugar chega.",
    // Fundo creme de cortiça → contorno duplo (recorte de adesivo pregado).
    treatment: "outline",
  },
  tirinhas: {
    id: "tirinhas",
    titleId: "z-tirinhas",
    index: "03",
    earth: "Terra-8311 · Piada",
    kicker: "As tirinhas",
    title: "Quadrinhos de verdade",
    subtitle:
      "A parte que existe só para brincadeira. Dois quadros, uma piada, nenhuma pretensão.",
    // Fundo azul-claro/creme → 3D profundo (a piada precisa de volume de gibi).
    treatment: "3d-deep",
  },
}

/**
 * Capa do fascículo "A sala" (`/criativo/sala`).
 *
 * As três zonas que moraram na capa até 06/08/2026 têm em comum o verbo: na
 * rádio ouve-se, na videoteca vê-se, nas tirinhas lê-se. As outras cinco são
 * de FAZER — desenhar, construir, anotar. Separá-las deu à revista um fascículo
 * de criação e outro de fruição, e encurtou uma capa que estava com oito
 * capítulos.
 */
export const SALA = {
  kicker: "Fascículo #2 · Terra-LR",
  titleTop: "A sala",
  titleGlitch: "de estar",
  subtitle:
    "A parte do multiverso que se consome sentado: o que toca no rádio, o que roda na fita e o que se lê em duas tiras. Nada aqui se produz — aqui só se assiste.",
  bubble: "Pega uma cadeira.",
  backCta: { label: "Voltar para a capa", href: "/criativo" },
} as const

export interface FunStat {
  value: number
  suffix: string
  label: string
  accent: Accent
}

/** Números da capa — contagem do arquivo, não métrica de venda. */
export const FUN_STATS: FunStat[] = [
  { value: 20, suffix: "", label: "dimensões visuais", accent: "magenta" },
  { value: 8, suffix: "", label: "zonas neste multiverso", accent: "cyan" },
  { value: 0, suffix: "", label: "coisas à venda", accent: "yellow" },
  { value: 100, suffix: "%", label: "feito por curiosidade", accent: "lime" },
]

export const OUTRO = {
  kicker: "Fim da edição",
  title: "Continua",
  glitch: "no próximo número",
  subtitle:
    "Volte quando quiser: o arquivo cresce sempre que eu invento alguma coisa. Se quiser trocar ideia sobre qualquer uma destas dimensões, é só chamar.",
  primaryCta: { label: "Falar comigo", href: "/portfolio#contato" },
  secondaryCta: { label: "Ver o portfólio", href: "/portfolio" },
} as const
