import type { RealmDesign } from "@/design-system/realms"
import { DEV_INDEX } from "./dev-index-chapters"
import { DevChapters, DevAccessibility, Chapter, Surface } from "./dev-chapters"
import {
  DevIntro,
  DevTokens,
  DevColors,
  DevTypography,
  DevMotion,
  DevShapeSpecs,
} from "./dev-foundations"
import {
  DevButtons,
  DevInputs,
  DevSelection,
  DevDataDisplay,
  DevOverlays,
  DevFeedback,
  DevSections,
} from "./dev-library"
import {
  DevPatternLogin,
  DevPatternSearch,
  DevPatternMultiStep,
  DevPatternFaq,
} from "./dev-patterns"
import {
  DevTplLanding,
  DevTplDashboard,
  DevTplArticle,
  DevTplPricing,
  DevTplProfile,
  DevTplDocs,
  DevTplChangelog,
  DevTplComingSoon,
} from "./dev-templates"
import { DevThemes, DevLab, DevDocs } from "./dev-extras"

/**
 * O guia de "O _Dev" — inteiro em Dracula.
 *
 * Diferente dos outros realms, o developer não usa o scaffold comic
 * (ComicHeader, sv-canvas, DsSectionTitle): o guia vive num único escopo
 * `.dracula` e cada seção é um painel de terminal. O corpo equipara, capítulo
 * a capítulo, o guia do Criativo — os 16 tópicos do índice mais as galerias de
 * componentes, patterns e templates —, e ainda soma o vocabulário que só o
 * _Dev tem (sintaxe, diff, devlog, exit code).
 *
 * O UI Kit chega por `kit` porque o preview vive na pasta da rota.
 */

/** Âncora de grupo — o alvo que o índice de 16 seções promete (components…). */
function Group({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  )
}

export function DeveloperGuide({ d, kit }: { d: RealmDesign; kit: React.ReactNode }) {
  return (
    <div className="min-w-0">
      {/* 01 · Introduction (o hero é aqui) */}
      <DevIntro d={d} />

      {/* 02 · Foundations */}
      {DEV_INDEX.foundations}

      {/* 03 · Design Tokens (+ elevação/raio) · 04 · Typography · 05 · Colors */}
      <DevTokens d={d} />
      <DevShapeSpecs d={d} />
      <DevTypography d={d} />
      <DevColors d={d} />

      {/* 06 · Grid · 07 · Iconography · 08 · Motion */}
      {DEV_INDEX.grid}
      {DEV_INDEX.iconography}
      <DevMotion d={d} />

      {/* 09 · Components — as 6 galerias equiparam os 6 grupos do Criativo */}
      <Group id="components">
        <DevButtons />
        <DevInputs />
        <DevSelection />
        <DevDataDisplay />
        <DevOverlays />
        <DevFeedback />
      </Group>

      {/* 11 · Seções de página */}
      <DevSections />

      {/* Vocabulário nativo do _Dev — o que o Criativo não tem: sintaxe, terminal,
          diff, estados, cartões, devlog, busca, vazio. */}
      <DevChapters />

      {/* UI Kit vivo, por versão */}
      <Chapter
        id="kit"
        n="09b"
        title="UI Kit"
        lead="Os componentes reais, não capturas — troque a versão para reimprimir o kit inteiro."
      >
        <div className="mt-1">{kit}</div>
      </Chapter>

      {/* 10 · Patterns — 4 fluxos equiparando os 4 do Criativo (+ command palette) */}
      <Group id="patterns">
        <DevPatternLogin />
        <DevPatternSearch />
        <DevPatternMultiStep />
        <DevPatternFaq />
        {DEV_INDEX.patterns}
      </Group>

      {/* 11 · Templates — 8 páginas equiparando os 8 do Criativo (+ lista de rotas) */}
      <Group id="templates">
        <DevTplLanding />
        <DevTplDashboard />
        <DevTplArticle />
        <DevTplPricing />
        <DevTplProfile />
        <DevTplDocs />
        <DevTplChangelog />
        <DevTplComingSoon />
        {DEV_INDEX.templates}
      </Group>

      {/* 12 · Accessibility */}
      <DevAccessibility />

      {/* 13 · Content Design */}
      {DEV_INDEX["content-design"]}

      {/* 14 · Brand */}
      <Chapter
        id="brand"
        n="14"
        title="Brand"
        lead="A marca do realm: o cursor de terminal que não para de piscar."
      >
        <Surface>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--d-purple)] font-mono text-sm font-bold text-[var(--d-bg)]">
              LR
              <span className="dv-caret" />
            </span>
            <p className="text-sm leading-snug text-[var(--d-comment)]">{d.logo}</p>
          </div>
        </Surface>
      </Chapter>

      {/* 15 · Resources */}
      {DEV_INDEX.resources}

      {/* 16 · Changelog */}
      {DEV_INDEX.changelog}

      {/* 18-20 · Extras que agora entram no índice (secoes/11 está com components) */}
      <DevThemes />
      <DevLab />
      <DevDocs />
    </div>
  )
}
