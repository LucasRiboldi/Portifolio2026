/**
 * Fontes externas do realm dev — notícias de tecnologia e repositórios estrelados.
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

/** Janela de revalidação. Notícia de tecnologia não muda de minuto em minuto. */
const REVALIDATE = 60 * 30

/** Teto por requisição. Acima disto a fonte é considerada indisponível. */
const TIMEOUT_MS = 6_000

const USER_AGENT = "portifolio2026 (github.com/LucasRiboldi)"

/** Handle do GitHub cujas estrelas são exibidas. */
export const GITHUB_USER = "LucasRiboldi"

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
   FONTE 1 · Hacker News

   Via Algolia, que é a busca oficial do HN e aceita filtro por pontuação. O
   corte em 100 pontos existe para separar notícia do murmúrio: a front page
   crua traz muita discussão local que não sobrevive a um dia.
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

export const getNoticiasHackerNews = unstable_cache(
  async (limite = 6): Promise<Noticia[]> => {
    const dados = await buscarJson<HnResposta>(
      "https://hn.algolia.com/api/v1/search?tags=front_page&numericFilters=points>100&hitsPerPage=20",
    )
    if (!dados?.hits) return []

    return dados.hits
      // Item de "Ask HN" vem sem url e apontaria para lugar nenhum.
      .filter((h) => h.url && h.title)
      .slice(0, limite)
      .map((h) => ({
        id: h.objectID,
        titulo: h.title!,
        url: h.url!,
        fonte: "Hacker News",
        data: h.created_at,
        pontos: h.points ?? undefined,
        autor: h.author ?? undefined,
      }))
  },
  ["tech-feed-hn"],
  { revalidate: REVALIDATE, tags: ["tech-feed"] },
)

/* ────────────────────────────────────────────────────────────────────────
   FONTE 2 · Dev.to

   Contraponto deliberado ao HN: artigo escrito por pessoa da área, não link
   agregado. `top=7` pega o melhor da semana, que envelhece bem melhor do que
   o "mais recente" numa página que revalida a cada meia hora.
   ──────────────────────────────────────────────────────────────────────── */
interface DevToArtigo {
  id: number
  title: string
  url: string
  published_at: string
  positive_reactions_count: number
  user: { name: string } | null
  tag_list: string[]
}

export const getNoticiasDevTo = unstable_cache(
  async (limite = 6): Promise<Noticia[]> => {
    const dados = await buscarJson<DevToArtigo[]>("https://dev.to/api/articles?top=7&per_page=20")
    if (!Array.isArray(dados)) return []

    return dados.slice(0, limite).map((a) => ({
      id: String(a.id),
      titulo: a.title,
      url: a.url,
      fonte: "Dev.to",
      data: a.published_at,
      pontos: a.positive_reactions_count,
      autor: a.user?.name ?? undefined,
    }))
  },
  ["tech-feed-devto"],
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
