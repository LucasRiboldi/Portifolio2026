"use client"

/**
 * Fila do Prophet Wire — a parte acionável do painel.
 *
 * Mostra rascunho e publicado na mesma lista, com a ação que falta em cada um.
 * Separar em duas telas obrigaria a navegar para desfazer uma publicação
 * errada, que é justamente a hora em que se quer pressa.
 */
import { useState, useTransition } from "react"
import { ExternalLink } from "lucide-react"

import {
  publicarNoticia,
  despublicarNoticia,
  excluirNoticia,
  type WireResult,
} from "@/app/admin/prophet-wire/actions"

export interface ItemFila {
  slug: string
  title: string
  sourceName: string
  sourceUrl: string
  publishedAt: string
  status: "rascunho" | "publicado"
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })

export function WireFila({ itens }: { itens: ItemFila[] }) {
  const [pendente, startTransition] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  // Qual linha está em ação — evita piscar o painel inteiro em cada clique.
  const [agindo, setAgindo] = useState<string | null>(null)

  function agir(slug: string, acao: (s: string) => Promise<WireResult>, confirmar?: string) {
    if (confirmar && !confirm(confirmar)) return
    setErro(null)
    setAgindo(slug)
    startTransition(async () => {
      const r = await acao(slug)
      if (!r.ok) setErro(r.error)
      setAgindo(null)
    })
  }

  if (itens.length === 0) {
    return (
      <p className="text-sm text-[color:var(--mm-text-2)]">
        Nada no acervo ainda. As notícias aparecem aqui depois de uma execução do agregador.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {erro && <p className="text-sm text-[color:var(--mm-error)]">{erro}</p>}

      {itens.map((n) => {
        const ocupado = pendente && agindo === n.slug
        const publicado = n.status === "publicado"
        return (
          <div
            key={n.slug}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-[color:var(--mm-border)] p-3"
            style={{ opacity: ocupado ? 0.5 : 1 }}
          >
            <div className="min-w-[14rem] flex-1">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-[color:var(--mm-text-2)]">
                {n.sourceName} · {fmt(n.publishedAt)}
                {n.sourceUrl && (
                  <>
                    {" · "}
                    <a
                      href={n.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline"
                    >
                      fonte <ExternalLink className="size-3" />
                    </a>
                  </>
                )}
              </p>
            </div>

            <span
              className="mm-chip shrink-0 text-xs"
              style={{
                background: publicado ? "var(--mm-light-success)" : "var(--mm-light-warning)",
                color: publicado ? "var(--mm-success)" : "#8a6100",
              }}
            >
              {publicado ? "no ar" : "rascunho"}
            </span>

            <div className="flex shrink-0 gap-2">
              {publicado ? (
                <button
                  type="button"
                  disabled={ocupado}
                  onClick={() => agir(n.slug, despublicarNoticia)}
                  className="rounded border border-[color:var(--mm-border)] px-2 py-1 text-xs hover:bg-[color:var(--mm-hover)] disabled:opacity-60"
                >
                  Tirar do ar
                </button>
              ) : (
                <button
                  type="button"
                  disabled={ocupado}
                  onClick={() => agir(n.slug, publicarNoticia)}
                  className="mm-btn mm-btn-primary px-3 py-1 text-xs disabled:opacity-60"
                >
                  Publicar
                </button>
              )}
              <button
                type="button"
                disabled={ocupado}
                onClick={() =>
                  agir(
                    n.slug,
                    excluirNoticia,
                    `Excluir "${n.title}"?\n\nO agregador pode recoletá-la numa execução futura.`,
                  )
                }
                className="rounded border border-[color:var(--mm-error)] px-2 py-1 text-xs text-[color:var(--mm-error)] hover:bg-[color:var(--mm-light-error)] disabled:opacity-60"
              >
                Excluir
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
