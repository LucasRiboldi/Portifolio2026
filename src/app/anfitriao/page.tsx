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
} from "@/lib/anfitriao-gazette"
import { PressMark } from "@/components/gazette/press-mark"

export const metadata = { title: "Primeira Página" }

/** Gravura de bancada — desenhada em traço, tratada como litografia via CSS. */
function BenchPlate() {
  return (
    <div className="gz-plate">
      <div className="gz-plate-inner">
        <svg viewBox="0 0 320 200" role="img" aria-label="Gravura da bancada do inventor" className="block w-full">
          <rect width="320" height="200" fill="#c2ae86" />
          {/* Fundo: prateleira e janela */}
          <rect x="0" y="0" width="320" height="118" fill="#b8a377" />
          <rect x="196" y="12" width="104" height="74" fill="#d8c9a4" stroke="#3a3024" strokeWidth="2" />
          <line x1="248" y1="12" x2="248" y2="86" stroke="#3a3024" strokeWidth="2" />
          <line x1="196" y1="49" x2="300" y2="49" stroke="#3a3024" strokeWidth="2" />
          {/* Luz da janela */}
          <path d="M196 86 L300 86 L268 200 L150 200 Z" fill="#e2d5b0" opacity=".45" />
          {/* Bancada */}
          <rect x="0" y="118" width="320" height="12" fill="#5c4a32" />
          <rect x="0" y="130" width="320" height="70" fill="#7a6244" />
          {/* Tabuleiro em cartão cru */}
          <rect x="24" y="86" width="96" height="34" fill="#d8c9a4" stroke="#3a3024" strokeWidth="2" transform="skewY(-4)" />
          <g stroke="#3a3024" strokeWidth="1" opacity=".8">
            <line x1="48" y1="84" x2="48" y2="118" transform="skewY(-4)" />
            <line x1="72" y1="82" x2="72" y2="116" transform="skewY(-4)" />
            <line x1="96" y1="80" x2="96" y2="114" transform="skewY(-4)" />
          </g>
          {/* Meeples enfileirados */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${132 + i * 17}, 92)`} fill="#3a3024">
              <circle cx="6" cy="4" r="4" />
              <path d="M6 9c-3 0-5 2-6 5l3 1 1-2v9h4v-9l1 2 3-1c-1-3-3-5-6-5z" />
            </g>
          ))}
          {/* Dados */}
          <g stroke="#3a3024" strokeWidth="2" fill="#e2d5b0">
            <rect x="216" y="98" width="20" height="20" />
            <rect x="242" y="104" width="14" height="14" />
          </g>
          <g fill="#3a3024">
            <circle cx="222" cy="104" r="1.6" /><circle cx="230" cy="112" r="1.6" />
            <circle cx="249" cy="111" r="1.4" />
          </g>
          {/* Cartas espalhadas */}
          <g stroke="#3a3024" strokeWidth="2" fill="#e8dcbe">
            <rect x="30" y="138" width="26" height="38" transform="rotate(-8 43 157)" />
            <rect x="58" y="142" width="26" height="38" transform="rotate(6 71 161)" />
          </g>
          {/* Faca e régua */}
          <g stroke="#3a3024" strokeWidth="2">
            <line x1="120" y1="168" x2="188" y2="152" />
            <path d="M188 152 l14 -4 -4 10 z" fill="#3a3024" />
            <rect x="212" y="150" width="82" height="10" fill="#d8c9a4" />
          </g>
          {/* Lamparina */}
          <g stroke="#3a3024" strokeWidth="2" fill="#3a3024">
            <path d="M282 118 l10 -22 h-20 z" fill="#5c4a32" />
            <line x1="282" y1="96" x2="282" y2="86" />
            <circle cx="282" cy="82" r="5" fill="#e2d5b0" />
          </g>
          {/* Hachuras de sombra (xilogravura) */}
          <g stroke="#3a3024" strokeWidth="1" opacity=".28">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={i} x1={0 + i * 8} y1="200" x2={40 + i * 8} y2="130" />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}

export default function GazetteFront() {
  return (
    <div className="gz-front">
      {/* ─── Barra de serviço ─── */}
      <div className="gz-service">
        <div>
          <p className="gz-svc-title">{servicebar.weather.title}</p>
          {servicebar.weather.rows.map(([k, v]) => (
            <p key={k} className="gz-svc-row">
              <span>{k}</span>
              <span>{v}</span>
            </p>
          ))}
        </div>
        <div>
          <p className="gz-svc-title">{servicebar.quotes.title}</p>
          {servicebar.quotes.rows.map(([k, v]) => (
            <p key={k} className="gz-svc-row">
              <span>{k}</span>
              <span>{v}</span>
            </p>
          ))}
        </div>
        <div>
          <p className="gz-svc-title">{servicebar.ephemeris.title}</p>
          {servicebar.ephemeris.lines.map((l) => (
            <p key={l} className="gz-svc-line">
              {l}
            </p>
          ))}
        </div>
      </div>

      {/* ─── Manchete principal ─── */}
      <section className="gz-lead">
        <p className="gz-kicker">{lead.kicker}</p>
        <h2 className="gz-bighead">{lead.headline}</h2>
        <p className="gz-subhead">{lead.subhead}</p>
        <p className="gz-byline">
          <b>{lead.byline}</b> · {lead.bylineRole} · {lead.dateline}
        </p>
      </section>

      <hr className="gz-rule--double" />

      {/* ─── Grelha editorial: coluna esquerda / miolo / coluna direita ─── */}
      <div className="gz-grid">
        {/* Coluna esquerda — editorial, curiosidades, anúncio */}
        <div className="gz-col">
          <div className="gz-editorial">
            <p className="gz-kicker">{editorial.title}</p>
            <h3>{editorial.headline}</h3>
            <hr className="gz-rule--hair" />
            {editorial.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="gz-sign">
              <Link href={editorial.href} className="gz-press">
                {editorial.sign}
              </Link>
            </p>
          </div>

          <div className="gz-box">
            <p className="gz-box-title">{boxes.curio.title}</p>
            <ul>
              {boxes.curio.items.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="gz-ad">
            <p className="gz-ad-head">{ads[0].head}</p>
            <p>{ads[0].body}</p>
            <p className="gz-ad-sign">{ads[0].sign}</p>
          </div>

          <div className="gz-orn" aria-hidden>
            ❦ ❧ ❦
          </div>
        </div>

        {/* Miolo — gravura + texto corrido em colunas */}
        <div className="gz-col">
          <figure className="gz-figure">
            <BenchPlate />
            <figcaption className="gz-figcaption">{lead.caption}</figcaption>
          </figure>

          <p className="gz-subhead" style={{ maxWidth: "none", textAlign: "left" }}>
            {lead.standfirst}
          </p>

          <div className="gz-lead-body">
            <p>
              <span className="gz-cap">{lead.dropcap}</span>
              {lead.openLine}
            </p>
            {lead.bodyBefore.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <blockquote className="gz-pull">{lead.pullquote}</blockquote>
            {lead.bodyAfter.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <hr className="gz-rule" />

          <div className="gz-orn" aria-hidden>
            ✦ · ✦ · ✦
          </div>
        </div>

        {/* Coluna direita (rail) — números, índice técnico, telegramas, anúncios */}
        <div className="gz-col gz-col--rail">
          <div className="gz-box gz-box--heavy">
            <p className="gz-box-title">{boxes.numbers.title}</p>
            {boxes.numbers.rows.map(([k, v]) => (
              <p key={k} className="gz-kv">
                <b>{k}</b>
                <span>{v}</span>
              </p>
            ))}
          </div>

          <div className="gz-box">
            <p className="gz-box-title">{briefs.title}</p>
            <ul className="gz-briefs">
              {briefs.items.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="gz-box">
            <p className="gz-box-title">{boxes.grimoire.title}</p>
            {boxes.grimoire.items.map((t) => (
              <p key={t.term} className="gz-term">
                <b>{t.term}</b> — <em>{t.note}</em>
              </p>
            ))}
          </div>

          <div className="gz-ad">
            <p className="gz-ad-head">{ads[1].head}</p>
            <p>{ads[1].body}</p>
            <p className="gz-ad-sign">{ads[1].sign}</p>
          </div>

          <div className="gz-box">
            <p className="gz-box-title">{boxes.tip.title}</p>
            <p>{boxes.tip.body}</p>
          </div>

          <div className="gz-ad">
            <p className="gz-ad-head">{ads[2].head}</p>
            <p>{ads[2].body}</p>
            <p className="gz-ad-sign">{ads[2].sign}</p>
          </div>

          <p className="gz-stamp" aria-hidden>
            Impresso
            <br />
            nesta casa
          </p>
        </div>
      </div>

      {/* ─── Matérias secundárias ─── */}
      <div className="gz-reports">
        {reports.map((r) => (
          <article key={r.href} className="gz-report">
            <p className="gz-report-kicker">{r.kicker}</p>
            <h3 className="gz-report-head">{r.head}</h3>
            <p className="gz-report-sub">{r.sub}</p>

            {r.chart && (
              <svg className="gz-chart" viewBox="0 0 140 62" role="img" aria-label="Índice de raridade em queda">
                <text x="2" y="7">DECRÉSCIMO ANUAL</text>
                <line x1="14" y1="12" x2="14" y2="54" />
                <line x1="14" y1="54" x2="136" y2="54" />
                <polyline points="16,20 44,26 64,24 88,38 110,46 134,52" />
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
                  <text key={i} x={17 + i * 10} y="60">
                    {m}
                  </text>
                ))}
              </svg>
            )}

            <p className="gz-report-body">
              <span className="gz-cap">{r.dropcap}</span>
              {r.body}
            </p>
            <p className="gz-report-note">{r.note}</p>

            <Link href={r.href} className="gz-more">
              {r.cta} <b>{r.page}</b>
            </Link>
          </article>
        ))}
      </div>

      {/* ─── Índice desta edição (menu incorporado) ─── */}
      <nav className="gz-index" aria-label="Índice desta edição">
        {index.map((i) => (
          <Link key={i.label} href={i.href} className="gz-index-item">
            <span>{i.label}</span>
            <span className="gz-index-dots" aria-hidden />
            <b>{i.page}</b>
          </Link>
        ))}
      </nav>

      {/* ─── Expediente (abriga o acesso administrativo) ─── */}
      <footer className="gz-colophon">
        <div>
          <p className="gz-box-title">{colophon.title}</p>
          {colophon.lines.map(([k, v]) => (
            <p key={k} className="gz-kv">
              <b>{k}</b>
              <span>{v}</span>
            </p>
          ))}
          <p className="gz-kv">
            <b>{colophon.pressLabel}</b>
            <span>
              <PressMark label={colophon.pressValue} />
            </span>
          </p>
        </div>

        <div>
          <p className="gz-box-title">Aviso aos Leitores</p>
          <p className="gz-notice">{colophon.notice}</p>
          <div className="gz-orn" aria-hidden>
            ❦
          </div>
          <p className="gz-notice" style={{ textAlign: "center" }}>
            {paper.place}
          </p>
        </div>

        <div>
          <p className="gz-box-title">Marcas de Registro</p>
          <p className="gz-kv">
            <b>Edição</b>
            <span>{colophon.registry}</span>
          </p>
          <p className="gz-kv">
            <b>Fecho</b>
            <span>à meia-noite</span>
          </p>
          <p className="gz-stamp" aria-hidden>
            Vol. XXVI
          </p>
        </div>
      </footer>

      <div className="gz-foot">
        <span>{paper.masthead}</span>
        <span className="gz-folio">— I —</span>
        <span>{paper.issue}</span>
      </div>
    </div>
  )
}
