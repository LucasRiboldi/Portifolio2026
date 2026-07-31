import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

import { describe, it, expect } from "vitest"

import { devlogs, labExperiments, snippets, wikiDocs, ideas } from "@/data/dev"
import { artworks, comics, movies, notes, strips, tracks, videos } from "@/data/criativo-zones"

/**
 * O CONTRATO DA PUBLICAÇÃO — o defeito que este arquivo existe para impedir.
 *
 * As cinco tabelas do realm dev existiam no banco desde a migration 0003 e
 * eram lidas normalmente pelas páginas, mas **nenhuma delas tinha caminho de
 * publicação**: não estavam no seed, não estavam no sync, e não havia arquivo
 * em `src/data`. O acervo do laboratório só podia ser escrito à mão pelo
 * painel, e por isso estava vazio — sem que nada no código acusasse.
 *
 * É uma falha silenciosa por natureza: tudo compila, tudo passa, as páginas
 * renderizam o estado vazio como se fosse legítimo. O teste abaixo é o que
 * transforma esse silêncio em erro.
 */

const RAIZ = path.join(import.meta.dirname, "..")
const ler = (p: string) => readFileSync(path.join(RAIZ, p), "utf8")

const semComentarios = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")

const REPO_DEV = ler("src/lib/repos/dev.ts")
const SYNC = semComentarios(ler("src/lib/admin/sync-content.ts"))
const SEED = semComentarios(ler("src/lib/admin/seed.ts"))

