"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvInput, SvSelect } from "@/components/ui/sv-input"
import { SvButton } from "@/components/ui/sv-button"
import { SvProgress } from "@/components/ui/sv-feedback"

const STEPS = ["Conta", "Perfil", "Confirmar"]

export default function MultiStepPatternPage() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const pct = ((step + 1) / STEPS.length) * 100

  return (
    <div>
      <Link href="/design-system/patterns" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Patterns
      </Link>
      <ComicHeader kicker="05 · Pattern" title="Formulário" highlight="multi-step" />

      <div className="mx-auto mt-6 max-w-lg rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 shadow-[var(--elevation-4)]">
        {/* stepper */}
        <div className="mb-3 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`grid size-8 place-items-center rounded-full border-[3px] border-black text-sm font-bold ${i <= step ? "bg-[var(--sv-magenta)] text-white" : "bg-black/40 text-white/40"}`}>
                {i < step || done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
              </span>
              <span className={`hidden text-xs uppercase tracking-wide sm:inline ${i <= step ? "text-white" : "text-white/40"}`}>{s}</span>
            </div>
          ))}
        </div>
        <SvProgress value={done ? 100 : pct} tone="info" />

        {/* passos */}
        <div className="mt-6 min-h-[160px]">
          {done ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <span className="font-[family-name:var(--font-display)] text-4xl text-[var(--sv-lime)] [-webkit-text-stroke:1.5px_#000]">DONE!</span>
              <p className="text-sm text-white/70">Cadastro concluído com sucesso.</p>
            </div>
          ) : step === 0 ? (
            <div className="flex flex-col gap-4">
              <SvInput label="E-mail" type="email" placeholder="voce@dominio.com" />
              <SvInput label="Senha" type="password" placeholder="••••••••" />
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col gap-4">
              <SvInput label="Nome completo" placeholder="Seu nome" />
              <SvSelect label="Dimensão preferida" placeholder="Escolha" options={[{ value: "neon", label: "Neon" }, { value: "noir", label: "Noir" }]} />
            </div>
          ) : (
            <div className="rounded-md border-2 border-dashed border-white/20 p-4 text-sm text-white/70">
              Revise seus dados e confirme para finalizar o cadastro no multiverso.
            </div>
          )}
        </div>

        {/* navegação */}
        {!done && (
          <div className="mt-4 flex justify-between">
            <SvButton variant="ghost" color="cyan" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Voltar
            </SvButton>
            {step < STEPS.length - 1 ? (
              <SvButton color="cyan" size="sm" onClick={() => setStep((s) => s + 1)}>Próximo</SvButton>
            ) : (
              <SvButton color="lime" size="sm" onClick={() => setDone(true)} pop="YES!">Concluir</SvButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
