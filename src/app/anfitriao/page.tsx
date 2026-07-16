import Link from "next/link"

import { frontPage as fp } from "@/lib/arcane-content"
import { InkScramble } from "@/components/prophet/ink-scramble"
import { LivingPortrait } from "@/components/prophet/living-portrait"

export const metadata = { title: "Primeira Página" }

export default function ProphetFront() {
  return (
    <div className="pr-front">
      {/* ─── Barra de informações ─── */}
      <div className="pr-infobar">
        <Link href="/anfitriao/oficina" className="pr-bounty">
          <span className="pr-bounty-amt">
            {fp.bounty.amount}
            <small>{fp.bounty.unit}</small>
          </span>
          <span className="pr-bounty-txt">
            <b>{fp.bounty.target}</b>
            <em>{fp.bounty.note}</em>
          </span>
        </Link>

        <div className="pr-info-cell">
          <p className="pr-info-title">{fp.weather.title}</p>
          {fp.weather.rows.map(([k, v]) => (
            <p key={k} className="pr-info-row">
              <span>{k}</span>
              <span>{v}</span>
            </p>
          ))}
        </div>

        <div className="pr-info-cell">
          <p className="pr-info-title">{fp.aspects.title}</p>
          {fp.aspects.lines.map((l) => (
            <p key={l} className="pr-info-row pr-info-row--single">
              {l}
            </p>
          ))}
        </div>

        <div className="pr-info-cell pr-info-cell--edition">
          <p className="pr-info-title">{fp.edition.label}</p>
          <p className="pr-info-row--single">{fp.edition.number}</p>
          <p className="pr-info-row--single">{fp.edition.place}</p>
          <p className="pr-info-row--single">{fp.edition.sign}</p>
          <span className="pr-price">{fp.edition.price}</span>
        </div>
      </div>

      {/* ─── Manchetão / herói ─── */}
      <section className="pr-hero">
        <span className="pr-side pr-side-l" aria-hidden>
          {fp.hero.sideLeft}
        </span>
        <span className="pr-side pr-side-r" aria-hidden>
          {fp.hero.sideRight}
        </span>

        <p className="pr-kicker pr-hero-kicker">{fp.hero.kicker}</p>
        <h2 className="pr-bighead">
          <InkScramble text={fp.hero.headline} />
        </h2>

        <div className="pr-hero-body">
          <p className="pr-hero-col pr-cap-wrap">
            <span className="pr-cap">O</span>
            {" "}jogo começa com uma pergunta: o que o jogador vai sentir ao arriscar?
            Dela nasce a mecânica — a peça, a carta, o dado — e só depois a temática
            que a veste. Aqui o processo é inverso ao de um layout: primeiro o verbo,
            depois o adjetivo.
          </p>

          <figure className="pr-hero-figure">
            <LivingPortrait caption={fp.hero.caption} />
            <p className="pr-hero-stand">{fp.hero.standfirst}</p>
          </figure>

          <p className="pr-hero-col pr-cap-wrap">
            <span className="pr-cap">N</span>
            os últimos ciclos, o estúdio prototipou economias de recursos, deckbuilding
            e loops de decisão tensa — sempre testando na mesa antes de qualquer arte.
            O objetivo é que a regra desapareça e reste apenas a história que os
            jogadores levam para casa.
          </p>
        </div>
      </section>

      <hr className="pr-rule pr-rule-thick" />

      {/* ─── Matérias (seções reais, com botão incorporado) ─── */}
      <div className="pr-reports">
        <article className="pr-report pr-report--lead">
          <h3 className="pr-report-head">
            {fp.darkForces.dropTitle} <em>{fp.darkForces.title}</em>
          </h3>
          <p className="pr-cap-wrap">
            <span className="pr-cap">S</span>
            {fp.darkForces.body}
          </p>
        </article>

        {fp.reports.map((r) => (
          <article key={r.href} className="pr-report">
            {r.kicker && <p className="pr-kicker">{r.kicker}</p>}
            <h3 className="pr-report-head">{r.title}</h3>

            {r.chart && (
              <svg className="pr-chart" viewBox="0 0 140 62" role="img" aria-label="Queda de preços">
                <text x="2" y="8" className="pr-chart-cap">DECRÉSCIMO ANUAL</text>
                <line x1="14" y1="12" x2="14" y2="54" />
                <line x1="14" y1="54" x2="136" y2="54" />
                <polyline points="16,20 44,26 64,24 88,38 110,46 134,52" />
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => (
                  <text key={i} x={18 + i * 10} y="61" className="pr-chart-x">
                    {m}
                  </text>
                ))}
              </svg>
            )}

            <p className="pr-cap-wrap">
              <span className="pr-cap">{r.dropcap}</span>
              {r.body}
            </p>

            <Link href={r.href} className="pr-fullreport">
              {r.cta} <b>{r.page}</b> <span aria-hidden>→</span>
            </Link>
          </article>
        ))}
      </div>

      {/* ─── Índice inferior = menu incorporado ─── */}
      <nav className="pr-index" aria-label="Índice desta edição">
        {fp.index.map((i) => (
          <Link key={i.href} href={i.href} className="pr-index-item">
            <span>{i.label}</span>
            <b>{i.page}</b>
          </Link>
        ))}
      </nav>
    </div>
  )
}
