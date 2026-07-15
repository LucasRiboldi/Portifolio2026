"use client"

import { useMemo, useState } from "react"

import { CopyButton } from "./copy-button"

type ToolId = "slug" | "count" | "json" | "base64" | "cor" | "time" | "uuid" | "lorem"

const TABS: { id: ToolId; label: string }[] = [
  { id: "slug", label: "Slugify" },
  { id: "count", label: "Contador" },
  { id: "json", label: "JSON" },
  { id: "base64", label: "Base64" },
  { id: "cor", label: "Cor" },
  { id: "time", label: "Timestamp" },
  { id: "uuid", label: "UUID" },
  { id: "lorem", label: "Lorem" },
]

const LOREM =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(
    " ",
  )

function loremParas(n: number) {
  return Array.from({ length: n }, () => {
    const len = 30 + Math.floor(Math.random() * 25)
    const words = Array.from({ length: len }, () => LOREM[Math.floor(Math.random() * LOREM.length)] ?? "lorem")
    const s = words.join(" ")
    return s.charAt(0).toUpperCase() + s.slice(1) + "."
  }).join("\n\n")
}

function hexToRgb(hex: string): string | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i)
  if (!m) return null
  const n = parseInt(m[1] ?? "0", 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}
function rgbToHex(rgb: string): string | null {
  const m = rgb.match(/(\d+)\D+(\d+)\D+(\d+)/)
  if (!m) return null
  const h = (v: string) => Number(v).toString(16).padStart(2, "0")
  return `#${h(m[1] ?? "0")}${h(m[2] ?? "0")}${h(m[3] ?? "0")}`
}

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
  const [gen, setGen] = useState("")
  const isGenerator = tab === "uuid" || tab === "lorem"

  const output = useMemo(() => {
    try {
      if (tab === "slug") return slugify(input)
      if (tab === "count") {
        const words = input.trim() ? input.trim().split(/\s+/).length : 0
        return `${input.length} caracteres · ${words} palavras · ${input.split(/\n/).length} linhas`
      }
      if (tab === "json") return input.trim() ? JSON.stringify(JSON.parse(input), null, 2) : ""
      if (tab === "cor") {
        if (!input.trim()) return ""
        return input.includes("#") || /^[0-9a-f]{6}$/i.test(input.trim())
          ? hexToRgb(input.trim()) ?? "hex inválido (use #rrggbb)"
          : rgbToHex(input) ?? "rgb inválido (use r,g,b)"
      }
      if (tab === "time") {
        if (!input.trim()) return ""
        const num = Number(input.trim())
        if (!Number.isNaN(num)) {
          const ms = input.trim().length > 10 ? num : num * 1000
          return new Date(ms).toISOString() + "  ·  " + new Date(ms).toLocaleString("pt-BR")
        }
        const d = new Date(input)
        return Number.isNaN(d.getTime())
          ? "data inválida"
          : `unix: ${Math.floor(d.getTime() / 1000)}  ·  ms: ${d.getTime()}`
      }
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

      {isGenerator ? (
        <div>
          <button
            type="button"
            className="dv-copy"
            onClick={() => setGen(tab === "uuid" ? crypto.randomUUID() : loremParas(3))}
            style={{ marginBottom: "0.6rem" }}
          >
            {tab === "uuid" ? "gerar UUID v4" : "gerar 3 parágrafos"}
          </button>
          {gen && (
            <div className="dv-tool-out flex items-start justify-between gap-3">
              <span style={{ flex: 1 }}>{gen}</span>
              <CopyButton text={gen} />
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
                    : tab === "cor"
                      ? "#bd93f9  ou  189, 147, 249"
                      : tab === "time"
                        ? "1784060000  ou  2026-07-14"
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
