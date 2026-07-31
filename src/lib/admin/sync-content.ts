import "server-only"

/**
 * Sincroniza conteúdo NOVO de `src/data/*.ts` para o Firestore.
 *
 * Diferente de `seedDatabase()` (que só popula tabelas vazias), este sync serve
 * para quando a tabela já tem dados e faltam registros novos — o caso comum
 * depois de acrescentar um projeto/ferramenta/post no código.
 *
 * Regras de segurança:
 *  - Só INSERE o que falta (compara por título/nome/slug). Nunca atualiza nem
 *    apaga conteúdo existente que você tenha editado pelo painel.
 *  - Exceção deliberada: ao inserir um projeto com `featured`, os demais são
 *    desmarcados, já que a home mostra um único destaque.
 *  - Idempotente: rodar de novo não duplica nada.
 */
import { atualizarOnde, gravarLote, idNatural, listarCampos } from "@/lib/firebase/collection"
import { projects } from "@/data/projects"
import { posts } from "@/data/posts"
import { tools } from "@/data/tools"
import { devlogs, labExperiments, snippets, wikiDocs, ideas } from "@/data/dev"
import { artworks, comics, movies, notes, strips, tracks, videos } from "@/data/criativo-zones"
import { materias } from "@/data/anfitriao-materias"

export interface SyncReport {
  /** Nomes/títulos inseridos por tabela (vazio = nada faltava). */
  inseridos: Record<string, string[]>
  /**
   * Tabela → motivo da falha.
   *
   * Existe porque uma tabela ausente derrubava a publicação inteira: o sync
   * percorre dezesseis tabelas em sequência e a primeira que lançava abortava
   * todas as seguintes. Pior, `runSyncContentAction` revalida o cache DEPOIS do
   * sync — então o que já tinha sido inserido antes do erro ficava no banco mas
   * invisível no site, e o relatório do que entrou era descartado junto com a
   * exceção.
   *
   * Foi o que aconteceu com `artworks` (migration 0006 não aplicada): as oito
   * tabelas anteriores gravaram, a publicação reportou só o erro, e nada
   * apareceu. Agora cada tabela falha sozinha e o relatório diz qual.
   */
  falhas: Record<string, string>
}

/**
 * Insere numa tabela só o que falta, comparando por chave natural.
 *
 * Extraído porque as cinco tabelas do realm dev repetiam exatamente o mesmo
 * ritual das três primeiras — ler as chaves existentes, achar o maior `sort`,
 * inserir o resto no fim da fila. Oito cópias do mesmo bloco seria o tipo de
 * duplicação que diverge na primeira manutenção.
 *
 * Mantém as duas garantias do sync: nunca atualiza nem apaga o que já existe
 * (conteúdo editado no painel é intocável), e rodar de novo não duplica nada.
 */
async function inserirFaltantes<T>(
  table: string,
  /** Coluna que identifica o registro — `title`, `name` ou `slug`. */
  chave: string,
  itens: T[],
  /** Lê a chave natural do item em memória. */
  chaveDe: (item: T) => string,
  /** Converte o item na linha da tabela, sem `sort` (que é atribuído aqui). */
  paraLinha: (item: T) => Record<string, unknown>,
): Promise<string[]> {
  // Sem prefixo de tabela: `tentar` já indexa a falha pelo nome dela, e
  // repetir aqui produzia "artworks: artworks: Could not find…" no relatório.
  const linhas = await listarCampos<Record<string, unknown>>(table, [chave, "sort"])
  const jaTem = new Set(linhas.map((r) => r[chave] as string))
  const maiorSort = Math.max(0, ...linhas.map((r) => (r.sort as number) ?? 0))
  const faltando = itens.filter((i) => !jaTem.has(chaveDe(i)))
  if (faltando.length === 0) return []

  // Entra no fim da fila: a ordem arrumada no painel continua valendo.
  const novos = faltando.map((i, n) => ({ ...paraLinha(i), sort: maiorSort + 1 + n }))
  await gravarLote(
    table,
    novos.map((dados) => ({ id: idNatural(dados), dados })),
  )

  return faltando.map(chaveDe)
}

