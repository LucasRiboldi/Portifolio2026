"use client"

import { useRef, useState } from "react"

import { isSupabaseConfigured } from "@/lib/supabase/config"
import { uploadMedia } from "@/app/admin/media/actions"
import { ACCEPT_ATTR, ACCEPTED_HINT } from "@/lib/admin/media-accept"

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
      const fd = new FormData()
      fd.set("file", file)
      const res = await uploadMedia(fd)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setUrl(res.data.url)
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
            className="shrink-0 rounded-lg border border-[color:var(--mm-border)] px-3 py-2 text-sm text-[color:var(--mm-text-2)] hover:bg-[color:var(--mm-hover)] disabled:opacity-60"
          >
            {uploading ? "Enviando…" : "Upload"}
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT_ATTR}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) upload(file)
        }}
      />
      {isSupabaseConfigured && (
        <p className="text-xs text-[color:var(--mm-text-2)]">{ACCEPTED_HINT}</p>
      )}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="preview" className="max-h-32 rounded-lg border border-[color:var(--mm-border)]" />
      )}
      {error && <p className="text-xs text-[color:var(--mm-error)]">{error}</p>}
    </div>
  )
}
