"use client"

/**
 * SvFeedback — comunicação de estado do sistema (Design System).
 * ------------------------------------------------------------------------
 * SvAlert · SvProgress · SvEmptyState · SvToast + useToast()/SvToaster
 *
 * Criatividade: painéis comic com caption-box, barra de progresso halftone,
 * toasts que entram em "pop" spring, empty-state com onomatopeia.
 * Acessível: role=alert/status, aria-live, aria-valuenow no progress.
 */

import * as React from "react"
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type Tone = "info" | "success" | "warning" | "danger"

const TONE: Record<Tone, { color: string; ink: string; Icon: typeof Info }> = {
  info: { color: "var(--sv-cyan)", ink: "#001b1f", Icon: Info },
  success: { color: "var(--sv-lime)", ink: "#0c1a00", Icon: CheckCircle2 },
  warning: { color: "var(--sv-yellow)", ink: "#1a1400", Icon: AlertTriangle },
  danger: { color: "var(--sv-orange)", ink: "#fff", Icon: XCircle },
}

/* ---------------- Alert ---------------- */
export function SvAlert({
  tone = "info",
  title,
  children,
  onClose,
  className,
}: {
  tone?: Tone
  title?: string
  children?: React.ReactNode
  onClose?: () => void
  className?: string
}) {
  const { color, Icon } = TONE[tone]
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn(
        "relative flex items-start gap-3 rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] p-4 shadow-[var(--elevation-2)]",
        className
      )}
      style={{ borderLeftWidth: 8, borderLeftColor: color }}
    >
      <Icon className="mt-0.5 size-5 shrink-0" style={{ color }} />
      <div className="min-w-0 flex-1">
        {title && <p className="sv-heavy text-sm uppercase tracking-wide text-white">{title}</p>}
        {children && <p className="mt-0.5 text-sm text-white/70">{children}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Fechar" className="shrink-0 text-white/40 transition-colors hover:text-white">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

/* ---------------- Progress ---------------- */
export function SvProgress({
  value,
  max = 100,
  label,
  tone = "info",
  indeterminate,
}: {
  value?: number
  max?: number
  label?: string
  tone?: Tone
  indeterminate?: boolean
}) {
  const { color } = TONE[tone]
  const pct = indeterminate ? 40 : Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex justify-between text-xs font-bold uppercase tracking-wider text-white/70">
          <span>{label}</span>
          {!indeterminate && <span style={{ color }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-4 w-full overflow-hidden rounded-full border-[3px] border-black bg-black/40"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-[var(--duration-slow)]", indeterminate && "animate-[sv-indeterminate_1.2s_ease_infinite]")}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

/* ---------------- Empty State ---------------- */
export function SvEmptyState({
  onoma = "WHOOSH!",
  title,
  description,
  action,
}: {
  onoma?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border-[3px] border-dashed border-white/20 bg-black/20 px-6 py-12 text-center">
      <span className="font-[family-name:var(--font-display)] text-5xl text-[var(--sv-magenta)] [-webkit-text-stroke:2px_#000]">
        {onoma}
      </span>
      <p className="sv-heavy text-lg uppercase tracking-wide text-white">{title}</p>
      {description && <p className="max-w-sm text-sm text-white/55">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/* ---------------- Toast system ---------------- */
export interface ToastItem { id: number; tone: Tone; title?: string; message: string }

const ToastCtx = React.createContext<{ toast: (t: Omit<ToastItem, "id">) => void } | null>(null)

export function SvToaster({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const idRef = React.useRef(0)

  const toast = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++idRef.current
    setItems((prev) => [...prev, { ...t, id }])
    setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), 4000)
  }, [])

  const remove = (id: number) => setItems((prev) => prev.filter((x) => x.id !== id))

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-toast flex w-[min(92vw,360px)] flex-col gap-2">
        {items.map((t) => {
          const { color, Icon } = TONE[t.tone]
          return (
            <div
              key={t.id}
              role="status"
              aria-live="polite"
              className="pointer-events-auto flex items-start gap-3 rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] p-3 shadow-[var(--elevation-3)] animate-[sv-toast-in_0.3s_var(--ease-spring)]"
              style={{ borderLeftWidth: 8, borderLeftColor: color }}
            >
              <Icon className="mt-0.5 size-5 shrink-0" style={{ color }} />
              <div className="min-w-0 flex-1">
                {t.title && <p className="sv-heavy text-xs uppercase tracking-wide text-white">{t.title}</p>}
                <p className="text-sm text-white/75">{t.message}</p>
              </div>
              <button onClick={() => remove(t.id)} aria-label="Fechar" className="text-white/40 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error("useToast precisa de <SvToaster> acima na árvore.")
  return ctx.toast
}
