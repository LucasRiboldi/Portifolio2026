import type { Metadata } from "next"

import { getProjects } from "@/lib/repos/projects"
import { getTools } from "@/lib/repos/tools"
import { getSnippets, getLab, getDevlogs } from "@/lib/repos/dev"
import { getSiteConfig } from "@/lib/repos/site-config"
import {
  getNoticiasDevTo,
  getNoticiasHackerNews,
  getReposEstrelados,
  GITHUB_USER,
} from "@/lib/repos/tech-feed"
import {
  certificacoes,
  designPatterns,
  javaRoadmap,
  livros,
  snippets as snippetsSeed,
} from "@/data/dev"
import { GsapDemo } from "@/components/dev/gsap-demo"
import {
  CardsPatterns,
  GradeBadges,
  GradeEstrelados,
  PainelNoticias,
  TrilhaJava,
} from "@/components/dev/acervo"
import {
  DevSection,
  DevPanel,
  DevPanelHead,
  DevPanelFoot,
  DevExternalLink,
  DevInternalLink,
  StatTile,
  TagList,
  MetaRow,
} from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Início",
  description: "Índice do laboratório: projetos, experimentos, ferramentas, snippets e devlog.",
}

const STACK = ["TypeScript", "React", "Next.js", "Node", "Python", "Supabase", "Tailwind", "Postgres"] as const

const ATALHOS = [
  { href: "/desenvolvedor/ferramentas", t: "Ferramentas", d: "Utilitários que rodam no navegador e utilitários publicados" },
  { href: "/desenvolvedor/codigo", t: "Código", d: "Snippets e boilerplates reutilizáveis, com destaque de sintaxe" },
  { href: "/desenvolvedor/learn", t: "Learn", d: "Trilhas de estudo por linguagem, com exercícios e progresso" },
  { href: "/desenvolvedor/java", t: "Java", d: "Trilha de estudo em oito etapas e cinco folhas de consulta" },
  { href: "/desenvolvedor/padroes", t: "Design Patterns", d: "Cartões com problema, solução e quando evitar o padrão" },
  { href: "/desenvolvedor/estante", t: "Estante", d: "Livros de referência de TI e badges de certificação" },
] as const

