"use client"

import { useEffect, useRef, useState, useCallback } from "react"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

const BUCKET = "public-media"

interface MediaItem {
  name: string
  url: string
}

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const supabase = createClient()
    const { data, error: err } = await supabase.storage
      .from(BUCKET)
      .list("", { sortBy: { column: "created_at", order: "desc" }, limit: 100 })
    if (err) {
      setError(err.message)
      return
    }
    const list = (data ?? [])
      .filter((f) => f.id)
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
      }))
    setItems(list)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function upload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop() ?? "bin"
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file)
      if (upErr) throw upErr
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.")
    } finally {
      setUploading(false)
    }
  }

  async function remove(name: string) {
    if (!confirm("Excluir este arquivo?")) return
    const supabase = createClient()
    await supabase.storage.from(BUCKET).remove([name])
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
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
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
            <img src={item.url} alt={item.name} className="aspect-video w-full rounded-lg object-cover" />
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
