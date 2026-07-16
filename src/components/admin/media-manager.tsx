"use client"

import { useEffect, useRef, useState, useCallback } from "react"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { listMedia, uploadMedia, deleteMedia, type MediaItem } from "@/app/admin/media/actions"
import { ACCEPT_ATTR, ACCEPTED_HINT } from "@/lib/admin/media-accept"

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const res = await listMedia()
    if (!res.ok) {
      setError(res.error)
      return
    }
    setItems(res.data)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function upload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.set("file", file)
      const res = await uploadMedia(fd)
      if (!res.ok) {
        setError(res.error)
        return
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.")
    } finally {
      setUploading(false)
    }
  }

  async function remove(name: string) {
    if (!confirm("Excluir este arquivo?")) return
    const res = await deleteMedia(name)
    if (!res.ok) {
      setError(res.error)
      return
    }
    await load()
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  if (!isSupabaseConfigured) {
    return <p className="text-sm text-amber-300">Configure o Supabase para usar a mídia.</p>
  }

  return (
    <div className="space-y-5">
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mm-btn mm-btn-primary"
        >
          {uploading ? "Enviando…" : "Enviar imagem"}
        </button>
        <p className="mt-1 text-xs text-[color:var(--mm-text-2)]">{ACCEPTED_HINT}</p>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_ATTR}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) upload(f)
          }}
        />
      </div>

      {error && <p className="text-sm text-[color:var(--mm-error)]">{error}</p>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.name} className="space-y-2 rounded-xl border border-[color:var(--mm-border)] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.name} className="img-frame img-wide rounded-lg" />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copy(item.url)}
                className="flex-1 rounded border border-[color:var(--mm-border)] px-2 py-1 text-xs text-[color:var(--mm-text-2)] hover:bg-[color:var(--mm-hover)]"
              >
                {copied === item.url ? "Copiado!" : "Copiar URL"}
              </button>
              <button
                type="button"
                onClick={() => remove(item.name)}
                className="rounded border border-[color:var(--mm-error)] px-2 py-1 text-xs text-[color:var(--mm-error)] hover:bg-[color:var(--mm-light-error)]"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !error && (
        <p className="text-sm text-[color:var(--mm-text-2)]">Nenhuma imagem enviada ainda.</p>
      )}
    </div>
  )
}
