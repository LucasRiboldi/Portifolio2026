import "server-only"

import { unstable_cache } from "next/cache"

import { buscarLinhas } from "@/lib/firebase/query"
import { CACHE_TAGS } from "./tags"
import {
  materias as materiasSeed,
  type Materia,
  type MateriaBloco,
  type MateriaBox,
} from "@/data/anfitriao-materias"

/**
 * Leitor das matérias das páginas internas.
 *
 * Cai no seed de `data/anfitriao-materias.ts` quando não há Supabase
 * configurado ou a consulta falha — mesmo contrato das zonas do criativo, e
 * pela mesma razão: a folha não pode abrir vazia. Uma página de jornal sem
 * matéria não é estado vazio legítimo, é folha em branco.
 *
 * Os leitores do realm dev devolvem `[]` nesse caso porque lá a seção some
 * inteira; aqui a matéria É a página.
 */

/** A linha como o banco a devolve — snake_case e jsonb crus. */
interface MateriaRow {
  slug: string
  caderno: string
  page: string
  kicker: string
  headline: string
  subhead: string
  standfirst: string
  byline: string
  byline_role: string
  dateline: string
  continua_de: string | null
  dropcap: string
  open_line: string
  blocos: MateriaBloco[]
  pullquote: string
  figure: Materia["figure"]
  boxes: MateriaBox[]
  sign: string
  colofao: Materia["colofao"]
  remissoes: Materia["remissoes"]
}

/**
 * Traduz a linha para o formato que a página consome.
 *
 * Existe porque o banco fala snake_case e o componente fala camelCase. A
 * tradução num lugar só evita que a rota conheça o formato do banco — que é
 * o que permitiria trocar a origem sem tocar na diagramação.
 */
function daLinha(r: MateriaRow): Materia {
  return {
    slug: r.slug,
    caderno: r.caderno,
    page: r.page,
    kicker: r.kicker,
    headline: r.headline,
    subhead: r.subhead,
    standfirst: r.standfirst,
    byline: r.byline,
    bylineRole: r.byline_role,
    dateline: r.dateline,
    ...(r.continua_de ? { continuaDe: r.continua_de } : {}),
    dropcap: r.dropcap,
    openLine: r.open_line,
    // Os jsonb chegam como `unknown` na prática; a coluna tem CHECK de forma
    // na migration, mas uma linha escrita antes dele ainda poderia vir torta.
    // O fallback mantém a página de pé em vez de estourar na renderização.
    blocos: Array.isArray(r.blocos) ? r.blocos : [],
    pullquote: r.pullquote,
    figure: r.figure ?? { caption: "", credit: "" },
    boxes: Array.isArray(r.boxes) ? r.boxes : [],
    sign: r.sign,
    colofao: r.colofao ?? { composta: "", revisao: "", chapas: "" },
    remissoes: Array.isArray(r.remissoes) ? r.remissoes : [],
  }
}

export const getMaterias = unstable_cache(
  async (): Promise<Materia[]> => {
    const data = await buscarLinhas<MateriaRow>("prophet_materias", {
      where: [{ campo: "published", valor: true }],
      orderBy: [{ campo: "sort" }, { campo: "created_at" }],
    })

    if (!data || data.length === 0) return materiasSeed
    return data.map(daLinha)
  },
  ["prophet_materias"],
  { tags: [CACHE_TAGS.materias] },
)

/**
 * Uma matéria pelo slug.
 *
 * Filtra a lista já cacheada em vez de consultar por slug: a folha tem uma
 * dúzia de matérias, e uma segunda entrada de cache por slug multiplicaria
 * as invalidações sem poupar nada.
 */
export async function getMateria(slug: string): Promise<Materia | undefined> {
  const todas = await getMaterias()
  return todas.find((m) => m.slug === slug)
}

export type { Materia }
