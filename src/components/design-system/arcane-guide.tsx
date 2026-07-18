import type { RealmDesign } from "@/design-system/realms"
import {
  ArcaneTypography,
  ArcaneManchete,
  ArcaneCapitular,
  ArcaneGrid,
  ArcaneFiletes,
  ArcaneCaixas,
  ArcaneClassificados,
  ArcaneExpediente,
  ArcaneAccessibility,
  ArcaneSilencio,
  SubChapter,
} from "./arcane-chapters"
import {
  ArcaneGravura,
  ArcaneReportagens,
  ArcaneEditorial,
  ArcaneServico,
  ArcaneGrafico,
  ArcaneMarcas,
  ArcaneCabecalho,
} from "./arcane-components"
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
import {
  ArcaneSecoes,
  ArcaneTiragens,
  ArcaneLab,
  ArcaneDocumentacao,
} from "./arcane-extras"

/**
 * O guia de "O Anfitrião" — inteiro numa folha de jornal.
 *
 * Paralelo ao DeveloperGuide (que fez o _Dev virar terminal): aqui o guia
 * inteiro vira uma folha impressa. Sai o scaffold comic (ComicHeader,
 * sv-canvas, DsSectionTitle) — a página é a folha, sobre a mesa escura da
 * redação (o ds-canvas--arcane). O único <h1> é o nameplate no masthead.
 *
 * ------------------------------------------------------------------
 * A ORDEM É O ÍNDICE. Não reordene sem mexer em architecture.ts.
 * ------------------------------------------------------------------
 * Esta lista segue exatamente `DS_ARCHITECTURE`, 01 → 20, com as matérias
 * (SubChapter) logo abaixo do caderno a que pertencem. Isso não é preciosismo:
 * a sidebar acende por IntersectionObserver na ordem do documento, então uma
 * seção fora de lugar faz o realce saltar para trás enquanto se rola para
 * frente.
 *
 * Antes daqui o guia renderizava Colors (05) ANTES de Typography (04), e os
 * capítulos nativos da folha traziam uma numeração própria 01–11 que colidia
 * com a canônica em nove pontos — clicar "04 Typography" no índice levava a um
 * título que dizia "№ 01". Agora o número vem de uma fonte só.
 *
 * O UI Kit chega por `kit` porque o preview vive na pasta da rota.
 */
export function ArcaneGuide({ d, kit }: { d: RealmDesign; kit: React.ReactNode }) {
  return (
    <div className="dp min-w-0 rounded-sm p-5 sm:p-8" style={{ color: "var(--dp-ink)" }}>
      <ArcaneMasthead d={d} />

      {/* 01 · o editorial de abertura */}
      <ArcaneIntro d={d} />

      {/* 02 · a oficina de composição, e os filetes como sua matéria */}
      <ArcaneFoundations />
      <ArcaneFiletes />

      {/* 03 · tintas & tokens */}
      <ArcaneTokens d={d} />

      {/* 04 · as vozes, e as duas matérias que a tipografia comanda */}
      <ArcaneTypography />
      <ArcaneManchete />
      <ArcaneCapitular />

      {/* 05 · as superfícies */}
      <ArcaneColors d={d} />

      {/* 06 · a grade de colunas */}
      <ArcaneGrid />

      {/* 07 · ornamentos & sinais */}
      <ArcaneIconography />

      {/* 08 · movimento — e o silêncio, que é o que este realm tem de motion */}
      <ArcaneMotion d={d} />
      <ArcaneSilencio />

      {/* 09 · a caixa de tipos, suas três matérias, e a oficina viva.
          O kit fecha o caderno de componentes em vez de flutuar no fim da
          folha: é o catálogo acima, impresso. Antes ele carregava n="09" e
          colidia com o próprio caderno que ilustra. */}
      <ArcaneComponents />
      <ArcaneGravura />
      <ArcaneCaixas />
      <ArcaneClassificados />
      <ArcaneReportagens />
      <ArcaneEditorial />
      <ArcaneServico />
      <ArcaneGrafico />
      <ArcaneMarcas />
      <SubChapter
        id="kit"
        n="09.9"
        title="Oficina · UI Kit"
        lead="Os componentes reais da folha, não capturas — troque a versão para reimprimir a mesma matéria noutra tiragem."
      >
        <div className="mt-1">{kit}</div>
      </SubChapter>

      {/* 10–11 · composições resolvidas e os cadernos */}
      <ArcanePatterns />
      <ArcaneTemplates />

      {/* 12 · as tintas sobre o papel */}
      <ArcaneAccessibility />

      {/* 13–16 · manual da redação, brasão, material da oficina, hemeroteca */}
      <ArcaneContentDesign />
      <ArcaneBrand d={d} />
      <ArcaneResources d={d} />
      <ArcaneChangelog />

      {/* 17–20 · os extras do índice: blocos de página (com o expediente como
          matéria), tiragens, bancada de provas e o manual da casa. */}
      <ArcaneSecoes />
      <ArcaneCabecalho />
      <ArcaneExpediente />
      <ArcaneTiragens />
      <ArcaneLab />
      <ArcaneDocumentacao d={d} />
    </div>
  )
}
