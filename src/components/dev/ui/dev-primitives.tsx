/**
 * DEV — primitivas do realm.
 *
 * Cinco arranjos estavam duplicados à mão em todas as páginas do realm: o
 * cabeçalho de card (título + selo), a lista de tags, o link de saída "❯ repo",
 * o título de seção e o indicador numérico. A duplicação já tinha divergido —
 * uns arquivos usavam `text-sm`, outros `style={{ marginTop }}` inline, e o
 * espaçamento entre blocos era diferente em cada página.
 *
 * Cada primitiva aqui tem uma responsabilidade e devolve marcação SEMÂNTICA:
 * `DevSection` produz `<section aria-labelledby>` com heading de verdade (antes
 * eram `<h2>` órfãos, irmãos de `<div>`, o que achatava o outline do documento),
 * `TagList` produz `<ul>` porque é uma lista, e `DevExternalLink` marca saída do
 * site — informação que o usuário não tinha.
 */

import Link from "next/link"
import type { ReactNode } from "react"

/* ────────────────────────────────────────────────────────────────────────
   SEÇÃO

   O identificador numérico não é ornamento: dá referência estável ao bloco
   ("§03") e torna a hierarquia da página visível numa interface densa. A
   contagem em `meta` responde a "quanto tem aqui dentro?" antes da rolagem.
   ──────────────────────────────────────────────────────────────────────── */
export function DevSection({
  id,
  index,
  title,
  meta,
  note,
  children,
}: {
  /** Âncora da seção. Vira o `id` do elemento e a base do `aria-labelledby`. */
  id: string
  /** Posição na página; renderizada como §NN. */
  index: number
  title: string
  /** Metadado curto alinhado à direita da régua — tipicamente uma contagem. */
  meta?: string
  /** Uma linha de contexto sob o título, quando o título não basta. */
  note?: string
  children: ReactNode
}) {
  const headingId = `${id}-titulo`
  return (
    <section id={id} className="dv-section" aria-labelledby={headingId}>
      <div className="dv-section-head">
        <span className="dv-section-id" aria-hidden>
          §{String(index).padStart(2, "0")}
        </span>
        <h2 id={headingId}>{title}</h2>
        {meta && <span className="dv-section-meta">{meta}</span>}
        {note && <p className="dv-section-note">{note}</p>}
      </div>
      <div className="dv-section-body">{children}</div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   LISTA DE TAGS

   Era um `<div>` com spans em cinco arquivos. Um leitor de tela anunciava
   "TypeScript React Node" como texto corrido, sem dizer que são itens de uma
   lista nem quantos são.
   ──────────────────────────────────────────────────────────────────────── */
export function TagList({ items, label = "Tecnologias" }: { items: readonly string[]; label?: string }) {
  if (items.length === 0) return null
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((t) => (
        <li key={t} className="dv-tag">
          {t}
        </li>
      ))}
    </ul>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   LINK DE SAÍDA

   O símbolo "❯" vinha escrito no JSX de quatro arquivos; agora é do CSS. O
   `↗` marca que o link deixa o site — e o texto acessível diz o destino, que
   "repo" sozinho não dizia.
   ──────────────────────────────────────────────────────────────────────── */
export function DevExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="dv-out" data-external="true">
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  )
}

/** Link interno com a mesma marcação visual do link de saída, sem o `↗`. */
export function DevInternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="dv-out">
      {children}
    </Link>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   INDICADOR

   Um número grande sozinho ("3") não informa nada; o par número + rótulo +
   destino é o que faz dele um instrumento navegável.
   ──────────────────────────────────────────────────────────────────────── */
export function StatTile({
  value,
  label,
  href,
  color,
}: {
  value: number
  label: string
  href: string
  color: string
}) {
  return (
    <Link href={href} className="dv-stat">
      <div className="n" style={{ color }}>
        {value}
      </div>
      <div className="l">{label}</div>
    </Link>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   METADADOS

   Lista de descrição de verdade (`<dl>`), não spans soltos: o par rótulo/valor
   é a estrutura que o conteúdo tem, e leitores de tela sabem lê-la.
   ──────────────────────────────────────────────────────────────────────── */
export function MetaRow({ items }: { items: readonly { k: string; v: ReactNode }[] }) {
  return (
    <dl className="dv-meta">
      {items.map(({ k, v }) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   PAINEL

   `.dv-card` continua sendo a superfície (documentada no guia). O que se
   componentiza aqui é o ARRANJO do cabeçalho e do rodapé, que quatro páginas
   remontavam com utilitários Tailwind soltos e divergentes.
   ──────────────────────────────────────────────────────────────────────── */
export function DevPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`dv-card ${className}`.trim()}>{children}</article>
}

export function DevPanelHead({ title, badge, href }: { title: string; badge?: ReactNode; href?: string }) {
  return (
    <div className="dv-panel-head">
      <h3>{href ? <Link href={href}>{title}</Link> : title}</h3>
      {badge}
    </div>
  )
}

export function DevPanelFoot({ children }: { children: ReactNode }) {
  return <div className="dv-panel-foot">{children}</div>
}
