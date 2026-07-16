import "server-only"

/**
 * Validação de upload de imagem — server-side.
 *
 * Regra de ouro: nada que o cliente DIZ é confiável. O `file.type` e a extensão
 * do nome vêm do navegador e são trivialmente forjáveis; por isso o formato é
 * decidido lendo os magic bytes do conteúdo. A extensão gravada é derivada
 * daí — nunca do nome original, o que também elimina path traversal
 * (`../../evil.png`) e nomes com sufixo duplo (`foto.png.html`).
 */

/** Teto por arquivo. Acima disso o custo de banda/armazenamento não compensa. */
export const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export type ImageKind = "png" | "jpg" | "gif" | "webp" | "avif"

export const ACCEPTED_LABEL = "PNG, JPEG, GIF, WebP ou AVIF, até 5 MB"

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

/**
 * Descobre o formato real pelo conteúdo. Retorna null se não for uma imagem
 * de um dos formatos aceitos.
 *
 * SVG fica de fora de propósito: é XML, pode carregar <script> e o bucket é
 * público — seria XSS servido do nosso próprio domínio.
 */
export function sniffImage(bytes: Uint8Array): ImageKind | null {
  if (matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png"
  if (matches(bytes, [0xff, 0xd8, 0xff])) return "jpg"
  if (ascii(bytes, 0, "GIF87a") || ascii(bytes, 0, "GIF89a")) return "gif"
  // RIFF....WEBP
  if (ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WEBP")) return "webp"
  // ....ftypavif / ftypavis
  if (ascii(bytes, 4, "ftyp") && (ascii(bytes, 8, "avif") || ascii(bytes, 8, "avis"))) return "avif"
  return null
}

const CONTENT_TYPE: Record<ImageKind, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
}

export interface ValidatedImage {
  kind: ImageKind
  contentType: string
  bytes: Uint8Array
}

export type ValidationError = { error: string }

/** Valida tamanho e formato real. Não confia em type/nome informados. */
export function validateImage(bytes: Uint8Array): ValidatedImage | ValidationError {
  if (bytes.length === 0) return { error: "Arquivo vazio." }
  if (bytes.length > MAX_BYTES) {
    const mb = (bytes.length / 1024 / 1024).toFixed(1)
    return { error: `Arquivo de ${mb} MB excede o limite de 5 MB.` }
  }
  const kind = sniffImage(bytes)
  if (!kind) {
    return { error: `Formato não aceito. Envie ${ACCEPTED_LABEL}.` }
  }
  return { kind, contentType: CONTENT_TYPE[kind], bytes }
}

/** Nome de destino: UUID + extensão derivada do conteúdo. Ignora o nome original. */
export function safeObjectName(kind: ImageKind): string {
  return `${crypto.randomUUID()}.${kind}`
}

/**
 * Valida um nome de objeto vindo do cliente (para excluir). Aceita só o
 * formato que nós mesmos geramos — barra qualquer path ou nome inesperado.
 */
export function isSafeObjectName(name: string): boolean {
  return /^[0-9a-f-]{36}\.(png|jpg|gif|webp|avif)$/i.test(name)
}