describe("toda tabela lida tem caminho de publicação", () => {
  /** As tabelas que o realm dev realmente lê, extraídas do repositório. */
  const tabelas = [...REPO_DEV.matchAll(/publishedReader<\w+>\("(\w+)"/g)].map((m) => m[1]!)

  it("o repositório declara as cinco tabelas do realm", () => {
    expect(tabelas.sort()).toEqual(["devlogs", "ideas", "lab_experiments", "snippets", "wiki"])
  })

  it.each(["devlogs", "ideas", "lab_experiments", "snippets", "wiki"])(
    "`%s` é publicável pelo sync do /admin",
    (tabela) => {
      expect(SYNC).toContain(`"${tabela}"`)
    },
  )

  it.each(["devlogs", "ideas", "lab_experiments", "snippets", "wiki"])(
    "`%s` entra no seed de banco novo",
    (tabela) => {
      expect(SEED).toContain(`"${tabela}"`)
    },
  )
})

describe("cadernos do realm arcano", () => {
  /**
   * As quatro passaram meses vazias com as páginas públicas já no ar: os
   * leitores fazem `data ?? []`, sem fallback, então `/anfitriao/oficina`,
   * `/mecanicas`, `/laboratorio` e `/imprensa` renderizavam nada — sem erro,
   * sem aviso, como se fosse o estado legítimo.
   *
   * Semeadas em 31/07/2026. Este bloco existe para que ninguém acrescente um
   * caderno novo repetindo a história.
   */
  const CADERNOS = [
    "prophet_tutorials",
    "prophet_mechanics",
    "prophet_prototypes",
    "prophet_resources",
  ]

  it.each(CADERNOS)("`%s` é publicável pelo sync do /admin", (tabela) => {
    expect(SYNC).toContain(`"${tabela}"`)
  })

  it.each(CADERNOS)("`%s` entra no seed de banco novo", (tabela) => {
    expect(SEED).toContain(`"${tabela}"`)
  })
})

describe("uma tabela quebrada não cala as outras", () => {
  /**
   * O sync percorre dezesseis tabelas em sequência, e cada uma lançava direto.
   * A primeira que falhasse abortava todas as seguintes — e como
   * `runSyncContentAction` revalida o cache DEPOIS do sync, o que já tinha sido
   * gravado ficava no banco e invisível no site, com o relatório descartado
   * junto da exceção.
   *
   * Aconteceu de verdade: `artworks` não existia (migration 0006 não aplicada),
   * a publicação morreu ali e as oito tabelas anteriores sumiram do relatório.
   * O erro na tela não dizia que elas tinham gravado.
   *
   * A verificação é estática porque o defeito é de ESTRUTURA, não de resultado:
   * exercitá-lo exigiria um Supabase falso devolvendo erro numa tabela do meio,
   * e ainda assim não impediria alguém de acrescentar a décima sétima tabela
   * fora do isolamento — que é exatamente como a falha nasceu.
   */
  it("toda escrita passa pelo isolamento por tabela", () => {
    // O padrão antigo: atribuir direto ao relatório, sem try/catch em volta.
    expect(SYNC).not.toMatch(/report\.\w+\s*=\s*await\s+inserirFaltantes\(/)
    expect(SYNC).not.toMatch(/report\[\w+\]\s*=\s*await\s+inserirFaltantes\(/)
  })

  it("o relatório separa o que entrou do que falhou", () => {
    // Sem os dois campos, a UI volta a ter de escolher entre mostrar sucesso
    // ou erro — e some com metade da verdade.
    expect(SYNC).toContain("inseridos")
    expect(SYNC).toContain("falhas")
  })

  it("o isolamento cobre as tabelas de escrita direta", () => {
    for (const tabela of ["projects", "tools", "posts"]) {
      expect(SYNC).toContain(`tentar("${tabela}"`)
    }
  })
})

describe("zonas do criativo", () => {
  /**
   * As sete zonas estavam no seed, mas não no sync — e `seedIfEmpty` desiste
   * assim que a tabela tem uma linha. O efeito era o mesmo do realm dev por
   * outro caminho: tirinha nova ficava parada no repositório, e a página
   * seguia mostrando o acervo antigo sem nada acusar.
   */
  const ZONAS = ["artworks", "comics", "movies", "tracks", "videos", "notes", "strips"]

  it.each(ZONAS)("`%s` é publicável pelo sync do /admin", (tabela) => {
    expect(SYNC).toContain(`"${tabela}"`)
  })

  it("nenhuma zona repete título — a chave do sync é o título", () => {
    const porZona: [string, string[]][] = [
      ["artworks", artworks.map((a) => a.title)],
      ["comics", comics.map((c) => c.title)],
      ["movies", movies.map((m) => m.title)],
      ["tracks", tracks.map((t) => t.title)],
      ["videos", videos.map((v) => v.title)],
      ["notes", notes.map((n) => n.title)],
      ["strips", strips.map((s) => s.title)],
    ]
    const comRepetido = porZona
      .map(([zona, titulos]) => [zona, titulos.filter((t, i) => titulos.indexOf(t) !== i)] as const)
      .filter(([, dup]) => dup.length > 0)
    expect(comRepetido).toEqual([])
  })

  it("toda tirinha aponta para uma capa que existe", () => {
    // As capas são geradas por `npm run covers` a partir deste mesmo arquivo;
    // acrescentar tirinha sem rodar o gerador deixa a imagem quebrada em
    // produção, e nada no build reclama.
    const semCapa = strips.filter(
      (s) => !existsSync(path.join(RAIZ, "public", s.image.replace(/^\//, ""))),
    )
    expect(semCapa.map((s) => s.image)).toEqual([])
  })
})

describe("o acervo não está vazio", () => {
  it.each([
    ["devlogs", devlogs.length],
    ["experimentos", labExperiments.length],
    ["snippets", snippets.length],
    ["wiki", wikiDocs.length],
    ["ideias", ideas.length],
  ])("%s tem conteúdo", (_nome, total) => {
    expect(total).toBeGreaterThan(3)
  })
})

describe("chaves naturais", () => {
  /**
   * O sync compara por chave natural e **só insere o que falta**. Duas linhas
   * com a mesma chave significam que a segunda nunca chega ao banco — e, pior,
   * some sem erro nenhum. Por isso a unicidade é testada aqui e não confiada
   * à revisão.
   */
  it.each([
    ["devlogs.slug", devlogs.map((d) => d.slug)],
    ["wiki.slug", wikiDocs.map((w) => w.slug)],
    ["lab.title", labExperiments.map((x) => x.title)],
    ["snippets.title", snippets.map((s) => s.title)],
    ["ideas.title", ideas.map((i) => i.title)],
  ])("%s não repete", (_campo, valores) => {
    const repetidos = valores.filter((v, i) => valores.indexOf(v) !== i)
    expect(repetidos).toEqual([])
  })

  it("os status respeitam o CHECK da migration 0003", () => {
    const statusLab = new Set(["wip", "playtest", "stable", "archived"])
    const statusIdeia = new Set(["idea", "mvp", "building", "paused", "done"])
    expect(labExperiments.filter((x) => !statusLab.has(x.status))).toEqual([])
    expect(ideas.filter((i) => !statusIdeia.has(i.status))).toEqual([])
  })

  it("as datas dos devlogs são válidas e não vêm do futuro", () => {
    const invalidas = devlogs.filter((d) => Number.isNaN(Date.parse(d.date)))
    expect(invalidas.map((d) => d.slug)).toEqual([])
    // Um acervo que se diz histórico não pode ter entrada datada adiante.
    const futuras = devlogs.filter((d) => Date.parse(d.date) > Date.now())
    expect(futuras.map((d) => d.slug)).toEqual([])
  })

  it("os devlogs estão em ordem cronológica decrescente", () => {
    const datas = devlogs.map((d) => Date.parse(d.date))
    expect(datas).toEqual([...datas].sort((a, b) => b - a))
  })
})
