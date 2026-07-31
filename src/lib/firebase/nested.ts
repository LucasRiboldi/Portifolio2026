import "server-only"

/**
 * Arrays aninhados: a única incompatibilidade estrutural real entre o schema
 * antigo e o Firestore.
 *
 * O Postgres guardava esses campos como `jsonb` — qualquer forma servia. O
 * Firestore recusa **array dentro de array** (`INVALID_ARGUMENT: Property array
 * contains an invalid nested entity`). Não é limite de tamanho nem de tipo: é
 * uma restrição do modelo de documento, porque cada elemento de array precisa
 * ser indexável isoladamente.
 *
 * Onde isso aparece hoje: `prophet_materias.boxes[].rows`, que é a matriz de
 * linhas × colunas das tabelas dentro de uma matéria do jornal.
 *
 * A solução é envelopar o array interno num objeto na gravação e desenvelopar
 * na leitura. Fica aqui, na fronteira de persistência, e não nos mapeadores de
 * cada entidade, por dois motivos:
 *
 *  1. A restrição é do Firestore, não da matéria. Qualquer entidade futura com
 *     matriz esbarraria nela, e a correção já estaria feita.
 *  2. Os tipos de domínio não mudam. `MateriaBox.rows` continua `string[][]`
 *     para a página que o desenha — a diagramação não fica sabendo do formato
 *     de armazenamento, que era exatamente a fronteira que o projeto já tinha.
 */

/** Marcador do envelope. O `$` evita colisão com campo de conteúdo. */
const ENVELOPE = "$arr"

interface Envelope {
  [ENVELOPE]: unknown[]
}

function ehEnvelope(v: unknown): v is Envelope {
  return typeof v === "object" && v !== null && Array.isArray((v as Envelope)[ENVELOPE])
}

/**
 * Prepara um valor para gravação: arrays diretamente dentro de arrays viram
 * `{ $arr: [...] }`. O resto passa intacto.
 */
export function paraFirestore<T>(valor: T): T {
  return converter(valor, false) as T
}

/** Desfaz o envelope na leitura. */
export function doFirestore<T>(valor: T): T {
  return reverter(valor) as T
}

function converter(valor: unknown, dentroDeArray: boolean): unknown {
  if (Array.isArray(valor)) {
    const itens = valor.map((v) => converter(v, true))
    return dentroDeArray ? { [ENVELOPE]: itens } : itens
  }
  if (valor && typeof valor === "object" && !(valor instanceof Date)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
      out[k] = converter(v, false)
    }
    return out
  }
  return valor
}

function reverter(valor: unknown): unknown {
  if (ehEnvelope(valor)) return valor[ENVELOPE].map(reverter)
  if (Array.isArray(valor)) return valor.map(reverter)
  if (valor && typeof valor === "object" && !(valor instanceof Date)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
      out[k] = reverter(v)
    }
    return out
  }
  return valor
}
