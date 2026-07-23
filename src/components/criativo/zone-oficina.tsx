import Link from "next/link"
import type { Project } from "@/data/projects"
import { Onoma } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { slideIn } from "@/components/comic/motion"
import { Reveal } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"

/** Quantos projetos entram na landing antes de mandar para o portfólio. */
const MAX = 4

/**
 * Oficina — sites e componentes, em blocos alternados.
 *
 * Cada peça ocupa a largura toda e troca o lado da imagem. É mais lento de
 * percorrer que uma grade, e é esse o objetivo: aqui o visitante deve parar em
 * cada coisa, não varrer miniaturas.
 */
export function ZoneOficina({ projects }: { projects: Project[] }) {
  return (
    <Zone {...ZONES.oficina} panel>
      <div className="space-y-16 sm:space-y-24">
        {projects.slice(0, MAX).map((p, i) => {
          const reversed = i % 2 === 1
          const href = p.slug ? `/portfolio/${p.slug}` : (p.href ?? "/portfolio")

          return (
            <article key={p.id} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
              <Reveal
                variants={slideIn(reversed ? "right" : "left")}
                className={reversed ? "lg:order-2" : undefined}
              >
                <Link
                  href={href}
                  aria-label={`Abrir ${p.title}`}
                  className="group k-panel k-cut-tr relative block aspect-[16/10] overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--k-cyan)]"
                >
                  <MediaFrame
                    src={p.coverImage}
                    fallback={p.title}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="absolute inset-0"
                    priority={i === 0}
                  />
                </Link>
              </Reveal>

              <Reveal
                variants={slideIn(reversed ? "left" : "right")}
                className={reversed ? "lg:order-1" : undefined}
              >
                <span className="k-kicker text-[10px] text-[var(--k-cyan)]">
                  {`Peça ${String(i + 1).padStart(2, "0")} · ${p.category}`}
                </span>

                <h3 className="k-title k-letter mt-4 text-3xl sm:text-5xl">{p.title}</h3>

                <p className="k-body mt-5 max-w-lg text-sm leading-relaxed opacity-80 sm:text-base">
                  {p.description}
                </p>

                {p.tags.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tecnologias">
                    {p.tags.map((t) => (
                      <li key={t} className="k-sub border-2 border-current px-3 py-1 text-[11px] opacity-75">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={href}
                  className="k-sub group mt-8 inline-flex items-center gap-2 text-sm text-[var(--k-lime)]"
                >
                  Abrir
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Reveal>
            </article>
          )
        })}
      </div>

      <Onoma accent="cyan" className="pointer-events-none absolute right-8 top-28 hidden text-5xl xl:block">
        BUILD!
      </Onoma>
    </Zone>
  )
}
