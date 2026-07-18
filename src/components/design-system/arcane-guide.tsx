import type { RealmDesign } from "@/design-system/realms"
import { ArcaneChapters, Chapter } from "./arcane-chapters"
import {
  ArcaneMasthead,
  ArcaneIntro,
  ArcaneTokens,
  ArcaneColors,
  ArcaneMotion,
  ArcaneBrand,
} from "./arcane-foundations"
import {
  ArcaneFoundations,
  ArcaneIconography,
  ArcaneComponents,
  ArcanePatterns,
  ArcaneTemplates,
  ArcaneContentDesign,
  ArcaneResources,
  ArcaneChangelog,
} from "./arcane-index-chapters"

/**
 * O guia de "O Anfitrião" — inteiro numa folha de jornal.
 *
 * Paralelo ao DeveloperGuide (que fez o _Dev virar terminal): aqui o guia
 * inteiro vira uma folha impressa. Sai o scaffold comic (ComicHeader,
 * sv-canvas, DsSectionTitle) — a página é a folha, sobre a mesa escura da
 * redação (o ds-canvas--arcane). O único <h1> é o nameplate no masthead.
 *
 * A ordem segue o índice: masthead, editorial, tintas, superfícies, e então
 * o corpo narrativo (as vozes = typography, a grade, a manchete, o silêncio…),
 * fechando com movimento, brasão e o kit vivo.
 *
 * O UI Kit chega por `kit` porque o preview vive na pasta da rota.
 */
export function ArcaneGuide({ d, kit }: { d: RealmDesign; kit: React.ReactNode }) {
  return (
    <div className="dp min-w-0 rounded-sm p-5 sm:p-8" style={{ color: "var(--dp-ink)" }}>
      <ArcaneMasthead d={d} />

      {/* Fundações da folha: editorial, oficina de composição, tintas, superfícies. */}
      <ArcaneIntro d={d} />
      <ArcaneFoundations />
      <ArcaneTokens d={d} />
      <ArcaneColors d={d} />

      {/* Corpo narrativo — traz typography (as vozes), grid, a manchete, os
          filetes, o classificado, o expediente, a acessibilidade (tintas) e o
          silêncio. Cada capítulo é uma matéria da folha. */}
      <ArcaneChapters />

      {/* Sistemas da folha, na ordem do índice. */}
      <ArcaneIconography />
      <ArcaneMotion d={d} />
      <ArcaneComponents />
      <ArcanePatterns />
      <ArcaneTemplates />
      <ArcaneContentDesign />
      <ArcaneBrand d={d} />
      <ArcaneResources d={d} />
      <ArcaneChangelog />

      {/* Kit vivo, por versão (estados da folha). */}
      <Chapter
        id="kit"
        n="09"
        title="Oficina · UI Kit"
        lead="Os componentes reais da folha, não capturas — troque a versão para reimprimir a mesma matéria noutra tiragem."
      >
        <div className="mt-1">{kit}</div>
      </Chapter>
    </div>
  )
}
