/**
 * PROPHET WIRE — semente estática dos 6 campos de notícia da primeira página.
 *
 * ATÉ o pipeline automático (collector → IA → publisher) entrar no ar, a folha
 * é abastecida por estas 6 notícias-semente. São fatos reais do mundo dos board
 * games internacionais, redigidos na voz vitoriana do Daily Prophet — não são
 * placeholders: cada uma cita fonte e link verdadeiros e preenche todos os
 * campos do contrato `NewsItem`.
 *
 * Quando o pipeline estiver pronto, `repository.ts` devolverá `NewsItem[]` do
 * Supabase e esta lista passa a ser o fallback honesto (offline / falha de
 * coleta), preservado por [[conteudo-vem-do-banco]].
 */

import type { NewsItem } from "@/lib/prophet-wire/types"
import { config } from "@/lib/prophet-wire/config"
import { InMemoryNewsRepository, type NewsRepository } from "@/lib/prophet-wire/repository"
import { FirestoreNewsRepository } from "@/lib/prophet-wire/firestore-repository"
import { resolveImages } from "@/lib/prophet-wire/image-resolver"
import { silentLogger } from "@/lib/prophet-wire/logger"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"

/** Moldura de gravura vazia — a página já usa `.img-empty` à espera de arte. */
function pendingPlate(alt: string, caption: string) {
  return { src: null, alt, caption }
}

export const seedNews: NewsItem[] = [
  {
    slug: "bgg-hotness-semanal",
    hash: "seed:bgg-hotness-semanal",
    title: "O TERMÔMETRO DE PORTLAND FERVE",
    subtitle: "A lista das mesas mais cobiçadas muda de mão a cada aurora",
    summary:
      "hega-nos por telégrafo o quadro semanal de calor da praça de Portland — a chamada «Hotness» —, no qual os títulos que aquecem as bancadas trocam de posto diariamente. Não é ranking de vendas nem de mérito: é o pulso da curiosidade coletiva, medido pelas buscas dos próprios jogadores.",
    dropcap: "C",
    note: "Quadro atualizado a cada meia-noite.",
    category: "Notícias",
    subcategory: "Comunidade",
    tags: ["BoardGameGeek", "Hotness", "tendências"],
    image: pendingPlate(
      "Termômetro de jornal marcando os jogos em alta na semana",
      "Fig. — O quadro de calor, transcrito da praça de Portland.",
    ),
    sourceName: "BoardGameGeek Hotness",
    sourceUrl: "https://boardgamegeek.com/hotness",
    publishedAt: "2026-07-24",
    status: "publicado",
  },
  {
    slug: "stonemaier-anuncio",
    hash: "seed:stonemaier-anuncio",
    title: "A CASA DO FAZENDEIRO ABRE O LIVRO",
    subtitle: "Stonemaier expõe suas contas antes de acender o prelo",
    summary:
      "editora que nos legou o «Wingspan» dos pássaros e o «Scythe» dos autômatos a vapor mantém o incomum hábito de publicar seus números e seus planos a céu aberto. A cada estação anuncia reimpressões e novos títulos sem o alarde do costume — o cavalheiro interessado consulta o próprio balcão da casa.",
    dropcap: "A",
    note: "Anúncios diretos, sem intermediário.",
    category: "Editoras",
    subcategory: "Stonemaier Games",
    tags: ["Stonemaier", "Wingspan", "reimpressão"],
    image: pendingPlate(
      "Brasão da editora Stonemaier sobre um livro-razão aberto",
      "Fig. — O livro-razão da casa, exposto à visitação.",
    ),
    designer: "Jamey Stegmaier",
    publisher: "Stonemaier Games",
    sourceName: "Stonemaier Games",
    sourceUrl: "https://stonemaiergames.com/",
    publishedAt: "2026-07-23",
    status: "publicado",
  },
  {
    slug: "kickstarter-campanha-corrente",
    hash: "seed:kickstarter-campanha-corrente",
    title: "COFRES ABERTOS NA PRAÇA DO FINANCIAMENTO",
    subtitle: "Campanhas de vintém coletivo enchem as arcas antes da prensa",
    summary:
      "ivro de subscrições da praça de Kickstarter registra, nesta quinzena, dezenas de projetos de jogos de mesa em busca de mecenas. O método é o mesmo de sempre: promete-se a caixa antes de ela existir, e a multidão decide, com sua bolsa, o que merece ir ao prelo.",
    dropcap: "O",
    note: "Subscrições encerram por prazo fixo.",
    category: "Kickstarter",
    subcategory: "Crowdfunding",
    tags: ["Kickstarter", "financiamento coletivo", "pré-venda"],
    image: pendingPlate(
      "Arca de moedas com selo de subscrição coletiva",
      "Fig. — A arca comum, cheia por muitas mãos.",
    ),
    sourceName: "Kickstarter — Tabletop Games",
    sourceUrl: "https://www.kickstarter.com/discover/categories/games/tabletop%20games",
    publishedAt: "2026-07-22",
    status: "publicado",
  },
  {
    slug: "gamefound-alternativa",
    hash: "seed:gamefound-alternativa",
    title: "RIVAL POLONÊS DISPUTA OS MECENAS",
    subtitle: "Gamefound cresce como segunda praça do vintém coletivo",
    summary:
      "ão só de uma praça vive o financiamento coletivo. A casa polonesa Gamefound, nascida para os jogos de tabuleiro, tornou-se o segundo balcão onde editoras erguem suas campanhas — muitas migrando de Kickstarter em busca de melhores condições de expedição e de comércio posterior.",
    dropcap: "N",
    note: "Praça especializada em jogos de mesa.",
    category: "Gamefound",
    subcategory: "Crowdfunding",
    tags: ["Gamefound", "financiamento coletivo", "expedição"],
    image: pendingPlate(
      "Bandeira de uma segunda praça de mercado ao lado da principal",
      "Fig. — A segunda praça, disputando os mesmos mecenas.",
    ),
    sourceName: "Gamefound",
    sourceUrl: "https://gamefound.com/",
    publishedAt: "2026-07-22",
    status: "publicado",
  },
  {
    slug: "spiel-essen-preparativos",
    hash: "seed:spiel-essen-preparativos",
    title: "ESSEN AQUECE OS PAVILHÕES",
    subtitle: "A grande feira alemã reúne o ofício sob um só teto de outubro",
    summary:
      "aior congresso do ramo, a feira de Essen — a «Spiel» —, prepara os seus pavilhões para receber, em outubro, editoras e projetistas de todo o continente. É lá que se firmam os lançamentos do ano e onde a folha de novidades do ofício se enche de uma só vez.",
    dropcap: "M",
    note: "Realiza-se anualmente, em outubro.",
    category: "Eventos",
    subcategory: "Feiras",
    tags: ["Spiel Essen", "feira", "lançamentos"],
    image: pendingPlate(
      "Pavilhões de feira enfileirados sob bandeiras",
      "Fig. — Os pavilhões de Essen, prontos para a temporada.",
    ),
    sourceName: "SPIEL Essen",
    sourceUrl: "https://www.spiel-essen.de/en/",
    publishedAt: "2026-07-21",
    status: "publicado",
  },
  {
    slug: "spiel-des-jahres-premio",
    hash: "seed:spiel-des-jahres-premio",
    title: "O LOURO ALEMÃO ELEGE O JOGO DO ANO",
    subtitle: "O «Spiel des Jahres» ainda é a coroa mais cobiçada do ofício",
    summary:
      "úri de crítica germânica que confere o «Spiel des Jahres» — o prêmio de Jogo do Ano — segue a autoridade que faz de um título modesto um êxito de mesa em toda a Europa. A pega vermelha em seu selo vale, dizem os comerciantes, mais que qualquer anúncio de página inteira.",
    dropcap: "O",
    note: "O selo que multiplica tiragens.",
    category: "Prêmios",
    subcategory: "Spiel des Jahres",
    tags: ["Spiel des Jahres", "prêmio", "Jogo do Ano"],
    image: pendingPlate(
      "Selo de láurea com a silhueta de uma pega sobre um jogo premiado",
      "Fig. — A láurea da pega, cobiçada em toda a praça.",
    ),
    sourceName: "Spiel des Jahres",
    sourceUrl: "https://www.spiel-des-jahres.de/en/",
    publishedAt: "2026-07-20",
    status: "publicado",
  },
]

