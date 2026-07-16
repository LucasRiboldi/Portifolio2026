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
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import {
  validateImage,
  safeObjectName,
  isSafeObjectName,
  MAX_BYTES,
} from "@/lib/admin/media-validate"

const BUCKET = "public-media"

export interface MediaItem {
  name: string
  url: string
}

export type MediaResult<T> = { ok: true; data: T } | { ok: false; error: string }

export async function listMedia(): Promise<MediaResult<MediaItem[]>> {
  await requireAdmin()
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." }

  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { sortBy: { column: "created_at", order: "desc" }, limit: 100 })
  if (error) return { ok: false, error: error.message }

  const items = (data ?? [])
    .filter((f) => f.id)
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
    }))
  return { ok: true, data: items }
}

export async function uploadMedia(formData: FormData): Promise<MediaResult<MediaItem>> {
  await requireAdmin()
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." }

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
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(BUCKET).upload(name, checked.bytes, {
    // contentType vem do conteúdo real, não do que o browser declarou.
    contentType: checked.contentType,
    upsert: false,
  })
  if (error) return { ok: false, error: error.message }

  const url = supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl
  return { ok: true, data: { name, url } }
}

export async function deleteMedia(name: string): Promise<MediaResult<null>> {
  await requireAdmin()
  if (!isSupabaseConfigured) return { ok: false, error: "Supabase não configurado." }

  // Só aceita o formato de nome que nós geramos — nada de caminhos.
  if (!isSafeObjectName(name)) return { ok: false, error: "Nome de arquivo inválido." }

  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(BUCKET).remove([name])
  if (error) return { ok: false, error: error.message }
  return { ok: true, data: null }
}
