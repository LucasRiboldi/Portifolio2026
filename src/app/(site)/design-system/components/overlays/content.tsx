"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MoreVertical, Settings, Trash2, Share2 } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle } from "@/design-system/ds-ui"
import { SvButton } from "@/components/ui/sv-button"
import {
  SvModal, SvDrawer, SvTooltip, SvPopover, SvMenuItem, SvContextMenu,
} from "@/components/ui/sv-overlay"

export function OverlaysContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)

  return (
    <div>
      <Link href="/design-system/components" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Componentes
      </Link>
      <ComicHeader as={headingAs} kicker="04 · Overlays" title="Camadas que" highlight="saltam" />

      <DsSectionTitle id="modal">Modal & Drawer</DsSectionTitle>
      <div className="flex flex-wrap gap-3">
        <SvButton color="magenta" onClick={() => setModal(true)}>Abrir Modal</SvButton>
        <SvButton color="cyan" variant="secondary" onClick={() => setDrawer(true)}>Abrir Drawer</SvButton>
      </div>

      <SvModal
        open={modal}
        onClose={() => setModal(false)}
        title="Confirmar salto"
        footer={
          <>
            <SvButton variant="ghost" color="cyan" size="sm" onClick={() => setModal(false)}>Cancelar</SvButton>
            <SvButton color="magenta" size="sm" onClick={() => setModal(false)} pop="GO!">Saltar</SvButton>
          </>
        }
      >
        Você está prestes a atravessar para outra dimensão. Esta ação recalibra todo o
        canvas. Deseja continuar?
      </SvModal>

      <SvDrawer open={drawer} onClose={() => setDrawer(false)} title="Configurações">
        <p>Painel lateral deslizante com foco preso e fechamento por Esc / clique-fora.</p>
      </SvDrawer>

      <DsSectionTitle id="tooltip">Tooltip</DsSectionTitle>
      <div className="flex flex-wrap items-center gap-6">
        <SvTooltip label="Passe o mouse ou use Tab!">
          <SvButton variant="outline" color="lime" size="sm">Hover / Focus</SvButton>
        </SvTooltip>
        <SvTooltip label="Informação extra aqui">
          <span className="cursor-help text-sm text-white/60 underline decoration-dotted">o que é isto?</span>
        </SvTooltip>
      </div>

      <DsSectionTitle id="popover">Popover / Dropdown</DsSectionTitle>
      <SvPopover
        trigger={({ toggle, open }) => (
          <SvButton variant="icon" color="violet" aria-label="Menu" aria-expanded={open} onClick={toggle}>
            <MoreVertical />
          </SvButton>
        )}
      >
        <SvMenuItem onSelect={() => {}}><Share2 className="size-4" /> Compartilhar</SvMenuItem>
        <SvMenuItem onSelect={() => {}}><Settings className="size-4" /> Configurar</SvMenuItem>
        <SvMenuItem danger onSelect={() => {}}><Trash2 className="size-4" /> Excluir</SvMenuItem>
      </SvPopover>

      <DsSectionTitle id="context">Context Menu (clique direito)</DsSectionTitle>
      <SvContextMenu
        items={[
          { label: "Abrir" },
          { label: "Renomear" },
          { label: "Excluir", danger: true },
        ]}
      >
        <div className="grid h-28 place-items-center rounded-lg border-[3px] border-dashed border-white/25 bg-black/20 text-sm text-white/50">
          Clique com o botão direito aqui
        </div>
      </SvContextMenu>
    </div>
  )
}
