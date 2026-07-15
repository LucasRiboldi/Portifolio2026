"use client"

/**
 * SvChoice — controles de seleção do Design System (Design System).
 * ------------------------------------------------------------------------
 * SvCheckbox · SvRadio (+SvRadioGroup) · SvSwitch · SvRating · SvSlider
 *
 * Criatividade: check que "carimba" (pop spring), radio em burst, switch com
 * hard-shadow que desliza, estrelas que estalam, slider com polegar comic.
 * Acessível: inputs nativos ocultos (peer) preservam teclado/foco/leitores.
 */

import * as React from "react"
import { Check, Star } from "lucide-react"
import { cn } from "@/lib/utils"

/* ---------------- Checkbox ---------------- */
export interface SvCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode
}
export const SvCheckbox = React.forwardRef<HTMLInputElement, SvCheckboxProps>(function SvCheckbox(
  { label, className, id, ...props },
  ref
) {
  const autoId = React.useId()
  const cbId = id ?? autoId
  return (
    <label htmlFor={cbId} className="group inline-flex cursor-pointer items-center gap-2.5 text-sm text-white/85 select-none">
      <span className="relative inline-grid size-6 place-items-center">
        <input
          ref={ref}
          id={cbId}
          type="checkbox"
          className={cn("peer absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed", className)}
          {...props}
        />
        <span className="pointer-events-none grid size-6 place-items-center rounded-[5px] border-[3px] border-black bg-black/40 shadow-[var(--elevation-1)] transition-all [&>svg]:scale-0 [&>svg]:transition-transform [&>svg]:duration-[var(--duration-fast)] [&>svg]:ease-[var(--ease-spring)] peer-hover:-translate-y-0.5 peer-checked:bg-[var(--sv-lime)] peer-checked:[&>svg]:scale-100 peer-focus-visible:shadow-[0_0_0_3px_var(--sv-cyan)] peer-disabled:opacity-40">
          <Check className="size-4 text-black" strokeWidth={4} />
        </span>
      </span>
      {label && <span className="peer-disabled:opacity-40">{label}</span>}
    </label>
  )
})

/* ---------------- Radio ---------------- */
export interface SvRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode
}
export const SvRadio = React.forwardRef<HTMLInputElement, SvRadioProps>(function SvRadio(
  { label, className, id, ...props },
  ref
) {
  const autoId = React.useId()
  const rId = id ?? autoId
  return (
    <label htmlFor={rId} className="group inline-flex cursor-pointer items-center gap-2.5 text-sm text-white/85 select-none">
      <span className="relative inline-grid size-6 place-items-center">
        <input
          ref={ref}
          id={rId}
          type="radio"
          className={cn("peer absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed", className)}
          {...props}
        />
        <span className="pointer-events-none grid size-6 place-items-center rounded-full border-[3px] border-black bg-black/40 shadow-[var(--elevation-1)] transition-all [&>span]:scale-0 [&>span]:transition-transform [&>span]:duration-[var(--duration-fast)] [&>span]:ease-[var(--ease-spring)] peer-hover:-translate-y-0.5 peer-focus-visible:shadow-[0_0_0_3px_var(--sv-cyan)] peer-checked:border-[var(--sv-magenta)] peer-checked:[&>span]:scale-100 peer-disabled:opacity-40">
          <span className="size-2.5 rounded-full bg-[var(--sv-magenta)]" />
        </span>
      </span>
      {label && <span className="peer-disabled:opacity-40">{label}</span>}
    </label>
  )
})

export function SvRadioGroup({ name, children, className }: { name: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement<SvRadioProps>(child) ? React.cloneElement(child, { name }) : child
      )}
    </div>
  )
}

/* ---------------- Switch ---------------- */
export interface SvSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode
}
export const SvSwitch = React.forwardRef<HTMLInputElement, SvSwitchProps>(function SvSwitch(
  { label, className, id, ...props },
  ref
) {
  const autoId = React.useId()
  const sId = id ?? autoId
  return (
    <label htmlFor={sId} className="group inline-flex cursor-pointer items-center gap-2.5 text-sm text-white/85 select-none">
      <span className="relative inline-block h-7 w-12">
        <input
          ref={ref}
          id={sId}
          type="checkbox"
          role="switch"
          className={cn("peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed", className)}
          {...props}
        />
        <span className="absolute inset-0 rounded-full border-[3px] border-black bg-white/15 shadow-[var(--elevation-1)] transition-colors peer-checked:bg-[var(--sv-cyan)] peer-focus-visible:shadow-[0_0_0_3px_var(--sv-cyan)] peer-disabled:opacity-40" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 size-5 rounded-full border-2 border-black bg-[var(--sv-ink)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)] peer-checked:left-[22px] peer-checked:bg-black" />
      </span>
      {label && <span className="peer-disabled:opacity-40">{label}</span>}
    </label>
  )
})

/* ---------------- Rating ---------------- */
export function SvRating({
  value,
  onChange,
  max = 5,
  label,
}: {
  value: number
  onChange?: (v: number) => void
  max?: number
  label?: string
}) {
  const [hover, setHover] = React.useState(0)
  const active = hover || value
  return (
    <div role="radiogroup" aria-label={label ?? "Avaliação"} className="inline-flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} de ${max}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange?.(n)}
          className="rounded outline-none transition-transform hover:scale-125 focus-visible:shadow-[0_0_0_3px_var(--sv-cyan)]"
        >
          <Star
            className={cn(
              "size-6 transition-colors",
              n <= active ? "fill-[var(--sv-yellow)] text-black" : "fill-transparent text-white/30"
            )}
            strokeWidth={2.5}
          />
        </button>
      ))}
    </div>
  )
}

/* ---------------- Slider ---------------- */
export interface SvSliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}
export const SvSlider = React.forwardRef<HTMLInputElement, SvSliderProps>(function SvSlider(
  { label, className, id, value, min = 0, max = 100, ...props },
  ref
) {
  const autoId = React.useId()
  const sId = id ?? autoId
  const pct = ((Number(value ?? min) - Number(min)) / (Number(max) - Number(min))) * 100
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/70">
          <label htmlFor={sId}>{label}</label>
          <span className="text-[var(--sv-cyan)]">{value ?? min}</span>
        </div>
      )}
      <input
        ref={ref}
        id={sId}
        type="range"
        min={min}
        max={max}
        value={value}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        className={cn("sv-slider h-2 w-full cursor-pointer appearance-none rounded-full outline-none", className)}
        {...props}
      />
    </div>
  )
})
