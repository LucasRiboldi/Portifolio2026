import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

import { describe, it, expect } from "vitest"

import { COLECOES } from "@/lib/firebase/schema"

import { RESOURCES, resourceTable } from "@/lib/admin/resources"

/**
 * A INTEGRIDADE DO PAINEL — menu, recursos, tabelas e colunas.
 *
 * O /admin tem quatro camadas que precisam concordar e que ninguém obriga a
 * concordar: o MENU (uma lista escrita à mão no sidebar), os RECURSOS (a
 * configuração declarativa), as COLEÇÕES e os CAMPOS (lib/firebase/schema). Cada uma
 * é editada por um motivo diferente, e as divergências não aparecem em
 * compilação nem em revisão — aparecem quando alguém clica em salvar.
 *
 * Foi assim que `projects.slug` e `projects.readme` passaram despercebidos:
 * campos oferecidos pelo painel, lidos pelo código, sem coluna em migration
 * nenhuma. Em produção as colunas existiam (criadas à mão), então nada
 * acusava; num banco novo, salvar projeto falhava.
 *
 * Estes testes leem as quatro fontes e exigem que fechem.
 */

const RAIZ = path.join(import.meta.dirname, "..")
const ler = (p: string) => readFileSync(path.join(RAIZ, p), "utf8")

/* ─────────────────── As quatro fontes, extraídas ─────────────────────── */

/** Itens do menu lateral. */
const MENU = [
  ...ler("src/components/admin/admin-sidebar.tsx").matchAll(
    /href:\s*"(\/admin[^"]*)",\s*label:\s*"([^"]+)"/g,
  ),
].map((m) => ({ href: m[1]!, label: m[2]! }))

/**
 * Campos de cada coleção. Vinham do SQL das migrations; agora da declaração
 * explícita em `lib/firebase/schema.ts` — o Firestore não tem schema próprio.
 */
const COLUNAS: Record<string, readonly string[]> = COLECOES

/** Rotas do painel com página própria (não passam pelo CRUD genérico). */
const ROTAS_PROPRIAS = ["/admin", "/admin/prophet", "/admin/prophet-wire", "/admin/realms", "/admin/site", "/admin/media", "/admin/messages"]

const slugsDoMenu = MENU.filter(
  (m) => !ROTAS_PROPRIAS.includes(m.href) && !m.href.startsWith("/admin/pages/"),
).map((m) => m.href.replace("/admin/", ""))

/* ────────────────────────── Menu ↔ recursos ───────────────────────────── */

describe("menu e recursos", () => {
  it("todo item do menu leva a um recurso registrado", () => {
    // Item apontando para recurso inexistente cai em 404 — e o menu é a
    // única forma de descobrir a tela.
    const mortos = slugsDoMenu.filter((s) => !RESOURCES[s])
    expect(mortos).toEqual([])
  })

  it("todo recurso registrado aparece no menu", () => {
    // Recurso fora do menu é inalcançável: existe, funciona, e ninguém chega.
    const escondidos = Object.keys(RESOURCES).filter((s) => !slugsDoMenu.includes(s))
    expect(escondidos).toEqual([])
  })

  it("as rotas de página própria existem como arquivo", () => {
    const faltando = ROTAS_PROPRIAS.filter((r) => {
      const base = r === "/admin" ? "src/app/admin" : `src/app${r}`
      try {
        readFileSync(path.join(RAIZ, base, "page.tsx"))
        return false
      } catch {
        return true
      }
    })
    expect(faltando).toEqual([])
  })

  it("nenhum rótulo do menu se repete dentro da mesma seção", () => {
    // "Laboratório" aparece duas vezes de propósito (realm Dev e Daily
    // Prophet), em seções diferentes — o que se proíbe é a repetição que
    // deixa o usuário sem saber qual é qual.
    const porHref = new Map(MENU.map((m) => [m.href, m.label]))
    expect(porHref.size).toBe(MENU.length)
  })
})

/* ───────────────────── Recursos ↔ tabelas ↔ colunas ───────────────────── */

