import type { Accent } from "@/components/comic/atoms"
import type { Treatment } from "@/components/comic/glitch-title"
import type { ZoneId } from "@/components/comic/zone"

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
  id: ZoneId
  titleId: string
  index: string
  earth: string
  kicker: string
  title: string
  subtitle: string
  /** Sem valor, a `Zone` aplica letras 3D — o tratamento padrão da página. */
  treatment?: Treatment
}

export const ZONES: Record<Exclude<ZoneId, "multiverso">, ZoneMeta> = {
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
  radio: {
    id: "radio",
    titleId: "z-radio",
    index: "05",
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
    index: "06",
    earth: "Terra-VHS · Fita",
    kicker: "A videoteca",
    title: "Fita rodando",
    subtitle:
      "Making of, timelapse e registro em movimento das coisas que não cabem numa imagem parada.",
    // Fundo verde-VHS escuro → separação RGB (o erro de rastreio da fita).
    treatment: "offset",
  },
  mural: {
    id: "mural",
    titleId: "z-mural",
    index: "07",
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
    index: "08",
    earth: "Terra-8311 · Piada",
    kicker: "As tirinhas",
    title: "Quadrinhos de verdade",
    subtitle:
      "A parte que existe só para brincadeira. Dois quadros, uma piada, nenhuma pretensão.",
    // Fundo azul-claro/creme → 3D profundo (a piada precisa de volume de gibi).
    treatment: "3d-deep",
  },
}

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
