import type { Note } from "@/lib/repos/criativo"
import { ACCENT_VAR, Onoma, type Accent } from "@/components/comic/atoms"
import { PANEL_IN } from "@/components/comic/motion"
import { RevealGroup, RevealItem } from "@/components/comic/reveal"
import { Chapter } from "@/components/layout/comic/chapter"
import { ZONES } from "@/constants/criativo-landing"

/** Rotações fixas por posição — aleatório em render quebraria a hidratação. */
const TILTS = ["-2.2deg", "1.6deg", "-1.1deg", "2.4deg", "-1.8deg", "1.2deg"]

/**
 * Mural — os recados pregados na parede.
 *
 * Só leitura: quem escreve é o admin. Sem formulário público não há superfície
 * de spam nem fila de moderação para manter.
 *
 * Único capítulo que não usa a grelha editorial nem o `Panel`, e de propósito:
 * um bilhete não é um requadro. O fluxo em `columns` encaixa alturas desiguais
 * como papel colado à mão, sem os buracos que uma grade de linhas iguais
 * deixaria, e o percevejo com a rotação já dá a moldura que o `Panel` daria.
 */
export function ZoneMural({ notes }: { notes: Note[] }) {
  const { id, ...meta } = ZONES.mural

  /**
   * O mural sem bilhetes.
   *
   * Estava a render um capítulo com cabeçalho, onomatopeia e NADA por baixo —
   * uma página em branco no meio da revista, e a mais curta de todas (868px
   * contra 2792 da Oficina). Um vazio desses não se lê como pausa: lê-se como
   * secção que não carregou.
   *
   * A saída não é esconder o capítulo. Numa revista, o espaço reservado que
   * ficou sem matéria recebe uma nota da redação — e aqui a nota cabe no
   * próprio universo: um bilhete pregado a dizer que o mural está vazio. O
   * leitor continua a ver a parede, a página mantém o ritmo, e a ausência
   * passa a ser texto em vez de buraco.
   */
  if (notes.length === 0) {
    return (
      <Chapter id={id} palette={id} scene="pop" {...meta}>
        <div className="flex justify-center py-6">
          <article
            className="k-panel relative max-w-md p-8 text-center"
            style={{ background: "var(--k-yellow)", transform: `rotate(${TILTS[0]})` }}
          >
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 size-5 -translate-x-1/2 rounded-full border-[3px] border-[var(--k-ink)] bg-[var(--k-white)] shadow-[2px_2px_0_var(--k-ink)]"
            />
            <p className="k-title text-2xl leading-tight text-[var(--k-ink)]">
              A parede está limpa
            </p>
            <p className="k-body mt-3 text-sm font-medium leading-relaxed text-[var(--k-ink)]/85">
              Ninguém pregou recado nenhum ainda. Quando pregar, aparece aqui — com
              percevejo e tudo.
            </p>
            <p className="k-sub mt-5 text-[10px] text-[var(--k-ink)]/60">— a administração</p>
          </article>
        </div>
      </Chapter>
    )
  }

  return (
    <Chapter id={id} palette={id} scene="pop" {...meta}>
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

      {/* Acima da primeira fila, e não sobre ela: aqui os quadros são bilhetes
          de texto: nas outras dimensões a onomatopeia cai sobre uma imagem e
          não estorva, mas por cima de um recado tapa o que está escrito. */}
      <Onoma accent="red" className="pointer-events-none absolute -top-14 right-8 hidden text-5xl xl:block">
        NOTE!
      </Onoma>
    </Chapter>
  )
}
