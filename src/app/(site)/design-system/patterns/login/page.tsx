"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Code2, Globe } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvInput } from "@/components/ui/sv-input"
import { SvButton } from "@/components/ui/sv-button"
import { SvCheckbox } from "@/components/ui/sv-choice"

export default function LoginPatternPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <Link href="/design-system/patterns" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Patterns
      </Link>
      <ComicHeader kicker="05 · Pattern" title="Fluxo de" highlight="login" />

      <div className="mx-auto mt-6 max-w-sm rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 shadow-[var(--elevation-4)]">
        <h2 className="sv-display text-2xl uppercase text-white">Bem-vindo de volta</h2>
        <p className="mb-5 text-xs text-white/50">Entre no multiverso.</p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => setLoading(false), 1500) }}
        >
          <SvInput label="E-mail" type="email" placeholder="voce@dominio.com" required />
          <SvInput label="Senha" type="password" placeholder="••••••••" required />

          <div className="flex items-center justify-between">
            <SvCheckbox label="Lembrar-me" />
            <a href="#" className="text-xs text-[var(--sv-cyan)] hover:underline">Esqueceu?</a>
          </div>

          <SvButton type="submit" color="magenta" className="w-full" isLoading={loading} pop="GO!">
            Entrar
          </SvButton>
        </form>

        <div className="my-5 flex items-center gap-3 text-[0.65rem] uppercase tracking-widest text-white/30">
          <span className="h-px flex-1 bg-white/15" /> ou <span className="h-px flex-1 bg-white/15" />
        </div>

        <div className="flex flex-col gap-2">
          <SvButton variant="outline" color="cyan" className="w-full" icon={<Code2 />}>Continuar com GitHub</SvButton>
          <SvButton variant="outline" color="lime" className="w-full" icon={<Globe />}>Continuar com Google</SvButton>
        </div>

        <p className="mt-5 text-center text-xs text-white/50">
          Não tem conta? <a href="#" className="font-bold text-[var(--sv-magenta)] hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  )
}
