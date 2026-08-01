"use client"

import { useRef, useState } from "react"
import { upload as uploadParaBlob } from "@vercel/blob/client"

import { uploadMedia } from "@/app/admin/media/actions"
import {
  DEFAULT_CLASSES,
  MAX_BYTES,
  PREFIX,
  SERVER_ACTION_LIMIT,
  acceptAttr,
  acceptedHint,
  type MediaClass,
} from "@/lib/admin/media-accept"

interface MediaPickerProps {
  name: string
  defaultValue: string
  inputClassName: string
  /** Espécies que este campo aceita. Sem isso, só imagem — o padrão antigo. */
  accept?: MediaClass[]
}

/** Extensão de destino a partir do tipo declarado pelo navegador. */
const EXT_POR_TIPO: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
}

/** Como renderizar o preview, deduzido da extensão da URL. */
function especieDaUrl(url: string): MediaClass | null {
  const semQuery = url.split("?")[0] ?? url
  const ext = semQuery.split(".").pop()?.toLowerCase()
  if (!ext) return null
  if (["png", "jpg", "jpeg", "gif", "webp", "avif"].includes(ext)) return "image"
  if (["mp3", "ogg", "wav", "m4a"].includes(ext)) return "audio"
  if (["mp4", "webm", "mov"].includes(ext)) return "video"
  return null
}

export function MediaPicker({
  name,
  defaultValue,
  inputClassName,
  accept = DEFAULT_CLASSES,
}: MediaPickerProps) {
  const [url, setUrl] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  /**
   * Vídeo não cabe no corpo de uma Server Action: sobe direto para o Blob, com
   * token emitido por `api/admin/blob-upload`. O resto continua pela action,
   * onde os magic bytes são conferidos.
   */
  async function uploadGrande(file: File) {
    const ext = EXT_POR_TIPO[file.type]
    if (!ext) {
      setError("Formato de vídeo não aceito. Envie MP4, WebM ou MOV.")
      return
    }
    const blob = await uploadParaBlob(`${PREFIX}/${crypto.randomUUID()}.${ext}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/blob-upload",
      contentType: file.type,
    })
    setUrl(blob.url)
  }

  async function uploadPelaAction(file: File) {
    const fd = new FormData()
    fd.set("file", file)
    fd.set("classes", accept.join(","))
    const res = await uploadMedia(fd)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setUrl(res.data.url)
  }

  async function upload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const tetoDoCampo = Math.max(...accept.map((c) => MAX_BYTES[c]))
      if (file.size > tetoDoCampo) {
        const mb = (file.size / 1024 / 1024).toFixed(1)
        setError(`Arquivo de ${mb} MB excede ${Math.round(tetoDoCampo / 1024 / 1024)} MB.`)
        return
      }

      const ehVideo = file.type.startsWith("video/")
      if (ehVideo || file.size > SERVER_ACTION_LIMIT) {
        await uploadGrande(file)
      } else {
        await uploadPelaAction(file)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.")
    } finally {
      setUploading(false)
    }
  }

  const especie = url ? especieDaUrl(url) : null

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://… ou envie um arquivo"
          className={inputClassName}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-lg border border-[color:var(--mm-border)] px-3 py-2 text-sm text-[color:var(--mm-text-2)] hover:bg-[color:var(--mm-hover)] disabled:opacity-60"
        >
          {uploading ? "Enviando…" : "Upload"}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={acceptAttr(accept)}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file)
          // Permite reenviar o mesmo arquivo depois de um erro.
          e.target.value = ""
        }}
      />
      <p className="text-xs text-[color:var(--mm-text-2)]">{acceptedHint(accept)}</p>

      {especie === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="preview" className="max-h-32 rounded-lg border border-[color:var(--mm-border)]" />
      )}
      {especie === "audio" && <audio src={url} controls className="w-full" />}
      {especie === "video" && (
        <video src={url} controls className="max-h-48 rounded-lg border border-[color:var(--mm-border)]" />
      )}

      {error && <p className="text-xs text-[color:var(--mm-error)]">{error}</p>}
    </div>
  )
}
