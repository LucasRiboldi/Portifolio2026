"use client"

import { useEffect, useRef, useState } from "react"

import { chave, useArmazenamentoLocal } from "@/lib/estudos/armazenamento"
import { Markdown } from "./markdown"

/**
 * NOTES — a área de anotações da disciplina.
 *
 * A chave inclui o slug (`dev:estudos:banco-de-dados:anotacoes`), então as
 * anotações de cada disciplina são independentes por construção, não por
 * disciplina de quem escreve.
 *
 * O autosave é adiado em 600 ms: gravar a cada tecla serializa e escreve em
 * disco dezenas de vezes por frase, e `localStorage` é síncrono — trava a
 * digitação em texto longo.
 */

const ATRASO_AUTOSAVE = 600

interface Anotacoes {
  texto: string
}

export function Notes({
  slug,
  nome,
  onTexto,
}: {
  slug: string
  nome: string
  /** Espelha o texto para quem precisa dele fora daqui — a busca, hoje. */
  onTexto?: (texto: string) => void
}) {
  const k = chave(slug, "anotacoes")
  const { valor, definir, hidratado, salvoEm, limpar } = useArmazenamentoLocal<Anotacoes>(
    k,
    { texto: "" },
    ATRASO_AUTOSAVE,
  )
  const [previa, setPrevia] = useState(false)
  const inputArquivo = useRef<HTMLInputElement>(null)

  // Espelha para fora sempre que o texto muda — inclusive na carga inicial,
  // senão a busca só enxergaria as anotações depois da primeira tecla.
  useEffect(() => {
    if (hidratado) onTexto?.(valor.texto)
  }, [valor.texto, hidratado, onTexto])

  const exportar = () => {
    const blob = new Blob([valor.texto], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `anotacoes-${slug}.md`
    a.click()
    // Sem o revoke o blob fica retido na aba até o reload.
    URL.revokeObjectURL(url)
  }

  const importar = async (arquivo: File) => {
    const texto = await arquivo.text()
    // Acrescenta em vez de sobrescrever: importar por engano não pode apagar
    // meses de anotação, e juntar é desfazível à mão enquanto apagar não é.
    definir((a) => ({ texto: a.texto ? `${a.texto}\n\n${texto}` : texto }))
  }

  const aoLimpar = () => {
    if (!confirm(`Apagar todas as anotações de ${nome}? Isso não pode ser desfeito.`)) return
    limpar()
  }

  return (
    <div className="es-notas">
      <div className="es-notas-barra">
        <div className="dv-tabs" role="group" aria-label="Modo das anotações">
          <button
            type="button"
            className="dv-tab"
            data-on={!previa}
            aria-pressed={!previa}
            onClick={() => setPrevia(false)}
          >
            escrever
          </button>
          <button
            type="button"
            className="dv-tab"
            data-on={previa}
            aria-pressed={previa}
            onClick={() => setPrevia(true)}
          >
            pré-visualizar
          </button>
        </div>

        <div className="es-notas-acoes">
          <button type="button" className="dv-filter" onClick={() => inputArquivo.current?.click()}>
            importar
          </button>
          <button type="button" className="dv-filter" onClick={exportar} disabled={!valor.texto}>
            exportar
          </button>
          <button type="button" className="dv-filter es-perigo" onClick={aoLimpar} disabled={!valor.texto}>
            limpar
          </button>
          <input
            ref={inputArquivo}
            type="file"
            accept=".md,.markdown,.txt,text/plain,text/markdown"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void importar(f)
              // Zera para que reimportar o MESMO arquivo dispare `change` de novo.
              e.target.value = ""
            }}
          />
        </div>
      </div>

      {previa ? (
        <div className="es-notas-previa">
          <Markdown texto={valor.texto} />
        </div>
      ) : (
        <textarea
          className="es-notas-campo"
          value={hidratado ? valor.texto : ""}
          onChange={(e) => definir({ texto: e.target.value })}
          placeholder={`Anotações de ${nome}.\n\nMarkdown básico: # título, **negrito**, *itálico*, \`código\`, - lista, > citação.`}
          aria-label={`Anotações de ${nome}`}
          spellCheck
          rows={14}
        />
      )}

      <p className="es-notas-rodape">
        {salvoEm ? (
          <>
            salvo automaticamente · última edição em{" "}
            <time dateTime={salvoEm}>
              {new Date(salvoEm).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
            </time>
          </>
        ) : (
          "salvo automaticamente neste navegador"
        )}
        <span className="es-notas-cont"> · {valor.texto.length} caracteres</span>
      </p>
    </div>
  )
}
