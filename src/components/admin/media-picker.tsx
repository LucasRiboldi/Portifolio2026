"use client"

import { useRef, useState } from "react"

import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/config"

const BUCKET = "public-media"

interface MediaPickerProps {
  name: string
  defaultValue: string
  inputClassName: string
}

export function MediaPicker({ name, defaultValue, inputClassName }: MediaPickerProps) {
  const [url, setUrl] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop() ?? "bin"
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })
      if (upErr) throw upErr
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      setUrl(data.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.")
    } finally {
      setUploading(false)
    }
  }

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
        {isSupabaseConfigured && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="shrink-0 rounded-lg border border-white/15 px-3 py-2 text-sm text-white/70 hover:bg-white/5 disabled:opacity-60"
          >
            {uploading ? "Enviando…" : "Upload"}
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file)
        }}
      />
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="preview" className="max-h-32 rounded-lg border border-white/10" />
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
