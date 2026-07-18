import { ComicHeader } from "@/components/spiderverse/decor"
import { DsSectionTitle, DsLead, DsCard } from "@/design-system/ds-ui"
import type { RealmDesign } from "@/design-system/realms"
import type { Realm } from "@/lib/realms"
import { DsIntroduction } from "./ds-introduction"
import { DsTokenTables, DsColors } from "./ds-token-tables"
import { SpecTable, RealmTokenGrid } from "./realm-specs"
import { RealmMotionLab } from "./realm-motion-lab"
import {
  CreativeFoundations,
  CreativeTokensCatalogo,
  CreativeGrid,
  CreativeIconographyChapter,
  CreativeMotionCatalogo,
  CreativeComponents,
  CreativePatterns,
  CreativeTemplates,
  CreativeAccessibility,
  CreativeContentDesignChapter,
  CreativeResources,
  CreativeChangelogChapter,
  CreativeSecoes,
  CreativeRetroOs,
  CreativeLab,
  CreativeDocumentacao,
  CreativeFim,
} from "./creative-chapters"
import { CreativeDimensions } from "./creative-dimensions"
import { CreativeSurfaces } from "./creative-surfaces"
import { CreativeComic } from "./creative-comic"
import { CreativeCover } from "./creative-cover"

/**
 * O guia de "O Criativo" — o scaffold comic, agora com corpo próprio.
 *
 * Paralelo ao DeveloperGuide (terminal Dracula) e ao ArcaneGuide (folha de
 * jornal). O Criativo era o único realm sem componente-guia: metade do
 * documento vivia solta dentro de `realms/[realm]/page.tsx` e a outra metade
 * em `creative-chapters.tsx`, e as duas metades não conversavam.
 *
 * ------------------------------------------------------------------
 * A ORDEM É O ÍNDICE. Não reordene sem mexer em architecture.ts.
 * ------------------------------------------------------------------
 * Era essa divisão que produzia a ordem quebrada: a página renderizava 01,
 * 03 e 05 primeiro, e só então entravam os capítulos começando pela 02. O
 * leitor via Design Tokens e Colors antes de Brand Foundation, e a sidebar
 * — que acende por IntersectionObserver na ordem do documento — saltava
 * para trás enquanto ele rolava para frente.
 *
 * As seções sem número (tokens de realm, elevação, raio, grelha do realm,
 * kit, catálogo, folhas) são específicas deste realm e não constam do índice
 * canônico: ficam ancoradas junto da seção-mãe a que pertencem.
 */
