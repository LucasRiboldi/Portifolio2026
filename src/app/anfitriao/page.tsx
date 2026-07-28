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
        <p className="newspaper-exclusive-box">
          <span>EXCLUSIVO</span>
        </p>
        <article className="newspaper-exclusive-text wrapper">
          <h1 className="fittext-exclusive-h1">
            {lead.headline} <span className="fittext-exclusive-span">{lead.kicker}</span>
          </h1>
          <p>
            <span className="helper-colsplit-2">{lead.subhead}</span>
            <Link href="/anfitriao/laboratorio">Leia no Laboratório.</Link>
          </p>
        </article>
      </section>

      {/* ─── MATÉRIAS ─── */}
      <section className="newspaper-articles">
        <article className="newspaper-toparticle wrapper">
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
          {featured && (
            <section className="newspaper-bottomarticle-first">
              <h1 className="fittext-bottomarticle-first-h1">{featured.title}</h1>
              {featured.image.src ? (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={featured.image.alt} src={featured.image.src} />
                </figure>
              ) : (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={featured.image.alt}
                    src="/dporiginal/images/mics500.jpg"
                    srcSet="/dporiginal/images/mics500.jpg 1x, /dporiginal/images/mics100.jpg 2x"
                    width={500}
                    height={200}
                  />
                </figure>
              )}

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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={second.image.alt}
                    src={second.image.src ?? "/dporiginal/images/potions200.jpg"}
                    srcSet={
                      second.image.src
                        ? undefined
                        : "/dporiginal/images/potions200.jpg 1x, /dporiginal/images/potions400.jpg 2x"
                    }
                    width={200}
                    height={200}
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
        <section className="dpx-wire wrapper" aria-labelledby="wire-titulo">
          <hr className="hr-double-top" />
          <h2 className="dpx-wire-title" id="wire-titulo">
            Do Telégrafo — Notícias das Mesas do Mundo
          </h2>
          <hr className="hr-double-bottom" />

          <div className="dpx-wire-grid">
            {rest.map((n) => (
              <WireColumn key={n.slug} news={n} />
            ))}
          </div>
        </section>
      )}

      {/* ─── CLIMA — o "Clima das Mesas" na zona de weather do original ─── */}
      <section className="newspaper-weather">
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
      </section>

      {/* ─── CHAMADA — as últimas notícias em telegrama ─── */}
      <section className="newspaper-teaser wrapper">
        <p className="newspaper-teaser-fatline">{briefs.title}</p>
        <p className="newspaper-teaser-page">
          <span>Pág.</span>
          IV
        </p>
        <p className="newspaper-teaser-story">
          {briefs.items[0]}
          <span>{briefs.items[1]}</span>
        </p>
      </section>

      {/* ─── ÍNDICE ─── */}
      <footer className="newspaper-footer">
        <ul className="newspaper-footer-index wrapper">
          {index.map((i) => (
            <li key={i.label}>
              <Link href={i.href} title={i.label}>
                {i.label} <span>{i.page}</span>
              </Link>
            </li>
          ))}
          {servicebar.ephemeris.lines.map((l, i) => (
            <li key={l}>
              <span title={l}>
                {l} <span>{i + 1}</span>
              </span>
            </li>
          ))}
        </ul>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          CADERNO DA OFICINA — tudo que a folha já trazia e que não tem
          zona equivalente no original. Vive sob `.prophet.dp`, onde as
          classes do kit antigo continuam valendo, então nada se perdeu.
          ───────────────────────────────────────────────────────────── */}
      <div className="prophet dp">
        <div className="dp-sheet dpx-caderno">
          <hr className="dp-rule--double" />

          <div className="dp-grid">
            <div className="dp-col">
              <div className="dp-box">
                <p className="dp-box-title">{boxes.curio.title}</p>
                <ul className="dp-list dp-list--fleuron">
                  {boxes.curio.items.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="dp-ad">
                <p className="dp-ad-head">{ads[0].head}</p>
                <p>{ads[0].body}</p>
                <p className="dp-ad-sign">{ads[0].sign}</p>
              </div>

              <div className="dp-box">
                <table className="dp-table">
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

              <form className="dp-box dp-box--heavy" aria-labelledby="cupom-titulo">
                <p className="dp-box-title" id="cupom-titulo">
                  {coupon.title}
                </p>
                <p className="dp-help" style={{ marginBottom: "0.5rem" }}>
                  {coupon.standfirst}
                </p>

                <div className="dp-field">
                  <label className="dp-label" data-required="true" htmlFor="cp-nome">
                    {coupon.fields.name.label}
                  </label>
                  <input
                    id="cp-nome"
                    name="nome"
                    className="dp-input"
                    placeholder={coupon.fields.name.placeholder}
                  />
                </div>

                <div className="dp-field">
                  <label className="dp-label" data-required="true" htmlFor="cp-praca">
                    {coupon.fields.place.label}
                  </label>
                  <input
                    id="cp-praca"
                    name="praca"
                    className="dp-input"
                    placeholder={coupon.fields.place.placeholder}
                  />
                </div>

                <fieldset
                  className="dp-field"
                  style={{ border: 0, padding: 0, margin: "0 0 0.85rem" }}
                >
                  <legend className="dp-label">{coupon.cadence.legend}</legend>
                  {coupon.cadence.options.map((o) => (
                    <label key={o.id} className="dp-choice">
                      <input
                        type="radio"
                        name="cadencia"
                        value={o.id}
                        className="dp-check dp-check--radio"
                        defaultChecked={o.default}
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset
                  className="dp-field"
                  style={{ border: 0, padding: 0, margin: "0 0 0.85rem" }}
                >
                  <legend className="dp-label">{coupon.extras.legend}</legend>
                  {coupon.extras.options.map((o) => (
                    <label key={o.id} className="dp-choice">
                      <input
                        type="checkbox"
                        name={o.id}
                        className="dp-check"
                        defaultChecked={o.default}
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="dp-field">
                  <label className="dp-label" htmlFor="cp-recado">
                    {coupon.fields.note.label}
                  </label>
                  <textarea id="cp-recado" name="recado" rows={2} className="dp-input dp-input--boxed" />
                  <p className="dp-help">{coupon.fields.note.help}</p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button type="submit" className="dp-btn dp-btn--primary">
                    {coupon.submit}
                  </button>
                  <button type="reset" className="dp-btn dp-btn--ghost dp-btn--sm">
                    {coupon.reset}
                  </button>
                </div>
                <p className="dp-help" style={{ marginTop: "0.5rem" }}>
                  {coupon.fineprint}
                </p>
              </form>
            </div>

            <div className="dp-col">
              <figure className="dp-figure">
                <svg
                  className="dp-chart"
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
                <figcaption className="dp-figcaption">{circulation.caption}</figcaption>
              </figure>

              <div className="dp-box">
                <p className="dp-box-title">{boxes.tip.title}</p>
                <p>{boxes.tip.body}</p>
              </div>

              <div className="dp-ad">
                <p className="dp-ad-head">{ads[1].head}</p>
                <p>{ads[1].body}</p>
                <p className="dp-ad-sign">{ads[1].sign}</p>
              </div>

              <div className="dp-signature">
                <p className="dp-autograph">{signature.autograph}</p>
                <div className="dp-signature-line">
                  <p className="dp-signature-name">{signature.name}</p>
                  <p className="dp-signature-role">{signature.role}</p>
                </div>
              </div>
            </div>

            <div className="dp-col dp-col--rail">
              <div className="dp-box dp-box--heavy">
                <p className="dp-box-title">{boxes.numbers.title}</p>
                {boxes.numbers.rows.map(([k, v]) => (
                  <p key={k} className="dp-kv">
                    <b>{k}</b>
                    <span className="dp-lining">{v}</span>
                  </p>
                ))}
              </div>

              <div className="dp-box">
                <p className="dp-box-title">{briefs.title}</p>
                <ul className="dp-briefs dp-list dp-list--dash">
                  {briefs.items.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="dp-box">
                <p className="dp-box-title">{boxes.grimoire.title}</p>
                {boxes.grimoire.items.map((t) => (
                  <p key={t.term} className="dp-term">
                    <b>{t.term}</b> — <em>{t.note}</em>
                  </p>
                ))}
              </div>

              <div className="dp-ad">
                <p className="dp-ad-head">{ads[2].head}</p>
                <p>{ads[2].body}</p>
                <p className="dp-ad-sign">{ads[2].sign}</p>
              </div>

              <p className="dp-stamp" aria-hidden>
                Impresso
                <br />
                nesta casa
              </p>
            </div>
          </div>

          {/* Expediente — abriga o acesso administrativo (PressMark). */}
          <footer className="dp-colophon">
            <div>
              <p className="dp-box-title">{colophon.title}</p>
              {colophon.lines.map(([k, v]) => (
                <p key={k} className="dp-kv">
                  <b>{k}</b>
                  <span>{v}</span>
                </p>
              ))}
              <p className="dp-kv">
                <b>{colophon.pressLabel}</b>
                <span>
                  <PressMark label={colophon.pressValue} />
                </span>
              </p>
            </div>

            <div>
              <p className="dp-box-title">Aviso aos Leitores</p>
              <p className="dp-notice">{colophon.notice}</p>
              <div className="dp-orn" aria-hidden>
                ❦
              </div>
              <p className="dp-notice" style={{ textAlign: "center" }}>
                <span className="dp-sc">{paper.place}</span>
              </p>
            </div>

            <div>
              <p className="dp-box-title">Marcas de Registro</p>
              <p className="dp-kv">
                <b>Edição</b>
                <span>{colophon.registry}</span>
              </p>
              <p className="dp-kv">
                <b>Fecho</b>
                <span>à meia-noite</span>
              </p>
              <div className="dp-postmark dp-anim-press" aria-hidden>
                Expedido
                <b>{registryNumber}</b>
                Terra-2026
              </div>
              <div
                className="dp-seal dp-seal--ink dp-anim-press"
                style={{ marginTop: "0.6rem" }}
                aria-hidden
              >
                <span className="dp-sc">{paper.masthead}</span>
                {paper.established}
              </div>
            </div>
          </footer>

          <hr className="dp-rule dp-rule--thick" />

          <div className="dp-foot">
            <span>{paper.masthead}</span>
            <span className="dp-folio">— I —</span>
            <span className="dp-oldstyle dp-liga">{paper.issue}</span>
          </div>
        </div>
      </div>
    </>
  )
}
