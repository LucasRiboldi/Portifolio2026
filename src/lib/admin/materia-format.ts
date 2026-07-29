/**
 * TRADUÇÃO ENTRE O FORMULÁRIO E O JSONB DAS MATÉRIAS.
 *
 * A tabela `prophet_materias` guarda cinco estruturas aninhadas em jsonb. O
 * caminho preguiçoso seria pôr cinco caixas de JSON cru no painel e mandar
 * quem escreve digitar chaves e colchetes — o que é aceitável para uma tabela
 * de configuração e péssimo para PROSA. Ninguém escreve uma matéria de jornal
 * contando vírgulas de JSON.
 *
 * Por isso o corpo tem formato próprio, de texto corrido:
 *
 *     Parágrafo de abertura do bloco.
 *
 *     Outro parágrafo do mesmo bloco.
 *
 *     ## Do silêncio como medida
 *
 *     Primeiro parágrafo depois do intertítulo.
 *
 * `## ` abre um bloco novo com intertítulo; linha em branco separa parágrafos.
 * É o mesmo modelo de conteúdo do banco, escrito de um jeito que um redator
 * digita sem pensar na estrutura.
 *
 * As outras quatro estruturas (caixas, gravura, colofão, remissões) são dados
 * tabulares, não prosa — essas continuam em JSON, que ali é a forma honesta.
 *
 * Este módulo NÃO é `server-only`: o formulário do painel é componente de
 * cliente e precisa da mesma serialização que a validação usa no servidor.
 * Ter as duas pontas no mesmo arquivo é o que impede que divirjam.
 */
import { z } from "zod"

import type { MateriaBloco } from "@/data/anfitriao-materias"

/* ───────────────────────────── Corpo ───────────────────────────────── */

/** Blocos → texto editável. */
export function blocosParaTexto(blocos: unknown): string {
  if (!Array.isArray(blocos)) return ""
  return (blocos as MateriaBloco[])
    .map((b) => {
      const corpo = (b.paragraphs ?? []).join("\n\n")
      return b.subhead ? `## ${b.subhead}\n\n${corpo}` : corpo
    })
    .join("\n\n")
    .trim()
}

/** Texto editável → blocos. */
export function textoParaBlocos(texto: string): MateriaBloco[] {
  const blocos: MateriaBloco[] = []
  let atual: MateriaBloco | null = null

  // Normaliza a quebra de linha do Windows antes de partir: sem isto, um
  // texto colado do painel no Windows deixaria `\r` preso no fim de cada
  // parágrafo, e o `## ` de um intertítulo não seria reconhecido.
  for (const pedaco of texto.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const t = pedaco.trim()
    if (!t) continue

    if (t.startsWith("## ")) {
      atual = { subhead: t.slice(3).trim(), paragraphs: [] }
      blocos.push(atual)
      continue
    }
    // Parágrafo antes de qualquer intertítulo: abre um bloco sem cabeça, que
    // é exatamente o primeiro bloco de toda matéria.
    if (!atual) {
      atual = { paragraphs: [] }
      blocos.push(atual)
    }
    atual.paragraphs.push(t)
  }

  // Um intertítulo sem parágrafo nenhum abaixo sairia como cabeça solta no
  // impresso — é erro de composição, não conteúdo.
  return blocos.filter((b) => b.paragraphs.length > 0)
}

/** Campo zod do corpo: aceita o texto do formulário ou blocos já prontos. */
export const blocosField = z.preprocess(
  (v) => (typeof v === "string" ? textoParaBlocos(v) : Array.isArray(v) ? v : []),
  z
    .array(
      z.object({
        subhead: z.string().optional(),
        paragraphs: z.array(z.string()).min(1),
      }),
    )
    .min(1, "A matéria precisa de ao menos um parágrafo de corpo."),
)

/* ───────────────────────────── JSON ────────────────────────────────── */

/** Valor do banco → texto do formulário, indentado para ser legível. */
export function jsonParaTexto(v: unknown): string {
  if (v == null) return ""
  if (typeof v === "string") return v
  return JSON.stringify(v, null, 2)
}

/**
 * Campo zod de JSON.
 *
 * A mensagem de erro diz o NOME do campo porque o formulário junta todos os
 * erros numa linha só: "Inválido" três vezes não diz onde está o problema.
 *
 * `transform` + `pipe` em vez de `preprocess`: o texto malformado precisa
 * virar uma FALHA relatada (`ctx.addIssue`), não uma exceção — se o parse
 * estourasse dentro do preprocess, a action inteira quebraria e quem editava
 * veria erro de servidor no lugar de "JSON inválido em Caixas".
 */
function jsonField<T extends z.ZodType>(rotulo: string, forma: T, vazio: unknown) {
  return z
    .unknown()
    // `.optional()` porque em zod 4 `z.unknown()` NÃO aceita ausência: uma
    // chave que não veio falha com "expected nonoptional". O formulário do
    // painel sempre manda as vinte chaves, mas qualquer outra chamada
    // (um script, um teste, um seed futuro) passaria objeto parcial — e o
    // certo aí é cair no valor neutro, não estourar.
    .optional()
    .transform((v, ctx) => {
      if (v == null || v === "") return vazio
      // Chamada programática (seed, sync) já manda a estrutura pronta.
      if (typeof v !== "string") return v
      try {
        return JSON.parse(v)
      } catch {
        ctx.addIssue({ code: "custom", message: `${rotulo}: JSON inválido.` })
        return z.NEVER
      }
    })
    .pipe(forma)
}

const caixa = z.object({
  title: z.string().min(1),
  body: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
  rows: z.array(z.tuple([z.string(), z.string()])).optional(),
})

export const boxesField = jsonField("Caixas", z.array(caixa), [])

export const figureField = jsonField(
  "Gravura",
  z.object({ caption: z.string(), credit: z.string() }),
  { caption: "", credit: "" },
)

export const colofaoField = jsonField(
  "Colofão",
  z.object({ composta: z.string(), revisao: z.string(), chapas: z.string() }),
  { composta: "", revisao: "", chapas: "" },
)

export const remissoesField = jsonField(
  "Remissões",
  z.array(z.object({ slug: z.string().min(1), label: z.string().min(1) })),
  [],
)