export function CreativeGuide({
  d,
  nav,
  kit,
}: {
  d: RealmDesign
  nav: Realm
  kit: React.ReactNode
}) {
  return (
    <>
      <ComicHeader
        kicker={`Design System · Realm ${nav.glyph}`}
        title={d.label.replace(/^O /, "")}
        highlight="design system"
        subtitle={d.tagline}
      />

      <DsLead>
        Fonte única em <code className="text-[var(--sv-cyan)]">src/design-system/realms.ts</code>. A
        escala compartilhada (spacing, z-index, breakpoints, durações) vive em{" "}
        <code className="text-[var(--sv-cyan)]">tokens.ts</code> e não é repetida por realm — repetir
        três vezes é como a inconsistência começa. Rota do realm:{" "}
        <code className="text-[var(--sv-cyan)]">{nav.route}</code>.
      </DsLead>

      {/* 01 · Introduction — absorveu os "Princípios" que antes flutuavam
          soltos: princípio sem objetivo e sem como-usar é frase de efeito. */}
      <DsIntroduction d={d} />

      {/* 02 · Brand Foundation */}
      <CreativeFoundations />

      {/* 03 · Design Tokens — o SwatchGrid antigo saiu: mostrava só nome e hex.
          As tabelas novas derivam RGB, HSL e contraste do mesmo hex. */}
      <DsTokenTables d={d} />
      <CreativeTokensCatalogo />

      {/* id distinto de `tokens` (o capítulo 03): dois elementos com o mesmo
          id são HTML inválido e a âncora salta para o primeiro. */}
      <DsSectionTitle id="tokens-realm">Tokens de realm</DsSectionTitle>
      <DsLead>
        Acima estão as primitivas deste realm. Aqui está a camada semântica:{" "}
        <code className="text-[var(--sv-cyan)]">--r-*</code> tem o mesmo nome nos três universos e
        resolve no valor de cada um, escopado pela classe do realm em{" "}
        <code className="text-[var(--sv-cyan)]">src/styles/realm-tokens.css</code>. É o que permite
        escrever um componente que atravessa os três sem um <code>if</code>.
      </DsLead>
      <div className="mt-4">
        <RealmTokenGrid scope={d.scope} />
      </div>

      <DsSectionTitle id="elevacao">Elevação</DsSectionTitle>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {d.elevation.map((e) => (
          <div key={e.name} className="text-center">
            <div
              style={{ boxShadow: e.value }}
              className="mx-auto h-14 w-14 rounded-md border-[3px] border-black bg-[var(--sv-ink-2)]"
            />
            <span className="mt-2 block font-mono text-[0.6rem] text-white/50">{e.name}</span>
          </div>
        ))}
      </div>
      <SpecTable rows={d.elevation} />

      <DsSectionTitle id="raio">Raio</DsSectionTitle>
      <SpecTable rows={d.radius} />

      {/* 04 · Typography */}
      <DsSectionTitle id="typography" n="04">Typography</DsSectionTitle>
      <div className="space-y-3">
        {d.typography.map((t) => (
          <DsCard key={t.role}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className={`${t.className} text-3xl`}>{t.family}</p>
              <p className="font-mono text-[10px] text-[var(--sv-cyan)]">
                {t.token} · .{t.className}
              </p>
            </div>
            <p className="sv-heavy mt-1 text-[11px] uppercase tracking-wide text-[var(--sv-magenta)]">
              {t.role}
            </p>
            <p className="mt-1 text-xs leading-snug text-white/60">{t.usage}</p>
          </DsCard>
        ))}
      </div>

      {/* 05 · Colors */}
      <DsColors d={d} />

      {/* 06 · Grid — e a grelha do realm, que são as specs deste universo.
          id distinto de `grid`: o capítulo é o sistema de grid completo. */}
      <CreativeGrid />
      <DsSectionTitle id="grid-realm">Grelha do realm</DsSectionTitle>
      <SpecTable rows={d.grid} />

      {/* 07 · Iconography */}
      <CreativeIconographyChapter />

      {/* 08 · Motion */}
      <DsSectionTitle id="motion" n="08">Motion</DsSectionTitle>
      <DsLead>
        Cada gesto abaixo toca de verdade, com as mesmas curvas do realm. Documentar movimento em
        texto é o jeito mais fácil de a documentação mentir — o easing muda no código e a tabela
        continua igual. Registro em{" "}
        <code className="text-[var(--sv-cyan)]">src/design-system/realm-motion.ts</code>.
      </DsLead>
      <div className="mt-4">
        <RealmMotionLab realm={d.id} />
      </div>
      <CreativeMotionCatalogo />

      {/* 09 · Components — as galerias, mais o kit vivo e o catálogo, que são
          este mesmo grupo rodando e tabelado. */}
      <CreativeComponents />

      <DsSectionTitle id="kit">UI Kit</DsSectionTitle>
      <DsLead>
        Os componentes reais, não capturas — se um quebrar, quebra aqui também, que é o ponto.
        Troque a versão para reimprimir o kit inteiro noutra chapa.
      </DsLead>
      <div className="mt-4">{kit}</div>

      <DsSectionTitle id="catalogo">Catálogo</DsSectionTitle>
      <div className="space-y-5">
        {d.kit.map((g) => (
          <div key={g.group}>
            <p className="sv-heavy mb-2 text-[11px] uppercase tracking-wide text-[var(--sv-yellow)]">
              {g.group}
            </p>
            <div className="overflow-x-auto rounded-md border-2 border-black">
              <table className="w-full text-left text-xs">
                <tbody>
                  {g.items.map((it) => (
                    <tr key={it.name} className="border-b border-white/10 last:border-0">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[var(--sv-cyan)]">
                        {it.name}
                      </td>
                      <td className="px-3 py-2">
                        {it.variants && (
                          <p className="font-mono text-[10px] text-white/50">{it.variants}</p>
                        )}
                        <p className="text-white/60">{it.note}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] text-white/35">
                        {it.from ?? "css"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* 09.7 · as dimensões — o sistema de temas do realm */}
      <CreativeDimensions />
      <CreativeSurfaces />
      <CreativeComic />
      <CreativeCover />

      {/* 10–11 · Patterns e Templates */}
      <CreativePatterns />
      <CreativeTemplates />

      {/* 12–13 · Accessibility e Content Design */}
      <CreativeAccessibility />
      <CreativeContentDesignChapter />

      {/* 14 · Brand */}
      <DsSectionTitle id="brand" n="14">Brand</DsSectionTitle>
      <DsCard>
        <p className="text-sm leading-snug text-white/70">{d.logo}</p>
      </DsCard>

      {/* 15 · Resources — e as folhas de estilo deste realm. */}
      <CreativeResources />
      <DsSectionTitle id="css">Folhas deste realm</DsSectionTitle>
      <div className="flex flex-wrap gap-2">
        {d.css.map((f) => (
          <code
            key={f}
            className="rounded border-2 border-black bg-[var(--sv-ink-2)] px-2 py-1 font-mono text-[11px] text-[var(--sv-cyan)]"
          >
            src/styles/{f}
          </code>
        ))}
      </div>

      {/* 16 · Changelog */}
      <CreativeChangelogChapter />

      {/* 17–20 · os extras do índice */}
      <CreativeSecoes />
      <CreativeRetroOs />
      <CreativeLab />
      <CreativeDocumentacao />

      <CreativeFim />
    </>
  )
}
