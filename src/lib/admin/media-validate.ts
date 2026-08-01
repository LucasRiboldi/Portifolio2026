import "server-only"

import {
  DEFAULT_CLASSES,
  MAX_BYTES,
  acceptedLabel,
  type MediaClass,
} from "@/lib/admin/media-accept"

/**
 * Validação de upload de mídia — server-side.
 *
 * Regra de ouro: nada que o cliente DIZ é confiável. O `file.type` e a extensão
 * do nome vêm do navegador e são trivialmente forjáveis; por isso o formato é
 * decidido lendo os magic bytes do conteúdo. A extensão gravada é derivada
 * daí — nunca do nome original, o que também elimina path traversal
 * (`../../evil.png`) e nomes com sufixo duplo (`foto.png.html`).
 *
 * Vale para imagem e áudio, que sobem pela Server Action. Vídeo vai direto do
 * navegador para o Blob e não passa por aqui — ver o comentário da rota
 * `api/admin/blob-upload`, que explica o que se perde e por quê.
 */

export type ImageKind = "png" | "jpg" | "gif" | "webp" | "avif"
export type AudioKind = "mp3" | "ogg" | "wav" | "m4a"
export type VideoKind = "mp4" | "webm" | "mov"
export type MediaKind = ImageKind | AudioKind | VideoKind

/** Teto de imagem. Mantido como export próprio por ser o caso mais citado. */
export const IMAGE_MAX_BYTES = MAX_BYTES.image

const CLASS_OF: Record<MediaKind, MediaClass> = {
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
}

const CONTENT_TYPE: Record<MediaKind, string> = {
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
}

/** Todas as extensões que `safeObjectName` pode gerar. */
const EXTENSOES = Object.keys(CONTENT_TYPE) as MediaKind[]

function matches(bytes: Uint8Array, sig: number[], offset = 0): boolean {
  if (bytes.length < offset + sig.length) return false
  return sig.every((b, i) => bytes[offset + i] === b)
}

function ascii(bytes: Uint8Array, offset: number, text: string): boolean {
  if (bytes.length < offset + text.length) return false
  for (let i = 0; i < text.length; i++) {
    if (bytes[offset + i] !== text.charCodeAt(i)) return false
  }
  return true
}

/** Marca de container ISO-BMFF: `....ftyp<brand>`. Cobre AVIF, MP4, M4A e MOV. */
function ftyp(bytes: Uint8Array, brand: string): boolean {
  return ascii(bytes, 4, "ftyp") && ascii(bytes, 8, brand)
}

/**
 * Descobre o formato real pelo conteúdo. Retorna null se não reconhecer.
 *
 * SVG fica de fora de propósito: é XML, pode carregar <script> e o bucket é
 * público — seria XSS servido do nosso próprio domínio.
 */
export function sniffMedia(bytes: Uint8Array): MediaKind | null {
  // — imagem —
  if (matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png"
  if (matches(bytes, [0xff, 0xd8, 0xff])) return "jpg"
  if (ascii(bytes, 0, "GIF87a") || ascii(bytes, 0, "GIF89a")) return "gif"
  // RIFF....WEBP / RIFF....WAVE — mesmo container, marca diferente no offset 8.
  if (ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WEBP")) return "webp"
  if (ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WAVE")) return "wav"
  if (ftyp(bytes, "avif") || ftyp(bytes, "avis")) return "avif"

  // — áudio —
  if (ascii(bytes, 0, "OggS")) return "ogg"
  if (ascii(bytes, 0, "ID3")) return "mp3"
  // MP3 sem tag ID3: frame sync são 11 bits em 1 no começo do quadro.
  if (matches(bytes, [0xff]) && ((bytes[1] ?? 0) & 0xe0) === 0xe0) return "mp3"
  if (ftyp(bytes, "M4A ")) return "m4a"

  // — vídeo —
  // Matroska/WebM compartilham o cabeçalho EBML; tratamos os dois como webm.
  if (matches(bytes, [0x1a, 0x45, 0xdf, 0xa3])) return "webm"
  if (ftyp(bytes, "qt  ")) return "mov"
  // Marcas usuais de MP4. Deixado por último: `M4A ` e `avif` também são ftyp.
  if (["isom", "iso2", "mp41", "mp42", "avc1", "M4V "].some((b) => ftyp(bytes, b))) return "mp4"

  return null
}

export interface ValidatedMedia {
  kind: MediaKind
  mediaClass: MediaClass
  contentType: string
  bytes: Uint8Array
}

export type ValidationError = { error: string }

/**
 * Valida tamanho e formato real contra as espécies que o campo aceita.
 * Não confia em type/nome informados.
 */
export function validateMedia(
  bytes: Uint8Array,
  classes: MediaClass[] = DEFAULT_CLASSES,
): ValidatedMedia | ValidationError {
  if (bytes.length === 0) return { error: "Arquivo vazio." }

  const kind = sniffMedia(bytes)
  // A espécie precisa ser reconhecida E permitida neste campo — senão dá para
  // salvar um mp3 no campo "Imagem de capa".
  if (!kind || !classes.includes(CLASS_OF[kind])) {
    return { error: `Formato não aceito. Envie ${acceptedLabel(classes)}.` }
  }

  const mediaClass = CLASS_OF[kind]
  const teto = MAX_BYTES[mediaClass]
  if (bytes.length > teto) {
    const mb = (bytes.length / 1024 / 1024).toFixed(1)
    const limite = Math.round(teto / 1024 / 1024)
    return { error: `Arquivo de ${mb} MB excede o limite de ${limite} MB.` }
  }

  return { kind, mediaClass, contentType: CONTENT_TYPE[kind], bytes }
}

/** Nome de destino: UUID + extensão derivada do conteúdo. Ignora o nome original. */
export function safeObjectName(kind: MediaKind): string {
  return `${crypto.randomUUID()}.${kind}`
}

const NOME_SEGURO = new RegExp(`^[0-9a-f-]{36}\\.(${EXTENSOES.join("|")})$`, "i")

/**
 * Valida um nome de objeto vindo do cliente (para excluir). Aceita só o
 * formato que nós mesmos geramos — barra qualquer path ou nome inesperado.
 */
export function isSafeObjectName(name: string): boolean {
  return NOME_SEGURO.test(name)
}
