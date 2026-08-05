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
    image: "/covers/artes/a1.svg",
    tools: ["CSS", "SVG"],
    year: 2026,
  },
  {
    id: "a2",
    title: "Recorte de foil holográfico",
    description: "Reconstrução do brilho de carta de TCG sem imagem — só gradiente e blend mode.",
    kind: "edicao",
    image: "/covers/artes/a2.svg",
    tools: ["CSS", "Photoshop"],
    year: 2026,
  },
  {
    id: "a3",
    title: "Alfabeto de onomatopeia",
    description: "Letragem própria para os POW / ZAP / THWIP espalhados pelo site.",
    kind: "vetor",
    image: "/covers/artes/a3.svg",
    tools: ["Illustrator"],
    year: 2025,
  },
  {
    id: "a4",
    title: "Terra-8bit",
    description: "Retrato em 32×32 pixels com paleta de 8 cores. Restrição por esporte.",
    kind: "pixel",
    image: "/covers/artes/a4.svg",
    tools: ["Aseprite"],
    year: 2025,
  },
  {
    id: "a5",
    title: "Colagem do multiverso",
    description: "Vinte dimensões visuais numa página só, para ver o que sobrevive lado a lado.",
    kind: "colagem",
    image: "/covers/artes/a5.svg",
    tools: ["Figma"],
    year: 2026,
  },
  {
    id: "a6",
    title: "Portal em rotação",
    description: "Anel caleidoscópico feito só com conic-gradient animado.",
    kind: "3d",
    image: "/covers/artes/a6.svg",
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
    cover_image: "/covers/revistas/amazing-spider-man.webp",
    status: "lendo",
    rating: 5,
    note: "A razão de este site inteiro existir.",
  },
  {
    id: "c2",
    title: "Sandman",
    author: "Neil Gaiman",
    publisher: "Vertigo",
    cover_image: "/covers/revistas/sandman.webp",
    status: "lendo",
    rating: 5,
    note: "Leio devagar de propósito. Não quero que acabe.",
  },
  {
    id: "c3",
    title: "Watchmen",
    author: "Alan Moore",
    publisher: "DC",
    cover_image: "/covers/revistas/watchmen.webp",
    status: "lido",
    rating: 5,
    note: "A grade de nove quadros virou meu jeito de pensar layout.",
  },
  {
    id: "c4",
    title: "Saga",
    author: "Brian K. Vaughan",
    publisher: "Image",
    // Sem capa no arquivo: a `MediaFrame` entra em modo `themed` e desenha o
    // requadro de fallback. Melhor um vazio diagramado do que um src partido.
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
    cover_image: "/covers/revistas/batman-year-one.webp",
    status: "lido",
    rating: 4,
    note: "Aula de como contar com sombra e pouco diálogo.",
  },
  {
    id: "c6",
    title: "21st Century Boys",
    author: "Naoki Urasawa",
    publisher: "Panini",
    cover_image: "/covers/revistas/21st-century-boys.webp",
    status: "lido",
    rating: 5,
    note: "O epílogo que fecha a conta toda. Urasawa não desperdiça um quadro.",
  },
]

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Aranhaverso",
    director: "Bob Persichetti",
    year: 2018,
    poster_image: "/covers/filmes/aranhaverso-1.webp",
    status: "assistido",
    rating: 5,
    note: "Provou que animação podia ter grão, retícula e erro de registro de impressão.",
  },
  {
    id: "m2",
    title: "Através do Aranhaverso",
    director: "Joaquim Dos Santos",
    year: 2023,
    poster_image: "/covers/filmes/aranhaverso-2.webp",
    status: "assistido",
    rating: 5,
    note: "Cada dimensão com técnica de arte própria. Roubei a ideia sem pedir.",
  },
  {
    id: "m3",
    title: "Blade Runner 2049",
    director: "Denis Villeneuve",
    year: 2017,
    poster_image: "/covers/filmes/blade-runner-2049.webp",
    status: "assistido",
    rating: 5,
    note: "Referência de cor sempre que preciso de laranja contra ciano.",
  },
  {
    id: "m4",
    title: "Akira",
    director: "Katsuhiro Otomo",
    year: 1988,
    poster_image: "/covers/filmes/akira.webp",
    status: "assistindo",
    rating: 0,
    note: "Revisitando pelo neon e pelas linhas de velocidade.",
  },
  {
    id: "m5",
    title: "Além do Aranhaverso",
    director: "Bob Persichetti",
    year: 2027,
    poster_image: "/covers/filmes/aranhaverso-3.webp",
    status: "fila",
    rating: 0,
    note: "A dimensão que ainda não abriu. Fica na fila até estrear.",
  },
]

