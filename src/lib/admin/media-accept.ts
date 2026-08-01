/**
 * Constantes de UI do upload de mídia — seguras para o client.
 *
 * Ficam separadas de `media-validate.ts` (que é `server-only`): o `accept` e o
 * texto de ajuda são só conveniência para o usuário escolher o arquivo certo.
 * A validação que vale é a do servidor.
 */

/** Que espécie de mídia um campo aceita. Um campo pode aceitar mais de uma. */
export type MediaClass = "image" | "audio" | "video" | "document"

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
 * Acima deste tamanho o upload não pode passar pela Server Action — é o que o
 * `bodySizeLimit` permite, com folga para o overhead do multipart. Só vídeo
 * cruza esta linha hoje.
 */
export const SERVER_ACTION_LIMIT = 25 * 1024 * 1024

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