export async function syncNewContent(): Promise<SyncReport> {
  const report: SyncReport = { inseridos: {}, falhas: {} }

  /**
   * Roda a publicação de UMA tabela isolando a falha dela.
   *
   * A regra é "uma tabela quebrada não cala as outras quinze". Sem isto, a
   * ordem de execução virava dependência escondida: tudo que vinha depois da
   * primeira tabela com problema simplesmente não era tentado, e quem lia o
   * erro não tinha como saber disso.
   */
  async function tentar(tabela: string, executar: () => Promise<string[]>) {
    try {
      report.inseridos[tabela] = await executar()
    } catch (err) {
      report.falhas[tabela] = err instanceof Error ? err.message : String(err)
      report.inseridos[tabela] = []
    }
  }

  // ─── Projetos (chave: title) ───
  await tentar("projects", async () => {
  const projRows = await listarCampos<{ title: string; sort?: number }>("projects", ["title", "sort"])
  const projHave = new Set(projRows.map((r) => r.title))
  const projMax = Math.max(0, ...projRows.map((r) => r.sort ?? 0))
  const projMissing = projects.filter((p) => !projHave.has(p.title))

  if (projMissing.length) {
    // A home renderiza um único destaque: se algum entrante é featured,
    // os antigos perdem o holofote antes da inserção.
    if (projMissing.some((p) => p.featured)) {
      await atualizarOnde("projects", { campo: "featured", valor: true }, { featured: false })
    }
    await gravarLote(
      "projects",
      projMissing.map((p, i) => ({ dados: {
        title: p.title,
        description: p.description,
        category: p.category,
        tags: p.tags,
        cover_image: p.coverImage,
        href: p.href ?? null,
        featured: p.featured ?? false,
        published: true,
        // Destaque vai para o topo; o resto entra no fim da fila.
        sort: p.featured ? -1 : projMax + 1 + i,
      } })),
    )
  }
  return projMissing.map((p) => p.title)
  })

  // ─── Ferramentas (chave: name) ───
  await tentar("tools", async () => {
  const toolRows = await listarCampos<{ name: string; sort?: number }>("tools", ["name", "sort"])
  const toolHave = new Set(toolRows.map((r) => r.name))
  const toolMax = Math.max(0, ...toolRows.map((r) => r.sort ?? 0))
  const toolMissing = tools.filter((t) => !toolHave.has(t.name))

  if (toolMissing.length) {
    await gravarLote(
      "tools",
      toolMissing.map((t, i) => ({ dados: {
        name: t.name,
        description: t.description,
        type: t.type,
        stack: t.stack,
        emoji: t.emoji,
        demo_url: t.demoUrl ?? null,
        github_url: t.githubUrl ?? null,
        sort: toolMax + 1 + i,
      } })),
    )
  }
  return toolMissing.map((t) => t.name)
  })

  // ─── Posts (chave: slug) ───
  await tentar("posts", async () => {
  const postRows = await listarCampos<{ slug: string; sort?: number }>("posts", ["slug", "sort"])
  const postHave = new Set(postRows.map((r) => r.slug))
  const postMax = Math.max(0, ...postRows.map((r) => r.sort ?? 0))
  const postMissing = posts.filter((p) => !postHave.has(p.slug))

  if (postMissing.length) {
    await gravarLote(
      "posts",
      postMissing.map((p, i) => ({ id: p.slug, dados: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        reading_minutes: p.readingMinutes,
        tags: p.tags,
        accent: p.accent,
        body: p.body,
        published: true,
        sort: postMax + 1 + i,
      } })),
    )
  }
  return postMissing.map((p) => p.title)
  })

  // ─── Realm dev ────────────────────────────────────────────────────────
  // Estas cinco tabelas existiam no banco desde a migration 0003, mas não
  // tinham caminho nenhum de publicação: nem seed, nem sync, nem arquivo em
  // `src/data`. Na prática, o acervo técnico do laboratório só podia ser
  // escrito à mão pelo painel — e por isso estava vazio.

  await tentar("devlogs", () =>
    inserirFaltantes(
    "devlogs",
    "slug",
    devlogs,
    (d) => d.slug,
    (d) => ({
      slug: d.slug,
      title: d.title,
      date: d.date,
      summary: d.summary,
      body: d.body,
      tags: d.tags,
      published: true,
    }),
  ))

  await tentar("lab_experiments", () =>
    inserirFaltantes(
    "lab_experiments",
    "title",
    labExperiments,
    (x) => x.title,
    (x) => ({
      title: x.title,
      description: x.description,
      status: x.status,
      stack: x.stack,
      demo_url: x.demoUrl ?? null,
      repo_url: x.repoUrl ?? null,
      published: true,
    }),
  ))

  await tentar("snippets", () =>
    inserirFaltantes(
    "snippets",
    "title",
    snippets,
    (s) => s.title,
    (s) => ({
      title: s.title,
      language: s.language,
      description: s.description,
      code: s.code,
      tags: s.tags,
      published: true,
    }),
  ))

  await tentar("wiki", () =>
    inserirFaltantes(
    "wiki",
    "slug",
    wikiDocs,
    (w) => w.slug,
    (w) => ({
      slug: w.slug,
      title: w.title,
      category: w.category,
      body: w.body,
      published: true,
    }),
  ))

  await tentar("ideas", () =>
    inserirFaltantes(
    "ideas",
    "title",
    ideas,
    (i) => i.title,
    (i) => ({
      title: i.title,
      description: i.description,
      status: i.status,
      tags: i.tags,
      published: true,
    }),
  ))

  // ─── Zonas do realm criativo ──────────────────────────────────────────
  // Mesmo buraco das tabelas do dev, por outro caminho: as sete zonas
  // estavam no seed, mas `seedIfEmpty` desiste assim que a tabela tem uma
  // linha. Na prática, depois do primeiro povoamento nenhuma tirinha, nota
  // ou ilustração nova saía de `src/data` — e a página seguia mostrando o
  // acervo antigo sem sinal de que havia conteúdo parado no repositório.
  //
  // Os campos dos seeds já têm o nome das colunas; só o `id` é descartado,
  // porque quem gera o dele é o banco.
  const zonas: [string, { id: string; title: string }[]][] = [
    ["artworks", artworks],
    ["comics", comics],
    ["movies", movies],
    ["tracks", tracks],
    ["videos", videos],
    ["notes", notes],
    ["strips", strips],
  ]

  // Cada zona é tentada por si: a migration 0006 pode não ter sido aplicada
  // (foi o caso de `artworks`), e uma tabela ausente aqui não pode impedir as
  // outras seis nem as matérias do jornal, que vêm depois.
  for (const [tabela, linhas] of zonas) {
    await tentar(tabela, () =>
      inserirFaltantes(
        tabela,
        "title",
        linhas,
        (z) => z.title,
        ({ id: _id, ...resto }) => ({ ...resto, published: true }),
      ),
    )
  }

  // ─── Matérias das páginas internas do jornal ──────────────────────────
  // As estruturas aninhadas (blocos, caixas, remissões, gravura, colofão)
  // vão como jsonb; o resto é coluna. A migration 0008 tem CHECK de forma
  // sobre as cinco, então um formato torto falha na escrita em vez de
  // aparecer quebrado na folha.
  await tentar("prophet_materias", () =>
    inserirFaltantes(
    "prophet_materias",
    "slug",
    materias,
    (m) => m.slug,
    (m) => ({
      slug: m.slug,
      caderno: m.caderno,
      page: m.page,
      kicker: m.kicker,
      headline: m.headline,
      subhead: m.subhead,
      standfirst: m.standfirst,
      byline: m.byline,
      byline_role: m.bylineRole,
      dateline: m.dateline,
      continua_de: m.continuaDe ?? null,
      dropcap: m.dropcap,
      open_line: m.openLine,
      blocos: m.blocos,
      pullquote: m.pullquote,
      figure: m.figure,
      boxes: m.boxes,
      sign: m.sign,
      colofao: m.colofao,
      remissoes: m.remissoes,
      published: true,
    }),
  ))

  return report
}
