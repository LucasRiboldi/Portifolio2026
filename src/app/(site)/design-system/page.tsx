import Link from "next/link"
import { ComicHeader } from "@/components/spiderverse/decor"
import { DsCard, DsLead } from "@/design-system/ds-ui"
import { REALM_DESIGN, REALM_DESIGN_IDS } from "@/design-system/realms"
import { REALM_VARIANTS, VARIANT_LABEL } from "@/design-system/realm-variants"
import { REALM_MOTION } from "@/design-system/realm-motion"

/**
 * Três páginas, uma por perfil — e nada mais aqui.
 *
 * Não existe um "design system corporativo" neutro neste projeto: o que havia
 * sob esta rota era todo comic (tinta grossa, halftone, tilts), ou seja, o
 * Criativo falando. Fingir neutralidade seria mentir sobre a própria fonte.
 * Então o conteúdo mudou-se para o guia do Criativo, e esta rota passou a ser
 * o que sempre deveria: a escolha do universo.
 */
export default function DesignSystemHome() {
  return (
    <div>
      <ComicHeader
        kicker="Design System"
        title="Três universos,"
        highlight="três sistemas"
        subtitle="Cada perfil tem o seu guia completo — identidade, tokens, componentes e motion."
      />
      <DsLead>
        Nada de sistema único para os três: um jornal de 1920, um terminal Dracula e um multiverso
        comic não compartilham gramática visual. O que atravessa os universos é a camada semântica{" "}
        <code className="text-[var(--sv-cyan)]">--r-*</code> e a escala em{" "}
        <code className="text-[var(--sv-cyan)]">tokens.ts</code> — o resto, cada realm resolve à sua
        maneira. Escolha um guia:
      </DsLead>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {REALM_DESIGN_IDS.map((id) => {
          const d = REALM_DESIGN[id]
          if (!d) return null
          const variantes = REALM_VARIANTS[id].length
          const gestos = REALM_MOTION[id].length
          return (
            <Link key={id} href={`/design-system/realms/${id}`} className="group block">
              <DsCard className="flex h-full flex-col transition-transform group-hover:-translate-y-1.5">
                <h2 className="sv-display text-3xl uppercase text-[var(--sv-cyan)]">{d.label}</h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-white/60">{d.tagline}</p>

                <dl className="mt-4 space-y-1 border-t border-white/10 pt-3 text-[10px] uppercase tracking-wide">
                  <div className="flex justify-between gap-2">
                    <dt className="text-white/40">{VARIANT_LABEL[id]}</dt>
                    <dd className="text-[var(--sv-yellow)]">{variantes}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-white/40">Gestos de motion</dt>
                    <dd className="text-[var(--sv-yellow)]">{gestos}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-white/40">Princípios</dt>
                    <dd className="text-[var(--sv-yellow)]">{d.principles.length}</dd>
                  </div>
                </dl>

                <span className="sv-heavy mt-4 inline-block text-[10px] uppercase tracking-wide text-[var(--sv-magenta)]">
                  Abrir o guia →
                </span>
              </DsCard>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
