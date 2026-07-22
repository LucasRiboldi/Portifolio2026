import { cn } from "@/lib/utils"
import { Caption, InkDivider } from "./atoms"
import { GlitchTitle, type Treatment } from "./glitch-title"
import { Reveal } from "./reveal"

/** As dimensões da landing. Cada uma tem paleta própria em `comic-2026.css`. */
export type ZoneId =
  | "multiverso"
  | "atelie"
  | "oficina"
  | "banca"
  | "cine"
  | "radio"
  | "videoteca"
  | "mural"
  | "tirinhas"

interface ZoneProps {
  id: ZoneId
  /** Âncora e alvo do `aria-labelledby` — o id do `<h2>` da zona. */
  titleId: string
  /** "Terra-XXX" — a assinatura da dimensão, no canto da legenda. */
  earth: string
  kicker: string
  title: string
  subtitle?: string
  /** Tratamento da manchete; o glitch é para uma ou duas zonas, não todas. */
  treatment?: Treatment
  index: string
  children: React.ReactNode
  className?: string
}

/**
 * Uma zona da landing = uma dimensão do multiverso.
 *
 * O wrapper carrega a paleta (`k-zone--*`), o cabeçalho e o separador de tinta
 * que fecha o bloco. Centralizar isto aqui é o que garante que uma zona nova
 * herde o ritmo inteiro — cabeçalho, numeração, retícula e fecho — em vez de
 * cada seção reinventar o seu.
 */
export function Zone({
  id,
  titleId,
  earth,
  kicker,
  title,
  subtitle,
  treatment = "3d",
  index,
  children,
  className,
}: ZoneProps) {
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("k-zone k-grain relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8", `k-zone--${id}`, className)}
    >
      <div className="mx-auto max-w-container">
        <Reveal as="header" className="relative mb-12 sm:mb-16">
          <span
            aria-hidden
            className="k-num k-outline pointer-events-none absolute -top-10 -left-1 select-none text-[6rem] leading-none sm:-top-16 sm:text-[10rem]"
          >
            {index}
          </span>

          <div className="relative flex flex-wrap items-center gap-3">
            <Caption>{kicker}</Caption>
            <span className="k-kicker text-[10px] opacity-60">{earth}</span>
          </div>

          <GlitchTitle
            as="h2"
            id={titleId}
            treatment={treatment}
            className="mt-6 text-4xl sm:text-6xl lg:text-7xl"
          >
            {title}
          </GlitchTitle>

          {subtitle && (
            <p className="k-body mt-6 max-w-2xl text-base font-medium leading-relaxed opacity-80 sm:text-lg">
              {subtitle}
            </p>
          )}
        </Reveal>

        {children}
      </div>

      {/* Fecha a dimensão: a próxima zona começa com outra paleta. */}
      <InkDivider className="absolute inset-x-0 bottom-0" />
    </section>
  )
}
