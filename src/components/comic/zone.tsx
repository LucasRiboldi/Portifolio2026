import { cn } from "@/lib/utils"
import { Burst, Caption, ComicButton, InkDivider, SpeedLines } from "./atoms"
import { GlitchTitle, type Treatment } from "./glitch-title"
import { Reveal } from "./reveal"

/**
 * CR-L1 · Intensidade do corte diagonal por dimensão (px). Faixas mais
 * "faladas" cortam mais fundo; as sóbrias quase reto. Cai no default de
 * `--nxb-cut` (22px) para quem não estiver no mapa.
 */
const ZONE_CUT: Partial<Record<string, number>> = {
  atelie: 30,
  oficina: 14,
  banca: 20,
  cine: 34,
  radio: 40,
  videoteca: 26,
  mural: 12,
  tirinhas: 24,
}

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
  /**
   * Cabeçalho em "painel de dimensão": número em caixa, título gigante sobre
   * a paleta viva da zona, retícula/speed-lines e botão Explorar — o visual da
   * capa multiverso. Sem isto, o cabeçalho clássico (mais sóbrio).
   */
  panel?: boolean
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
  panel = false,
}: ZoneProps) {
  // Alterna o corte diagonal e o lado do texto a cada faixa (par vira à direita)
  // — é o "desalinho" da página de quadrinho montada à mão.
  const flip = Number(index) % 2 === 0

  if (panel) {
    return (
      <section id={id} aria-labelledby={titleId} className={cn("k-zone relative overflow-x-clip", `k-zone--${id}`, className)}>
        <header
          className={cn("nxb k-grain", flip && "nxb--flip")}
          style={ZONE_CUT[id] ? ({ "--nxb-cut": `${ZONE_CUT[id]}px` } as React.CSSProperties) : undefined}
        >
          {/* Número-fantasma gigante ao fundo + retícula da impressão. */}
          <span aria-hidden className="nxb__ghost">{index}</span>
          <span aria-hidden className="nxb__dots" />
          <SpeedLines x={flip ? 20 : 82} y={26} color="rgba(18,16,14,0.12)" />

          {/* Selo de dimensão no lado "arte" (oposto ao texto). */}
          <Burst
            accent="yellow"
            className={cn(
              "nxb__seal absolute top-8 hidden size-28 rotate-12 lg:flex",
              flip ? "left-10" : "right-10",
            )}
          >
            <span className="k-title max-w-[74%] text-[11px] leading-tight">{earth}</span>
          </Burst>

          <Reveal className={cn("nxb__inner flex flex-col gap-5", flip ? "items-end" : "items-start")}>
            <span aria-hidden className="nxb__num text-5xl sm:text-7xl">
              {index}
            </span>

            <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", flip && "justify-end")}>
              <Caption>{kicker}</Caption>
              <span className="k-kicker text-[10px] opacity-70">{earth}</span>
            </div>

            <GlitchTitle
              as="h2"
              id={titleId}
              treatment={treatment}
              className="nxb__title text-[clamp(2.6rem,11vw,6.5rem)] leading-[0.86]"
            >
              {title}
            </GlitchTitle>

            {subtitle && (
              <p className="k-body max-w-xl text-base font-medium leading-relaxed opacity-90 sm:text-lg">
                {subtitle}
              </p>
            )}

            <ComicButton href={`#${id}-conteudo`}>Explorar ↓</ComicButton>
          </Reveal>
        </header>

        <div
          id={`${id}-conteudo`}
          className="mx-auto max-w-container scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          {children}
        </div>

        <InkDivider className="absolute inset-x-0 bottom-0" />
      </section>
    )
  }

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "k-zone k-grain relative overflow-x-clip px-4 py-24 sm:px-6 sm:py-32 lg:px-8",
        `k-zone--${id}`,
        className,
      )}
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

        <div id={`${id}-conteudo`} className="scroll-mt-24">
          {children}
        </div>
      </div>

      <InkDivider className="absolute inset-x-0 bottom-0" />
    </section>
  )
}
