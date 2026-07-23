import type { Note } from "@/lib/repos/criativo"
import { ACCENT_VAR, Onoma, type Accent } from "@/components/comic/atoms"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Zone } from "@/components/comic/zone"
import { ZONES } from "@/constants/criativo-landing"

/** Rotações fixas por posição — aleatório em render quebraria a hidratação. */
const TILTS = ["-2.2deg", "1.6deg", "-1.1deg", "2.4deg", "-1.8deg", "1.2deg"]

/**
 * Mural — os recados pregados na parede.
 *
 * Só leitura: quem escreve é o admin. Sem formulário público não há superfície
 * de spam nem fila de moderação para manter.
 *
 * O layout é `columns` e não grid: os bilhetes têm alturas diferentes e o
 * fluxo em coluna encaixa-os como papel colado à mão, sem os buracos que uma
 * grade de linhas iguais deixaria.
 */
export function ZoneMural({ notes }: { notes: Note[] }) {
  return (
    <Zone {...ZONES.mural} panel>
      <RevealGroup as="ul" className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        {notes.map((n, i) => (
          <RevealItem key={n.id} as="li" variants={PANEL_IN} className="break-inside-avoid">
            <article
              className="k-panel relative p-6"
              style={{
                background: ACCENT_VAR[n.accent as Accent] ?? "var(--k-yellow)",
                transform: `rotate(${TILTS[i % TILTS.length]})`,
              }}
            >
              {/* Percevejo. */}
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 size-5 -translate-x-1/2 rounded-full border-[3px] border-[var(--k-ink)] bg-[var(--k-white)] shadow-[2px_2px_0_var(--k-ink)]"
              />

              {n.pinned && (
                <span className="k-kicker mb-2 block text-[9px] text-[var(--k-ink)]/60">Fixado</span>
              )}

              {n.title && <h3 className="k-title text-xl leading-tight text-[var(--k-ink)]">{n.title}</h3>}

              <p className="k-body mt-3 text-sm font-medium leading-relaxed text-[var(--k-ink)]/85">
                {n.body}
              </p>

              <p className="k-sub mt-4 text-[10px] text-[var(--k-ink)]/60">— {n.author}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <Onoma accent="red" className="pointer-events-none absolute right-8 top-24 hidden text-5xl xl:block">
        NOTE!
      </Onoma>
    </Zone>
  )
}
