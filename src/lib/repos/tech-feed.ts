/**
 * Fontes externas do realm dev — notícias de tecnologia, repositórios estrelados
 * e a versão publicada deste próprio site.
 *
 * ## As três regras que este arquivo segue
 *
 * 1. **Falha nunca derruba a página.** Rede é a parte do sistema que não está sob
 *    nosso controle: API fora do ar, rate limit, DNS lento. Todo leitor aqui
 *    devolve lista vazia em erro e a seção some, do mesmo jeito que
 *    `publishedReader` trata banco ausente. Notícia indisponível não é defeito da
 *    aplicação, e a home não pode virar tela de erro por causa disso.
 *
 * 2. **Sem chave de API.** Hacker News (via Algolia), Dev.to e a API pública do
 *    GitHub atendem sem autenticação. Isso mantém o build reprodutível em preview
 *    e em CI, onde não há segredo configurado — e evita mais uma variável de
 *    ambiente para um conteúdo que é ornamento informativo, não núcleo do site.
 *
 * 3. **Cache no servidor, não no cliente.** `unstable_cache` com tag e janela de
 *    revalidação: a página é servida do cache e a rede só é tocada quando a
 *    janela expira. Sem isso, cada visita gastaria a cota anônima do GitHub (60
 *    chamadas por hora por IP) e o rate limit chegaria numa tarde.
 *
 * O `timeout` explícito existe porque `fetch` sem sinal espera indefinidamente:
 * uma fonte lenta seguraria o render inteiro do servidor.
 */

import { unstable_cache } from "next/cache"

import pacote from "../../../package.json"

/** Janela de revalidação. Notícia de tecnologia não muda de minuto em minuto. */
const REVALIDATE = 60 * 30

/** Teto por requisição. Acima disto a fonte é considerada indisponível. */
const TIMEOUT_MS = 6_000

const USER_AGENT = "portifolio2026 (github.com/LucasRiboldi)"

/** Handle do GitHub cujas estrelas são exibidas. */
export const GITHUB_USER = "LucasRiboldi"

/** Repositório que versiona este site — origem do número exibido no hero. */
export const GITHUB_REPO = `${GITHUB_USER}/Portifolio2026`

export interface Noticia {
  id: string
  titulo: string
  url: string
  /** Nome da fonte, exibido no cartão — o leitor precisa saber de onde veio. */
  fonte: string
  /** ISO 8601. Formatada na renderização, não aqui. */
  data: string
  /** Métrica de interesse da própria fonte (pontos no HN, reações no Dev.to). */
  pontos?: number
  autor?: string
  /**
   * Idioma do conteúdo. Existe porque o radar PRIORIZA português: sem o campo,
   * a ordenação seria uma regra invisível dentro da função de mescla e a
   * interface não teria como dizer ao leitor que aquele item veio de fora.
   */
  idioma: "pt-BR" | "en"
}

export interface RepoEstrelado {
  id: number
  nome: string
  /** owner/repo — o nome sozinho não identifica. */
  nomeCompleto: string
  url: string
  descricao: string
  linguagem: string | null
  estrelas: number
  topicos: string[]
}

/**
 * `fetch` com prazo e sem lançar.
 *
 * Devolve `null` em qualquer falha — rede, status não-2xx, JSON inválido ou
 * estouro do prazo. Quem chama decide o que fazer com a ausência, e o tipo
 * força essa decisão em vez de deixá-la implícita num try/catch distante.
 */
