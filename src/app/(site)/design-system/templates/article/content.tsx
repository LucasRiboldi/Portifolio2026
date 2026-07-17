import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { ComicHeader } from "@/components/spiderverse/decor"
import { SvTag, SvBreadcrumb } from "@/components/ui/sv-data"
import { SvNewsletter } from "@/components/sections/sv-marketing"

export function ArticleTemplateContent({ headingAs = "h1" }: { headingAs?: "h1" | "h2" }) {
  // o cabeçalho da página já ocupa `headingAs`; o artigo-exemplo vem um nível abaixo
  const Title = headingAs === "h1" ? "h2" : "h3"
  return (
    <div>
      <Link href="/design-system/templates" className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/50 transition-colors hover:text-[var(--sv-cyan)]">
        <ArrowLeft className="size-3.5" /> Templates
      </Link>
      <ComicHeader as={headingAs} kicker="06 · Template" title="Página de" highlight="artigo" />

      <article className="mx-auto mt-6 max-w-2xl">
        <SvBreadcrumb items={[{ label: "Templates", href: "/design-system/templates" }, { label: "Design System" }]} />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SvTag color="magenta">Design System</SvTag>
          <SvTag color="cyan">Tokens</SvTag>
          <span className="inline-flex items-center gap-1 text-xs text-white/40"><Clock className="size-3" /> 5 min de leitura</span>
        </div>

        {/* título do artigo-exemplo: acompanha o nível do cabeçalho da página
            para não virar um segundo h1 (nem no documento único, nem na rota) */}
        <Title className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-white sm:text-5xl [-webkit-text-stroke:1px_#000]">
          Como construir um Design System comic-first
        </Title>

        <div className="mt-4 flex items-center gap-3 border-y-2 border-white/10 py-3">
          <span className="grid size-10 place-items-center rounded-full border-2 border-black bg-[var(--sv-magenta)] font-[family-name:var(--font-heavy)] text-black">LR</span>
          <div className="text-xs">
            <div className="font-bold text-white">Lucas Riboldi</div>
            <div className="text-white/40">13 de julho de 2026</div>
          </div>
        </div>

        <div className="prose-invert mt-6 space-y-4 text-sm leading-relaxed text-white/75">
          <p className="first-letter:float-left first-letter:mr-2 first-letter:font-[family-name:var(--font-display)] first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-[var(--sv-magenta)]">
            Um design system nasce dos tokens. Antes de qualquer componente, você define os valores atômicos —
            cor, espaço, forma e movimento — em uma fonte única de verdade.
          </p>
          <h2 className="sv-heavy text-lg uppercase tracking-wide text-[var(--sv-cyan)]">1. Comece pelos tokens</h2>
          <p>Três camadas: primitivos, semânticos e de componente. Cada nível referencia o anterior, garantindo consistência e temas trocáveis.</p>
          <h2 className="sv-heavy text-lg uppercase tracking-wide text-[var(--sv-cyan)]">2. Componha com composição</h2>
          <p>Prefira subcomponentes compostos a props booleanas infinitas. Use CVA para variantes e mantenha a lógica de negócio fora da UI.</p>
          <blockquote className="border-l-[6px] border-[var(--sv-yellow)] pl-4 italic text-white/85">
            “Um bom design system é invisível: ele acelera sem impor.”
          </blockquote>
        </div>

        <div className="mt-10">
          <SvNewsletter subtitle="Receba mais artigos como este." />
        </div>
      </article>
    </div>
  )
}
