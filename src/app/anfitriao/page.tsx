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
} from "@/lib/anfitriao-prophet"
import { PressMark } from "@/components/prophet/press-mark"

export const metadata = { title: "Primeira Página" }

/** Campo de imagem da matéria principal — cinza listrado, à espera de arte. */
function BenchPlate() {
  return (
    <div className="dp-plate">
      <div className="dp-placeholder" role="img" aria-label="Campo de imagem" />
    </div>
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
        <h2 className="dp-bighead">{lead.headline}</h2>
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
            <p className="dp-sign">{editorial.sign}</p>
          </div>

          <div className="dp-box">
            <p className="dp-box-title">{boxes.curio.title}</p>
            <ul>
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
                <span>{v}</span>
              </p>
            ))}
          </div>

          <div className="dp-box">
            <p className="dp-box-title">{briefs.title}</p>
            <ul className="dp-briefs">
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
        {reports.map((r) => (
          <article key={r.href} className="dp-report">
            <p className="dp-report-kicker">{r.kicker}</p>
            <h3 className="dp-report-head">{r.head}</h3>
            <p className="dp-report-sub">{r.sub}</p>

            <p className="dp-report-body">
              <span className="dp-cap">{r.dropcap}</span>
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
            {paper.place}
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
          <p className="dp-stamp" aria-hidden>
            Vol. XXVI
          </p>
        </div>
      </footer>

      <div className="dp-foot">
        <span>{paper.masthead}</span>
        <span className="dp-folio">— I —</span>
        <span>{paper.issue}</span>
      </div>
    </div>
  )
}
