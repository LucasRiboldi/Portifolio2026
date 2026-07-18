import Link from "next/link"
import type { RealmId } from "@/lib/realms"

/**
 * O card de cada realm na página de escolha do Design System.
 *
 * Cada um é desenhado na língua do seu universo — o mesmo princípio dos
 * guias: o card do _Dev é um painel de terminal Dracula, o do Anfitrião é um
 * recorte de folha impressa, o do Criativo é um painel comic. Um card
 * genérico para os três mentiria sobre o que há dentro.
 *
 * Usa valores literais (não as vars escopadas dos temas): o card é um
 * showcase isolado, e assim não arrasta o `min-height:100vh` de `.dracula`
 * nem o escopo `.dp` para cá.
 */

export interface RealmCardStat {
  label: string
  value: number | string
}

interface DsRealmCardProps {
  id: RealmId
  label: string
  tagline: string
  href: string
  stats: RealmCardStat[]
}

export function DsRealmCard({ id, label, tagline, href, stats }: DsRealmCardProps) {
  if (id === "developer") return <DevCard label={label} tagline={tagline} href={href} stats={stats} />
  if (id === "arcane") return <ArcaneCard label={label} tagline={tagline} href={href} stats={stats} />
  return <ComicCard label={label} tagline={tagline} href={href} stats={stats} />
}

type CardInner = Omit<DsRealmCardProps, "id">

/* ---------------- Criativo — painel comic ---------------- */
function ComicCard({ label, tagline, href, stats }: CardInner) {
  return (
    <Link href={href} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-md border-[3px] border-black bg-[var(--sv-ink-2)] shadow-[6px_6px_0_0_#000] transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-[-0.6deg] group-hover:shadow-[9px_9px_0_0_var(--sv-magenta)]">
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, var(--sv-magenta), var(--sv-cyan), var(--sv-yellow))" }}
        />
        <div className="flex flex-1 flex-col p-4">
          <h2 className="sv-display text-3xl uppercase text-[var(--sv-cyan)]">{label}</h2>
          <p className="mt-2 flex-1 text-xs leading-relaxed text-white/60">{tagline}</p>
          <dl className="mt-4 space-y-1 border-t border-white/10 pt-3 text-[10px] uppercase tracking-wide">
            {stats.map((s) => (
              <div key={s.label} className="flex justify-between gap-2">
                <dt className="text-white/40">{s.label}</dt>
                <dd className="text-[var(--sv-yellow)]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <span className="sv-heavy mt-4 inline-block text-[10px] uppercase tracking-wide text-[var(--sv-magenta)]">
            Abrir o guia →
          </span>
        </div>
      </article>
    </Link>
  )
}

/* ---------------- _Dev — painel de terminal Dracula ---------------- */
function DevCard({ label, tagline, href, stats }: CardInner) {
  return (
    <Link href={href} className="group block">
      <article
        className="flex h-full flex-col overflow-hidden rounded-[12px] border border-[#44475a] bg-[#282a36] font-mono transition-colors duration-200 group-hover:border-[#50fa7b]"
        style={{ fontFamily: "var(--font-mono, ui-monospace, Menlo, monospace)" }}
      >
        {/* barra de janela de terminal */}
        <div className="flex items-center gap-1.5 border-b border-[#44475a] bg-[#21222c] px-3 py-2">
          <span className="size-2.5 rounded-full bg-[#ff5555]" />
          <span className="size-2.5 rounded-full bg-[#f1fa8c]" />
          <span className="size-2.5 rounded-full bg-[#50fa7b]" />
          <span className="ml-2 text-[10px] text-[#6272a4]">~/design-system/dev</span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h2 className="text-xl font-bold text-[#f8f8f2]">
            <span className="text-[#50fa7b]">➜</span> {label}
            <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[#50fa7b] group-hover:animate-pulse" />
          </h2>
          <p className="mt-2 flex-1 text-xs leading-relaxed text-[#6272a4]">
            <span className="text-[#6272a4]">{"// "}</span>
            {tagline}
          </p>
          <dl className="mt-4 space-y-1 border-t border-[#44475a] pt-3 text-[10px]">
            {stats.map((s) => (
              <div key={s.label} className="flex justify-between gap-2">
                <dt className="text-[#6272a4]">{s.label}</dt>
                <dd className="text-[#f1fa8c]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <span className="mt-4 inline-block text-[10px] text-[#bd93f9]">$ open --guide ↵</span>
        </div>
      </article>
    </Link>
  )
}

/* ---------------- Anfitrião — recorte de folha impressa ---------------- */
function ArcaneCard({ label, tagline, href, stats }: CardInner) {
  return (
    <Link href={href} className="group block">
      <article
        className="flex h-full flex-col overflow-hidden rounded-sm border-2 border-[#2a2216] bg-[#e8dcbe] shadow-[3px_3px_0_0_rgba(42,34,22,0.4)] transition-transform duration-200 group-hover:-translate-y-1"
        style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif' }}
      >
        <div className="flex flex-1 flex-col p-4 text-[#1c1710]">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#7a5c34]">The Daily Prophet · edição</p>
          <h2
            className="mt-1 text-3xl font-bold uppercase leading-none"
            style={{ fontFamily: '"Playbill", "Bookman Old Style", Rockwell, Georgia, serif' }}
          >
            {label}
          </h2>
          <div className="mt-1.5 border-b-[3px] border-double border-[#2a2216]" />
          <p className="mt-2 flex-1 text-xs leading-snug text-[#43382a]">
            <span className="float-left mr-1 text-3xl font-bold leading-[0.8]">{tagline.charAt(0)}</span>
            {tagline.slice(1)}
          </p>
          <dl className="mt-3 space-y-1 border-t border-[#2a2216]/40 pt-2 text-[10px] uppercase tracking-wide">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-2">
                <dt className="text-[#6b5c45]">{s.label}</dt>
                <dd className="font-bold text-[#1c1710]">{s.value}</dd>
              </div>
            ))}
          </dl>
          <span className="mt-3 inline-block text-[10px] uppercase tracking-wide text-[#7a5c34] underline decoration-dotted underline-offset-2">
            Leia a edição →
          </span>
        </div>
      </article>
    </Link>
  )
}
