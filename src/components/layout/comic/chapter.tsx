import { cn } from "@/lib/utils"
import { Caption } from "@/components/comic/atoms"
import { GlitchTitle, type Treatment } from "@/components/comic/glitch-title"
import { Reveal } from "@/components/comic/reveal"

interface ChapterProps {
  /** Âncora da URL — `#atelie`. */
  id: string
  /** Id do `<h2>`, alvo do `aria-labelledby`. */
  titleId: string
  /** Número do capítulo, em caixa. */
  index: string
  /** "O ateliê" — a etiqueta curta acima da manchete. */
  kicker: string
  title: string
  subtitle?: string
  /** "Terra-616 · Banca" — a assinatura da dimensão. */
  earth?: string
  treatment?: Treatment
  /**
   * Variação de identidade do capítulo: aplica `k-zone--<accentZone>` para o
   * bloco herdar a paleta daquela dimensão. Sem isto o capítulo fica na paleta
   * global — consistente, mas sem a mudança de ar que separa um capítulo do
   * seguinte.
   */
  palette?: string
  children: React.ReactNode
  className?: string
}

/**
 * Capítulo — o agrupador narrativo entre a página e os requadros.
 *
 * Existe para que a landing deixe de ser uma pilha de `<section>` irmãs: o
 * capítulo é o que a câmara persegue, o que a transição de página anuncia e o
 * que dá um ar próprio a um conjunto de quadros sem partir a consistência
 * global (a paleta muda, a grelha e o ritmo não).
 *
 * Server component de propósito. O movimento todo vive no `CameraStage`, que o
 * encontra pelo atributo `data-chapter` — assim um capítulo continua a ser
 * apenas marcação, e a página não paga um client boundary por bloco.
 */
export function Chapter({
  id,
  titleId,
  index,
  kicker,
  title,
  subtitle,
  earth,
  treatment = "3d",
  palette,
  children,
  className,
}: ChapterProps) {
  return (
    <section
      id={id}
      data-chapter={id}
      aria-labelledby={titleId}
      className={cn(
        "cp-chapter cp-halftone k-zone relative overflow-x-clip",
        palette && `k-zone--${palette}`,
        className,
      )}
      style={{ paddingBlock: "var(--cp-chapter-gap)" }}
    >
      <div className="cp-bleed">
        <Reveal as="header" className="relative mb-10 sm:mb-14">
          {/* Número-fantasma: marca a página como um capítulo de revista sem
              ocupar espaço de leitura. */}
          <span
            aria-hidden
            className="k-num k-outline pointer-events-none absolute -top-8 -left-1 select-none text-[5.5rem] leading-none opacity-60 sm:-top-14 sm:text-[9rem]"
          >
            {index}
          </span>

          <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1">
            <Caption>{kicker}</Caption>
            {earth && <span className="k-kicker text-[10px] opacity-60">{earth}</span>}
          </div>

          <GlitchTitle
            as="h2"
            id={titleId}
            treatment={treatment}
            className="mt-5 text-[clamp(2.2rem,8vw,5rem)] leading-[0.9]"
          >
            {title}
          </GlitchTitle>

          {subtitle && (
            <p className="k-body mt-5 max-w-2xl text-base font-medium leading-relaxed opacity-80 sm:text-lg">
              {subtitle}
            </p>
          )}
        </Reveal>

        <div id={`${id}-conteudo`} className="scroll-mt-24">
          {children}
        </div>
      </div>
    </section>
  )
}