async function buscarJson<T>(url: string): Promise<T | null> {
  const controle = new AbortController()
  const prazo = setTimeout(() => controle.abort(), TIMEOUT_MS)
  try {
    const resposta = await fetch(url, {
      signal: controle.signal,
      headers: { accept: "application/json", "user-agent": USER_AGENT },
    })
    if (!resposta.ok) return null
    return (await resposta.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(prazo)
  }
}

/* ────────────────────────────────────────────────────────────────────────
   FONTE 1 · TabNews — português, e a primeira da fila

   O agregador brasileiro. Entra na frente do Hacker News por decisão
   editorial: o radar é lido em português, e manchete em inglês obriga o
   leitor a traduzir antes de decidir se aquilo interessa.

   `strategy=relevant` é o ranking da própria casa (tabcoins + recência) — o
   equivalente à front page, e não ao "mais recente", que traria rascunho.
   ──────────────────────────────────────────────────────────────────────── */
interface TabNewsConteudo {
  id: string
  slug: string
  title: string | null
  owner_username: string
  published_at: string
  tabcoins: number
  /** Preenchido quando o post é link para fora; nulo quando o texto é local. */
  source_url: string | null
}

async function buscarTabNews(limite: number): Promise<Noticia[]> {
  const dados = await buscarJson<TabNewsConteudo[]>(
    "https://www.tabnews.com.br/api/v1/contents?page=1&per_page=15&strategy=relevant",
  )
  if (!Array.isArray(dados)) return []

  return dados
    .filter((c) => c.title)
    .slice(0, limite)
    .map((c) => ({
      id: `tabnews-${c.id}`,
      titulo: c.title!,
      // Sempre a página do TabNews, mesmo quando há `source_url`: é lá que
      // está a discussão, que é metade do valor de um agregador.
      url: `https://www.tabnews.com.br/${c.owner_username}/${c.slug}`,
      fonte: "TabNews",
      data: c.published_at,
      pontos: c.tabcoins,
      autor: c.owner_username,
      idioma: "pt-BR" as const,
    }))
}

/* ────────────────────────────────────────────────────────────────────────
   FONTE 2 · Dev.to, recorte brasileiro

   Mesma API de antes, outra pergunta: `tag=braziliandevs` é a comunidade
   lusófona do Dev.to. Contraponto ao TabNews pelo formato — lá é link e
   discussão, aqui é artigo escrito por quem pratica.
   ──────────────────────────────────────────────────────────────────────── */
interface DevToArtigo {
  id: number
  title: string
  url: string
  published_at: string
  positive_reactions_count: number
  user: { name: string } | null
}

async function buscarDevToBrasil(limite: number): Promise<Noticia[]> {
  const dados = await buscarJson<DevToArtigo[]>(
    "https://dev.to/api/articles?tag=braziliandevs&per_page=15",
  )
  if (!Array.isArray(dados)) return []

  return dados.slice(0, limite).map((a) => ({
    id: `devto-${a.id}`,
    titulo: a.title,
    url: a.url,
    fonte: "Dev.to BR",
    data: a.published_at,
    pontos: a.positive_reactions_count,
    autor: a.user?.name ?? undefined,
    idioma: "pt-BR" as const,
  }))
}

/* ────────────────────────────────────────────────────────────────────────
   FONTE 3 · Hacker News — só como reserva

   Deixou de ser painel próprio e virou rede de segurança: entra apenas se as
   duas fontes brasileiras não encherem o radar. O corte em 100 pontos separa
   notícia de murmúrio.
   ──────────────────────────────────────────────────────────────────────── */
interface HnResposta {
  hits: {
    objectID: string
    title: string | null
    url: string | null
    points: number | null
    author: string | null
    created_at: string
  }[]
}

async function buscarHackerNews(limite: number): Promise<Noticia[]> {
  const dados = await buscarJson<HnResposta>(
    "https://hn.algolia.com/api/v1/search?tags=front_page&numericFilters=points>100&hitsPerPage=20",
  )
  if (!dados?.hits) return []

  return dados.hits
    // Item de "Ask HN" vem sem url e apontaria para lugar nenhum.
    .filter((h) => h.url && h.title)
    .slice(0, limite)
    .map((h) => ({
      id: `hn-${h.objectID}`,
      titulo: h.title!,
      url: h.url!,
      fonte: "Hacker News",
      data: h.created_at,
      pontos: h.points ?? undefined,
      autor: h.author ?? undefined,
      idioma: "en" as const,
    }))
}

/* ────────────────────────────────────────────────────────────────────────
   RADAR — as três fontes viram uma lista curta

   Três itens, e não vinte: a home não é um leitor de RSS. O que ela precisa
   responder é "o que vale olhar hoje", e três manchetes bem escolhidas fazem
   isso; vinte só empurram o resto da página para baixo.

   A mescla é um rodízio entre as fontes BRASILEIRAS, não uma concatenação.
   Concatenar encheria as três vagas com TabNews sempre que ele respondesse, e
   o Dev.to BR nunca apareceria. O rodízio garante variedade de formato
   (discussão × artigo) dentro do mesmo idioma.

   O Hacker News só é consultado quando sobra vaga — o que na prática só
   acontece se as duas fontes brasileiras falharem juntas.
   ──────────────────────────────────────────────────────────────────────── */
function rodizio(fontes: readonly Noticia[][], limite: number): Noticia[] {
  const saida: Noticia[] = []
  const maior = Math.max(0, ...fontes.map((f) => f.length))
  for (let i = 0; i < maior && saida.length < limite; i++) {
    for (const fonte of fontes) {
      const item = fonte[i]
      if (item && saida.length < limite) saida.push(item)
    }
  }
  return saida
}

export const getRadarBrasil = unstable_cache(
  async (limite = 3): Promise<Noticia[]> => {
    /* As três em paralelo mesmo com o HN sendo reserva: em série, descobrir
       que faltou uma vaga custaria mais um prazo de 6 s no meio do render. */
    const [tabnews, devto, hn] = await Promise.all([
      buscarTabNews(limite),
      buscarDevToBrasil(limite),
      buscarHackerNews(limite),
    ])

    const brasileiras = rodizio([tabnews, devto], limite)
    if (brasileiras.length >= limite) return brasileiras

    return [...brasileiras, ...hn].slice(0, limite)
  },
  ["radar-brasil"],
  { revalidate: REVALIDATE, tags: ["tech-feed"] },
)

/* ────────────────────────────────────────────────────────────────────────
   Repositórios estrelados

   Estrela é curadoria pública: diz o que a pessoa achou digno de guardar. É
   por isso que a lista entra no acervo em vez de um "projetos favoritos"
   escrito à mão — esta se mantém sozinha.
   ──────────────────────────────────────────────────────────────────────── */
interface GhRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  topics?: string[]
}

