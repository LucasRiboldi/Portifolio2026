/* ------------------------------------------------------------------
   Cadernos 13–16 do índice do Anfitrião — manual da redação, brasão,
   material da oficina e a hemeroteca (changelog). Extraídos de
   arcane-index-chapters.tsx para manter cada arquivo sob 500 linhas.
   Reusa as primitivas de ./arcane-chapters — mesmos tokens .dp.
   ------------------------------------------------------------------ */
import type { RealmDesign } from "@/design-system/realms"
import { Chapter, Folha, Nota } from "./arcane-chapters"

/* ══════════════ 13 · CONTENT DESIGN ══════════════ */
const REDACAO = [
  {
    regra: "A manchete afirma, no presente",
    sim: "Ministério nega tudo",
    nao: "O Ministério teria negado as acusações",
  },
  {
    regra: "Voz ativa — quem fez o quê",
    sim: "Aranha salva a cidade",
    nao: "A cidade foi salva",
  },
  {
    regra: "O chapéu classifica, não repete",
    sim: "Exclusivo · Terra-2026",
    nao: "Notícia importante sobre o Ministério",
  },
  {
    regra: "O vazio é uma nota, não um desenho",
    sim: "Aguardando composição…",
    nao: "Ilustração de caixa vazia",
  },
  {
    regra: "Números por extenso até dez",
    sim: "três cadernos · 12 páginas",
    nao: "3 cadernos · doze páginas",
  },
  {
    regra: "O erro se assume, não se disfarça",
    sim: "A redação lamenta o engano",
    nao: "Ops! Algo deu errado :(",
  },
  {
    regra: "A legenda diz o que a foto não diz",
    sim: "A rotativa, horas antes do fecho",
    nao: "Foto de uma máquina",
  },
  {
    regra: "Sem exclamação — a folha não grita",
    sim: "Ministério confirma a portaria",
    nao: "Ministério confirma a portaria!",
  },
]

/** O vocabulário da casa: um nome por peça, para não divergirem. */
const VOCABULARIO = [
  ["Chapéu", "A linha curta ACIMA da manchete, que classifica"],
  ["Manchete", "O título grande da matéria principal"],
  ["Linha fina", "A frase ABAIXO da manchete, que qualifica"],
  ["Olho", "A citação destacada no meio do texto"],
  ["Capitular", "A letra grande que abre o parágrafo"],
  ["Fólio", "O número da página, no pé"],
  ["Expediente", "Quem imprime, onde, em que edição"],
  ["Trilho", "A coluna estreita lateral"],
]

export function ArcaneContentDesign() {
  return (
    <Chapter
      id="content-design"
      n="13"
      title="Manual da redação"
      lead="A folha também tem voz, e ela é econômica: manchete no presente, voz ativa, chapéu que classifica em vez de gritar. O texto de interface aqui se escreve como se escreve jornal — não como se anuncia software."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {REDACAO.map((r) => (
          <Folha key={r.regra}>
            <p className="text-sm" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>{r.regra}</p>
            <div className="my-2 dp-rule dp-rule--hair" />
            <p className="flex gap-2 text-xs" style={{ color: "var(--dp-ink-2)" }}>
              <span style={{ color: "var(--dp-ink)" }}>☞</span>
              <span style={{ fontFamily: "var(--dp-head)" }}>{r.sim}</span>
            </p>
            <p className="mt-1 flex gap-2 text-xs" style={{ color: "var(--dp-ink-3)" }}>
              <span style={{ color: "#8a3020" }}>✕</span>
              <span className="italic line-through">{r.nao}</span>
            </p>
          </Folha>
        ))}
      </div>

      {/* O vocabulário — um nome por peça */}
      <p className="mb-2 mt-5 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        O vocabulário da casa
      </p>
      <Folha>
        <p className="mb-3 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
          Metade das discussões de design é gente chamando a mesma peça por nomes diferentes. Aqui
          cada uma tem um nome só — e é o nome de oficina, não o de software.
        </p>
        {/* `.dp-term` é a peça de glossário da folha (versalete no termo, tinta
            fraca na definição, pontilhado entre entradas). Aqui havia um <dl>
            refeito à mão com estilo inline que imitava — mal — o que a classe
            já fazia: o guia do sistema contornando o próprio sistema. */}
        <div className="grid gap-x-6 sm:grid-cols-2">
          {VOCABULARIO.map(([termo, def]) => (
            <p key={termo} className="dp-term">
              <b>{termo}</b> — <em>{def}</em>
            </p>
          ))}
        </div>
      </Folha>
    </Chapter>
  )
}