describe("recursos e banco", () => {
  it.each(Object.keys(RESOURCES))("«%s» aponta para uma tabela que existe", (slug) => {
    const tabela = resourceTable(slug)
    expect(COLUNAS[tabela], `coleção ${tabela} não está declarada em lib/firebase/schema.ts`).toBeDefined()
  })

  /**
   * O teste que teria pego `projects.slug`.
   *
   * Todo campo do formulário vira chave no insert/update. Campo sem coluna
   * correspondente faz o Postgres recusar a escrita inteira — o usuário vê
   * «column "x" does not exist» e nada é salvo.
   */
  it.each(Object.keys(RESOURCES))("todo campo de «%s» tem coluna na tabela", (slug) => {
    const tabela = resourceTable(slug)
    const colunas = COLUNAS[tabela] ?? []
    const semColuna = RESOURCES[slug]!.fields.map((f) => f.name).filter((n) => !colunas.includes(n))
    expect(semColuna, `${slug} → ${tabela}`).toEqual([])
  })

  it.each(Object.keys(RESOURCES))("as colunas listadas por «%s» existem", (slug) => {
    const tabela = resourceTable(slug)
    const colunas = COLUNAS[tabela] ?? []
    const semColuna = RESOURCES[slug]!.columns.map((c) => c.name).filter((n) => !colunas.includes(n))
    expect(semColuna, `${slug} → ${tabela}`).toEqual([])
  })

  it.each(Object.keys(RESOURCES))("«%s» ordena por uma coluna que existe", (slug) => {
    const tabela = resourceTable(slug)
    const colunas = COLUNAS[tabela] ?? []
    expect(colunas, `${slug}.orderBy`).toContain(RESOURCES[slug]!.orderBy.column)
  })
})

/* ──────────────────────── Conteúdo órfão ─────────────────────────────── */

/**
 * ÓRFÃOS — o painel edita, nenhuma página mostra.
 *
 * A varredura de 29/07/2026 encontrou SETE: `posts` e `skills` sem leitor
 * nenhum, e `wiki`, `ideas`, `tutorials`, `mechanics` e `resources` com
 * leitor que nenhuma página chamava. Conteúdo era escrito, publicado e ficava
 * inalcançável — sem nada no código para acusar.
 *
 * Os sete ganharam página na mesma passagem, e a lista está vazia. Ela
 * permanece como trava nos dois sentidos: órfão novo faz o teste falhar, e
 * órfão resolvido também — obrigando quem resolveu a atualizar o registro em
 * vez de deixar a lista mentir.
 */
const ORFAOS_CONHECIDOS: string[] = []

describe("conteúdo órfão", () => {
  /** Um recurso é órfão quando nenhuma página/componente lê o que ele grava. */
  function temLeitorUsado(slug: string): boolean {
    const tabela = resourceTable(slug)
    const dirRepos = path.join(RAIZ, "src/lib/repos")

    // Qual repositório menciona a tabela (tags.ts fora: só nomeia cache).
    const repo = readdirSync(dirRepos)
      .filter((f) => f.endsWith(".ts") && f !== "tags.ts")
      .find((f) => readFileSync(path.join(dirRepos, f), "utf8").includes(`"${tabela}"`))
    if (!repo) return false

    const fonte = readFileSync(path.join(dirRepos, repo), "utf8")

    /*
     * O leitor DESTA tabela, não qualquer leitor do arquivo.
     *
     * Um repositório serve várias tabelas: `dev.ts` exporta cinco leitores,
     * um por tabela. A primeira versão deste detector aceitava qualquer
     * export do arquivo e dava `wiki` como renderizada porque `getDevlogs`
     * — vizinha no mesmo arquivo — é usada. O corte por `export` isola cada
     * leitor com o nome de tabela que ele consulta.
     */
    const leitores = fonte
      .split(/^export /m)
      .slice(1)
      .filter((pedaco) => pedaco.includes(`"${tabela}"`))
      .map((pedaco) => pedaco.match(/^(?:const|async function) (get\w+)/)?.[1])
      .filter((n): n is string => Boolean(n))

    // Repositório que nomeia a tabela mas não expõe leitor para ela: o
    // conteúdo é inalcançável do mesmo jeito.
    if (leitores.length === 0) return false

    // Procura chamada dos leitores nas páginas e componentes.
    const alvos: string[] = []
    const varre = (dir: string) => {
      for (const e of readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) {
        const p = `${dir}/${e.name}`
        if (e.isDirectory()) varre(p)
        else if (p.endsWith(".tsx") || p.endsWith(".ts")) alvos.push(p)
      }
    }
    varre("src/app")
    varre("src/components")

    return alvos.some((p) => {
      const t = readFileSync(path.join(RAIZ, p), "utf8")
      return leitores.some((fn) => new RegExp(`\\b${fn}\\s*\\(`).test(t))
    })
  }

  it("a lista de órfãos está exata — nem a mais, nem a menos", () => {
    const orfaos = Object.keys(RESOURCES).filter((s) => !temLeitorUsado(s)).sort()
    expect(orfaos).toEqual([...ORFAOS_CONHECIDOS])
  })

  it.each(Object.keys(RESOURCES).filter((s) => !ORFAOS_CONHECIDOS.includes(s)))(
    "«%s» tem página que mostra o conteúdo",
    (slug) => {
      expect(temLeitorUsado(slug)).toBe(true)
    },
  )
})
