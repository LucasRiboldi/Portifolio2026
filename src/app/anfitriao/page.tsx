import Link from "next/link"

import { leadArticle } from "@/lib/arcane-content"
import { getTutorials, getMechanics, getPrototypes } from "@/lib/repos/prophet"
import { InkScramble } from "@/components/prophet/ink-scramble"
import { LivingPortrait } from "@/components/prophet/living-portrait"
import { LottieOrb } from "@/components/prophet/lottie-orb"

export const metadata = { title: "Primeira Página" }

export default async function ProphetFront() {
  const [tutorials, mechanics, prototypes] = await Promise.all([
    getTutorials(),
    getMechanics(),
    getPrototypes(),
  ])

  return (
    <div>
      {/* Matéria de capa */}
      <article>
        <p className="pr-kicker">{leadArticle.kicker}</p>
        <h2 className="pr-headline">
          <InkScramble text={leadArticle.headline} />
        </h2>
        <p className="pr-stand">{leadArticle.standfirst}</p>
        {leadArticle.byline && <p className="pr-byline">{leadArticle.byline}</p>}
        <LivingPortrait caption="Coruja-correio sobrevoa o castelo ao anoitecer" />
        <LottieOrb />
        <div className="pr-columns">
          {leadArticle.body.map((p, i) => (
            <p key={i} className={i === 0 ? "pr-dropcap" : undefined} style={{ marginBottom: "0.75rem" }}>
              {p}
            </p>
          ))}
        </div>
      </article>

      <hr className="pr-rule" />

      {/* Últimas publicações por editoria */}
      <section>
        <p className="pr-kicker">Novidades desta edição</p>
        <div className="pr-grid">
          {tutorials.slice(0, 3).map((t) => (
            <Link key={t.id} href="/anfitriao/oficina" className="pr-card">
              <span className="pr-badge">Oficina</span>
              <h3 className="mt-2">{t.title}</h3>
              <p>{t.summary}</p>
            </Link>
          ))}
          {mechanics.slice(0, 3).map((m) => (
            <Link key={m.id} href="/anfitriao/mecanicas" className="pr-card">
              <span className="pr-badge">Mecânica</span>
              <h3 className="mt-2">{m.title}</h3>
              <p>{m.summary}</p>
            </Link>
          ))}
          {prototypes.slice(0, 2).map((p) => (
            <Link key={p.id} href="/anfitriao/laboratorio" className="pr-card">
              <span className="pr-badge">Laboratório</span>
              <h3 className="mt-2">{p.title}</h3>
              <p>{p.description}</p>
            </Link>
          ))}
        </div>
        {tutorials.length + mechanics.length + prototypes.length === 0 && (
          <p className="pr-empty">A gráfica ainda está compondo esta edição…</p>
        )}
      </section>
    </div>
  )
}