/* ══════════════ 15 · RESOURCES ══════════════ */
export function ArcaneResources({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="resources"
      n="15"
      title="O material da oficina"
      lead="O que a gráfica guarda na estante: as fontes fundidas, as folhas de estilo e a caixa de ornamentos. Tudo real, do próprio projeto — não há download que não exista no código."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            As fontes fundidas
          </p>
          <ul className="space-y-1.5">
            {d.typography.map((t) => (
              <li key={t.role} className="flex items-baseline justify-between gap-2 border-b border-[var(--dp-rule)]/30 pb-1 text-xs" style={{ color: "var(--dp-ink-2)" }}>
                <span style={{ color: "var(--dp-ink)" }}>{t.family}</span>
                <code className="font-mono text-[10px]" style={{ color: "var(--dp-sepia)" }}>{t.token}</code>
              </li>
            ))}
          </ul>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            As folhas de estilo
          </p>
          <div className="flex flex-wrap gap-2">
            {d.css.map((f) => (
              <code
                key={f}
                className="border border-[var(--dp-rule)] px-2 py-1 font-mono text-[11px]"
                style={{ background: "var(--dp-paper)", color: "var(--dp-ink-2)" }}
              >
                src/styles/{f}
              </code>
            ))}
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A caixa de ornamentos
          </p>
          <p className="mt-1 select-all text-2xl leading-relaxed" style={{ color: "var(--dp-ink)" }}>
            ❦ ❧ ☞ ¶ § † ‡ ※ ⁂ ☙ ✝ ℔
          </p>
          <Nota>Selecione e copie — são caracteres, não arquivos.</Nota>
        </Folha>

        <Folha className="sm:col-span-2">
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            As medidas da oficina — o resumo que se leva para a bancada
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" style={{ color: "var(--dp-ink-2)" }}>
              <tbody>
                {[
                  ["Medida da coluna", "~28–36ch", "O que torna a old style legível"],
                  ["Raio", "0", "Guilhotina não faz canto redondo"],
                  ["Elevação", "nenhuma", "Separação é fio e moldura, nunca sombra"],
                  ["Corpo", "15px / 1.42", "Base da folha, em .dp"],
                  ["Colunas do corpo", "2 → 4", "Conforme a largura, via .dp-lead-body"],
                  ["Tinta segura", "--dp-ink · --dp-ink-2", "AA nas duas folhas"],
                ].map(([k, v, o]) => (
                  <tr key={k} className="border-t border-[var(--dp-rule)]/30 first:border-0">
                    <td className="whitespace-nowrap py-1.5 pr-4" style={{ color: "var(--dp-ink)" }}>{k}</td>
                    <td className="whitespace-nowrap py-1.5 pr-4 font-mono text-[11px]" style={{ color: "var(--dp-sepia)" }}>{v}</td>
                    <td className="py-1.5" style={{ color: "var(--dp-ink-3)" }}>{o}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Folha>
      </div>
    </Chapter>
  )
}

/* ══════════════ 16 · CHANGELOG ══════════════ */
const EDICOES = [
  {
    data: "18 jul 2026",
    ed: "Nº 5",
    tipo: "Edição",
    o: "O índice completo — ornamentos, caixa de tipos, cadernos, manual da redação e a hemeroteca",
  },
  {
    data: "18 jul 2026",
    ed: "Nº 4",
    tipo: "Edição extra",
    o: "A folha inteira — o Anfitrião ganha chrome de jornal, do masthead ao expediente",
  },
  {
    data: "17 jul 2026",
    ed: "Nº 3",
    tipo: "Edição extra",
    o: "Três perfis, três sistemas — o Design System separa-se por realm",
  },
  {
    data: "17 jul 2026",
    ed: "Nº 2",
    tipo: "Edição",
    o: "Tintas medidas — tabelas de token com contraste WCAG sobre as duas folhas",
  },
  {
    data: "15 jul 2026",
    ed: "Nº 1",
    tipo: "Primeira tiragem",
    o: "O portal dos três multiversos",
  },
]

export function ArcaneChangelog() {
  return (
    <Chapter
      id="changelog"
      n="16"
      title="Números anteriores"
      lead="O arquivo da folha: cada edição com a sua data e o que trouxe. Destilado dos commits reais do projeto — não é ficção de changelog, é a hemeroteca."
    >
      <Folha>
        <div className="space-y-2.5">
          {EDICOES.map((e) => (
            <div key={e.ed} className="border-b border-[var(--dp-rule)]/30 pb-2 last:border-0">
              <div className="flex items-baseline gap-3">
                <span className="w-14 shrink-0 text-[11px]" style={{ color: "var(--dp-sepia)", fontFamily: "var(--dp-head)" }}>
                  {e.ed}
                </span>
                <span className="min-w-0 flex-1 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
                  {e.o}
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide" style={{ color: "var(--dp-ink-3)" }}>
                  {e.data}
                </span>
              </div>
              <p className="ml-[4.25rem] text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--dp-ink-3)" }}>
                {e.tipo}
              </p>
            </div>
          ))}
        </div>
      </Folha>

      {/* Semântica de versão, em linguagem de jornal */}
      <p className="mb-2 mt-5 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        Como se numera uma edição
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            t: "Edição extra",
            v: "major",
            o: "Refunde a chapa: remove token, renomeia classe, muda a diagramação. Quem compunha do jeito antigo precisa recompor.",
          },
          {
            t: "Edição",
            v: "minor",
            o: "Acrescenta caderno, peça ou ornamento. Nada do que já existia deixa de servir.",
          },
          {
            t: "Errata",
            v: "patch",
            o: "Corrige valor, contraste ou texto. A matéria é a mesma; o engano é que sai.",
          },
        ].map((v) => (
          <Folha key={v.t}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-base" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
                {v.t}
              </span>
              <code className="font-mono text-[10px]" style={{ color: "var(--dp-sepia)" }}>{v.v}</code>
            </div>
            <div className="my-1.5 dp-rule dp-rule--hair" />
            <p className="text-[11px] leading-snug" style={{ color: "var(--dp-ink-2)" }}>{v.o}</p>
          </Folha>
        ))}
      </div>
    </Chapter>
  )
}