/**
 * Vazio de propósito, desde 04/08.
 *
 * Havia seis faixas aqui, todas com `audio_url: ""` — nenhuma tinha arquivo, e
 * `public/musica/` também estava vazia. O resultado era uma zona Rádio que
 * listava seis títulos e não tocava nenhum, com o player exibindo um aviso de
 * "sem áudio" que virou permanente em vez de conserto.
 *
 * O array continua exportado, e não removido, porque é a fonte de seed da
 * coleção `tracks`: `seed.ts`, `sync-content.ts` e `repos/criativo.ts` o
 * consomem, e o recurso "Rádio" do /admin depende dessa fiação. Vazio, o seed
 * simplesmente não insere nada.
 *
 * Para publicar música existem dois caminhos, e nenhum passa por aqui:
 * jogar o arquivo em `public/musica/` (ver o README de lá) ou cadastrar a
 * faixa em /admin → Rádio, que aceita capa e comentário.
 */
export const tracks: Track[] = []

export const videos: Video[] = [
  {
    id: "v1",
    title: "Making of: as 20 dimensões",
    description: "Timelapse de como cada dimensão visual do site foi construída em CSS.",
    video_url: "",
    poster_image: "/covers/videos/fita-rodando.webp",
    kind: "local",
  },
  {
    id: "v2",
    title: "Foil holográfico sem imagem",
    description:
      "Reconstrução do brilho de carta de TCG usando só gradiente cônico e blend mode. Da primeira tentativa (que parecia plástico molhado) até o ângulo que finalmente enganou o olho.",
    video_url: "",
    poster_image: "/covers/videos/v2.svg",
    kind: "local",
  },
  {
    id: "v3",
    title: "Diário de um bug de hidratação",
    description:
      "Quarenta minutos caçando um 'Carregando...' eterno que era um loading.tsx na raiz. Deixei os becos sem saída no vídeo de propósito — é assim que depuração parece de verdade.",
    video_url: "",
    poster_image: "/covers/videos/v3.svg",
    kind: "local",
  },
  {
    id: "v4",
    title: "Letragem: do rascunho ao vetor",
    description:
      "O alfabeto de onomatopeia sendo desenhado à mão e depois vetorizado. THWIP levou onze tentativas; ZAP saiu na primeira e nunca mais foi mexido.",
    video_url: "",
    poster_image: "/covers/videos/v4.svg",
    kind: "local",
  },
  {
    id: "v5",
    title: "Retrato em 32×32",
    description:
      "Pixel art com paleta de oito cores, do esboço ao último pixel. A restrição era a graça: sem meio-tom, cada cor precisa fazer dois trabalhos.",
    video_url: "",
    poster_image: "/covers/videos/v5.svg",
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
  {
    id: "n5",
    title: "Aprendido na marra",
    body: "Efeito bonito que ninguém consegue desligar não é efeito, é obstáculo. O cursor customizado durou onze meses e saiu por isso.",
    author: "Lucas",
    accent: "orange",
    pinned: false,
  },
  {
    id: "n6",
    title: "Critério de tirinha",
    body: "Se a piada precisa de legenda explicando a piada, o problema está no segundo quadro — não no leitor.",
    author: "Lucas",
    accent: "violet",
    pinned: false,
  },
  {
    id: "n7",
    title: "Encontrado num caderno velho",
    body: "\"Desenhar todo dia\" escrito quatorze vezes em páginas diferentes, cada uma com uma data. A última é de anteontem.",
    author: "Achado",
    accent: "cyan",
    pinned: false,
  },
]

export const strips: Strip[] = [
  {
    id: "s1",
    title: "O bug",
    image: "/covers/tirinhas/s1.svg",
    setup: "Funciona na minha máquina.",
    punchline: "Então vamos entregar a sua máquina para o cliente.",
  },
  {
    id: "s2",
    title: "Design system",
    image: "/covers/tirinhas/s2.svg",
    setup: "Temos um componente de botão para isso.",
    punchline: "Temos catorze componentes de botão para isso.",
  },
  {
    id: "s3",
    title: "A estimativa",
    image: "/covers/tirinhas/s3.svg",
    setup: "É só mudar uma cor.",
    punchline: "Três dias depois, ainda mudando a cor.",
  },
  {
    id: "s4",
    title: "O commit honesto",
    image: "/covers/tirinhas/s4.svg",
    setup: "Escreve aí o que essa mudança faz.",
    punchline: "\"ajustes\". Trezentos e quarenta arquivos.",
  },
  {
    id: "s5",
    title: "Cobertura",
    image: "/covers/tirinhas/s5.svg",
    setup: "Cem por cento de cobertura de testes.",
    punchline: "E nenhum deles testa o que o usuário faz.",
  },
  {
    id: "s6",
    title: "A reunião",
    image: "/covers/tirinhas/s6.svg",
    setup: "Essa reunião podia ter sido um e-mail.",
    punchline: "Esse e-mail podia ter sido um silêncio.",
  },
  {
    id: "s7",
    title: "Modo escuro",
    image: "/covers/tirinhas/s7.svg",
    setup: "Já tem modo escuro?",
    punchline: "Tem modo escuro. O modo claro é que nunca foi testado.",
  },
  {
    id: "s8",
    title: "Retrocompatibilidade",
    image: "/covers/tirinhas/s8.svg",
    setup: "Ninguém mais usa esse parâmetro.",
    punchline: "Uma pessoa usa. Ela abre chamado às sextas.",
  },
]
