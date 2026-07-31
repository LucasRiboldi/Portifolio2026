"use server"

/**
 * Mídia — Server Actions.
 *
 * Antes o cliente falava direto com o Storage usando a anon key: a única
 * barreira era `accept="image/*"` no input (contornável) e as policies do
 * bucket, que enxergam "autenticado" mas não conhecem a allowlist de admin
 * do app. Qualquer usuário Supabase logado podia enviar ou apagar arquivos.
 *
 * Agora todo acesso passa por aqui: requireAdmin() + validação por magic bytes
 * + service-role. O bucket pode (e deve) negar escrita a clientes — ver o SQL
 * em `docs/storage-policies.sql`.
 */
import { requireAdmin } from "@/lib/auth/is-admin"
import { getBucket, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import {
  validateImage,
  safeObjectName,
  isSafeObjectName,
  MAX_BYTES,
} from "@/lib/admin/media-validate"

/**
 * Prefixo dos objetos no bucket. No Supabase isto era um *bucket* dedicado;
 * o Firebase Storage tem um bucket por projeto, então a separação vira pasta.
 */
const PREFIX = "public-media"

/**
 * URL pública de um objeto.
 *
 * Diferença relevante em relação ao Supabase: lá o bucket era marcado "public"
 * e a URL era previsível. Aqui a leitura pública depende das Storage Rules
 * (ver `storage.rules`) e a URL canônica passa pelo endpoint de download com o
 * nome do objeto encodado.
 */
function publicUrl(bucket: string, objeto: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objeto)}?alt=media`
}

export interface MediaItem {
  name: string
  url: string
}

export type MediaResult<T> = { ok: true; data: T } | { ok: false; error: string }

export async function listMedia(): Promise<MediaResult<MediaItem[]>> {
  await requireAdmin()
  if (!isFirebaseAdminConfigured) return { ok: false, error: "Firebase não configurado." }

  try {
    const bucket = getBucket()
    const [files] = await bucket.getFiles({ prefix: `${PREFIX}/` })

    // O Storage não ordena por data na listagem — ordenamos aqui para manter o
    // "mais recente primeiro" que o painel já mostrava.
    const items = files
      .filter((f) => !f.name.endsWith("/"))
      .sort((a, b) => (b.metadata.timeCreated ?? "").localeCompare(a.metadata.timeCreated ?? ""))
      .slice(0, 100)
      .map((f) => ({
        name: f.name.slice(PREFIX.length + 1),
        url: publicUrl(bucket.name, f.name),
      }))
    return { ok: true, data: items }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha ao listar." }
  }
}

export async function uploadMedia(formData: FormData): Promise<MediaResult<MediaItem>> {
  await requireAdmin()
  if (!isFirebaseAdminConfigured) return { ok: false, error: "Firebase não configurado." }

  const file = formData.get("file")
  if (!(file instanceof File)) return { ok: false, error: "Nenhum arquivo recebido." }

  // Corta antes de ler o corpo inteiro na memória.
  if (file.size > MAX_BYTES) {
    return { ok: false, error: `Arquivo de ${(file.size / 1024 / 1024).toFixed(1)} MB excede 5 MB.` }
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const checked = validateImage(bytes)
  if ("error" in checked) return { ok: false, error: checked.error }

  const name = safeObjectName(checked.kind)

  try {
    const bucket = getBucket()
    const objeto = `${PREFIX}/${name}`
    await bucket.file(objeto).save(Buffer.from(checked.bytes), {
      // contentType vem do conteúdo real, não do que o browser declarou.
      contentType: checked.contentType,
      // Sobrescrever é irrelevante aqui: safeObjectName() gera nome único.
      metadata: { cacheControl: "public, max-age=31536000, immutable" },
    })
    return { ok: true, data: { name, url: publicUrl(bucket.name, objeto) } }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha no upload." }
  }
}

export async function deleteMedia(name: string): Promise<MediaResult<null>> {
  await requireAdmin()
  if (!isFirebaseAdminConfigured) return { ok: false, error: "Firebase não configurado." }

  // Só aceita o formato de nome que nós geramos — nada de caminhos.
  if (!isSafeObjectName(name)) return { ok: false, error: "Nome de arquivo inválido." }

  try {
    await getBucket().file(`${PREFIX}/${name}`).delete()
    return { ok: true, data: null }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha ao apagar." }
  }
}
