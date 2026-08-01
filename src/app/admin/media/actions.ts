"use server"

/**
 * Mídia — Server Actions.
 *
 * Antes o cliente falava direto com o storage usando a chave pública: a única
 * barreira era `accept="image/*"` no input (contornável) e as policies do
 * bucket, que enxergam "autenticado" mas não conhecem a allowlist de admin
 * do app. Qualquer usuário logado podia enviar ou apagar arquivos.
 *
 * Agora todo acesso passa por aqui: requireAdmin() + validação por magic bytes.
 * Nenhum token de escrita chega ao browser.
 *
 * ------------------------------------------------------------------
 * POR QUE VERCEL BLOB, E NÃO FIREBASE STORAGE
 * ------------------------------------------------------------------
 * O resto do backend é Firebase, e o natural seria o Storage dele. Mas o Cloud
 * Storage exige o plano Blaze — cartão cadastrado — enquanto Firestore e Auth
 * cabem no plano gratuito. Como o projeto precisa custar zero, a mídia foi para
 * o Vercel Blob, que entra na cota inclusa do Hobby e roda na mesma plataforma
 * onde o site já está.
 *
 * O custo dessa escolha é ter dois fornecedores no backend. O ganho é o painel
 * continuar publicando imagem sem redeploy, que é a razão de ele existir.
 */
import { list, put, del } from "@vercel/blob"

import { requireAdmin } from "@/lib/auth/is-admin"
import {
  validateMedia,
  safeObjectName,
  isSafeObjectName,
} from "@/lib/admin/media-validate"
import { DEFAULT_CLASSES, MAX_BYTES, PREFIX, type MediaClass } from "@/lib/admin/media-accept"

/**
 * True quando o SDK consegue falar com o store.
 *
 * São DOIS caminhos de autenticação, e checar só o primeiro estava barrando
 * ambiente que funcionaria:
 *
 *   • `BLOB_READ_WRITE_TOKEN` — token longo, estático;
 *   • OIDC — `BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN`, que é o **padrão** dos
 *     stores vinculados hoje (credencial curta, rotacionada sozinha).
 *
 * O `VERCEL_OIDC_TOKEN` é emitido em runtime, então não pode ser lido no topo
 * do módulo — daí isto ser função, e não const. `BLOB_STORE_ID` basta como
 * sinal de que o store está vinculado.
 */
function temBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

const SEM_TOKEN =
  "Armazenamento de mídia não configurado (nem BLOB_READ_WRITE_TOKEN nem BLOB_STORE_ID presentes)."

export interface MediaItem {
  name: string
  url: string
}

export type MediaResult<T> = { ok: true; data: T } | { ok: false; error: string }

const CLASSES_VALIDAS: MediaClass[] = ["image", "audio", "video", "document"]

/**
 * Lê as espécies aceitas que o formulário declarou. Vem do cliente, então é
 * filtrado contra a lista conhecida — na falta de valor válido, cai no padrão
 * (só imagem), que é o comportamento restritivo.
 */
function lerClasses(bruto: FormDataEntryValue | null): MediaClass[] {
  if (typeof bruto !== "string") return DEFAULT_CLASSES
  const pedidas = bruto.split(",").filter((c): c is MediaClass =>
    (CLASSES_VALIDAS as string[]).includes(c),
  )
  return pedidas.length > 0 ? pedidas : DEFAULT_CLASSES
}

export async function listMedia(): Promise<MediaResult<MediaItem[]>> {
  await requireAdmin()
  if (!temBlob()) return { ok: false, error: SEM_TOKEN }

  try {
    const { blobs } = await list({ prefix: `${PREFIX}/`, limit: 100 })

    // A listagem vem por pathname; o painel mostra "mais recente primeiro".
    const items = blobs
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .map((b) => ({ name: b.pathname.slice(PREFIX.length + 1), url: b.url }))
    return { ok: true, data: items }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha ao listar." }
  }
}

export async function uploadMedia(formData: FormData): Promise<MediaResult<MediaItem>> {
  await requireAdmin()
  if (!temBlob()) return { ok: false, error: SEM_TOKEN }

  const file = formData.get("file")
  if (!(file instanceof File)) return { ok: false, error: "Nenhum arquivo recebido." }

  const classes = lerClasses(formData.get("classes"))

  // Corta antes de ler o corpo inteiro na memória. Usa o maior teto entre as
  // espécies aceitas; o teto exato da espécie real é conferido em `validateMedia`.
  const tetoMax = Math.max(...classes.map((c) => MAX_BYTES[c]))
  if (file.size > tetoMax) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    return { ok: false, error: `Arquivo de ${mb} MB excede ${Math.round(tetoMax / 1024 / 1024)} MB.` }
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const checked = validateMedia(bytes, classes)
  if ("error" in checked) return { ok: false, error: checked.error }

  const name = safeObjectName(checked.kind)

  try {
    const blob = await put(`${PREFIX}/${name}`, Buffer.from(checked.bytes), {
      access: "public",
      // contentType vem do conteúdo real, não do que o browser declarou.
      contentType: checked.contentType,
      // `safeObjectName` já garante nome único; sufixo aleatório só sujaria a URL.
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000,
    })
    return { ok: true, data: { name, url: blob.url } }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha no upload." }
  }
}

export async function deleteMedia(name: string): Promise<MediaResult<null>> {
  await requireAdmin()
  if (!temBlob()) return { ok: false, error: SEM_TOKEN }

  // Só aceita o formato de nome que nós geramos — nada de caminhos.
  if (!isSafeObjectName(name)) return { ok: false, error: "Nome de arquivo inválido." }

  try {
    // `del` trabalha com a URL do blob, que inclui o id do store — por isso a
    // busca antes. Apagar é raro; a ida extra não pesa e evita adivinhar a URL.
    const { blobs } = await list({ prefix: `${PREFIX}/${name}`, limit: 1 })
    const alvo = blobs[0]
    if (!alvo) return { ok: false, error: "Arquivo não encontrado." }

    await del(alvo.url)
    return { ok: true, data: null }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Falha ao apagar." }
  }
}
