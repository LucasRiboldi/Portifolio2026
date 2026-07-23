import Link from "next/link"
import type { Project } from "@/data/projects"
import { Onoma } from "@/components/comic/atoms"
import { MediaFrame } from "@/components/comic/media-frame"
import { slideIn } from "@/components/comic/motion"
import { Reveal } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { Panel, PanelBody } from "@/components/layout/comic/panel"
import { ZONES } from "@/constants/criativo-landing"

/** Quantos projetos entram na landing antes de mandar para o portfólio. */
const MAX = 4

/**
 * Capítulo 02 · Oficina — sites e componentes, em quadros alternados.
 *
 * Cada peça ocupa uma página dupla e troca o lado da imagem. É mais lento de
 * percorrer que uma galeria, e é esse o objetivo: aqui o visitante deve parar
 * em cada coisa, não varrer miniaturas.
 *
 * O par entra na grelha editorial como 7+5 colunas (e não 6+6): a assimetria é
 * o que impede que a página leia como duas colunas de site. A troca de lado é
 * feita com `order` e não reordenando o array — assim a ordem do DOM segue a de
 * leitura, e quem navega por teclado ou leitor de ecrã encontra sempre a imagem
 * antes do texto que a descreve.
 */
export function ZoneOficina({ projects }: { projects: Project[] }) {
  const { id, ...meta } = ZONES.oficina

  return (
    <Chapter id={id} palette={id} scene="slideL" {...meta}>
      <div className="space-y-16 sm:space-y-24">
        {projects.slice(0, MAX).map((p, i) => {
          const reversed = i % 2 === 1
          const href = p.slug ? `/portfolio/${p.slug}` : (p.href ?? "/portfolio")

          return (
            <article key={p.id} className="cp-grid items-center gap-y-8">
              <Reveal
                variants={slideIn(reversed ? "right" : "left")}
                className="cp-col"
                style={
                  {
                    "--cp-span-l": 7,
                    ...(reversed ? { order: 2 } : null),
                  } as React.CSSProperties
                }
              >
                <Panel
                  as="div"
                  shape={reversed ? "cutBL" : "cutTR"}
                  accent="cyan"
                  lit
                  className="group"
                >
                  <PanelBody bleed>
                    <Link
                      href={href}
                      aria-label={`Abrir ${p.title}`}
                      className="relative block aspect-[16/10] overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--k-cyan)]"
                    >
                      <MediaFrame
                        src={p.coverImage}
                        fallback={p.title}
                        themed
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="absolute inset-0"
                        priority={i === 0}
                      />
                    </Link>
                  </PanelBody>
                </Panel>
              </Reveal>

              <Reveal
                variants={slideIn(reversed ? "left" : "right")}
                className="cp-col"
                style={
                  {
                    "--cp-span-l": 5,
                    ...(reversed ? { order: 1 } : null),
                  } as React.CSSProperties
                }
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
                      <li
                        key={t}
                        className="k-sub border-2 border-current px-3 py-1 text-[11px] opacity-75"
                      >
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
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </article>
          )
        })}
      </div>

      <Onoma
        accent="cyan"
        className="pointer-events-none absolute right-8 top-28 hidden text-5xl xl:block"
      >
        BUILD!
      </Onoma>
    </Chapter>
  )
}
