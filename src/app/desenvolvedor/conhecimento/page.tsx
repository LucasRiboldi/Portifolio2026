import type { Metadata } from "next"

import {
  certificacoes,
  designPatterns,
  javaCheatSheets,
  javaRoadmap,
  livros,
  devlogs as devlogsSeed,
  labExperiments as labSeed,
  snippets as snippetsSeed,
  wikiDocs as wikiSeed,
} from "@/data/dev"
import { getSnippets, getWiki, getDevlogs, getIdeas, getLab } from "@/lib/repos/dev"
import { IndiceConhecimento, type EntradaConhecimento } from "@/components/dev/acervo"
import { DevSection, MetaRow, StatTile } from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Conhecimento",
  description:
    "Repositório vivo de conhecimento: trilhas, folhas de consulta, padrões, livros, snippets e wiki num índice só.",
}

/**
 * O repositório vivo de conhecimento — índice de tudo que é material de estudo.
 *
 * ## Por que existe uma página só para indexar
 *
 * O acervo cresceu por rotas independentes (wiki, código, learn, java, padrões,
 * estante) e cada uma só se anuncia a quem já sabe que ela existe. Um índice com
 * CONTAGEM resolve as duas perguntas que o menu não responde: o que há aqui
 * dentro, e vale a pena entrar. Sem o número, todo item parece igualmente cheio
 * ou igualmente vazio.
 *
 * ## "Vivo" não é adjetivo de marketing
 *
 * Metade das contagens vem do banco (`getSnippets`, `getWiki`, …) e metade de
 * arquivo versionado. Nenhuma é escrita à mão aqui — acrescentar um padrão em
 * `patterns.ts` ou um snippet pelo /admin muda este índice sozinho. Número
 * digitado à mão vira mentira no primeiro commit seguinte, e era exatamente
 * assim que a home antiga descrevia o acervo.
 */
export default async function ConhecimentoPage() {
  const [snippets, wiki, devlogs, ideias, lab] = await Promise.all([
    getSnippets(),
    getWiki(),
    getDevlogs(),
    getIdeas(),
    getLab(),
  ])

  const itensCheat = javaCheatSheets.reduce((n, f) => n + f.itens.length, 0)

  /**
   * Contagem com o arquivo versionado como piso.
   *
   * `repos/dev.ts` devolve `[]` sem Supabase e não cai no seed (ao contrário de
   * `repos/criativo.ts`). Num índice cuja premissa é "o número diz se vale
   * entrar", exibir 0 para uma coleção que tem conteúdo no repositório é pior do
   * que não exibir número nenhum: manda o leitor embora de uma sala cheia.
   *
   * O banco continua tendo prioridade — o piso só vale quando não há nada
   * publicado.
   */
  const total = (doBanco: unknown[], doArquivo: unknown[]) =>
    doBanco.length > 0 ? doBanco.length : doArquivo.length

  const entradas: EntradaConhecimento[] = [
    {
      href: "/desenvolvedor/java",
      titulo: "Trilha de Java",
      descricao: "Oito etapas com critério de conclusão, do fundamento ao Spring.",
      total: javaRoadmap.length,
      unidade: "etapas",
    },
    {
      href: "/desenvolvedor/java",
      titulo: "Cheat sheets de Java",
      descricao: "Coleções, streams, Java moderno, exceções e concorrência.",
      total: itensCheat,
      unidade: "consultas",
    },
    {
      href: "/desenvolvedor/padroes",
      titulo: "Design Patterns",
      descricao: "Problema, solução, exemplo e — o que costuma faltar — quando evitar.",
      total: designPatterns.length,
      unidade: "padrões",
    },
    {
      href: "/desenvolvedor/estante",
      titulo: "Estante de livros",
      descricao: "Referências de TI lidas, em leitura e na fila, com o porquê de cada uma.",
      total: livros.length,
      unidade: "títulos",
    },
    {
      href: "/desenvolvedor/estante#certificacoes",
      titulo: "Certificações",
      descricao: "Badges com emissor, ano e link de verificação quando existe.",
      total: certificacoes.length,
      unidade: "badges",
    },
    {
      href: "/desenvolvedor/codigo",
      titulo: "Snippets",
      descricao: "Código que já resolveu um problema real neste projeto.",
      total: total(snippets, snippetsSeed),
      unidade: "trechos",
    },
    {
      href: "/desenvolvedor/wiki",
      titulo: "Wiki",
      descricao: "Decisões, convenções e armadilhas registradas para não se repetirem.",
      total: total(wiki, wikiSeed),
      unidade: "verbetes",
    },
    {
      href: "/desenvolvedor/learn",
      titulo: "Learn",
      descricao: "Trilhas por linguagem com exercícios e progresso salvo.",
      total: total(lab, labSeed),
      unidade: "experimentos",
    },
  ]

  const totalItens = entradas.reduce((n, e) => n + e.total, 0)

  return (
    <>
      <section className="dv-hero" aria-labelledby="conhecimento-titulo">
        <p className="term">
          <span className="tok-fn">git</span> log --<span className="tok-str">conhecimento</span>
          <span className="dv-caret" aria-hidden>
            ▌
          </span>
        </p>
        <h1 id="conhecimento-titulo">
          Um repositório <span className="g">vivo</span> de conhecimento.
        </h1>
        <p>
          Tudo que estudo fica registrado em algum lugar deste realm. Este é o índice — e as contagens
          abaixo são calculadas, não digitadas: acrescentar um padrão ou publicar um snippet muda esta
          página sozinho.
        </p>
      </section>

      <nav className="dv-stats" aria-label="Acervo em números">
        <StatTile value={totalItens} label="itens no acervo" href="#indice" color="var(--dev-ok)" />
        <StatTile value={entradas.length} label="coleções" href="#indice" color="var(--dev-signal)" />
        <StatTile value={total(devlogs, devlogsSeed)} label="devlogs" href="/desenvolvedor" color="var(--dev-mark)" />
      </nav>

      <DevSection
        id="indice"
        index={1}
        title="Índice do acervo"
        meta={`${entradas.length} coleções`}
        note="Cada cartão traz quantos itens existem lá dentro."
      >
        <IndiceConhecimento entradas={entradas} />
      </DevSection>

      <footer className="dv-section">
        <MetaRow
          items={[
            { k: "padrões", v: designPatterns.length },
            { k: "livros", v: livros.length },
            { k: "snippets", v: total(snippets, snippetsSeed) },
            { k: "wiki", v: total(wiki, wikiSeed) },
            { k: "ideias", v: ideias.length },
          ]}
        />
      </footer>
    </>
  )
}
