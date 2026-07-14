"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, WifiOff } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle } from "@/design-system/ds-ui"
import { SvButton } from "@/components/ui/sv-button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SvAlert, SvProgress, SvEmptyState, SvToaster, useToast, type Tone,
} from "@/components/ui/sv-feedback"

export default function FeedbackPage() {
  return (
    <SvToaster>
      <FeedbackInner />
    </SvToaster>
  )
}

function FeedbackInner() {
  const toast = useToast()
  const [prog, setProg] = useState(20)

  useEffect(() => {
    const t = setInterval(() => setProg((p) => (p >= 100 ? 20 : p + 10)), 900)
    return () => clearInterval(t)
  }, [])

  const tones: Tone[] = ["info", "success", "warning", "danger"]

  return (
    <div>
      <Link href="/design-system/components" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Componentes
      </Link>
      <ComicHeader kicker="04 · Feedback" title="O sistema" highlight="fala" />

      <DsSectionTitle id="alert">Alert</DsSectionTitle>
      <div className="flex flex-col gap-3">
        <SvAlert tone="info" title="Dica" onClose={() => {}}>Você está no multiverso do Design System.</SvAlert>
        <SvAlert tone="success" title="Deploy concluído">Sua página foi publicada com sucesso.</SvAlert>
        <SvAlert tone="warning" title="Atenção">Alguns tokens estão sem contraste suficiente.</SvAlert>
        <SvAlert tone="danger" title="Erro">Falha ao conectar com a dimensão Terra-616.</SvAlert>
      </div>

      <DsSectionTitle id="toast">Toast / Snackbar</DsSectionTitle>
      <div className="flex flex-wrap gap-2">
        {tones.map((t) => (
          <SvButton key={t} variant="secondary" size="sm" color={t === "info" ? "cyan" : t === "success" ? "lime" : t === "warning" ? "yellow" : "orange"} onClick={() => toast({ tone: t, title: t.toUpperCase(), message: `Toast do tipo ${t} disparado!` })}>
            {t}
          </SvButton>
        ))}
      </div>

      <DsSectionTitle id="progress">Progress</DsSectionTitle>
      <div className="flex flex-col gap-4">
        <SvProgress value={prog} label="Carregando assets" tone="info" />
        <SvProgress value={72} label="Cobertura de testes" tone="success" />
        <SvProgress indeterminate label="Sincronizando…" tone="warning" />
      </div>

      <DsSectionTitle id="skeleton">Loading / Skeleton</DsSectionTitle>
      <div className="flex items-center gap-4 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>

      <DsSectionTitle id="empty">Empty State</DsSectionTitle>
      <SvEmptyState
        onoma="WHOOSH!"
        title="Nada por aqui ainda"
        description="Nenhum projeto encontrado nesta dimensão. Que tal criar o primeiro?"
        action={<SvButton color="magenta" size="sm">Criar projeto</SvButton>}
      />

      <DsSectionTitle id="errors">Erros: 404 · 500 · Offline</DsSectionTitle>
      <div className="grid gap-4 sm:grid-cols-3">
        <ErrorCard code="404" onoma="OOPS!" msg="Página perdida no multiverso." color="var(--sv-magenta)" />
        <ErrorCard code="500" onoma="KRAK!" msg="Algo quebrou no servidor." color="var(--sv-orange)" />
        <ErrorCard code="OFF" onoma="ZzZ…" msg="Você está offline." color="var(--sv-cyan)" icon={<WifiOff className="size-8" />} />
      </div>
    </div>
  )
}

function ErrorCard({ code, onoma, msg, color, icon }: { code: string; onoma: string; msg: string; color: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-6 text-center shadow-[var(--elevation-2)]">
      {icon ?? <span className="font-[family-name:var(--font-display)] text-5xl [-webkit-text-stroke:2px_#000]" style={{ color }}>{code}</span>}
      <span className="font-[family-name:var(--font-display)] text-lg text-[var(--sv-yellow)] [-webkit-text-stroke:1px_#000]">{onoma}</span>
      <p className="text-xs text-white/55">{msg}</p>
    </div>
  )
}