/**
 * Repositório padrão da aplicação. Quando o Firestore está configurado, usa
 * `FirestoreNewsRepository`; senão cai na impl in-memory
 * semeada com as 6 notícias estáticas — o fallback honesto quando o banco não
 * responde. A landing sempre lê pelo repo — nunca da lista crua —, então a
 * troca de impl não toca na página.
 */
let repo: NewsRepository | null = null

export function defaultRepository(): NewsRepository {
  if (!repo) {
    repo = isFirebaseAdminConfigured
      ? new FirestoreNewsRepository()
      : new InMemoryNewsRepository(seedNews)
  }
  return repo
}

/** Redefine o repositório (usado em testes para injetar um fake). */
export function setDefaultRepository(next: NewsRepository | null): void {
  repo = next
}

/**
 * Devolve as notícias que a landing deve exibir, limitadas ao número de campos
 * configurado (`config.newsFields`) e apenas as publicadas — lidas via repo.
 *
 * A arte passa pelo resolvedor aqui também, e não só no pipeline: a semente
 * estática não atravessa o pipeline, e sem isto ela apareceria inteira com a
 * gravura vazia. Assim a mesma cascata (fonte → busca → categoria → gravura)
 * vale para qualquer origem do item.
 */
export async function getFrontNews(): Promise<NewsItem[]> {
  const items = await defaultRepository().listPublished(config.newsFields)
  return resolveImages(items, { logger: silentLogger })
}
