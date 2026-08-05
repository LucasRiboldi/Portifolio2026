"use client"

import { useRef, useState } from "react"

import { enviarMidia } from "@/components/admin/enviar-midia"
import {
  DEFAULT_CLASSES,
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

/** Como renderizar o preview, deduzido da extensão da URL. */
function especieDaUrl(url: string): MediaClass | null {
  const semQuery = url.split("?")[0] ?? url
  const ext = semQuery.split(".").pop()?.toLowerCase()
  if (!ext) return null
  if (["png", "jpg", "jpeg", "gif", "webp", "avif"].includes(ext)) return "image"
  if (["mp3", "ogg", "wav", "m4a"].includes(ext)) return "audio"
  if (["mp4", "webm", "mov"].includes(ext)) return "video"
  if (ext === "pdf") return "document"
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
  // null = sem progresso a mostrar (upload pequeno, que sobe de uma vez).
  const [progresso, setProgresso] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setUploading(true)
    setError(null)
    setProgresso(null)
    try {
      const res = await enviarMidia(file, accept, setProgresso)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setUrl(res.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.")
    } finally {
      setUploading(false)
      setProgresso(null)
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
          {uploading ? (progresso !== null ? `${progresso}%` : "Enviando…") : "Upload"}
        </button>
      </div>

      {/* "Enviando…" sozinho é indistinguível de travado — foi assim que um
          vídeo ficou enviando para sempre sem ninguém saber onde parou. */}
      {uploading && progresso !== null && (
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-[color:var(--mm-border)]"
          role="progressbar"
          aria-valuenow={progresso}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do envio"
        >
          <div
            className="h-full bg-[color:var(--mm-text-2)] transition-[width] duration-200"
            style={{ width: `${progresso}%` }}
          />
        </div>
      )}
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
      {especie === "document" && (
        // PDF não tem preview barato que valha a pena embutir; o link confirma
        // que o arquivo subiu e abre para conferência.
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs underline text-[color:var(--mm-text-2)]"
        >
          Abrir PDF em nova aba
        </a>
      )}

      {error && <p className="text-xs text-[color:var(--mm-error)]">{error}</p>}
    </div>
  )
}
