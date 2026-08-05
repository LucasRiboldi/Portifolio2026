/**
 * Constantes de UI do upload de mídia — seguras para o client.
 *
 * Ficam separadas de `media-validate.ts` (que é `server-only`): o `accept` e o
 * texto de ajuda são só conveniência para o usuário escolher o arquivo certo.
 * A validação que vale é a do servidor.
 */

/** Que espécie de mídia um campo aceita. Um campo pode aceitar mais de uma. */
export type MediaClass = "image" | "audio" | "video" | "document"

export type ImageKind = "png" | "jpg" | "gif" | "webp" | "avif"
export type AudioKind = "mp3" | "ogg" | "wav" | "m4a"
export type VideoKind = "mp4" | "webm" | "mov"
export type DocumentKind = "pdf"
export type MediaKind = ImageKind | AudioKind | VideoKind | DocumentKind

/**
 * Extensão → classe. Moradia canônica desde 04/08/2026.
 *
 * Vivia em `media-validate.ts`, que é `server-only`. O upload direto ao Blob
 * precisa das mesmas tabelas nos DOIS lados — o cliente para nomear o arquivo, a
 * rota do token para decidir o que autorizar — e duplicá-las era garantir que um
 * dia divergissem, com o cliente mandando um formato que o token recusa.
 */
export const CLASS_OF: Record<MediaKind, MediaClass> = {
  png: "image",
  jpg: "image",
  gif: "image",
  webp: "image",
  avif: "image",
  mp3: "audio",
  ogg: "audio",
  wav: "audio",
  m4a: "audio",
  mp4: "video",
  webm: "video",
  mov: "video",
  pdf: "document",
}

/** Extensão → content-type canônico. */
export const CONTENT_TYPE: Record<MediaKind, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  pdf: "application/pdf",
}

/**
 * Content-type declarado pelo navegador → extensão canônica.
 *
 * Derivado de `CONTENT_TYPE`, e não escrito à mão, para não existir a
 * possibilidade de as duas discordarem. `audio/mp4` mapeia para `m4a`.
 */
export const EXT_POR_TIPO: Record<string, MediaKind> = Object.fromEntries(
  Object.entries(CONTENT_TYPE).map(([ext, tipo]) => [tipo, ext as MediaKind]),
) as Record<string, MediaKind>

/** Extensão a partir do nome de objeto que nós geramos (`UUID.ext`). */
export function extDoNome(nome: string): MediaKind | null {
  const ext = nome.split(".").pop()?.toLowerCase()
  return ext && ext in CONTENT_TYPE ? (ext as MediaKind) : null
}

/**
 * Pasta dos objetos dentro do store. Mantém o nome que o bucket antigo tinha.
 *
 * Mora aqui, e não em `media/actions.ts`, porque um arquivo `"use server"` só
 * pode exportar função async — e o cliente precisa do prefixo para montar o
 * caminho do upload direto de vídeo.
 */
export const PREFIX = "public-media"

/**
 * Teto por espécie. Imagem e áudio sobem pela Server Action (e por isso cabem
 * no `bodySizeLimit` do `next.config.ts`); vídeo vai direto do navegador para o
 * Blob, sem passar pelo corpo da action — daí o limite ser outra ordem de
 * grandeza. Mexer no teto de áudio exige mexer no `bodySizeLimit` junto.
 */
export const MAX_BYTES: Record<MediaClass, number> = {
  image: 5 * 1024 * 1024,
  audio: 25 * 1024 * 1024,
  video: 200 * 1024 * 1024,
  document: 25 * 1024 * 1024,
}

/**
 * Acima deste tamanho o upload NÃO pode passar pela Server Action.
 *
 * Valia 25 MB, alinhado ao `bodySizeLimit: "26mb"` do `next.config.ts`. Estava
 * errado: **o `bodySizeLimit` não manda**. Quem corta é a plataforma, antes do
 * Next ver o request. Medido em produção em 04/08/2026, contra
 * `/api/admin/blob-upload`, que lê o corpo antes de responder 401:
 *
 *   corpo de 1 MB → 401 (nosso código rodou)
 *   corpo de 4 MB → 401 (nosso código rodou)
 *   corpo de 6 MB → 413 FUNCTION_PAYLOAD_TOO_LARGE
 *
 * O efeito de 25 MB era mandar tudo entre 4,5 e 25 MB pela Server Action, para
 * morrer com "An unexpected response was received from the server" — mensagem
 * que não menciona tamanho. Foi como um PDF de 4,52 MB falhou em 01/08.
 *
 * 4 MB, e não 4,5: sobra folga para o overhead do multipart, que viaja junto do
 * arquivo e conta para o limite.
 */
export const SERVER_ACTION_LIMIT = 4 * 1024 * 1024

const ACCEPT_BY_CLASS: Record<MediaClass, string> = {
  image: "image/png,image/jpeg,image/gif,image/webp,image/avif",
  audio: "audio/mpeg,audio/ogg,audio/wav,audio/mp4",
  video: "video/mp4,video/webm,video/quicktime",
  document: "application/pdf",
}

const LABEL_BY_CLASS: Record<MediaClass, string> = {
  image: "PNG, JPEG, GIF, WebP ou AVIF",
  audio: "MP3, OGG, WAV ou M4A",
  video: "MP4, WebM ou MOV",
  document: "PDF",
}

/** Espécies aceitas quando o campo não declara nada. Preserva o padrão antigo. */
export const DEFAULT_CLASSES: MediaClass[] = ["image"]

const mb = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`

/** Filtro do seletor de arquivos. Espelha os formatos aceitos no servidor. */
export function acceptAttr(classes: MediaClass[] = DEFAULT_CLASSES): string {
  return classes.map((c) => ACCEPT_BY_CLASS[c]).join(",")
}

/** Texto de ajuda sob o campo: formatos e teto de cada espécie aceita. */
export function acceptedHint(classes: MediaClass[] = DEFAULT_CLASSES): string {
  return classes.map((c) => `${LABEL_BY_CLASS[c]} · até ${mb(MAX_BYTES[c])}`).join(" · ")
}

/** Frase de erro do servidor quando o conteúdo não bate com o esperado. */
export function acceptedLabel(classes: MediaClass[] = DEFAULT_CLASSES): string {
  return classes.map((c) => `${LABEL_BY_CLASS[c]} (até ${mb(MAX_BYTES[c])})`).join(", ")
}
