"use client"

import { useMemo, useState } from "react"

import { CopyButton } from "./copy-button"

type ToolId = "slug" | "count" | "json" | "base64" | "uuid"

const TABS: { id: ToolId; label: string }[] = [
  { id: "slug", label: "Slugify" },
  { id: "count", label: "Contador" },
  { id: "json", label: "JSON" },
  { id: "base64", label: "Base64" },
  { id: "uuid", label: "UUID" },
]

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function DevToolbox() {
  const [tab, setTab] = useState<ToolId>("slug")
  const [input, setInput] = useState("")
  const [uuid, setUuid] = useState("")

  const output = useMemo(() => {
    try {
      if (tab === "slug") return slugify(input)
      if (tab === "count") {
        const words = input.trim() ? input.trim().split(/\s+/).length : 0
        return `${input.length} caracteres · ${words} palavras · ${input.split(/\n/).length} linhas`
      }
      if (tab === "json") return input.trim() ? JSON.stringify(JSON.parse(input), null, 2) : ""
      if (tab === "base64") {
        // encode se não parecer base64; senão tenta decodificar
        const looksB64 = /^[A-Za-z0-9+/=\s]+$/.test(input) && input.length % 4 === 0 && input.length > 0
        return looksB64
          ? (() => {
              try {
                return decodeURIComponent(escape(atob(input)))
              } catch {
                return btoa(unescape(encodeURIComponent(input)))
              }
            })()
          : input
            ? btoa(unescape(encodeURIComponent(input)))
            : ""
      }
      return ""
    } catch (e) {
      return `⚠ ${e instanceof Error ? e.message : "entrada inválida"}`
    }
  }, [tab, input])

  return (
    <div className="dv-toolbox">
      <div className="mb-3 flex items-center justify-between">
        <h3 style={{ color: "var(--d-cyan)", fontWeight: 700 }}>Ferramentas internas</h3>
        <span className="dv-count">utilitários que rodam no seu navegador</span>
      </div>

      <div className="dv-tabs">
        {TABS.map((t) => (
          <button key={t.id} className="dv-tab" data-on={t.id === tab} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "uuid" ? (
        <div>
          <button
            type="button"
            className="dv-copy"
            onClick={() => setUuid(crypto.randomUUID())}
            style={{ marginBottom: "0.6rem" }}
          >
            gerar UUID v4
          </button>
          {uuid && (
            <div className="dv-tool-out flex items-center justify-between gap-3">
              <span>{uuid}</span>
              <CopyButton text={uuid} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            className="dv-tool-field"
            rows={tab === "json" ? 5 : 3}
            placeholder={
              tab === "slug"
                ? "Título do Meu Post"
                : tab === "json"
                  ? '{"a":1,"b":[2,3]}'
                  : tab === "base64"
                    ? "texto ou base64…"
                    : "cole seu texto…"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {output && (
            <div className="dv-tool-out">
              <div className="flex items-start justify-between gap-3">
                <span style={{ flex: 1 }}>{output}</span>
                {tab !== "count" && <CopyButton text={output} />}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