export const getReposEstrelados = unstable_cache(
  async (limite = 8): Promise<RepoEstrelado[]> => {
    const dados = await buscarJson<GhRepo[]>(
      `https://api.github.com/users/${GITHUB_USER}/starred?per_page=${limite}`,
    )
    if (!Array.isArray(dados)) return []

    return dados.map((r) => ({
      id: r.id,
      nome: r.name,
      nomeCompleto: r.full_name,
      url: r.html_url,
      descricao: r.description ?? "",
      linguagem: r.language,
      estrelas: r.stargazers_count,
      topicos: (r.topics ?? []).slice(0, 3),
    }))
  },
  ["github-starred"],
  { revalidate: REVALIDATE, tags: ["tech-feed"] },
)

/* ────────────────────────────────────────────────────────────────────────
   PULSO DO REPOSITÓRIO

   A home diz que este é "um ambiente vivo, em constante evolução". Isso era
   uma AFIRMAÇÃO — e afirmação sobre atividade que ninguém consegue conferir
   vale pouco. Aqui ela vira prova: os últimos commits e quantos houve por dia
   nas duas últimas semanas, lidos do próprio repositório que serve a página.

   Cobre também o buraco deixado pelo devlog manual, que dependia de alguém
   lembrar de escrever a entrada. Este se mantém sozinho.
   ──────────────────────────────────────────────────────────────────────── */

/** Janela do gráfico de barras. Duas semanas cabem na largura e no per_page. */
const DIAS_PULSO = 14

export interface Commit {
  sha: string
  /** Só a primeira linha da mensagem — o corpo é para quem abre o commit. */
  titulo: string
  data: string
  url: string
}

export interface PulsoRepo {
  commits: Commit[]
  /** Um item por dia, do mais antigo ao mais recente. */
  atividade: { dia: string; total: number }[]
  /** Total na janela. Zero também é resposta: diz que a semana foi parada. */
  totalJanela: number
  /**
   * Verdadeiro quando as páginas pedidas encheram e pode haver commit fora da
   * contagem. Existe para a interface não afirmar um número exato que ela não
   * tem — nesse caso mostra "200+" em vez de "200".
   */
  parcial: boolean
  url: string
}

const PULSO_VAZIO: PulsoRepo = {
  commits: [],
  atividade: [],
  totalJanela: 0,
  parcial: false,
  url: `https://github.com/${GITHUB_REPO}`,
}

interface GhCommit {
  sha: string
  html_url: string
  commit: { message: string; author: { date: string } | null } | null
}

/** `YYYY-MM-DD` em UTC — o mesmo fuso que o GitHub usa para datar o commit. */
function diaUtc(iso: string): string {
  return iso.slice(0, 10)
}

/** Teto da API por página, e o passo da paginação abaixo. */
const POR_PAGINA = 100

/** Quantas páginas no máximo. Ver o comentário em `getPulsoRepo`. */
const PAGINAS_MAX = 2