export default async function DevHome() {
  /**
   * As três fontes externas entram no mesmo `Promise.all` das internas.
   *
   * Em série, o pior caso somaria os prazos das três (18 s de teto) e a home
   * inteira esperaria por notícia — que é o conteúdo menos importante da
   * página. Em paralelo o teto é o da fonte mais lenta, e cada leitor já
   * devolve lista vazia em falha, então nenhuma delas derruba o render.
   */
  const [projects, tools, snippets, lab, site, devlogs, hn, devto, estrelados] = await Promise.all([
    getProjects(),
    getTools(),
    getSnippets(),
    getLab(),
    getSiteConfig(),
    getDevlogs(),
    getNoticiasHackerNews(5),
    getNoticiasDevTo(5),
    getReposEstrelados(6),
  ])

  const featured = projects.find((p) => p.featured) ?? projects[0]

  /**
   * Exemplos de snippet, com o arquivo versionado como rede.
   *
   * `repos/dev.ts` devolve `[]` quando não há Supabase — e, diferente do
   * `repos/criativo.ts`, NÃO cai no seed. Com a tabela `snippets` vazia (que é o
   * estado atual), a seção sumiria da home sem que nada acusasse: exatamente a
   * falha silenciosa que `conteudo-publicavel.test.ts` foi escrito para
   * denunciar, só que na renderização.
   *
   * Aqui o banco continua tendo prioridade — o que for publicado pelo /admin
   * manda. O arquivo só entra quando não há nada publicado, e o `key` usa o
   * título porque o seed não tem `id`.
   */
  const exemplosSnippets =
    snippets.length > 0
      ? snippets.map((s) => ({ chave: s.id, titulo: s.title, linguagem: s.language, descricao: s.description, tags: s.tags ?? [] }))
      : snippetsSeed.map((s) => ({ chave: s.title, titulo: s.title, linguagem: s.language, descricao: s.description, tags: s.tags }))

  const etapaAtual = javaRoadmap.find((e) => e.status === "estudando")
  const certsObtidas = certificacoes.filter((c) => c.status === "obtida")
  const lendo = livros.filter((l) => l.status === "lendo")

  const stats = [
    { n: projects.length, l: "projetos", href: "/desenvolvedor/projetos", color: "var(--dev-ok)" },
    { n: lab.length, l: "experimentos", href: "/desenvolvedor/laboratorio", color: "var(--dev-signal)" },
    { n: snippets.length, l: "snippets", href: "/desenvolvedor/codigo", color: "var(--dev-mark)" },
  ]

  return (
    <>
      {/* Cabeçalho do realm. É o único h1 da página — os blocos abaixo entram
          como <section> com h2, o que antes não acontecia: eram h2 soltos,
          irmãos de <div>, e o outline do documento saía achatado. */}
      <section className="dv-hero" aria-labelledby="dv-hero-titulo">
        <p className="term">
          <span className="tok-fn">const</span> dev = <span className="tok-str">{"{"}</span> nome:{" "}
          <span className="tok-str">&quot;{site.name}&quot;</span> {"}"}
          <span className="dv-caret" aria-hidden>
            ▌
          </span>
        </p>
        <h1 id="dv-hero-titulo">
          Construo <span className="g">produtos</span>, <span className="p">ferramentas</span> e{" "}
          <span className="c">experimentos</span> digitais.
        </h1>
        <p>{site.description}</p>
        <div className="dv-chip-row">
          {STACK.map((s) => (
            <span key={s} className="dv-tag">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Indicadores: contagem + destino. São o índice numérico do acervo. */}
      <nav className="dv-stats" aria-label="Acervo em números">
        {stats.map((s) => (
          <StatTile key={s.l} value={s.n} label={s.l} href={s.href} color={s.color} />
        ))}
      </nav>

      {featured && (
        <DevSection id="destaque" index={1} title="Projeto em destaque" meta={featured.tags[0] ?? "projeto"}>
          <DevPanel>
            <DevPanelHead
              title={featured.title}
              href={featured.slug ? `/desenvolvedor/projetos/${featured.slug}` : undefined}
              badge={<span className="dv-status done">★ destaque</span>}
            />
            <p>{featured.description}</p>
            <TagList items={featured.tags} />
            {(featured.href || featured.slug) && (
              <DevPanelFoot>
                {featured.slug && (
                  <DevInternalLink href={`/desenvolvedor/projetos/${featured.slug}`}>ver README</DevInternalLink>
                )}
                {featured.href && <DevExternalLink href={featured.href}>abrir repositório</DevExternalLink>}
              </DevPanelFoot>
            )}
          </DevPanel>
        </DevSection>
      )}

      {/* ─── Radar: as duas fontes de notícia, lado a lado ───────────────
          Duas e não uma porque elas se corrigem: o HN é agregador de links e
          pende para infraestrutura e discussão; o Dev.to é artigo escrito por
          quem pratica. Uma só daria um recorte estreito do que "está
          acontecendo". Se as duas falharem, a seção some inteira em vez de
          renderizar dois painéis vazios. */}
      {(hn.length > 0 || devto.length > 0) && (
        <DevSection
          id="radar"
          index={2}
          title="Radar de tecnologia"
          meta="atualiza a cada 30 min"
          note="Duas fontes com vieses diferentes, buscadas no servidor e cacheadas."
        >
          <div className="dv-feed-par">
            <PainelNoticias
              titulo="Alta do agregador"
              fonte="Hacker News"
              noticias={hn}
              vazio="A fonte não respondeu agora."
            />
            <PainelNoticias
              titulo="Artigos da semana"
              fonte="Dev.to"
              noticias={devto}
              vazio="A fonte não respondeu agora."
            />
          </div>
        </DevSection>
      )}

      {/* ─── Estrelas do GitHub ────────────────────────────────────────── */}
      <DevSection
        id="estrelados"
        index={3}
        title="Estrelados no GitHub"
        meta={estrelados.length > 0 ? `${estrelados.length} repositórios` : "indisponível"}
        note="Curadoria pública: o que eu marquei como digno de guardar."
      >
        <GradeEstrelados repos={estrelados} />
        <DevPanelFoot>
          <DevExternalLink href={`https://github.com/${GITHUB_USER}?tab=stars`}>
            ver todas as estrelas
          </DevExternalLink>
        </DevPanelFoot>
      </DevSection>

      {/* ─── Java: só o trecho em curso ────────────────────────────────────
          A trilha inteira tem oito etapas e é a página `/java`. Aqui entram a
          etapa atual e a seguinte — o suficiente para dizer onde o estudo está
          sem transformar a home no roadmap. */}
      {etapaAtual && (
        <DevSection
          id="java"
          index={4}
          title="Estudando agora"
          meta={`etapa ${etapaAtual.ordem} de ${javaRoadmap.length}`}
          note="Trilha de Java com critério de conclusão declarado por etapa."
        >
          <TrilhaJava etapas={javaRoadmap.slice(etapaAtual.ordem - 1, etapaAtual.ordem + 1)} />
          <DevPanelFoot>
            <DevInternalLink href="/desenvolvedor/java">ver a trilha inteira</DevInternalLink>
          </DevPanelFoot>
        </DevSection>
      )}

      {/* ─── Exemplos de snippet ───────────────────────────────────────── */}
      {exemplosSnippets.length > 0 && (
        <DevSection
          id="snippets"
          index={5}
          title="Snippets"
          meta={`${exemplosSnippets.length} no acervo`}
          note="Código que já resolveu um problema real neste projeto — não trecho de tutorial."
        >
          <div className="dv-objects">
            {exemplosSnippets.slice(0, 3).map((s) => (
              <DevPanel key={s.chave}>
                <DevPanelHead title={s.titulo} badge={<span className="dv-status">{s.linguagem}</span>} />
                <p>{s.descricao}</p>
                <TagList items={s.tags} />
              </DevPanel>
            ))}
          </div>
          <DevPanelFoot>
            <DevInternalLink href="/desenvolvedor/codigo">abrir o acervo de código</DevInternalLink>
          </DevPanelFoot>
        </DevSection>
      )}

      {/* ─── Design patterns: amostra ──────────────────────────────────── */}
      <DevSection
        id="padroes"
        index={6}
        title="Design Patterns"
        meta={`${designPatterns.length} cartões`}
        note="Cada cartão traz o que quase nenhum catálogo traz: quando NÃO usar."
      >
        <CardsPatterns patterns={designPatterns.slice(0, 3)} />
        <DevPanelFoot>
          <DevInternalLink href="/desenvolvedor/padroes">ver os {designPatterns.length} padrões</DevInternalLink>
        </DevPanelFoot>
      </DevSection>

      {/* ─── Certificações ─────────────────────────────────────────────── */}
      <DevSection
        id="certificacoes"
        index={7}
        title="Certificações"
        meta={`${certsObtidas.length} de ${certificacoes.length} obtidas`}
        note="Emissor, ano e link de verificação quando existe."
      >
        <GradeBadges itens={certificacoes} />
      </DevSection>

      {/* ─── Estante: só o que está aberto agora ───────────────────────── */}
      {lendo.length > 0 && (
        <DevSection
          id="lendo"
          index={8}
          title="Lendo agora"
          meta={`${livros.length} títulos na estante`}
          note="A lista completa — lidos, lendo e na fila — fica na estante."
        >
          <ul className="dv-estante">
            {lendo.map((l) => (
              <li key={l.titulo} className="dv-livro" data-status={l.status}>
                <div className="dv-livro-topo">
                  <h3>{l.titulo}</h3>
                  <span className="dv-status">lendo</span>
                </div>
                <p className="dv-livro-autor">
                  {l.autor} · {l.area}
                </p>
                <p className="dv-prose">{l.comentario}</p>
              </li>
            ))}
          </ul>
          <DevPanelFoot>
            <DevInternalLink href="/desenvolvedor/estante">abrir a estante</DevInternalLink>
          </DevPanelFoot>
        </DevSection>
      )}

      {devlogs.length > 0 && (
        <DevSection
          id="devlog"
          index={9}
          title="Devlog"
          meta={`${devlogs.length} entrada${devlogs.length === 1 ? "" : "s"}`}
          note="Registro cronológico do que foi construído, na ordem em que aconteceu."
        >
          {/* <ol> porque a ordem CARREGA significado aqui — é uma linha do
              tempo. O <div> anterior não dizia isso a ninguém. */}
          <ol className="dv-timeline">
            {devlogs.slice(0, 3).map((d) => (
              <li key={d.id} className="dv-tl-item">
                <time className="dv-tl-date">{d.date}</time>
                <h3>{d.title}</h3>
                <p className="dv-prose">{d.summary}</p>
              </li>
            ))}
          </ol>
        </DevSection>
      )}

      <DevSection
        id="stack"
        index={10}
        title="Stack em movimento"
        meta="GSAP · ScrollTrigger"
        note="Demonstração funcional do motor de animação usado no site."
      >
        <GsapDemo />
      </DevSection>

      {/* ─── A porta do repositório vivo ───────────────────────────────────
          Os blocos acima são amostras; o índice é onde o acervo se vê inteiro,
          com as contagens calculadas de cada coleção. */}
      <DevSection
        id="conhecimento"
        index={11}
        title="Repositório vivo de conhecimento"
        meta="índice geral"
        note="Trilhas, folhas de consulta, padrões, livros, snippets e wiki — com quantos itens há em cada."
      >
        <DevPanel>
          <DevPanelHead title="Índice do acervo" href="/desenvolvedor/conhecimento" />
          <p>
            As contagens são calculadas a partir das próprias coleções, não digitadas: publicar um snippet
            ou acrescentar um padrão atualiza o índice sozinho.
          </p>
          <DevPanelFoot>
            <DevInternalLink href="/desenvolvedor/conhecimento">abrir o índice</DevInternalLink>
          </DevPanelFoot>
        </DevPanel>
      </DevSection>

      <DevSection id="explorar" index={12} title="Explorar" meta={`${ATALHOS.length} áreas`}>
        <div className="dv-objects">
          {ATALHOS.map((x) => (
            <DevPanel key={x.href}>
              <DevPanelHead title={x.t} href={x.href} />
              <p>{x.d}</p>
              <DevPanelFoot>
                <DevInternalLink href={x.href}>entrar</DevInternalLink>
              </DevPanelFoot>
            </DevPanel>
          ))}
        </div>
      </DevSection>

      {/* Rodapé de estado: os números que descrevem o acervo inteiro, no fim
          da leitura, com rótulo. Antes o total de ferramentas só aparecia
          escondido dentro de um texto de card. */}
      <footer className="dv-section">
        <MetaRow
          items={[
            { k: "projetos", v: projects.length },
            { k: "experimentos", v: lab.length },
            { k: "snippets", v: snippets.length },
            { k: "ferramentas", v: tools.length },
            { k: "devlogs", v: devlogs.length },
          ]}
        />
      </footer>
    </>
  )
}
