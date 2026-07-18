import type { RealmDesign } from "@/design-system/realms"
import { DEV_INDEX } from "./dev-index-chapters"
import {
  DevSintaxe,
  DevTerminal,
  DevCodigo,
  DevEstadosProjeto,
  DevCartoes,
  DevDevlog,
  DevVazio,
  DevAccessibility,
  Chapter,
  SubChapter,
  Surface,
} from "./dev-chapters"
import {
  DevIntro,
  DevTokens,
  DevColors,
  DevTypography,
  DevMotion,
  DevShapeSpecs,
} from "./dev-foundations"
import {
  DevInputs,
  DevSelection,
  DevDataDisplay,
  DevOverlays,
  DevFeedback,
  DevSections,
} from "./dev-library"
import { DevButtons } from "./dev-buttons"
import { DevIconography, DevMotionInventory } from "./dev-icons-motion"
import { DevNavegacao, DevBlocoCodigo, DevPrimitivas } from "./dev-chrome"
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
import { DevLab, DevDocs } from "./dev-extras"
import { DevOsThemes } from "./dev-os"

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

/**
 * Cabeçalho de um caderno que só tem matérias — o alvo que o índice promete
 * para Components, Patterns e Templates.
 *
 * Era um `<section>` mudo: dava âncora ao id mas não desenhava nada. Enquanto
 * as galerias tinham numeração plana própria (05, 06, 07…) isso passava
 * despercebido; ao virarem 09.1, 09.2, 09.3 o buraco ficou visível — o leitor
 * via a matéria sem nunca ver o caderno, e a sidebar apontava "09 Components"
 * para um ponto sem título. Agora ele imprime o próprio cabeçalho, no mesmo
 * compasso de Chapter.
 */
function Group({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string
  n: string
  title: string
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={`${n} · ${title}`}
      className="mt-14 scroll-mt-24 border-t border-[var(--d-current)] pt-9"
    >
      <p className="mb-3 flex items-baseline gap-2 font-mono text-sm font-bold text-[var(--d-orange)]">
        <span className="text-[var(--d-purple)]">▍</span>
        <span className="text-[var(--d-comment)]">{n}</span>
        {title}
      </p>
      {lead && (
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-[var(--d-comment)]">{lead}</p>
      )}
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

      {/* 05.1 · a sintaxe é matéria de Colors: aqui a cor classifica, não decora */}
      <DevSintaxe />

      {/* 06 · Grid · 07 · Iconography · 08 · Motion */}
      {DEV_INDEX.grid}
      <DevIconography />
      <DevMotion d={d} />
      <DevMotionInventory />

      {/* 09 · Components — as 6 galerias equiparam os 6 grupos do Criativo, e
          os capítulos nativos do _Dev (terminal, diff, estados, cartões,
          vazio) entram como matérias do mesmo caderno em vez de flutuarem
          numa sequência 01–08 própria. O kit fecha o grupo. */}
      <Group
        id="components"
        n="09"
        title="Components"
        lead="A biblioteca do realm, em quinze matérias: seis galerias que equiparam os grupos do Criativo, cinco peças que só existem aqui (terminal, diff, estados de projeto, cartões, vazio) e o chrome que toda página usa — navegação, bloco de código e as primitivas de composição. Fecha com o kit vivo, que é este mesmo catálogo rodando."
      >
        <DevButtons />
        <DevInputs />
        <DevSelection />
        <DevDataDisplay />
        <DevOverlays />
        <DevFeedback />
        <DevTerminal />
        <DevCodigo />
        <DevEstadosProjeto />
        <DevCartoes />
        <DevVazio />
        <DevNavegacao />
        <DevBlocoCodigo />
        <DevPrimitivas />
        <SubChapter
          id="kit"
          n="09.15"
          title="UI Kit"
          lead="Os componentes reais, não capturas — troque a versão para reimprimir o kit inteiro."
        >
          <div className="mt-1">{kit}</div>
        </SubChapter>
      </Group>

      {/* 10 · Patterns — 4 fluxos equiparando os 4 do Criativo (+ command
          palette + o devlog, que é o pattern de timeline nativo do realm) */}
      <Group
        id="patterns"
        n="10"
        title="Patterns"
        lead="Composições que já vêm resolvidas: autenticação, busca, formulário em etapas e FAQ — mais duas nativas do realm, a paleta de comandos e o devlog. Não são telas, são arranjos que se repetem."
      >
        <DevPatternLogin />
        <DevPatternSearch />
        <DevPatternMultiStep />
        <DevPatternFaq />
        {DEV_INDEX.patterns}
        <DevDevlog />
      </Group>

      {/* 11 · Templates — 8 páginas equiparando os 8 do Criativo (+ lista de rotas) */}
      <Group
        id="templates"
        n="11"
        title="Templates"
        lead="Páginas inteiras montadas com o kit, das oito que o portfólio realmente usa até a lista de rotas que as serve. Template aqui não é maquete: é a página que existe."
      >
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

      {/* 17–20 · os extras do índice. `secoes` estava renderizado lá em cima,
          junto de Components, carregando n="11" (o número de Templates) — saiu
          do lugar e do número. */}
      <DevSections />
      <DevOsThemes />
      <DevLab />
      <DevDocs />
    </div>
  )
}
