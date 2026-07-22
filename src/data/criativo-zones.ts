/**
 * Seeds das zonas da landing /criativo.
 *
 * Mesma função dos outros ficheiros de `data/`: são a fonte histórica que
 * popula o Supabase (botão "Publicar conteúdo novo do código" no /admin) e o
 * fallback de leitura quando não há banco configurado. Em produção quem manda
 * é a tabela — editar aqui não publica nada sozinho.
 */

export type ArtworkKind = "ilustracao" | "edicao" | "3d" | "pixel" | "vetor" | "colagem"
export type ComicStatus = "lendo" | "lido" | "fila" | "largado"
export type MovieStatus = "assistido" | "assistindo" | "fila"
export type VideoKind = "local" | "youtube" | "vimeo"
export type NoteAccent = "yellow" | "cyan" | "magenta" | "lime" | "orange" | "violet"

export interface Artwork {
  id: string
  title: string
  description: string
  kind: ArtworkKind
  image: string
  tools: string[]
  year: number
}

export interface Comic {
  id: string
  title: string
  author: string
  publisher: string
  cover_image: string
  status: ComicStatus
  rating: number
  note: string
}

export interface Movie {
  id: string
  title: string
  director: string
  year: number
  poster_image: string
  status: MovieStatus
  rating: number
  note: string
}

export interface Track {
  id: string
  title: string
  artist: string
  audio_url: string
  cover_image: string
  note: string
}

export interface Video {
  id: string
  title: string
  description: string
  video_url: string
  poster_image: string
  kind: VideoKind
}

export interface Note {
  id: string
  title: string
  body: string
  author: string
  accent: NoteAccent
  pinned: boolean
}

export interface Strip {
  id: string
  title: string
  image: string
  setup: string
  punchline: string
}

export const artworks: Artwork[] = [
  {
    id: "a1",
    title: "Retícula que não obedece",
    description: "Estudo de halftone em CSS puro. Virou o fundo desta página inteira.",
    kind: "ilustracao",
    image: "",
    tools: ["CSS", "SVG"],
    year: 2026,
  },
  {
    id: "a2",
    title: "Recorte de foil holográfico",
    description: "Reconstrução do brilho de carta de TCG sem imagem — só gradiente e blend mode.",
    kind: "edicao",
    image: "",
    tools: ["CSS", "Photoshop"],
    year: 2026,
  },
  {
    id: "a3",
    title: "Alfabeto de onomatopeia",
    description: "Letragem própria para os POW / ZAP / THWIP espalhados pelo site.",
    kind: "vetor",
    image: "",
    tools: ["Illustrator"],
    year: 2025,
  },
  {
    id: "a4",
    title: "Terra-8bit",
    description: "Retrato em 32×32 pixels com paleta de 8 cores. Restrição por esporte.",
    kind: "pixel",
    image: "",
    tools: ["Aseprite"],
    year: 2025,
  },
  {
    id: "a5",
    title: "Colagem do multiverso",
    description: "Vinte dimensões visuais numa página só, para ver o que sobrevive lado a lado.",
    kind: "colagem",
    image: "",
    tools: ["Figma"],
    year: 2026,
  },
  {
    id: "a6",
    title: "Portal em rotação",
    description: "Anel caleidoscópico feito só com conic-gradient animado.",
    kind: "3d",
    image: "",
    tools: ["CSS", "Blender"],
    year: 2026,
  },
]

