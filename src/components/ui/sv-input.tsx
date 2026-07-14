"use client"

/**
 * SvInput — sistema de campos do Design System (identidade Aranhaverso).
 * ------------------------------------------------------------------------
 * Tipos:   text · email · password · number · date · search · phone · cpf · cep
 * Estados: normal · hover · focus · error · success · disabled · readonly
 *
 * Criatividade: moldura comic, halo cyan no foco, "shake" no erro, selo de
 * check no sucesso, revelar senha, ícone de busca, máscaras BR embutidas.
 * Acessível: label associado, aria-invalid, aria-describedby, mensagens live.
 */

import * as React from "react"
import { Eye, EyeOff, Search, Check, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

/* ---------------- máscaras BR ---------------- */
export const masks = {
  cpf: (v: string) =>
    v.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  cep: (v: string) =>
    v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2"),
  phone: (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11)
    if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
  },
} as const

type MaskKind = keyof typeof masks
export type SvInputType =
  | "text" | "email" | "password" | "number" | "date" | "search"
  | "phone" | "cpf" | "cep"

const MASK_OF: Partial<Record<SvInputType, MaskKind>> = { cpf: "cpf", cep: "cep", phone: "phone" }
const NATIVE_TYPE: Record<SvInputType, string> = {
  text: "text", email: "email", password: "password", number: "number",
  date: "date", search: "search", phone: "tel", cpf: "text", cep: "text",
}
const INPUTMODE: Partial<Record<SvInputType, React.HTMLAttributes<HTMLInputElement>["inputMode"]>> = {
  cpf: "numeric", cep: "numeric", phone: "tel", number: "numeric",
}

export interface SvInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string
  type?: SvInputType
  error?: string
  success?: string
  hint?: string
}

let uid = 0

export const SvInput = React.forwardRef<HTMLInputElement, SvInputProps>(function SvInput(
  { label, type = "text", error, success, hint, className, disabled, readOnly, onChange, id, ...props },
  ref
) {
  const [reveal, setReveal] = React.useState(false)
  const autoId = React.useId?.() ?? `sv-input-${++uid}`
  const inputId = id ?? autoId
  const msgId = `${inputId}-msg`

  const mask = MASK_OF[type]
  const isPassword = type === "password"
  const isSearch = type === "search"
  const state = error ? "error" : success ? "success" : "normal"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask) e.target.value = masks[mask](e.target.value)
    onChange?.(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/70">
          {label}
        </label>
      )}

      <div
        data-state={state}
        className={cn(
          "group/field relative flex items-center rounded-md border-[3px] bg-black/40 transition-all",
          "border-black shadow-[var(--elevation-1)]",
          "focus-within:-translate-y-0.5 focus-within:border-[var(--sv-cyan)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--sv-cyan)_45%,transparent)]",
          state === "error" && "sv-anim-error-shake border-[var(--sv-orange)] animate-[sv-error-shake_0.4s_ease]",
          state === "success" && "border-[var(--sv-lime)]",
          disabled && "opacity-50 grayscale",
          readOnly && "bg-white/5",
          className
        )}
      >
        {isSearch && <Search aria-hidden className="ml-3 size-4 shrink-0 text-white/40" />}

        <input
          ref={ref}
          id={inputId}
          type={isPassword && reveal ? "text" : NATIVE_TYPE[type]}
          inputMode={INPUTMODE[type]}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={error || success || hint ? msgId : undefined}
          className="peer min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none disabled:cursor-not-allowed [color-scheme:dark]"
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Ocultar senha" : "Mostrar senha"}
            className="mr-2 grid size-8 shrink-0 place-items-center rounded text-white/50 transition-colors hover:text-[var(--sv-cyan)]"
          >
            {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}

        {state === "success" && (
          <Check aria-hidden className="mr-3 size-4 shrink-0 text-[var(--sv-lime)]" />
        )}
        {state === "error" && (
          <AlertTriangle aria-hidden className="mr-3 size-4 shrink-0 text-[var(--sv-orange)]" />
        )}
      </div>

      {(error || success || hint) && (
        <p
          id={msgId}
          role={error ? "alert" : undefined}
          className={cn(
            "mt-1.5 text-xs",
            error && "font-semibold text-[var(--sv-orange)]",
            success && "font-semibold text-[var(--sv-lime)]",
            !error && !success && "text-white/45"
          )}
        >
          {error || success || hint}
        </p>
      )}
    </div>
  )
})

/* ---------------- Textarea ---------------- */
export interface SvTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}
export const SvTextarea = React.forwardRef<HTMLTextAreaElement, SvTextareaProps>(function SvTextarea(
  { label, error, hint, className, id, ...props },
  ref
) {
  const autoId = React.useId?.() ?? `sv-ta-${++uid}`
  const taId = id ?? autoId
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={taId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/70">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={taId}
        aria-invalid={!!error}
        className={cn(
          "min-h-[110px] w-full resize-y rounded-md border-[3px] border-black bg-black/40 px-3 py-2.5 text-sm text-white shadow-[var(--elevation-1)] outline-none transition-all placeholder:text-white/30",
          "focus:-translate-y-0.5 focus:border-[var(--sv-cyan)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--sv-cyan)_45%,transparent)]",
          error && "border-[var(--sv-orange)]",
          className
        )}
        {...props}
      />
      {(error || hint) && (
        <p className={cn("mt-1.5 text-xs", error ? "font-semibold text-[var(--sv-orange)]" : "text-white/45")}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

/* ---------------- Select (nativo estilizado) ---------------- */
export interface SvSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
}
export const SvSelect = React.forwardRef<HTMLSelectElement, SvSelectProps>(function SvSelect(
  { label, options, placeholder, className, id, ...props },
  ref
) {
  const autoId = React.useId?.() ?? `sv-sel-${++uid}`
  const selId = id ?? autoId
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/70">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selId}
          defaultValue=""
          className={cn(
            "w-full appearance-none rounded-md border-[3px] border-black bg-black/40 px-3 py-2.5 pr-9 text-sm text-white shadow-[var(--elevation-1)] outline-none transition-all",
            "focus:-translate-y-0.5 focus:border-[var(--sv-cyan)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--sv-cyan)_45%,transparent)]",
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[var(--sv-ink-2)]">
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sv-cyan)]">▾</span>
      </div>
    </div>
  )
})
