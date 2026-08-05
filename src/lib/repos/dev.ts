import "server-only"

import { unstable_cache } from "next/cache"

import { buscarLinhas } from "@/lib/firebase/query"
import { devlogs as devlogsSeed } from "@/data/dev"
import { CACHE_TAGS } from "./tags"

export interface DevlogRow {
  id: string
  slug: string
  title: string
  date: string
  summary: string
  body: string
  tags: string[]
}
export interface SnippetRow {
  id: string
  title: string
  language: string
  description: string
  code: string
  tags: string[]
}
export interface LabRow {
  id: string
  title: string
  description: string
  status: string
  stack: string[]
  demo_url: string | null
  repo_url: string | null
}

/** Cria um leitor público cacheado (published=true) para uma tabela. */
function publishedReader<T>(table: string, tag: string, order: string, asc: boolean) {
  return unstable_cache(
    async (): Promise<T[]> => {
      const data = await buscarLinhas<T>(table, {
        where: [{ campo: "published", valor: true }],
        orderBy: [{ campo: order, asc }],
      })
      return data ?? []
    },
    [table],
    { tags: [tag] },
  )
}

/**
 * Envolve um leitor com a cópia versionada de `src/data`.
 *
 * O banco continua mandando: o seed só entra quando não há NADA publicado, e
 * nunca se mistura com o que veio do Firestore — meia lista do banco somada a
 * meia lista do arquivo daria uma terceira coisa que ninguém escreveu.
 */
function leitorComSeed<T>(ler: () => Promise<T[]>, seed: () => T[]) {
  return async (): Promise<T[]> => {
    const publicados = await ler()
    return publicados.length > 0 ? publicados : seed()
  }
}

/**
 * Devlogs — o único leitor deste arquivo com rede embaixo.
 *
 * Os três nasceram iguais: `data ?? []`, sem fallback. Isso bastava enquanto o
 * devlog era uma faixa opcional na home — lista vazia, seção some, ninguém
 * percebe. Com rota própria (`/desenvolvedor/devlog`) o cálculo mudou: uma
 * PÁGINA vazia é promessa quebrada, e "o site funciona com ou sem backend" é a
 * regra central deste projeto.
 *
 * `id` vira o slug porque o seed não tem identificador próprio — e o slug já é
 * a chave natural que o sync do /admin usa para comparar.
 *
 * Snippets e lab seguem sem fallback de propósito: os dois têm página que
 * trata o vazio com uma frase acionável ("adicione em /admin/…"), o que aqui
 * não caberia — o devlog versionado EXISTE, e escondê-lo seria mentir sobre o
 * acervo.
 */
export const getDevlogs = leitorComSeed(
  publishedReader<DevlogRow>("devlogs", CACHE_TAGS.devlogs, "date", false),
  () => devlogsSeed.map((d) => ({ ...d, id: d.slug })),
)

/** Um devlog pelo slug (reaproveita a lista, que já é cacheada). */
export async function getDevlogBySlug(slug: string): Promise<DevlogRow | undefined> {
  const todos = await getDevlogs()
  return todos.find((d) => d.slug === slug)
}

export const getSnippets = publishedReader<SnippetRow>("snippets", CACHE_TAGS.snippets, "sort", true)
export const getLab = publishedReader<LabRow>("lab_experiments", CACHE_TAGS.lab, "sort", true)
