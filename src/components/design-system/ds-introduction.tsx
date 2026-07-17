import { DsCard } from "@/design-system/ds-ui"
import { DS_ARCHITECTURE, STATUS_LABEL } from "@/design-system/architecture"
import type { RealmDesign } from "@/design-system/realms"

/**
 * 01 · Introduction — a seção que responde "por quê" antes de "o quê".
 *
 * Parte é comum aos três realms (como usar, contribuir, versionar): são
 * regras do repositório, não do universo. Parte vem do realm (objetivo,
 * filosofia, princípios), porque é aí que os três divergem de propósito.
 */
export function DsIntroduction({ d }: { d: RealmDesign }) {
  const prontas = DS_ARCHITECTURE.filter(s => s.em.includes(d.id)).length

  return (
    <section id="introduction" aria-label="01 · Introduction" className="scroll-mt-24">
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">01</span>
        Introduction
      </p>

      {/* ---- Objetivo & filosofia ---- */}
      <div className="grid gap-4 sm:grid-cols-2">
        <DsCard>
          <h3 className="sv-heavy mb-2 text-xs uppercase tracking-wide text-[var(--sv-cyan)]">
            Objetivo
          </h3>
          <p className="text-xs leading-relaxed text-white/70">
            Dar a {d.label} uma linguagem visual que se possa aplicar sem adivinhação: as decisões
            já foram tomadas e estão escritas, então quem constrói uma tela nova não recomeça do
            zero nem inventa uma variação a mais do mesmo botão.
          </p>
        </DsCard>

        <DsCard>
          <h3 className="sv-heavy mb-2 text-xs uppercase tracking-wide text-[var(--sv-cyan)]">
            Filosofia
          </h3>
          <p className="text-xs leading-relaxed text-white/70">
            {d.tagline} Este guia documenta o que <em>existe no código</em>, não o que seria bom
            existir: cada exemplo abaixo usa os componentes e classes reais. Se um quebrar, quebra
            aqui — é assim que a documentação evita mentir.
          </p>
        </DsCard>
      </div>

      {/* ---- Princípios ---- */}
      <h3 className="sv-heavy mb-3 mt-6 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
        Princípios
      </h3>
      <ol className="space-y-2">
        {d.principles.map((p, i) => (
          <li key={p} className="flex gap-3">
            <span className="sv-display shrink-0 text-2xl leading-none text-[var(--sv-yellow)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="pt-1 text-sm leading-snug text-white/75">{p}</p>
          </li>
        ))}
      </ol>

      {/* ---- Público & uso ---- */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <DsCard>
          <h3 className="sv-heavy mb-2 text-xs uppercase tracking-wide text-[var(--sv-cyan)]">
            Para quem é
          </h3>
          <ul className="space-y-1.5 text-xs leading-relaxed text-white/70">
            <li>
              <strong className="text-white/90">Designers</strong> — para escolher token em vez de
              inventar valor, e saber o que já está resolvido.
            </li>
            <li>
              <strong className="text-white/90">Desenvolvedores</strong> — para importar o
              componente existente em vez de reescrever, e ver os estados que precisam existir.
            </li>
            <li>
              <strong className="text-white/90">Quem chega agora</strong> — para entender por que o
              projeto tem três universos e o que muda entre eles.
            </li>
          </ul>
        </DsCard>

        <DsCard>
          <h3 className="sv-heavy mb-2 text-xs uppercase tracking-wide text-[var(--sv-cyan)]">
            Como usar
          </h3>
          <ol className="space-y-1.5 text-xs leading-relaxed text-white/70">
            <li>
              <strong className="text-white/90">1.</strong> Procure a seção no índice à esquerda —
              ele é o sumário deste documento.
            </li>
            <li>
              <strong className="text-white/90">2.</strong> Prefira sempre o token à constante:{" "}
              <code className="text-[var(--sv-cyan)]">var(--r-accent)</code> em vez do hex.
            </li>
            <li>
              <strong className="text-white/90">3.</strong> Se algo não existe aqui, provavelmente
              não deveria existir na tela. Proponha antes de criar.
            </li>
          </ol>
        </DsCard>
      </div>

      {/* ---- Estrutura ---- */}
      <h3 className="sv-heavy mb-2 mt-6 text-xs uppercase tracking-wide text-[var(--sv-yellow)]">
        Estrutura da documentação
      </h3>
      <p className="mb-3 max-w-3xl text-xs leading-relaxed text-white/60">
        As 16 seções são as mesmas nos três realms — é o que torna possível comparar “Motion no
        Criativo” com “Motion no Anfitrião” e ver que um usa spring e o outro não se move. O
        esqueleto é comum; a carne, não. Neste guia, {prontas} das {DS_ARCHITECTURE.length} já têm
        conteúdo.
      </p>
      <div className="overflow-x-auto rounded-md border-2 border-black">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[var(--sv-ink-2)] text-white/40">
              <th className="px-3 py-2 font-normal">#</th>
              <th className="px-3 py-2 font-normal">Seção</th>
              <th className="px-3 py-2 font-normal">Responde</th>
              <th className="px-3 py-2 font-normal">Aqui</th>
            </tr>
          </thead>
          <tbody>
            {DS_ARCHITECTURE.map(s => {
              const aqui = s.em.includes(d.id)
              return (
                <tr key={s.id} className="border-t border-white/10">
                  <td className="whitespace-nowrap px-3 py-1.5 font-mono text-[10px] text-white/35">
                    {s.n}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    {aqui ? (
                      <a href={`#${s.id}`} className="text-[var(--sv-cyan)] hover:underline">
                        {s.label}
                      </a>
                    ) : (
                      <span className="text-white/35">{s.label}</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-white/55">{s.desc}</td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-[10px] uppercase tracking-wide">
                    <span
                      style={{
                        color: aqui
                          ? s.status === "wip"
                            ? "var(--sv-yellow)"
                            : "var(--sv-lime)"
                          : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {aqui ? STATUS_LABEL[s.status] : "—"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ---- Contribuição & versionamento ---- */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <DsCard>
          <h3 className="sv-heavy mb-2 text-xs uppercase tracking-wide text-[var(--sv-cyan)]">
            Fluxo de contribuição
          </h3>
          <ol className="space-y-1.5 text-xs leading-relaxed text-white/70">
            <li>
              <strong className="text-white/90">1. Existe?</strong> Procure no índice e no catálogo
              antes de propor. Quase toda “necessidade nova” é uma variante de algo que já está aqui.
            </li>
            <li>
              <strong className="text-white/90">2. Token primeiro.</strong> Se a peça exige um valor
              que não é token, o problema é o valor, não a peça.
            </li>
            <li>
              <strong className="text-white/90">3. Fonte única.</strong> Componha o que existe; não
              copie. Duas cópias divergem em silêncio — é sempre uma questão de tempo.
            </li>
            <li>
              <strong className="text-white/90">4. Documente aqui.</strong> Um componente sem seção
              neste guia é um componente que ninguém vai achar.
            </li>
          </ol>
        </DsCard>

        <DsCard>
          <h3 className="sv-heavy mb-2 text-xs uppercase tracking-wide text-[var(--sv-cyan)]">
            Versionamento
          </h3>
          <p className="text-xs leading-relaxed text-white/70">
            Semântico, aplicado ao que quebra <em>consumo</em>, não ao que muda pixel:
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-white/70">
            <li>
              <code className="text-[var(--sv-magenta)]">major</code> — remover token ou variante,
              renomear classe: quebra quem usa.
            </li>
            <li>
              <code className="text-[var(--sv-yellow)]">minor</code> — acrescentar componente,
              variante ou token.
            </li>
            <li>
              <code className="text-[var(--sv-lime)]">patch</code> — corrigir valor, contraste ou
              texto.
            </li>
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-white/45">
            O histórico vive nos commits do repositório; a seção 16 · Changelog vai destilá-lo.
          </p>
        </DsCard>
      </div>
    </section>
  )
}
