import { ComicHeader } from "@/components/spiderverse/decor"
import { DsLead } from "@/design-system/ds-ui"
import { DsRealmCard } from "@/components/design-system/ds-realm-card"
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

      <div className="mt-8 grid items-stretch gap-5 sm:grid-cols-3">
        {REALM_DESIGN_IDS.map((id) => {
          const d = REALM_DESIGN[id]
          if (!d) return null
          return (
            <DsRealmCard
              key={id}
              id={id}
              label={d.label}
              tagline={d.tagline}
              href={`/design-system/realms/${id}`}
              stats={[
                { label: VARIANT_LABEL[id], value: REALM_VARIANTS[id].length },
                { label: "Gestos de motion", value: REALM_MOTION[id].length },
                { label: "Princípios", value: d.principles.length },
              ]}
            />
          )
        })}
      </div>
    </div>
  )
}
