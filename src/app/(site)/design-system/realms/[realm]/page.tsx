import { notFound } from "next/navigation"

import { REALM_DESIGN, REALM_DESIGN_IDS } from "@/design-system/realms"
import { isRealmId, REALMS } from "@/lib/realms"
import { RealmKitPreview } from "./kit-preview"
import { RealmVariantSwitcher } from "@/components/design-system/realm-variant-switcher"
import { DsRealmNav } from "@/components/design-system/ds-realm-nav"
import { CreativeGuide } from "@/components/design-system/creative-guide"
import { DeveloperGuide } from "@/components/design-system/developer-guide"
import { ArcaneGuide } from "@/components/design-system/arcane-guide"

export function generateStaticParams() {
  return REALM_DESIGN_IDS.map((realm) => ({ realm }))
}

export async function generateMetadata({ params }: { params: Promise<{ realm: string }> }) {
  const { realm } = await params
  const d = isRealmId(realm) ? REALM_DESIGN[realm] : undefined
  return { title: d ? `Design System · ${d.label}` : "Design System" }
}

/**
 * O documento do Design System de um realm.
 *
 * Cada universo tem o seu guia, e a rota só escolhe qual: o Criativo em
 * scaffold comic, o _Dev em terminal Dracula, o Anfitrião em folha de jornal.
 * Antes o Criativo era exceção — metade do corpo dele vivia inline aqui e a
 * outra metade em `creative-chapters.tsx`, o que quebrava a ordem canônica
 * das seções (a página abria 01, 03, 05 e só então entrava a 02). Agora os
 * três são simétricos e a ordem de cada documento é responsabilidade do seu
 * guia, que segue `architecture.ts`.
 */
export default async function RealmDesignPage({ params }: { params: Promise<{ realm: string }> }) {
  const { realm } = await params
  if (!isRealmId(realm)) notFound()

  const d = REALM_DESIGN[realm]
  if (!d) notFound()

  const nav = REALMS[realm]

  // O kit vivo é igual nos três; o preview vive na pasta da rota, por isso
  // desce por prop em vez de ser importado dentro de cada guia.
  const kit = (
    <RealmVariantSwitcher realm={d.id}>
      <RealmKitPreview realm={d.id} scope={d.scope} />
    </RealmVariantSwitcher>
  )

  return (
    <div
      className={`lg:flex lg:gap-10 ${
        // .dracula resolve as vars --d-*; bg-transparent deixa o ds-canvas--dev
        // (fixo, atrás) aparecer em vez de a classe pintar uma caixa sólida.
        d.id === "developer" ? "dracula bg-transparent" : ""
      }`}
    >
      {/* Índice do documento — sumário, não menu de rotas. */}
      <DsRealmNav realm={d.id} />

      <div className="min-w-0 flex-1">
        {d.id === "developer" ? (
          <DeveloperGuide d={d} kit={kit} />
        ) : d.id === "arcane" ? (
          <ArcaneGuide d={d} kit={kit} />
        ) : (
          <CreativeGuide d={d} nav={nav} kit={kit} />
        )}
      </div>
    </div>
  )
}
