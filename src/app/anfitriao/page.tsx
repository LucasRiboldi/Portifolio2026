import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import {
  paper,
  servicebar,
  lead,
  editorial,
  briefs,
  index,
  playtests,
  signature,
} from "@/lib/anfitriao-prophet"
import { ZoneLink } from "@/components/anfitriao/zone-link"
import { NewspaperJsonLd } from "@/components/anfitriao/newspaper-jsonld"
import { Plate } from "@/components/anfitriao/wire-column"
import { WireGrid } from "@/components/anfitriao/wire-motion"
import { ProphetScroll } from "@/components/anfitriao/prophet-scroll"
import { ProphetCaderno } from "@/components/anfitriao/prophet-caderno"
import { getFrontNews } from "@/data/prophet-wire"

/**
 * Metadados da primeira página.
 *
 * Só havia `title`. A rota é a porta de entrada do realm e a única com
 * conteúdo editorial de verdade — sem `description` própria ela herdava a do
 * layout, e sem `openGraph` qualquer compartilhamento saía como cartão vazio.
 * `metadataBase` e o `openGraph` base vêm do layout raiz; aqui só se declara
 * o que é desta página.
 */
export const metadata: Metadata = {
  title: "Primeira Página",
  description:
    "A primeira página d'O Anfitrião: manchete da oficina, editorial, notícias do telégrafo das mesas do mundo, coleção da casa e o cupom de assinatura.",
  alternates: { canonical: "/anfitriao" },
  openGraph: {
    type: "article",
    title: "O Anfitrião — Primeira Página",
    description:
      "Jornal das artes de mesa: game design, mecânicas, prototipagem, impressão 3D, miniaturas e print & play.",
    url: "/anfitriao",
  },
}

/**
 * A primeira página, reconstruída sobre a estrutura do layout original
 * (`public/dporiginal`): cabeçalho com brasão, faixa EXCLUSIVO, matéria de
 * capa com texto vertical, aside editorial, matérias inferiores, clima,
 * chamada e índice no rodapé.
 *
 * O que mudou em relação à versão anterior é a MOLDURA, não o conteúdo: cada
 * peça que existia continua aqui, remapeada para a zona equivalente do
 * original. As auxiliares (cupom, quadro de playtests, gravura de tiragem,
 * grimório, anúncios e expediente) vivem no "caderno" ao pé da folha, dentro
 * de `.prophet.dp`, onde as classes do kit antigo continuam valendo.
 *
 * As zonas de notícia automática são duas: as duas matérias inferiores do
 * original e a faixa `dpx-wire`, juntas cobrindo os 6 campos que o Prophet
 * Wire abastece.
 */

