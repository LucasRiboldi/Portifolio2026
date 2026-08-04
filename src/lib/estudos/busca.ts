import type { Disciplina } from "@/data/estudos/tipos"

/**
 * Busca dentro da disciplina.
 *
 * Índice montado uma vez por disciplina (`useMemo` no componente) e varrido em
 * memória: são vinte aulas, não vinte mil documentos — trazer um motor de busca
 * para cá seria peso sem retorno.
 *
 * O acento é removido dos dois lados da comparação. Quem procura "arvore" está
 * procurando "árvore", e num conteúdo em português essa é a diferença entre a
 * busca servir e não servir.
 */

export type TipoOcorrencia =
  | "conteudo"
  | "exemplo"
  | "exercicio"
  | "resumo"
  | "anotacao"
  | "aula"

export interface Ocorrencia {
  tipo: TipoOcorrencia
  /** Número da aula; `null` quando o acerto está nas anotações da disciplina. */
  aula: number | null
  titulo: string
  /** Trecho do texto onde o termo apareceu, para dar contexto ao resultado. */
  trecho: string
  /** Âncora de destino na página. */
  ancora: string
}

interface EntradaIndice {
  tipo: TipoOcorrencia
  aula: number | null
  titulo: string
  texto: string
  ancora: string
}

export function normalizar(s: string): string {
  // NFD separa a letra do acento; a classe seguinte varre a faixa dos
  // diacríticos combinantes (U+0300–U+036F) e sobra a letra pura.
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
}

/** Recorta ~120 caracteres em volta do acerto, sem cortar no meio da palavra. */
function trechoDe(texto: string, posicao: number): string {
  const inicio = Math.max(0, posicao - 50)
  const fim = Math.min(texto.length, posicao + 90)
  const corte = texto.slice(inicio, fim).trim()
  return `${inicio > 0 ? "…" : ""}${corte}${fim < texto.length ? "…" : ""}`
}

export function montarIndice(d: Disciplina): EntradaIndice[] {
  const entradas: EntradaIndice[] = []

  for (const aula of d.aulas) {
    const ancora = `aula-${aula.numero}`
    const rotulo = `Aula ${String(aula.numero).padStart(2, "0")} · ${aula.assunto}`

    entradas.push({
      tipo: "aula",
      aula: aula.numero,
      titulo: rotulo,
      texto: `${aula.assunto} ${aula.unidade}`,
      ancora,
    })

    const c = aula.conteudo
    if (c) {
      entradas.push({
        tipo: "conteudo",
        aula: aula.numero,
        titulo: rotulo,
        texto: [
          c.resumo,
          c.explicacaoSimples,
          c.explicacaoTecnica,
          ...c.aplicacoes,
          ...c.curiosidades,
          ...c.conceitos.map((x) => `${x.termo}: ${x.definicao}`),
        ].join(" "),
        ancora,
      })

      for (const ex of c.exemplos) {
        entradas.push({
          tipo: "exemplo",
          aula: aula.numero,
          titulo: `${rotulo} — ${ex.titulo}`,
          texto: [ex.titulo, ex.descricao ?? "", ex.codigo ?? "", ...(ex.linhas ?? []).map((l) => `${l.trecho} ${l.explicacao}`)].join(" "),
          ancora,
        })
      }
    }

    for (const e of aula.exercicios ?? []) {
      entradas.push({
        tipo: "exercicio",
        aula: aula.numero,
        titulo: `${rotulo} — exercício ${e.nivel}`,
        texto: [e.enunciado, e.dica, e.resolucao, e.resposta].join(" "),
        ancora,
      })
    }

    const r = aula.resumo
    if (r) {
      entradas.push({
        tipo: "resumo",
        aula: aula.numero,
        titulo: `${rotulo} — resumo`,
        texto: [...r.conceitosImportantes, ...r.checklist, ...r.palavrasChave, ...r.pontosRevisao].join(" "),
        ancora,
      })
    }
  }

  return entradas
}

/**
 * Procura `termo` no índice, com as anotações entrando como fonte extra.
 *
 * As anotações não estão no índice pré-montado porque mudam a cada tecla; vêm
 * por parâmetro para não invalidar o `useMemo` do índice inteiro a cada
 * digitação.
 */
export function buscar(
  indice: readonly EntradaIndice[],
  termo: string,
  anotacoes = "",
  limite = 40,
): Ocorrencia[] {
  const alvo = normalizar(termo.trim())
  if (alvo.length < 2) return []

  const achados: Ocorrencia[] = []

  const examinar = (e: EntradaIndice) => {
    const pos = normalizar(e.texto).indexOf(alvo)
    if (pos === -1) return
    achados.push({
      tipo: e.tipo,
      aula: e.aula,
      titulo: e.titulo,
      trecho: trechoDe(e.texto, pos),
      ancora: e.ancora,
    })
  }

  for (const e of indice) {
    if (achados.length >= limite) break
    examinar(e)
  }

  if (anotacoes.trim()) {
    const pos = normalizar(anotacoes).indexOf(alvo)
    if (pos !== -1) {
      achados.push({
        tipo: "anotacao",
        aula: null,
        titulo: "Minhas anotações",
        trecho: trechoDe(anotacoes, pos),
        ancora: "anotacoes",
      })
    }
  }

  return achados
}

export const ROTULO_TIPO: Record<TipoOcorrencia, string> = {
  aula: "aula",
  conteudo: "conteúdo",
  exemplo: "exemplo",
  exercicio: "exercício",
  resumo: "resumo",
  anotacao: "anotação",
}
