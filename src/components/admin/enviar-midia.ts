"use client"

import { upload as uploadParaBlob } from "@vercel/blob/client"

import { uploadMedia } from "@/app/admin/media/actions"
import {
  EXT_POR_TIPO,
  MAX_BYTES,
  PREFIX,
  SERVER_ACTION_LIMIT,
  type MediaClass,
} from "@/lib/admin/media-accept"

/**
 * A decisão de POR ONDE um arquivo sobe, num lugar só.
 *
 * ------------------------------------------------------------------
 * POR QUE ISTO É COMPARTILHADO
 * ------------------------------------------------------------------
 * Havia duas lógicas de upload em paralelo: a do `media-picker` (campo de
 * formulário), que sabia desviar arquivo grande para o Blob, e a do
 * `media-manager` (`/admin/media`), que não sabia e mandava tudo pela Server
 * Action. Conserto numa não alcançava a outra — e foi exatamente assim que o
 * teto de 4,5 MB ficou meio consertado.
 *
 * Agora as duas chamam isto. Uma regra, dois chamadores.
 */

export type ResultadoEnvio =
  | { ok: true; name: string; url: string }
  | { ok: false; error: string }

/**
 * Envia um arquivo pelo caminho certo e devolve a URL pública.
 *
 * `onProgress` só é chamado no caminho direto: pela Server Action o corpo sobe
 * de uma vez e não existe evento intermediário para reportar.
 */
export async function enviarMidia(
  file: File,
  classes: MediaClass[],
  onProgress?: (percentual: number) => void,
): Promise<ResultadoEnvio> {
  const tetoDoCampo = Math.max(...classes.map((c) => MAX_BYTES[c]))
  if (file.size > tetoDoCampo) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    return {
      ok: false,
      error: `Arquivo de ${mb} MB excede ${Math.round(tetoDoCampo / 1024 / 1024)} MB.`,
    }
  }

  // Vídeo vai sempre direto, mesmo pequeno: `validateMedia` precisa do arquivo
  // inteiro em memória, e vídeo é justamente o que não cabe.
  const direto = file.type.startsWith("video/") || file.size > SERVER_ACTION_LIMIT

  if (!direto) {
    const fd = new FormData()
    fd.set("file", file)
    fd.set("classes", classes.join(","))
    const res = await uploadMedia(fd)
    return res.ok ? { ok: true, name: res.data.name, url: res.data.url } : res
  }

  const ext = EXT_POR_TIPO[file.type]
  if (!ext) {
    // O `accept` do input filtra antes, mas arrastar-e-soltar escapa disso, e o
    // navegador às vezes entrega `type` vazio.
    return {
      ok: false,
      error: `Formato não aceito para envio direto: ${file.type || "tipo desconhecido"}.`,
    }
  }

  const name = `${crypto.randomUUID()}.${ext}`
  const blob = await uploadParaBlob(`${PREFIX}/${name}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/blob-upload",
    contentType: file.type,
    onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
  })

  return { ok: true, name, url: blob.url }
}
