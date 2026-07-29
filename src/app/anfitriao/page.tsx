import Link from "next/link"

import {
  paper,
  servicebar,
  lead,
  editorial,
  boxes,
  ads,
  briefs,
  index,
  colophon,
  coupon,
  playtests,
  awards,
  lineage,
  circulation,
  signature,
  registryNumber,
} from "@/lib/anfitriao-prophet"
import { PressMark } from "@/components/prophet/press-mark"
import { getFrontNews } from "@/data/prophet-wire"
import type { NewsItem } from "@/lib/prophet-wire/types"

export const metadata = { title: "Primeira Página" }

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

/** Gravura de uma notícia — arte real quando houver, moldura vazia quando não. */
function NewsPlate({ news }: { news: NewsItem }) {
  return (
    <figure>
      {news.image.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={news.image.src} alt={news.image.alt} />
      ) : (
        <div className="dpx-news-plate" role="img" aria-label={news.image.alt} />
      )}
      {news.image.caption ? <figcaption>{news.image.caption}</figcaption> : null}
    </figure>
  )
}

/** Uma coluna de notícia da faixa automática. */
function WireColumn({ news }: { news: NewsItem }) {
  return (
    <article className="dpx-news">
      <p>
        <span className="dpx-news-kicker">{news.category}</span>
      </p>
      <h3 className="dpx-news-head">{news.title}</h3>
      {news.subtitle ? <p className="dpx-news-sub">{news.subtitle}</p> : null}

      <NewsPlate news={news} />

      <p className="dpx-news-body">
        <span className="dpx-news-cap">{news.dropcap}</span>
        {news.summary}
      </p>
      {news.note ? <p className="dpx-news-note">{news.note}</p> : null}

      <a
        className="dpx-news-source"
        href={news.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {news.sourceName} ↗
      </a>
    </article>
  )
}

export default async function DailyProphetFront() {
  const news = await getFrontNews()
  // As duas primeiras ocupam as matérias inferiores do original; o restante
  // vai para a faixa do Wire.
  const [featured, second, ...rest] = news

  return (
    <>
      {/* ─── EXCLUSIVO — a faixa de manchete do original ─── */}
      <section className="newspaper-exclusive wrapper">
        <span id="anf-manchete-principal" className="helper-hide dpx-anchor">
          Manchete Principal
        </span>
        <p className="newspaper-exclusive-box">
          <span>EXCLUSIVO</span>
        </p>
        <article className="newspaper-exclusive-text wrapper">
          <h1 className="fittext-exclusive-h1">
            {lead.headline} <span className="fittext-exclusive-span">{lead.kicker}</span>
          </h1>
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
        <article className="newspaper-toparticle wrapper">
          <span id="anf-colunas-texto" className="helper-hide dpx-anchor">
            Colunas de Texto
          </span>
          <h1 className="fittext-toparticle-h1-1">
            <span className="newspaper-toparticle-spanwrap">
              <span className="helper-verticaltext">Oficina</span> A regra que
            </span>{" "}
            <span className="fittext-toparticle-h1-2">desaparece</span>
          </h1>

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
            <figure>
              <span id="anf-ilustracoes" className="helper-hide dpx-anchor">
                Ilustrações
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Bancada da oficina ao anoitecer"
                src="/dporiginal/images/tornado508.jpg"
                srcSet="/dporiginal/images/tornado508.jpg 1x, /dporiginal/images/tornado1016.jpg 2x"
                width={508}
                height={188}
              />
            </figure>

            <hr className="hr-double-top" />
            <h2>
              <span>{signature.autograph}</span> na bancada
            </h2>
            <hr className="hr-double-bottom" />
            <blockquote>{lead.pullquote}</blockquote>
            <div className="helper-colsplit-2">
              {lead.bodyAfter.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <p>{lead.caption}</p>
            </div>
          </section>

          {/* O aside "Rita Skeeter reports" do original vira o nosso Editorial. */}
          <aside className="newspaper-toparticle-aside">
            <span id="anf-editorial" className="helper-hide dpx-anchor">
              Editorial
            </span>
            <h1>
              {editorial.title} <span>{editorial.headline}</span>
            </h1>
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
        <article className="newspaper-bottomarticles wrapper">
          <span id="anf-noticias-secundarias" className="helper-hide dpx-anchor">
            Notícias Secundárias
          </span>
          {featured && (
            <section className="newspaper-bottomarticle-first">
              <h1 className="fittext-bottomarticle-first-h1">{featured.title}</h1>
              {/* A arte vem resolvida do pipeline (image-resolver): imagem da
                  fonte, busca, padrão da categoria ou — não havendo nenhuma — a
                  gravura vazia, que no impresso é recurso legítimo. */}
              <figure>
                {featured.image.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={featured.image.alt} src={featured.image.src} />
                ) : (
                  <div className="dpx-news-plate" role="img" aria-label={featured.image.alt} />
                )}
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
                <h1 className="newspaper-bottomarticle-second-h1">{second.category}</h1>
                <h2 className="newspaper-bottomarticle-second-h2">{second.title}</h2>
                <h3 className="newspaper-bottomarticle-second-h3">{second.dropcap}</h3>
                <p className="newspaper-articles-ingress">{second.subtitle || second.note}</p>
              </div>

              <div className="wrapper relative">
                <div className="floated" />
                <figure>
                  {second.image.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={second.image.alt} src={second.image.src} width={200} height={200} />
                  ) : (
                    <div className="dpx-news-plate" role="img" aria-label={second.image.alt} />
                  )}
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
        <section className="dpx-wire wrapper" aria-labelledby="wire-titulo">
          <span id="anf-noticias-internacionais" className="helper-hide dpx-anchor">
            Notícias Internacionais
          </span>
          <hr className="hr-double-top" />
          <h2 className="dpx-wire-title" id="wire-titulo">
            Notícias Internacionais — Do Telégrafo, as Mesas do Mundo
          </h2>
          <hr className="hr-double-bottom" />

          <div className="dpx-wire-grid">
            {rest.map((n) => (
              <WireColumn key={n.slug} news={n} />
            ))}
          </div>
        </section>
      )}

      {/* ─── MERCADO — cotações da oficina e sentimento das mesas, na zona de weather do original ─── */}
      <section className="newspaper-weather">
        <span id="anf-mercado" className="helper-hide dpx-anchor">
          Mercado Financeiro e Comércio
        </span>
        <hr className="hr-double-top" />
        <h2>{servicebar.weather.title}</h2>
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
      <section className="newspaper-teaser wrapper">
        <span id="anf-colecao" className="helper-hide dpx-anchor">
          Coleção
        </span>
        <p className="newspaper-teaser-fatline">{briefs.title}</p>
        {/* O número da página leva o erro de registro — o efeito de letra que
            o original reserva aos algarismos grandes. Ver `.dpx-misregister`. */}
        <p className="newspaper-teaser-page dpx-misregister">
          <span>Pág.</span>
          IV
        </p>
        <p className="newspaper-teaser-story">
          {briefs.items[0]}
          <span>{briefs.items[1]}</span>
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COLEÇÃO — continuação da zona aberta pelo telegrama acima.
          ═══════════════════════════════════════════════════════════
          Sem âncora própria: a da zona "Coleção" está no telegrama, que é
          onde o menu deve pousar. Duas âncoras com o mesmo `id` seriam id
          duplicado — HTML inválido, e o navegador só enxerga a primeira.
          ═══════════════════════════════════════════════════════════ */}

      <section className="dpx-band" aria-labelledby="colecao-titulo">
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="colecao-titulo">
            Coleção da Casa
          </h2>
          <p className="dpx-band-sub">
            Os premiados, a linhagem do ofício e o índice técnico das mesas
          </p>
        </header>

        <div className="dpx-zone dpx-zone--3">
          {/* Coluna I — o quadro de láureas e o primeiro classificado */}
          <div>
            <div className="dpx-box">
              <table className="dpx-table">
                <caption>{awards.caption}</caption>
                <thead>
                  <tr>
                    {awards.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {awards.rows.map((r) => (
                    <tr key={`${r.year}-${r.title}`}>
                      {/* Não usa `.num`: aquela classe zera o padding à direita
                          para encostar o número na borda da tabela, e serve à
                          ÚLTIMA coluna. Aqui o ano abre a linha — sem padding
                          ele colava no título ("2024Sky Team"). */}
                      <td className="year">{r.year}</td>
                      <td>{r.title}</td>
                      <td>{r.prize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Coluna II — a linhagem, o quadro de playtests e a gravura */}
          <div>
            <div className="dpx-box">
              <p className="dpx-box-title">{lineage.title}</p>
              {lineage.items.map((l) => (
                <p key={l.title} className="dpx-term">
                  <b>
                    {l.title} <span className="dpx-term-year">{l.year}</span>
                  </b>{" "}
                  — <em>{l.note}</em>
                  <span className="dpx-term-author">{l.author}</span>
                </p>
              ))}
            </div>

            <div className="dpx-box">
              <table className="dpx-table">
                <caption>{playtests.caption}</caption>
                <thead>
                  <tr>
                    {playtests.head.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {playtests.rows.map((r) => (
                    <tr key={r.item}>
                      <td>{r.item}</td>
                      <td className="num">{r.players}</td>
                      <td className="num">{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figure style={{ margin: 0 }}>
              <svg
                className="dpx-chart"
                viewBox="0 0 200 84"
                role="img"
                aria-label={circulation.aria}
              >
                <line x1="22" y1="8" x2="22" y2="66" />
                <line x1="22" y1="66" x2="192" y2="66" />
                <polyline points={circulation.points} />
                {circulation.years.map(([x, ano]) => (
                  <text key={ano} x={x} y="76" textAnchor="middle">
                    {ano}
                  </text>
                ))}
                <text x="4" y="12">
                  {circulation.top}
                </text>
                <text x="4" y="66">
                  {circulation.bottom}
                </text>
              </svg>
              <figcaption className="dpx-figcaption">{circulation.caption}</figcaption>
            </figure>
          </div>

          {/* Coluna III — números da casa, telegramas e o índice técnico */}
          <div>
            <div className="dpx-box dpx-box--heavy">
              <p className="dpx-box-title">{boxes.numbers.title}</p>
              {boxes.numbers.rows.map(([k, v]) => (
                <p key={k} className="dpx-kv">
                  <b>{k}</b>
                  <span>{v}</span>
                </p>
              ))}
            </div>

            <div className="dpx-box">
              <p className="dpx-box-title">{briefs.title}</p>
              <ul className="dpx-list dpx-list--dash">
                {briefs.items.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="dpx-box">
              <p className="dpx-box-title">{boxes.curio.title}</p>
              <ul className="dpx-list dpx-list--fleuron">
                {boxes.curio.items.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="dpx-box">
              <p className="dpx-box-title">{boxes.grimoire.title}</p>
              {boxes.grimoire.items.map((t) => (
                <p key={t.term} className="dpx-term">
                  <b>{t.term}</b> — <em>{t.note}</em>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ANÚNCIOS PUBLICITÁRIOS — zona própria ═══
          Os três classificados estavam repartidos: um na banda da Coleção e
          dois na do Serviço ao Leitor. Uma zona do menu precisa ser UM lugar
          — clicar em "Anúncios Publicitários" levava a um deles e escondia os
          outros dois numa seção de outro assunto. Agora é uma faixa só. */}
      <section className="dpx-band" aria-labelledby="anuncios-titulo">
        <span id="anf-anuncios" className="helper-hide dpx-anchor">
          Anúncios Publicitários
        </span>
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="anuncios-titulo">
            Anúncios Publicitários
          </h2>
          <p className="dpx-band-sub">Os classificados desta praça</p>
        </header>

        <div className="dpx-zone dpx-zone--3">
          {ads.map((a) => (
            <div key={a.head} className="dpx-ad">
              <p className="dpx-ad-head">{a.head}</p>
              <p className="dpx-ad-body">{a.body}</p>
              <p className="dpx-ad-sign">{a.sign}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Serviço ao leitor: o cupom, o conselho e a rubrica ═══ */}
      <section className="dpx-band" aria-labelledby="servico-titulo">
        <span id="anf-servico" className="helper-hide dpx-anchor">
          Serviço ao Leitor
        </span>
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="servico-titulo">
            Serviço ao Leitor
          </h2>
          <p className="dpx-band-sub">Assinatura e conselho da casa</p>
        </header>

        <div className="dpx-zone dpx-zone--2">
          {/* O cupom — a camada de formulário, impressa */}
          <form aria-labelledby="cupom-titulo">
            <div className="dpx-box dpx-box--heavy">
              <p className="dpx-box-title" id="cupom-titulo">
                {coupon.title}
              </p>
              <p className="dpx-help">{coupon.standfirst}</p>

              <div className="dpx-field">
                <label className="dpx-label" data-required="true" htmlFor="cp-nome">
                  {coupon.fields.name.label}
                </label>
                <input
                  id="cp-nome"
                  name="nome"
                  className="dpx-input"
                  placeholder={coupon.fields.name.placeholder}
                />
              </div>

              <div className="dpx-field">
                <label className="dpx-label" data-required="true" htmlFor="cp-praca">
                  {coupon.fields.place.label}
                </label>
                <input
                  id="cp-praca"
                  name="praca"
                  className="dpx-input"
                  placeholder={coupon.fields.place.placeholder}
                />
              </div>

              <fieldset className="dpx-field">
                <legend className="dpx-label">{coupon.cadence.legend}</legend>
                {coupon.cadence.options.map((o) => (
                  <label key={o.id} className="dpx-choice">
                    <input
                      type="radio"
                      name="cadencia"
                      value={o.id}
                      className="dpx-check"
                      defaultChecked={o.default}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="dpx-field">
                <legend className="dpx-label">{coupon.extras.legend}</legend>
                {coupon.extras.options.map((o) => (
                  <label key={o.id} className="dpx-choice">
                    <input
                      type="checkbox"
                      name={o.id}
                      className="dpx-check"
                      defaultChecked={o.default}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </fieldset>

              <div className="dpx-field">
                <label className="dpx-label" htmlFor="cp-recado">
                  {coupon.fields.note.label}
                </label>
                <textarea
                  id="cp-recado"
                  name="recado"
                  rows={2}
                  className="dpx-input dpx-input--boxed"
                />
                <p className="dpx-help">{coupon.fields.note.help}</p>
              </div>

              <div className="dpx-actions">
                <button type="submit" className="dpx-btn dpx-btn--primary">
                  {coupon.submit}
                </button>
                <button type="reset" className="dpx-btn dpx-btn--ghost">
                  {coupon.reset}
                </button>
              </div>
              <p className="dpx-help">{coupon.fineprint}</p>
            </div>
          </form>

          {/* Conselho da casa e a rubrica do editor. Os classificados que
              viviam aqui mudaram para a faixa "Anúncios Publicitários". */}
          <div>
            <div className="dpx-box">
              <p className="dpx-box-title">{boxes.tip.title}</p>
              <p className="dpx-text">{boxes.tip.body}</p>
            </div>

            {/* As efemérides estavam no índice do rodapé, entre as entradas de
                navegação — pareciam links e não eram. Horários da casa são
                serviço ao leitor; é aqui que se informam, e é o que preenche
                esta coluna, antes vazia da metade para baixo. */}
            <div className="dpx-box">
              <p className="dpx-box-title">{servicebar.ephemeris.title}</p>
              <ul className="dpx-list dpx-list--dash">
                {servicebar.ephemeris.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>

            <div className="dpx-signature">
              <p className="dpx-autograph">{signature.autograph}</p>
              <p className="dpx-signature-name">{signature.name}</p>
              <p className="dpx-signature-role">{signature.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Expediente — abriga o acesso administrativo (PressMark) ═══ */}
      <section className="dpx-band" aria-labelledby="expediente-titulo">
        <span id="anf-expediente" className="helper-hide dpx-anchor">
          Expediente
        </span>
        <header className="dpx-band-head">
          <h2 className="dpx-band-title" id="expediente-titulo">
            {colophon.title}
          </h2>
        </header>

        <div className="dpx-zone dpx-zone--3">
          <div>
            {colophon.lines.map(([k, v]) => (
              <p key={k} className="dpx-kv">
                <b>{k}</b>
                <span>{v}</span>
              </p>
            ))}
            <p className="dpx-kv">
              <b>{colophon.pressLabel}</b>
              <span>
                <PressMark label={colophon.pressValue} />
              </span>
            </p>
          </div>

          <div>
            <p className="dpx-box-title">Aviso aos Leitores</p>
            <p className="dpx-text">{colophon.notice}</p>
            <div className="dpx-orn" aria-hidden>
              ❦
            </div>
            <p className="dpx-text" style={{ textAlign: "center" }}>
              {paper.place}
            </p>
          </div>

          <div>
            <p className="dpx-box-title">Marcas de Registro</p>
            <p className="dpx-kv">
              <b>Edição</b>
              <span>{colophon.registry}</span>
            </p>
            <p className="dpx-kv">
              <b>Fecho</b>
              <span>à meia-noite</span>
            </p>
            <div className="dpx-stamp" aria-hidden>
              Expedido
              <br />
              {registryNumber}
              <br />
              Terra-2026
            </div>
          </div>
        </div>
      </section>

      {/* ─── ÍNDICE DESTA EDIÇÃO ───
          Estava entre o telegrama e a banda da Coleção, partindo aquela zona
          em duas metades separadas por outra seção. No layout original o
          índice é a ÚLTIMA peça da folha; as bandas do caderno é que foram
          acrescentadas depois dele. Devolvido ao fim, cada zona volta a ser
          um trecho contínuo — e o menu passa a percorrer a página em ordem.

          A lista vem de `index`, derivada de `zones`: o mesmo sumário do menu
          sanduíche, impresso. */}
      <footer className="newspaper-footer">
        <span id="anf-indice" className="helper-hide dpx-anchor">
          Índice desta Edição
        </span>
        <ul className="newspaper-footer-index wrapper">
          {index.map((i) => (
            <li key={i.label}>
              <Link href={i.href} title={i.label}>
                {i.label} <span>{i.page}</span>
              </Link>
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
