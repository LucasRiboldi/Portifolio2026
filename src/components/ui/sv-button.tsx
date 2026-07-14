"use client"

/**
 * SvButton — sistema de botões do Design System (identidade Aranhaverso).
 * ------------------------------------------------------------------------
 * Variantes: primary · secondary · ghost · outline · link · fab · icon
 * Estados:   normal · hover · active · focus · disabled · loading
 * Cores:     magenta · cyan · yellow · lime · violet · orange
 *
 * Criatividade: borda comic 3px, hard-shadow (offset sólido), tilt no hover,
 * "press" físico no active, aberração cromática no texto (hover), halftone
 * sutil e spinner de raio-comic para loading. Foco sempre visível (WCAG 2.4.7).
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export type SvColor = "magenta" | "cyan" | "yellow" | "lime" | "violet" | "orange"

const COLOR: Record<SvColor, { bg: string; ink: string }> = {
  magenta: { bg: "var(--sv-magenta)", ink: "#fff" },
  cyan: { bg: "var(--sv-cyan)", ink: "#001b1f" },
  yellow: { bg: "var(--sv-yellow)", ink: "#1a1400" },
  lime: { bg: "var(--sv-lime)", ink: "#0c1a00" },
  violet: { bg: "var(--sv-violet)", ink: "#fff" },
  orange: { bg: "var(--sv-orange)", ink: "#fff" },
}

const buttonVariants = cva(
  // base
  "group/svbtn relative inline-flex select-none items-center justify-center gap-2 " +
    "font-[family-name:var(--font-heavy)] uppercase tracking-wide outline-none " +
    "transition-[transform,box-shadow,filter] duration-[var(--duration-fast)] ease-[var(--ease-spring)] " +
    "focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--sv-cyan)] " +
    "disabled:pointer-events-none disabled:opacity-50 disabled:grayscale " +
    "data-[loading=true]:pointer-events-none data-[loading=true]:cursor-progress",
  {
    variants: {
      variant: {
        primary:
          "border-[3px] border-black text-[var(--btn-ink)] shadow-[var(--elevation-2)] " +
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:rotate-[-1.5deg] hover:shadow-[var(--elevation-4)] " +
          "active:translate-x-0.5 active:translate-y-0.5 active:rotate-0 active:shadow-[var(--elevation-1)]",
        secondary:
          "border-[3px] border-[var(--btn-bg)] bg-transparent text-[var(--btn-bg)] shadow-[var(--elevation-1)] " +
          "hover:-translate-y-0.5 hover:bg-[var(--btn-bg)] hover:text-black hover:shadow-[var(--elevation-3)] " +
          "active:translate-y-0.5 active:shadow-none",
        ghost:
          "border-[3px] border-transparent bg-transparent text-[var(--btn-bg)] " +
          "hover:bg-[color-mix(in_srgb,var(--btn-bg)_16%,transparent)] hover:border-[color-mix(in_srgb,var(--btn-bg)_35%,transparent)] " +
          "active:scale-95",
        outline:
          "border-[3px] border-dashed border-[var(--btn-bg)] bg-transparent text-[var(--btn-bg)] " +
          "hover:border-solid hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)] active:translate-y-0",
        link:
          "border-0 bg-transparent p-0 text-[var(--btn-bg)] underline decoration-[3px] underline-offset-4 " +
          "decoration-[color-mix(in_srgb,var(--btn-bg)_40%,transparent)] " +
          "hover:decoration-[var(--btn-bg)] hover:tracking-wider active:opacity-70",
        fab:
          "aspect-square rounded-full border-[3px] border-black text-[var(--btn-ink)] shadow-[var(--elevation-3)] " +
          "hover:-translate-y-1 hover:rotate-6 hover:shadow-[var(--elevation-5)] active:translate-y-0 active:rotate-0",
        icon:
          "aspect-square border-[3px] border-black text-[var(--btn-ink)] shadow-[var(--elevation-1)] " +
          "hover:-translate-y-0.5 hover:rotate-[-4deg] hover:shadow-[var(--elevation-3)] active:translate-y-0",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-8 text-lg",
      },
      shape: {
        box: "rounded-md",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      { variant: "fab", size: "sm", class: "h-10 w-10 px-0" },
      { variant: "fab", size: "md", class: "h-14 w-14 px-0" },
      { variant: "fab", size: "lg", class: "h-16 w-16 px-0" },
      { variant: "icon", size: "sm", class: "h-8 w-8 px-0" },
      { variant: "icon", size: "md", class: "h-11 w-11 px-0" },
      { variant: "icon", size: "lg", class: "h-14 w-14 px-0" },
    ],
    defaultVariants: { variant: "primary", size: "md", shape: "box" },
  }
)

/** Fundo sólido só nas variantes preenchidas. */
const FILLED = new Set(["primary", "fab", "icon"])

export interface SvButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  color?: SvColor
  isLoading?: boolean
  /** Ícone antes do texto (ou o único filho em icon/fab). */
  icon?: React.ReactNode
  /** onomatopeia flutuante que "estala" no hover (ex.: "POW!"). */
  pop?: string
}

export const SvButton = React.forwardRef<HTMLButtonElement, SvButtonProps>(function SvButton(
  { className, variant = "primary", size, shape, color = "magenta", isLoading, icon, pop, children, disabled, style, ...props },
  ref
) {
  const c = COLOR[color]
  const filled = FILLED.has(variant ?? "primary")

  return (
    <button
      ref={ref}
      data-slot="sv-button"
      data-loading={isLoading || undefined}
      aria-busy={isLoading || undefined}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      style={
        {
          "--btn-bg": c.bg,
          "--btn-ink": c.ink,
          background: filled ? c.bg : undefined,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* onomatopeia pop no hover */}
      {pop && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-3 rotate-6 scale-0 font-[family-name:var(--font-display)] text-sm text-[var(--sv-yellow)] opacity-0 transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)] [-webkit-text-stroke:1px_#000] group-hover/svbtn:scale-100 group-hover/svbtn:opacity-100"
        >
          {pop}
        </span>
      )}

      {isLoading ? (
        <ComicSpinner />
      ) : (
        icon && <span className="grid place-items-center [&_svg]:size-[1.1em]">{icon}</span>
      )}

      {/* texto com leve aberração cromática no hover (só variantes com rótulo) */}
      {children && variant !== "fab" && variant !== "icon" && (
        <span className="relative transition-[text-shadow] duration-[var(--duration-fast)] group-hover/svbtn:[text-shadow:1.5px_0_0_var(--sv-cyan),-1.5px_0_0_var(--sv-magenta)]">
          {children}
        </span>
      )}

      {/* filho cru para icon/fab quando não há prop icon */}
      {!icon && !isLoading && (variant === "fab" || variant === "icon") && (
        <span className="grid place-items-center [&_svg]:size-[1.3em]">{children}</span>
      )}
    </button>
  )
})

/** Spinner de "raio comic" — dois arcos girando em contra-rotação. */
function ComicSpinner() {
  return (
    <span aria-hidden className="relative inline-block size-[1.15em]">
      <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-black/25 border-t-current" />
      <span className="absolute inset-[3px] animate-[spin_0.6s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-current" />
    </span>
  )
}

export { buttonVariants as svButtonVariants }
