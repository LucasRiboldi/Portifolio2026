"use client"

import { useEffect, useRef, useState, useCallback } from "react"

import { listMedia, deleteMedia, type MediaItem } from "@/app/admin/media/actions"
import { enviarMidia } from "@/components/admin/enviar-midia"
import { acceptAttr, acceptedHint, type MediaClass } from "@/lib/admin/media-accept"

/**
 * A biblioteca sobe pela Server Action, que confere magic bytes — por isso
 * aceita imagem, áudio e PDF, mas não vídeo. Vídeo vai direto para o Blob e só o
 * campo "Vídeo" do formulário tem esse caminho.
 */
const CLASSES: MediaClass[] = ["image", "audio", "document"]

/** O preview do grid muda por espécie: <img> não renderiza um mp3 nem um PDF. */
const ehAudio = (nome: string) => /\.(mp3|ogg|wav|m4a)$/i.test(nome)
const ehPdf = (nome: string) => /\.pdf$/i.test(nome)

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // null = sem progresso a mostrar (upload pequeno, que sobe de uma vez).
  const [progresso, setProgresso] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Sem gate no client: quem sabe se a mídia está configurada é o servidor
  // (o token do Blob nunca chega aqui). A action devolve o motivo, e o motivo
  // é o que o painel mostra — uma verdade só, em vez de duas que divergem.
  const load = useCallback(async () => {
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
    setProgresso(null)
    try {
      // Mesma regra do campo de formulário: `enviarMidia` decide se vai pela
      // Server Action ou direto ao Blob. Esta página mandava tudo pela action,
      // então qualquer arquivo acima de ~4,5 MB morria aqui — e um conserto no
      // `media-picker` não a alcançava.
      const res = await enviarMidia(file, CLASSES, setProgresso)
      if (!res.ok) {
        setError(res.error)
        return
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.")
    } finally {
      setUploading(false)
      setProgresso(null)
    }
  }

  async function remove(item: MediaItem) {
    // O servidor recusa de qualquer forma (é ele que tem a verdade), mas
    // avisar aqui evita o clique inútil e diz o porquê antes do confirm.
    if (item.usos.length > 0) {
      setError(
        `"${item.name}" está em uso por ${item.usos.length} ` +
          `${item.usos.length === 1 ? "documento" : "documentos"} e não pode ser apagado. ` +
          `Troque a mídia neles primeiro.`,
      )
      return
    }
    if (!confirm("Excluir este arquivo?")) return
    const res = await deleteMedia(item.name)
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

  return (
    <div className="space-y-5">
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mm-btn mm-btn-primary"
        >
          {uploading ? (progresso !== null ? `Enviando… ${progresso}%` : "Enviando…") : "Enviar arquivo"}
        </button>
        {uploading && progresso !== null && (
          <div
            className="mt-2 h-1 w-full max-w-xs overflow-hidden rounded-full bg-[color:var(--mm-border)]"
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
        <p className="mt-1 text-xs text-[color:var(--mm-text-2)]">{acceptedHint(CLASSES)}</p>
        <input
          ref={fileRef}
          type="file"
          accept={acceptAttr(CLASSES)}
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
            {ehAudio(item.name) ? (
              <audio src={item.url} controls className="w-full" />
            ) : ehPdf(item.name) ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="img-frame img-wide flex items-center justify-center rounded-lg text-xs underline"
              >
                Abrir PDF
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.name} className="img-frame img-wide rounded-lg" />
            )}
            {/* Sem isto a grade é uma parede de UUIDs, e nada indica que
                apagar um deles quebra uma página. */}
            {item.usos.length > 0 ? (
              <p
                className="text-[11px] leading-snug text-[color:var(--mm-text-2)]"
                title={item.usos.map((u) => `${u.colecao} · ${u.titulo} (${u.campo})`).join("\n")}
              >
                <span className="font-semibold">Em uso</span> ·{" "}
                {item.usos.map((u) => u.titulo).join(", ")}
              </p>
            ) : (
              <p className="text-[11px] text-[color:var(--mm-text-2)] opacity-60">Sem uso</p>
            )}
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
                onClick={() => remove(item)}
                disabled={item.usos.length > 0}
                title={
                  item.usos.length > 0
                    ? "Arquivo em uso — troque a mídia nos documentos antes de apagar"
                    : "Excluir arquivo"
                }
                className="rounded border border-[color:var(--mm-error)] px-2 py-1 text-xs text-[color:var(--mm-error)] hover:bg-[color:var(--mm-light-error)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !error && (
        <p className="text-sm text-[color:var(--mm-text-2)]">Nenhum arquivo enviado ainda.</p>
      )}
    </div>
  )
}
