import Link from "next/link"

import {
  paper,
  servicebar,
  lead,
  editorial,
  reports,
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

export const metadata = { title: "Primeira Página" }

/**
 * A folha consumindo o próprio Design System.
 * ---------------------------------------------------------------------
 * Uma auditoria (classes definidas em daily-prophet*.css × classes usadas
 * aqui) mostrou que esta página usava 51% do sistema que o guia documenta.
 * A metade ausente era justamente a camada de interface — botões, campos,
 * selo, tabela, assinatura, marcadores e recursos de fonte —, escrita depois
 * de a página existir.
 *
 * O critério para trazer cada peça NÃO foi cobrir o catálogo. Foi ser
 * editorialmente legítimo numa primeira página: cupom de assinatura, quadro
 * de cotações e gravura de tiragem existiam de verdade no impresso.
 *
 * Ficaram deliberadamente de fora, com motivo:
 *   .dp-tabs        — papel não troca de caderno; aba é gesto de tela.
 *   .dp-btn--danger — não há ação destrutiva numa folha que se lê.
 *   .dp-error       — estado de validação estático seria cenário, não peça.
 *   .dp-crest/-amp  — pertencem ao masthead, que vive no layout.
 * Cobrir 100% aqui exigiria contrabandear gestos de tela para dentro do
 * papel, que é exatamente o que a seção 08.1 do guia proíbe.
 */

/** Campo de imagem da matéria principal — cinza listrado, à espera de arte. */
function BenchPlate() {
  return (
    <div className="dp-plate">
      <div className="dp-plate-inner">
        <div className="img-frame img-wide img-empty" role="img" aria-label="Campo de imagem" />
      </div>
    </div>
  )
}

/** O cupom — a peça que traz a camada de formulário para a folha. */
function Coupon() {
  return (
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
        <input id="cp-nome" name="nome" className="dp-input" placeholder={coupon.fields.name.placeholder} />
      </div>

      <div className="dp-field">
        <label className="dp-label" data-required="true" htmlFor="cp-praca">
          {coupon.fields.place.label}
        </label>
        <input id="cp-praca" name="praca" className="dp-input" placeholder={coupon.fields.place.placeholder} />
      </div>

      <fieldset className="dp-field" style={{ border: 0, padding: 0, margin: "0 0 0.85rem" }}>
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

      <fieldset className="dp-field" style={{ border: 0, padding: 0, margin: "0 0 0.85rem" }}>
        <legend className="dp-label">{coupon.extras.legend}</legend>
        {coupon.extras.options.map((o) => (
          <label key={o.id} className="dp-choice">
            <input type="checkbox" name={o.id} className="dp-check" defaultChecked={o.default} />
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
  )
}

/**
 * O quadro de playtests — três colunas, porque quatro transbordavam a coluna
 * estreita (250px numa caixa de 220). A coluna de nota usa `.num`, que traz
 * algarismo tabular: em tabela as casas precisam encaixar na vertical.
 */
function PlaytestTable() {
  return (
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
  )
}

/** A gravura de dados — traço de nanquim, sem cor, com rótulo por extenso. */
function CirculationChart() {
  return (
    <figure className="dp-figure">
      <svg className="dp-chart" viewBox="0 0 200 84" role="img" aria-label={circulation.aria}>
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
  )
}

export default function DailyProphetFront() {
  return (
    <div className="dp-front">
      {/* ─── Barra de serviço ─── */}
      <div className="dp-service">
        <div>
          <p className="dp-svc-title">{servicebar.weather.title}</p>
          {servicebar.weather.rows.map(([k, v]) => (
            <p key={k} className="dp-svc-row">
              <span>{k}</span>
              <span>{v}</span>
            </p>
          ))}
        </div>
        <div>
          <p className="dp-svc-title">{servicebar.quotes.title}</p>
          {servicebar.quotes.rows.map(([k, v]) => (
            <p key={k} className="dp-svc-row">
              <span>{k}</span>
              <span>{v}</span>
            </p>
          ))}
        </div>
        <div>
          <p className="dp-svc-title">{servicebar.ephemeris.title}</p>
          {servicebar.ephemeris.lines.map((l) => (
            <p key={l} className="dp-svc-line">
              {l}
            </p>
          ))}
        </div>
      </div>

      {/* ─── Manchete principal ─── */}
      <section className="dp-lead">
        <p className="dp-kicker">{lead.kicker}</p>
        <h2 className="dp-bighead dp-anim-settle">{lead.headline}</h2>
        <p className="dp-subhead">{lead.subhead}</p>
        <p className="dp-byline">
          <b>{lead.byline}</b> · {lead.bylineRole} · {lead.dateline}
        </p>
      </section>

      <hr className="dp-rule--double" />

      {/* ─── Grelha editorial: coluna esquerda / miolo / coluna direita ─── */}
      <div className="dp-grid">
        {/* Coluna esquerda — editorial, curiosidades, anúncio */}
        <div className="dp-col">
          <div className="dp-editorial">
            <p className="dp-kicker">{editorial.title}</p>
            <h3>{editorial.headline}</h3>
            <hr className="dp-rule--hair" />
            {editorial.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="dp-signature">
              <p className="dp-autograph">{signature.autograph}</p>
              <div className="dp-signature-line">
                <p className="dp-signature-name">{signature.name}</p>
                <p className="dp-signature-role">{signature.role}</p>
              </div>
            </div>
          </div>

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

          <PlaytestTable />

          <Coupon />

          <div className="dp-orn" aria-hidden>
            ❦ ❧ ❦
          </div>
        </div>

        {/* Miolo — gravura + texto corrido em colunas */}
        <div className="dp-col">
          <figure className="dp-figure">
            <BenchPlate />
            <figcaption className="dp-figcaption">{lead.caption}</figcaption>
          </figure>

          <p className="dp-subhead" style={{ maxWidth: "none", textAlign: "left" }}>
            {lead.standfirst}
          </p>

          <div className="dp-lead-body">
            <p>
              <span className="dp-cap">{lead.dropcap}</span>
              {lead.openLine}
            </p>
            {lead.bodyBefore.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <blockquote className="dp-pull">{lead.pullquote}</blockquote>
            {lead.bodyAfter.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <hr className="dp-rule" />

          <CirculationChart />

          <div className="dp-orn" aria-hidden>
            ✦ · ✦ · ✦
          </div>
        </div>

        {/* Coluna direita (rail) — números, índice técnico, telegramas, anúncios */}
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
            <p className="dp-ad-head">{ads[1].head}</p>
            <p>{ads[1].body}</p>
            <p className="dp-ad-sign">{ads[1].sign}</p>
          </div>

          <div className="dp-box">
            <p className="dp-box-title">{boxes.tip.title}</p>
            <p>{boxes.tip.body}</p>
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

      {/* ─── Matérias secundárias ─── */}
      <div className="dp-reports">
        {reports.map((r, i) => (
          <article key={r.href} className="dp-report">
            <p className="dp-report-kicker">
              <span className="dp-tag">{r.kicker}</span>
            </p>
            <h3 className="dp-report-head">{r.head}</h3>
            <p className="dp-report-sub">{r.sub}</p>

            <p className="dp-report-body">
              {/* A primeira matéria abre com inicial em caixa; as outras com a
                  capitular solta. É a distinção que a matéria 09.12 do guia
                  documenta — uma por matéria, e a caixa é a de abertura. */}
              <span className={i === 0 ? "dp-initial dp-initial--ornate" : "dp-cap"}>
                {r.dropcap}
              </span>
              {r.body}
            </p>
            <p className="dp-report-note">{r.note}</p>

            <Link href={r.href} className="dp-more">
              {r.cta} <b>{r.page}</b>
            </Link>
          </article>
        ))}
      </div>

      {/* ─── Índice desta edição (menu incorporado) ─── */}
      <nav className="dp-index" aria-label="Índice desta edição">
        {index.map((i) => (
          <Link key={i.label} href={i.href} className="dp-index-item">
            <span>{i.label}</span>
            <span className="dp-index-dots" aria-hidden />
            <b>{i.page}</b>
          </Link>
        ))}
      </nav>

      {/* ─── Expediente (abriga o acesso administrativo) ─── */}
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
          <div className="dp-seal dp-seal--ink dp-anim-press" style={{ marginTop: "0.6rem" }} aria-hidden>
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
  )
}