export const getPulsoRepo = unstable_cache(
  async (quantosCommits = 5): Promise<PulsoRepo> => {
    /*
     * `since` recorta a janela no SERVIDOR, e é o que torna o gráfico honesto.
     *
     * A primeira versão pedia os 100 commits mais recentes e contava quantos
     * caíam nos últimos 14 dias. Num repositório movimentado esses 100
     * cobriam só 12 dias — e os dois dias mais antigos da janela apareciam
     * zerados por falta de dado, não por falta de trabalho. O gráfico mentia
     * exatamente onde dizia "aqui não houve nada".
     *
     * Com `since`, a pergunta passa a ser "o que houve nesta janela?". A
     * paginação existe porque a resposta pode passar de uma página; duas é o
     * teto para não gastar a cota anônima (60 chamadas por hora por IP) numa
     * seção decorativa. Se as duas encherem, `parcial` avisa a interface.
     */
    const inicio = new Date()
    inicio.setUTCDate(inicio.getUTCDate() - (DIAS_PULSO - 1))
    inicio.setUTCHours(0, 0, 0, 0)
    const desde = inicio.toISOString()

    const dados: GhCommit[] = []
    let parcial = false
    for (let pagina = 1; pagina <= PAGINAS_MAX; pagina++) {
      const lote = await buscarJson<GhCommit[]>(
        `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=${POR_PAGINA}&page=${pagina}&since=${desde}`,
      )
      if (!Array.isArray(lote) || lote.length === 0) break
      dados.push(...lote)
      if (lote.length < POR_PAGINA) break
      // Página cheia na última volta permitida: pode haver mais lá atrás.
      if (pagina === PAGINAS_MAX) parcial = true
    }
    if (dados.length === 0) return PULSO_VAZIO

    const datados = dados
      .map((c) => ({ c, data: c.commit?.author?.date }))
      .filter((x): x is { c: GhCommit; data: string } => Boolean(x.data))

    const commits: Commit[] = datados.slice(0, quantosCommits).map(({ c, data }) => ({
      sha: c.sha.slice(0, 7),
      titulo: (c.commit?.message ?? "").split("\n")[0] ?? c.sha.slice(0, 7),
      data,
      url: c.html_url,
    }))

    /* O eixo é construído a partir dos DIAS, não dos commits: dia sem commit
       precisa existir como barra zerada, senão o gráfico comprime o descanso
       e finge constância que não houve. */
    const porDia = new Map<string, number>()
    for (const { data } of datados) porDia.set(diaUtc(data), (porDia.get(diaUtc(data)) ?? 0) + 1)

    const hoje = new Date()
    const atividade = Array.from({ length: DIAS_PULSO }, (_, i) => {
      const d = new Date(hoje)
      d.setUTCDate(d.getUTCDate() - (DIAS_PULSO - 1 - i))
      const dia = d.toISOString().slice(0, 10)
      return { dia, total: porDia.get(dia) ?? 0 }
    })

    return {
      commits,
      atividade,
      totalJanela: atividade.reduce((s, a) => s + a.total, 0),
      parcial,
      url: `https://github.com/${GITHUB_REPO}/commits`,
    }
  },
  ["github-pulso"],
  { revalidate: REVALIDATE, tags: ["tech-feed"] },
)

/* ────────────────────────────────────────────────────────────────────────
   Versão publicada

   O número exibido no hero tem que ser o do REPOSITÓRIO, não um literal
   digitado na página — literal envelhece na primeira vez que alguém esquece
   de mexer nele. A cadeia de origens vai da mais específica para a mais
   garantida:

     1. release do GitHub  — é o que a pessoa realmente anunciou;
     2. tag mais recente   — quando há tag mas ninguém abriu release;
     3. `package.json`     — sempre existe, funciona sem rede e sem token.

   O passo 3 é o que mantém a promessa do projeto (o site funciona sem
   backend): rate limit da API anônima, CI sem rede ou repositório privado
   caem nele em silêncio, e o hero continua mostrando um número honesto.
   ──────────────────────────────────────────────────────────────────────── */
export interface VersaoSite {
  /** Rótulo pronto para exibição, sempre com o "v": `v3.4.1`. */
  rotulo: string
  /** De onde o número veio. O badge muda de legenda conforme a origem. */
  origem: "release" | "tag" | "pacote"
  /** Página do GitHub correspondente àquela origem. */
  url: string
}

/** Normaliza `3.4.1`, `v3.4.1` e `V3.4.1` para a mesma forma exibida. */
function comV(bruto: string): string {
  return `v${bruto.trim().replace(/^v/i, "")}`
}

export const getVersaoSite = unstable_cache(
  async (): Promise<VersaoSite> => {
    const release = await buscarJson<{ tag_name?: string; html_url?: string }>(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    )
    if (release?.tag_name) {
      return {
        rotulo: comV(release.tag_name),
        origem: "release",
        url: release.html_url ?? `https://github.com/${GITHUB_REPO}/releases/latest`,
      }
    }

    const tags = await buscarJson<{ name: string }[]>(
      `https://api.github.com/repos/${GITHUB_REPO}/tags?per_page=1`,
    )
    const maisRecente = tags?.[0]?.name
    if (maisRecente) {
      return {
        rotulo: comV(maisRecente),
        origem: "tag",
        url: `https://github.com/${GITHUB_REPO}/releases/tag/${encodeURIComponent(maisRecente)}`,
      }
    }

    return {
      rotulo: comV(pacote.version),
      origem: "pacote",
      url: `https://github.com/${GITHUB_REPO}`,
    }
  },
  ["github-versao"],
  { revalidate: REVALIDATE, tags: ["tech-feed"] },
)
