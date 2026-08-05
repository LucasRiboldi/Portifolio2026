import type { Metadata } from "next"

import { getProjects } from "@/lib/repos/projects"
import { getTools } from "@/lib/repos/tools"
import { getSnippets, getLab } from "@/lib/repos/dev"
import { getSiteConfig } from "@/lib/repos/site-config"
import {
  getPulsoRepo,
  getRadarBrasil,
  getReposEstrelados,
  getVersaoSite,
  GITHUB_USER,
} from "@/lib/repos/tech-feed"
import { GradeEstrelados } from "@/components/dev/acervo"
import {
  Bancada,
  PulsoRepositorio,
  RadarBrasil,
  type PecaBancada,
} from "@/components/dev/home-zonas"
import { ConsoleDev } from "@/components/dev/console-dev"
import { MotorDeMovimento } from "@/components/dev/home-motor"
import {
  DevSection,
  DevPanel,
  DevPanelHead,
  DevPanelFoot,
  DevExternalLink,
  DevInternalLink,
  DevVersionBadge,
  StatTile,
  TagList,
  MetaRow,
} from "@/components/dev/ui/dev-primitives"

export const metadata: Metadata = {
  title: "Início",
  description:
    "Laboratório digital de Lucas Riboldi: estudos, projetos, experimentos, anotações e ferramentas em um lugar só.",
}

/**
 * Os quatro princípios da abertura.
 *
 * Ficam em constante e não no JSX porque são CONTEÚDO EDITORIAL de tamanho
 * fixo — a mesma decisão do `ATALHOS` logo abaixo. Se um dia virarem
 * editáveis pelo /admin, viram recurso em `lib/admin/resource-defs-*.ts`; até
 * lá, mudar a frase é mudar uma linha aqui, não caçar `<article>` no meio do
 * render.
 */
const PRINCIPIOS = [
  {
    glifo: "🤔",
    t: "E se eu testar isso...?",
    d: "A maioria dos meus projetos começou exatamente com essa pergunta.",
  },
  {
    glifo: "⚡",
    t: "Café → Código",
    d: "Converto curiosidade, pesquisa e algumas xícaras de café em software.",
  },
  {
    glifo: "📂",
    t: "Nada se perde",
    d: "Todo aprendizado merece um lugar. Organizo tudo para consultar depois (e compartilhar também).",
  },
  {
    glifo: "🎲",
    t: "Experimentar faz parte",
    d: "Nem sempre acerto de primeira. Mas quase sempre descubro um jeito melhor no caminho.",
  },
] as const

/** Quantas peças a bancada mostra. Mosaico é recorte, não catálogo. */
const PECAS_NA_BANCADA = 6

/**
 * Rodízio entre listas: um de cada, até esgotar.
 *
 * O mesmo padrão que o radar usa para mesclar fontes de notícia, e pelo mesmo
 * motivo — uma lista longa engoliria as vagas das curtas se fossem apenas
 * concatenadas.
 */
function intercalar<T>(...listas: readonly T[][]): T[] {
  const saida: T[] = []
  const maior = Math.max(0, ...listas.map((l) => l.length))
  for (let i = 0; i < maior; i++) {
    for (const lista of listas) {
      const item = lista[i]
      if (item) saida.push(item)
    }
  }
  return saida
}