export default async function DailyProphetFront() {
  const news = await getFrontNews()
  // As duas primeiras ocupam as matérias inferiores do original; o restante
  // vai para a faixa do Wire.
  const [featured, second, ...rest] = news

  return (
    <>
      {/* Dados estruturados da folha. Fica no topo por convenção de leitura —
          o buscador não se importa com a posição, quem lê o HTML se importa. */}
      <NewspaperJsonLd url="https://portifolio2026-two.vercel.app/anfitriao" />

      {/* Motor de rolagem (GSAP/ScrollTrigger). Não imprime nada: enriquece o
          HTML que o servidor já mandou. Ver `prophet-scroll.tsx` para a divisão
          de território com o Motion das colunas. */}
      <ProphetScroll />

      {/* ─── EXCLUSIVO — a faixa de manchete do original ─── */}
      <section
        id="anf-manchete-principal"
        className="newspaper-exclusive wrapper dpx-anchor"
        aria-label="Manchete Principal"
        tabIndex={-1}
      >
        <p className="newspaper-exclusive-box">
          <span>EXCLUSIVO</span>
        </p>
        <article className="newspaper-exclusive-text wrapper">
          <h2 className="fittext-exclusive-h1">
            {lead.headline} <span className="fittext-exclusive-span">{lead.kicker}</span>
          </h2>
          {/* O link saiu de dentro do parágrafo do subtítulo. Ali ele era
              irmão inline de um `<span>` com `column-count: 2`, e o espaço
              que os separava desaparecia na fronteira entre as colunas —
              saía "…em silêncioLeia no Laboratório.". Como chamada de
              leitura, ele também é um bloco à parte por direito próprio. */}
          <p className="helper-colsplit-2">{lead.subhead}</p>
          <p className="dpx-exclusive-cta">
            <Link href="/anfitriao/laboratorio">Leia no Laboratório.</Link>
          </p>
        </article>
      </section>

      {/* ─── MATÉRIAS ─── */}
      <section className="newspaper-articles">
        <article
          id="anf-colunas-texto"
          className="newspaper-toparticle wrapper dpx-anchor"
          aria-labelledby="colunas-titulo"
          tabIndex={-1}
        >
          <h2 className="fittext-toparticle-h1-1" id="colunas-titulo">
            <span className="newspaper-toparticle-spanwrap">
              <span className="helper-verticaltext">Oficina</span> A regra que
            </span>{" "}
            <span className="fittext-toparticle-h1-2">desaparece</span>
          </h2>

          <section className="newspaper-toparticle-starttext">
            <p className="newspaper-articles-ingress">{lead.standfirst}</p>
            <div className="helper-colsplit-2">
              <p className="newspaper-articles-anfang">{lead.openLine}</p>
              {lead.bodyBefore.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </section>

          <section className="newspaper-toparticle-story">
            {/* Arte local e de proporção conhecida: dispensa moldura de
                recorte e entra com as suas próprias medidas. O `srcSet` de
                1x/2x que estava escrito à mão sai — o otimizador gera a
                escada de larguras E converte para AVIF/WebP, que é o ganho
                que o par de JPEG fixos não dava. */}
            <figure id="anf-ilustracoes" className="dpx-anchor" tabIndex={-1}>
              <Image
                alt="Bancada da oficina ao anoitecer"
                src="/dporiginal/images/tornado508.jpg"
                width={508}
                height={188}
                sizes="(min-width: 64em) 480px, (min-width: 48em) 45vw, 90vw"
              />
            </figure>

            <hr className="hr-double-top" />
            <h3>
              <span>{signature.autograph}</span> na bancada
            </h3>
            <hr className="hr-double-bottom" />
            <blockquote>{lead.pullquote}</blockquote>
            <div className="helper-colsplit-2">
              {lead.bodyAfter.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p>{lead.caption}</p>
              {/* A continuação existe de fato: leva à página II, onde a
                  matéria prossegue. Enquanto não havia página interna, esta
                  chamada teria sido mentira tipográfica — por isso não
                  existia. */}
              <Link href="/anfitriao/materia/a-regra-que-desaparece" className="dpx-mat-continua">
                Continua na página II ❦
              </Link>
            </div>
          </section>

          {/* O aside "Rita Skeeter reports" do original vira o nosso Editorial. */}
          <aside
            id="anf-editorial"
            className="newspaper-toparticle-aside dpx-anchor"
            aria-labelledby="editorial-titulo"
            tabIndex={-1}
          >
            <h2 id="editorial-titulo">
              {editorial.title} <span>{editorial.headline}</span>
            </h2>
            <hr />
            {editorial.body.map((p, i) => (
              <p key={i} className={i === 0 ? "newspaper-articles-anfang" : undefined}>
                {p}
              </p>
            ))}
            <p>{editorial.sign}</p>
            <p>{signature.role}</p>
          </aside>
        </article>

        <hr />

        {/* ─── Matérias inferiores: as duas primeiras notícias automáticas ─── */}
        <article
          id="anf-noticias-secundarias"
          className="newspaper-bottomarticles wrapper dpx-anchor"
          aria-label="Notícias Secundárias"
          tabIndex={-1}
        >
          {featured && (
            <section className="newspaper-bottomarticle-first">
              <h2 className="fittext-bottomarticle-first-h1">{featured.title}</h2>
              {/* A arte vem resolvida do pipeline (image-resolver): imagem da
                  fonte, busca, padrão da categoria ou — não havendo nenhuma — a
                  gravura vazia, que no impresso é recurso legítimo. */}
              <figure>
                <Plate
                  image={featured.image}
                  sizes="(min-width: 64em) 480px, (min-width: 48em) 45vw, 90vw"
                />
                {featured.image.caption ? <figcaption>{featured.image.caption}</figcaption> : null}
              </figure>

              <blockquote>
                <p>“{featured.subtitle || featured.summary.slice(0, 80)}”</p>
                <span>
                  <a
                    className="dpx-news-source"
                    href={featured.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {featured.sourceName} ↗
                  </a>
                </span>
              </blockquote>
            </section>
          )}

          {second && (
            <section className="newspaper-bottomarticle-second wrapper">
              <div className="wrapper">
                {/*
                  Estes três eram `<h1>`, `<h2>` e `<h3>` — e só um deles é
                  título. `category` é chapéu de editoria (rótulo, vira `<p>`)
                  e `dropcap` é UMA LETRA de ornamento: como cabeçalho, ela
                  entrava na lista de títulos do leitor de tela como uma
                  entrada de um caractere. Vira ornamento declarado, fora da
                  árvore de acessibilidade. As classes seguem as mesmas, e o
                  CSS herdado passou a mirar nelas em vez das tags.
                */}
                <p className="newspaper-bottomarticle-second-h1">{second.category}</p>
                <h3 className="newspaper-bottomarticle-second-h2">{second.title}</h3>
                <p className="newspaper-bottomarticle-second-h3" aria-hidden>
                  {second.dropcap}
                </p>
                <p className="newspaper-articles-ingress">{second.subtitle || second.note}</p>
              </div>

              <div className="wrapper relative">
                <div className="floated" />
                <figure>
                  <Plate
                    image={second.image}
                    shape="round"
                    sizes="(min-width: 64em) 240px, (min-width: 48em) 25vw, 45vw"
                  />
                </figure>

                <p className="newspaper-articles-anfang">{second.summary}</p>
                <p>
                  <a
                    className="dpx-news-source"
                    href={second.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {second.sourceName} ↗
                  </a>
                </p>
              </div>
            </section>
          )}
        </article>
      </section>

      {/* ─── PROPHET WIRE — as demais notícias automáticas ─── */}
      {rest.length > 0 && (
        <section
          id="anf-noticias-internacionais"
          className="dpx-wire wrapper dpx-anchor"
          aria-labelledby="wire-titulo"
          tabIndex={-1}
        >
          <hr className="hr-double-top" />
          <h2 className="dpx-wire-title" id="wire-titulo">
            Notícias Internacionais — Do Telégrafo, as Mesas do Mundo
          </h2>
          <hr className="hr-double-bottom" />

          {/* A grelha saiu daqui para `wire-motion.tsx`, que é onde as colunas
              ganham entrada por rolagem, elevação no ponteiro e a tarja de
              procedência. O `<div className="dpx-wire-grid">` continua sendo o
              elemento externo — mudou quem o imprime, não a diagramação. */}
          <WireGrid news={rest} />
        </section>
      )}

      {/* ─── MERCADO — cotações da oficina e sentimento das mesas, na zona de weather do original ─── */}
      <section
        id="anf-mercado"
        className="newspaper-weather dpx-anchor"
        aria-labelledby="mercado-titulo"
        tabIndex={-1}
      >
        <hr className="hr-double-top" />
        <h2 id="mercado-titulo">{servicebar.weather.title}</h2>
        <ul className="newspaper-weather-cities wrapper">
          {servicebar.weather.rows.map(([k, v]) => (
            <li key={k}>
              <h3>{k}</h3>
              <p>{v}</p>
            </li>
          ))}
          {servicebar.quotes.rows.map(([k, v]) => (
            <li key={k}>
              <h3>{k}</h3>
              <p>{v}</p>
            </li>
          ))}
        </ul>
        {/* Procedência dos números, impressa junto — quadro sem fonte é
            ornamento, não notícia. */}
        <p className="dpx-market-note">{servicebar.marketNote}</p>
      </section>

      {/* ─── COLEÇÃO · abertura em telegrama ───
          A âncora da zona "Coleção" vive AQUI, e não na banda seguinte: o
          telegrama é a abertura da coleção (já se chamava "Coleção em
          Telegrama") e a banda "Coleção da Casa" vem logo abaixo. Com a
          âncora na banda, este bloco ficava fora do alcance do menu. */}
      <section
        id="anf-colecao"
        className="newspaper-teaser wrapper dpx-anchor"
        aria-label="Coleção"
        tabIndex={-1}
      >
        <p className="newspaper-teaser-fatline">{briefs.title}</p>
        {/* O número da página leva o erro de registro — o efeito de letra que
            o original reserva aos algarismos grandes. Ver `.dpx-misregister`.

            Dizia "Pág. IV" e apontava para o vazio: a Coleção é a página III
            (ver `zones`), e IV é o Serviço ao Leitor. Chamada de jornal que
            manda para a página errada é pior que chamada nenhuma. */}
        <p className="newspaper-teaser-page dpx-misregister">
          <span>Pág.</span>
          III
        </p>
        <p className="newspaper-teaser-story">
          {briefs.items[0]}
          <span>{briefs.items[1]}</span>
        </p>
      </section>

      {/* ─── O CADERNO — coleção, anúncios, serviço e expediente ───
          As quatro bandas ao pé da folha vivem em `ProphetCaderno`. Saíram
          daqui em 13/08 por tamanho, verbatim e com o HTML conferido. */}
      <ProphetCaderno />

      {/* ─── ÍNDICE DESTA EDIÇÃO ───
          Estava entre o telegrama e a banda da Coleção, partindo aquela zona
          em duas metades separadas por outra seção. No layout original o
          índice é a ÚLTIMA peça da folha; as bandas do caderno é que foram
          acrescentadas depois dele. Devolvido ao fim, cada zona volta a ser
          um trecho contínuo — e o menu passa a percorrer a página em ordem.

          A lista vem de `index`, derivada de `zones`: o mesmo sumário do menu
          sanduíche, impresso. */}
      <footer
        id="anf-indice"
        className="newspaper-footer dpx-anchor"
        aria-label="Índice desta Edição"
        tabIndex={-1}
      >
        <ul className="newspaper-footer-index wrapper">
          {index.map((i) => (
            <li key={i.label}>
              {/* `ZoneLink` em vez de `Link`: o índice impresso aponta para as
                  mesmas âncoras do sumário do menu e precisa levar o foco de
                  teclado junto, como o menu faz. A última entrada é rota de
                  verdade (`/anfitriao/laboratorio`) — o componente reconhece e
                  deixa a navegação com o navegador. */}
              <ZoneLink href={i.href} title={i.label}>
                {i.label} <span>{i.page}</span>
              </ZoneLink>
            </li>
          ))}
        </ul>
      </footer>

      <div className="dpx-foot">
        <span>{paper.masthead}</span>
        <span>— I —</span>
        <span>{paper.issue}</span>
      </div>
    </>
  )
}