export const comics: Comic[] = [
  {
    id: "c1",
    title: "Homem-Aranha: Aranhaverso",
    author: "Dan Slott",
    publisher: "Marvel",
    cover_image: "",
    status: "lendo",
    rating: 5,
    note: "A razão de este site inteiro existir.",
  },
  {
    id: "c2",
    title: "Sandman",
    author: "Neil Gaiman",
    publisher: "Vertigo",
    cover_image: "",
    status: "lendo",
    rating: 5,
    note: "Leio devagar de propósito. Não quero que acabe.",
  },
  {
    id: "c3",
    title: "Watchmen",
    author: "Alan Moore",
    publisher: "DC",
    cover_image: "",
    status: "lido",
    rating: 5,
    note: "A grade de nove quadros virou meu jeito de pensar layout.",
  },
  {
    id: "c4",
    title: "Saga",
    author: "Brian K. Vaughan",
    publisher: "Image",
    cover_image: "",
    status: "fila",
    rating: 0,
    note: "Todo mundo insiste. Chegou a hora.",
  },
  {
    id: "c5",
    title: "Batman: Ano Um",
    author: "Frank Miller",
    publisher: "DC",
    cover_image: "",
    status: "lido",
    rating: 4,
    note: "Aula de como contar com sombra e pouco diálogo.",
  },
]

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Aranhaverso",
    director: "Bob Persichetti",
    year: 2018,
    poster_image: "",
    status: "assistido",
    rating: 5,
    note: "Provou que animação podia ter grão, retícula e erro de registro de impressão.",
  },
  {
    id: "m2",
    title: "Através do Aranhaverso",
    director: "Joaquim Dos Santos",
    year: 2023,
    poster_image: "",
    status: "assistido",
    rating: 5,
    note: "Cada dimensão com técnica de arte própria. Roubei a ideia sem pedir.",
  },
  {
    id: "m3",
    title: "Blade Runner 2049",
    director: "Denis Villeneuve",
    year: 2017,
    poster_image: "",
    status: "assistido",
    rating: 5,
    note: "Referência de cor sempre que preciso de laranja contra ciano.",
  },
  {
    id: "m4",
    title: "Akira",
    director: "Katsuhiro Otomo",
    year: 1988,
    poster_image: "",
    status: "assistindo",
    rating: 0,
    note: "Revisitando pelo neon e pelas linhas de velocidade.",
  },
]

export const tracks: Track[] = [
  {
    id: "t1",
    title: "Faixa de teste",
    artist: "Lucas Riboldi",
    audio_url: "",
    cover_image: "",
    note: "Suba o arquivo pelo /admin → Rádio. Enquanto não houver áudio, o visualizador roda em modo demo.",
  },
]

export const videos: Video[] = [
  {
    id: "v1",
    title: "Making of: as 20 dimensões",
    description: "Timelapse de como cada dimensão visual do site foi construída em CSS.",
    video_url: "",
    poster_image: "",
    kind: "local",
  },
]

export const notes: Note[] = [
  {
    id: "n1",
    title: "Por que este site existe",
    body: "Não é vitrine de venda. É oficina: tudo que eu testo, quebro e conserto fica registrado aqui.",
    author: "Lucas",
    accent: "yellow",
    pinned: true,
  },
  {
    id: "n2",
    title: "Regra da casa",
    body: "Se um experimento não couber numa página, ele vira uma dimensão nova.",
    author: "Lucas",
    accent: "cyan",
    pinned: false,
  },
  {
    id: "n3",
    title: "Lembrete",
    body: "Terminar o visualizador de áudio antes de começar mais três coisas.",
    author: "Lucas",
    accent: "magenta",
    pinned: false,
  },
  {
    id: "n4",
    title: "Anotado de um leitor",
    body: "\"O site demora mais para carregar na minha cabeça do que no navegador.\" — obrigado, acho.",
    author: "Recado",
    accent: "lime",
    pinned: false,
  },
]

export const strips: Strip[] = [
  {
    id: "s1",
    title: "O bug",
    image: "",
    setup: "Funciona na minha máquina.",
    punchline: "Então vamos entregar a sua máquina para o cliente.",
  },
  {
    id: "s2",
    title: "Design system",
    image: "",
    setup: "Temos um componente de botão para isso.",
    punchline: "Temos catorze componentes de botão para isso.",
  },
  {
    id: "s3",
    title: "A estimativa",
    image: "",
    setup: "É só mudar uma cor.",
    punchline: "Três dias depois, ainda mudando a cor.",
  },
]