export default async function DevHome() {
  /**
   * As fontes externas entram no mesmo `Promise.all` das internas.
   *
   * Em série, o pior caso somaria os prazos de todas e a home inteira
   * esperaria por notícia — que é o conteúdo menos importante da página. Em
   * paralelo o teto é o da fonte mais lenta, e cada leitor já devolve lista
   * vazia em falha, então nenhuma delas derruba o render.
   */
  const [projects, tools, snippets, lab, site, radar, estrelados, pulso, versao] =
    await Promise.all([
      getProjects(),
      getTools(),
      getSnippets(),
      getLab(),
      getSiteConfig(),
      getRadarBrasil(3),
      getReposEstrelados(6),
      getPulsoRepo(5),
      getVersaoSite(),
    ])

  const featured = projects.find((p) => p.featured) ?? projects[0]

  /**
   * A bancada: as três famílias intercaladas, não concatenadas.
   *
   * Concatenar deixaria os projetos ocupando a primeira fila inteira e as
   * ferramentas fora do corte — que é exatamente o efeito que a bancada existe
   * para desfazer. Intercalando, o mosaico mostra as três desde a primeira
   * linha, e o leitor entende de saída que são estágios da mesma coisa.
   *
   * O projeto em destaque fica de fora: ele já tem a seção anterior inteira.
   */
  const pecas: PecaBancada[] = intercalar(
    projects
      .filter((p) => p.id !== featured?.id)
      .map<PecaBancada>((p) => ({
        chave: `proj-${p.id}`,
        tipo: "projeto",
        titulo: p.title,
        descricao: p.description,
        tags: p.tags,
        href: p.slug ? `/desenvolvedor/projetos/${p.slug}` : p.href,
        externo: !p.slug && Boolean(p.href),
      })),
    lab.map<PecaBancada>((l) => ({
      chave: `lab-${l.id}`,
      tipo: "experimento",
      titulo: l.title,
      descricao: l.description,
      tags: l.stack,
      estado: l.status,
      href: l.demo_url ?? l.repo_url ?? undefined,
      externo: true,
    })),
    tools.map<PecaBancada>((t) => ({
      chave: `tool-${t.id}`,
      tipo: "ferramenta",
      titulo: `${t.emoji ? `${t.emoji} ` : ""}${t.name}`,
      descricao: t.description,
      tags: t.stack,
      href: t.demoUrl ?? t.githubUrl ?? "/desenvolvedor/ferramentas",
      externo: Boolean(t.demoUrl ?? t.githubUrl),
    })),
  ).slice(0, PECAS_NA_BANCADA)

  const stats = [
    { n: projects.length, l: "projetos", href: "/desenvolvedor/projetos", color: "var(--dev-ok)" },
    { n: lab.length, l: "experimentos", href: "/desenvolvedor/laboratorio", color: "var(--dev-signal)" },
    { n: tools.length, l: "ferramentas", href: "/desenvolvedor/ferramentas", color: "var(--dev-warn)" },
    { n: snippets.length, l: "snippets", href: "/desenvolvedor/codigo", color: "var(--dev-mark)" },
  ]

  return (
    <>
      {/* Cabeçalho do realm. É o único h1 da página — os blocos abaixo entram
          como <section> com h2, o que antes não acontecia: eram h2 soltos,
          irmãos de <div>, e o outline do documento saía achatado. */}
      <section className="dv-hero" aria-labelledby="dv-hero-titulo">
        {/* Prompt e selo de versão dividem a primeira linha: os dois são
            metadado do mesmo objeto — quem é o site e qual corte dele está no
            ar. Em telas estreitas a linha quebra e o selo desce inteiro. */}
        <div className="dv-hero-topo">
          <p className="term">
            <span className="tok-fn">const</span> dev = <span className="tok-str">{"{"}</span> nome:{" "}
            <span className="tok-str">&quot;{site.name}&quot;</span> {"}"}
            <span className="dv-caret" aria-hidden>
              ▌
            </span>
          </p>
          <DevVersionBadge versao={versao} />
        </div>
        <h1 id="dv-hero-titulo">
          Olá, eu sou <span className="p">Lucas Riboldi</span>.
        </h1>
        <p className="dv-hero-sub">
          Eternamente um <span className="g">estudante</span>, <span className="c">curioso</span> e{" "}
          <span className="y">futricador</span>.
        </p>
      </section>

      {/* ─── Manifesto ──────────────────────────────────────────────────
          Entra como §01 e não como bloco solto porque é texto longo: sem a
          régua de seção, o leitor não tem onde ancorar a leitura nem como
          voltar a ela. O ritmo interno (tese → prosa → log → prosa) está
          documentado em `dev-home.css`. */}
      <DevSection id="manifesto" index={1} title="readme.md" meta="manifesto">
        <div className="dv-mf">
          <p className="dv-mf-lead">Este não é só um portfólio.</p>

          <p>
            É onde eu junto tudo aquilo que desperta minha curiosidade: estudos, códigos, projetos,
            anotações, ideias malucas, experimentos que deram certo... e principalmente os que deram
            errado.
          </p>

          <p>
            Gosto de desmontar as coisas para entender como funcionam, testar tecnologias novas,
            criar projetos só pela curiosidade e documentar tudo pelo caminho. Afinal, conhecimento
            que não é registrado acaba se perdendo.
          </p>

          <p className="dv-mf-pull">Por isso resolvi concentrar tudo em um único lugar.</p>

          <p>
            Aqui você vai encontrar desde projetos completos até rascunhos, pesquisas, documentações,
            ferramentas, anotações de aula, desafios que enfrentei e soluções que descobri. É
            praticamente meu laboratório digital aberto ao público.
          </p>

          {/* Relatório de situação, não prosa — por isso saída de terminal. */}
          <ul className="dv-mf-log">
            <li data-t="pendente">Nem tudo aqui está finalizado.</li>
            <li data-t="curso">Algumas ideias ainda estão tomando forma.</li>
            <li data-t="quebrado">Outras quebraram completamente.</li>
            <li data-t="eterno">E várias continuam sendo um eterno &quot;work in progress&quot;.</li>
          </ul>

          <p className="dv-mf-turn">Mas é justamente isso que torna tudo interessante.</p>

          {/* Três vezes a mesma estrutura (entrada → saída); em coluna única
              a repetição some, em três colunas ela é o argumento. */}
          <ul className="dv-mf-eq">
            <li>
              <span className="k">Cada erro</span>
              <span className="v">vira aprendizado.</span>
            </li>
            <li>
              <span className="k">Cada projeto</span>
              <span className="v">ensina uma habilidade nova.</span>
            </li>
            <li>
              <span className="k">Cada experimento</span>
              <span className="v">responde uma pergunta... ou cria várias outras.</span>
            </li>
          </ul>

          <p>
            Este espaço acompanha minha evolução como estudante, desenvolvedor e eterno curioso. Em
            vez de mostrar apenas os resultados finais, ele registra todo o caminho percorrido — das
            primeiras ideias às soluções mais elaboradas.
          </p>

          <div className="dv-mf-brain">
            <span className="glifo" aria-hidden>
              🧠
            </span>
            <p>
              No fim das contas, este site funciona como meu <b>Second Brain</b>: uma mistura de
              portfólio, wiki técnica, diário de estudos, laboratório de experimentação e repositório
              de conhecimento. Um lugar onde posso aprender, construir, errar, melhorar e,
              principalmente, nunca parar de explorar.
            </p>
          </div>

          <p className="dv-mf-prompt">
            Se você também gosta de aprender fuçando, testar coisas novas e descobrir como elas
            funcionam... seja bem-vindo. 🚀
          </p>
        </div>
      </DevSection>

      {/* ─── Princípios ─────────────────────────────────────────────────── */}
      <DevSection
        id="principios"
        index={2}
        title="Modo de operação"
        meta={`${PRINCIPIOS.length} princípios`}
      >
        <div className="dv-traits" data-spot>
          {PRINCIPIOS.map((p) => (
            <DevPanel key={p.t} className="dv-trait" revelar>
              <span className="dv-trait-glifo" aria-hidden>
                {p.glifo}
              </span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </DevPanel>
          ))}
        </div>
      </DevSection>

      {/* Indicadores: contagem + destino. São o índice numérico do acervo. */}
      <nav className="dv-stats" aria-label="Acervo em números">
        {stats.map((s) => (
          <StatTile key={s.l} value={s.n} label={s.l} href={s.href} color={s.color} />
        ))}
      </nav>

      {featured && (
        <DevSection id="destaque" index={3} title="Projeto em destaque" meta={featured.tags[0] ?? "projeto"}>
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

      {/* ─── Bancada ─────────────────────────────────────────────────────
          As três famílias — projeto, experimento, ferramenta — na mesma
          superfície. Separadas em três seções, cada lista parecia curta e o
          leitor tinha de montar sozinho a ideia de que são estágios da mesma
          coisa. */}
      {pecas.length > 0 && (
        <DevSection
          id="bancada"
          index={4}
          title="Bancada"
          meta={`${pecas.length} peças`}
          note="O que está montado, o que está em teste e o que já virou ferramenta — lado a lado."
        >
          <Bancada pecas={pecas} />
          <DevPanelFoot>
            <DevInternalLink href="/desenvolvedor/projetos">todos os projetos</DevInternalLink>
            <DevInternalLink href="/desenvolvedor/laboratorio">todos os experimentos</DevInternalLink>
            <DevInternalLink href="/desenvolvedor/ferramentas">todas as ferramentas</DevInternalLink>
          </DevPanelFoot>
        </DevSection>
      )}

      {/* ─── Radar ───────────────────────────────────────────────────────
          Três manchetes, em português. As fontes brasileiras (TabNews e o
          recorte `braziliandevs` do Dev.to) entram em rodízio e ocupam as
          vagas; o Hacker News só aparece se as duas falharem juntas — e,
          quando aparece, o selo de idioma avisa antes do clique. */}
      {radar.length > 0 && (
        <DevSection
          id="radar"
          index={5}
          title="Radar de tecnologia"
          meta="atualiza a cada 30 min"
          note="Prioridade para conteúdo em português: TabNews e a comunidade brasileira do Dev.to."
        >
          <RadarBrasil noticias={radar} />
        </DevSection>
      )}

      {/* ─── Pulso do repositório ────────────────────────────────────────
          A prova de que "ambiente vivo" não é só uma frase do manifesto: o
          gráfico e os commits vêm do próprio repositório que serve a página. */}
      <DevSection
        id="pulso"
        index={6}
        title="Pulso do repositório"
        meta={pulso.commits.length > 0 ? `${pulso.totalJanela} commits` : "indisponível"}
        note="Este site é construído em público. O que mudou nele nas últimas duas semanas."
      >
        <PulsoRepositorio pulso={pulso} />
      </DevSection>

      {/* ─── Estrelas do GitHub ────────────────────────────────────────── */}
      <DevSection
        id="estrelados"
        index={7}
        title="Estrelados no GitHub"
        meta={estrelados.length > 0 ? `${estrelados.length} repositórios` : "indisponível"}
        note="Curadoria pública: o que eu marquei como digno de guardar."
      >
        <div data-spot>
          <GradeEstrelados repos={estrelados} />
        </div>
        <DevPanelFoot>
          <DevExternalLink href={`https://github.com/${GITHUB_USER}?tab=stars`}>
            ver todas as estrelas
          </DevExternalLink>
        </DevPanelFoot>
      </DevSection>

      {/* ─── Console ─────────────────────────────────────────────────────
          A única peça interativa da página, e a última de propósito: quem
          chegou até aqui já leu o resto e pode brincar. `ir <área>` navega
          sem tirar a mão do teclado — mas o dock continua sendo a navegação
          de verdade, e nada aqui é a única via para lugar nenhum. */}
      <DevSection
        id="console"
        index={8}
        title="Console"
        meta="experimental"
        note="Um terminal de mentira que navega de verdade. Digite `ajuda` para começar."
      >
        <ConsoleDev versao={versao.rotulo} />
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
            { k: "versão", v: versao.rotulo },
          ]}
        />
      </footer>

      {/* Sem marcação própria: só enriquece o HTML acima depois de montar.
          Fica no fim para não atrasar nada do que veio antes. */}
      <MotorDeMovimento />
    </>
  )
}
