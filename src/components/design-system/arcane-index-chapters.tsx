/* ------------------------------------------------------------------
   As seções do índice que faltavam ao guia de "O Anfitrião".
   ------------------------------------------------------------------
   Escritas na língua da folha, não traduzidas do comic: aqui não há
   "template de pricing" nem "icon font". Há a oficina de composição, os
   ornamentos de tipógrafo (cast metal, não SVG), os cadernos, o manual da
   redação, o material da gráfica e os números anteriores.

   Reusa Chapter/Folha de arcane-chapters — mesmos tokens .dp e mesmo
   compasso. Se uma classe .dp-* quebrar, quebra aqui.
   ------------------------------------------------------------------ */
import type { RealmDesign } from "@/design-system/realms"
import { Chapter, Folha } from "./arcane-chapters"

/** Rótulo de caixa no tom da folha — o "quando usar" de cada peça. */
function Nota({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--dp-ink-3)" }}>
      {children}
    </p>
  )
}

/* ══════════════ 02 · FOUNDATIONS ══════════════ */
export function ArcaneFoundations() {
  return (
    <Chapter
      id="foundations"
      n="02"
      title="A oficina de composição"
      lead="Antes da cor e do componente vêm as regras do impressor: a medida, a entrelinha, o espaço e o fio. São elas que fazem uma folha ler como folha — decisões de 1920 que aqui ainda mandam."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A medida — largura de coluna
          </p>
          <p className="dp-lead-body" style={{ color: "var(--dp-ink)", maxWidth: "34ch" }}>
            A coluna estreita não é estética: é o que torna a old style legível. O olho não salta
            linhas de 34 caracteres. A rotativa impunha; aqui é escolha.
          </p>
          <Nota>Corpo justificado e hifenizado, ~28–36ch por coluna.</Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O espaço — tipos de tira
          </p>
          <table className="w-full text-left text-sm" style={{ color: "var(--dp-ink-2)" }}>
            <tbody>
              <tr className="border-b border-[var(--dp-rule)]/30">
                <td className="py-1 pr-3 text-center text-lg" style={{ color: "var(--dp-ink)" }}>—</td>
                <td className="py-1">travessão (em) · aparte, diálogo</td>
              </tr>
              <tr className="border-b border-[var(--dp-rule)]/30">
                <td className="py-1 pr-3 text-center text-lg" style={{ color: "var(--dp-ink)" }}>–</td>
                <td className="py-1">meia-risca (en) · intervalos, 1920–26</td>
              </tr>
              <tr>
                <td className="py-1 pr-3 text-center text-lg" style={{ color: "var(--dp-ink)" }}>·</td>
                <td className="py-1">ponto médio · separa itens do expediente</td>
              </tr>
            </tbody>
          </table>
        </Folha>

        <Folha>
          <p className="mb-3 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Os fios — toda a hierarquia de separação
          </p>
          <div className="space-y-3">
            <div>
              <div className="dp-rule dp-rule--hair" />
              <Nota>.dp-rule--hair · separa itens dentro de um bloco</Nota>
            </div>
            <div>
              <div className="dp-rule" />
              <Nota>.dp-rule · separa matérias</Nota>
            </div>
            <div>
              <div className="dp-rule dp-rule--double" />
              <Nota>.dp-rule--double · fecha o masthead e as seções</Nota>
            </div>
            <div>
              <div className="dp-rule dp-rule--thick" />
              <Nota>.dp-rule--thick · abre cada caderno</Nota>
            </div>
          </div>
        </Folha>

        <Folha className="flex flex-col justify-center">
          <p className="mb-1 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Sem canto redondo
          </p>
          <p className="text-4xl leading-none" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            raio&nbsp;=&nbsp;0
          </p>
          <Nota>Papel cortado a guilhotina não tem canto arredondado. Profundidade é moldura e fio, nunca sombra.</Nota>
        </Folha>
      </div>
    </Chapter>
  )
}

/* ══════════════ 07 · ICONOGRAPHY ══════════════ */
const ORNAMENTOS = [
  { g: "❦", nome: "Fleurão", uso: "Ornamento de fecho — encerra uma matéria" },
  { g: "❧", nome: "Aldus", uso: "Vira-fólio, aponta o fim da coluna" },
  { g: "☞", nome: "Manícula", uso: "A mãozinha — chama atenção para um aviso" },
  { g: "¶", nome: "Pilcrow", uso: "Marca de parágrafo, na revisão" },
  { g: "§", nome: "Secção", uso: "Referência a caderno ou cláusula" },
  { g: "†", nome: "Adaga", uso: "Nota de rodapé, segunda chamada" },
  { g: "‡", nome: "Adaga dupla", uso: "Terceira chamada de nota" },
  { g: "※", nome: "Sinal de nota", uso: "Referência cruzada oriental" },
  { g: "⁂", nome: "Asterismo", uso: "Quebra de seção sem fio" },
  { g: "☙", nome: "Rosa reversa", uso: "Ornamento de abertura" },
  { g: "✝", nome: "Óbito", uso: "Antecede a nota de falecimento" },
  { g: "℔", nome: "Libra", uso: "Preços e pesos nos classificados" },
]

export function ArcaneIconography() {
  return (
    <Chapter
      id="iconography"
      n="07"
      title="Ornamentos & sinais"
      lead="Não há icon font em 1920 — os sinais são peças de metal fundido da caixa do tipógrafo. Cada um tem função, não é enfeite: o fleurão fecha, a manícula aponta, a adaga chama a nota. Todos existem em Unicode; nada foi desenhado."
    >
      <Folha>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
          {ORNAMENTOS.map((o) => (
            <div key={o.nome} className="flex items-start gap-3 border-t border-[var(--dp-rule)]/25 pt-2 first:border-0 [&:nth-child(2)]:border-0 sm:[&:nth-child(3)]:border-0 lg:[&:nth-child(4)]:border-0">
              <span className="w-7 shrink-0 text-center text-2xl leading-none" style={{ color: "var(--dp-ink)" }}>
                {o.g}
              </span>
              <span className="min-w-0">
                <span className="block text-xs" style={{ color: "var(--dp-ink)" }}>{o.nome}</span>
                <span className="block text-[10px] leading-snug" style={{ color: "var(--dp-ink-3)" }}>{o.uso}</span>
              </span>
            </div>
          ))}
        </div>
      </Folha>
    </Chapter>
  )
}

/* ══════════════ 09 · COMPONENTS ══════════════ */
const PECAS = [
  { cls: ".dp-kicker", nome: "Chapéu", sim: "Classifica a matéria acima da manchete", nao: "Nunca como título — não afirma nada" },
  { cls: ".dp-bighead", nome: "Manchete", sim: "A afirmação da página, em slab pesada", nao: "Uma por página; duas e a hierarquia some" },
  { cls: ".dp-subhead", nome: "Linha fina", sim: "Qualifica a manchete em uma frase", nao: "Não repete a manchete com outras palavras" },
  { cls: ".dp-cap", nome: "Capitular", sim: "Abre a matéria, ancora o olho na coluna", nao: "Uma por matéria; float pede coluna única" },
  { cls: ".dp-pull", nome: "Olho", sim: "Rouba uma frase forte para o miolo", nao: "Não inventa citação que não está no texto" },
  { cls: ".dp-byline", nome: "Assinatura", sim: "Responsabiliza — quem escreveu e quando", nao: "Não some: matéria sem assinatura é boato" },
  { cls: ".dp-box", nome: "Caixa", sim: "Tira do fluxo o que é apoio — cercado por fio", nao: "Não levanta card: papel separa com moldura" },
  { cls: ".dp-ad", nome: "Classificado", sim: "Anúncio na mesma tinta, assinado ao pé", nao: "Não grita com cor: quem paga assina discreto" },
]

export function ArcaneComponents() {
  return (
    <Chapter
      id="components"
      n="09"
      title="A caixa de tipos"
      lead="O catálogo das peças da folha, cada uma com o seu ofício. A oficina (o UI Kit) mostra-as vivas; aqui ficam documentadas — o quando usar e, sobretudo, o quando não. Todas são classes reais de daily-prophet.css."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {PECAS.map((p) => (
          <Folha key={p.cls}>
            <div className="flex items-baseline justify-between gap-2 border-b border-[var(--dp-rule)]/40 pb-1.5">
              <span className="text-lg" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
                {p.nome}
              </span>
              <code className="font-mono text-[10px]" style={{ color: "var(--dp-sepia)" }}>{p.cls}</code>
            </div>
            <p className="mt-2 flex gap-2 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              <span style={{ color: "var(--dp-ink)" }}>☞</span> {p.sim}
            </p>
            <p className="mt-1 flex gap-2 text-xs leading-snug" style={{ color: "var(--dp-ink-3)" }}>
              <span style={{ color: "#8a3020" }}>✕</span> {p.nao}
            </p>
          </Folha>
        ))}
      </div>
    </Chapter>
  )
}

/* ══════════════ 10 · PATTERNS ══════════════ */
export function ArcanePatterns() {
  return (
    <Chapter
      id="patterns"
      n="10"
      title="Composições resolvidas"
      lead="Peças combinadas num arranjo que se repete: a primeira página, a errata, a coluna de classificados. Não são telas — são diagramações que a oficina já sabe compor de cor."
    >
      <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        Padrão · a primeira página
      </p>
      <Folha className="!p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.7fr_1fr]">
          <div>
            <p className="dp-kicker">Terra-2026 · exclusivo</p>
            <p className="text-2xl leading-none" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
              Design system é achado em edição rara
            </p>
            <p className="mt-1 text-sm italic" style={{ color: "var(--dp-ink-2)" }}>
              Três universos sob o mesmo teto; especialistas divergem
            </p>
            <div className="my-2 dp-rule" />
            <p className="dp-lead-body text-xs" style={{ color: "var(--dp-ink)" }}>
              <span className="dp-cap">A</span>
              matéria abre com capitular e desce em colunas justificadas até o fio, quando salta para
              a página interna. O corpo nunca encolhe — o papel tem tamanho fixo.
            </p>
          </div>
          <div className="border-t border-[var(--dp-rule)] pt-2 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>No trilho</p>
            <div className="mt-1 space-y-1.5 text-[11px]" style={{ color: "var(--dp-ink-2)" }}>
              <p className="flex justify-between border-b border-dotted border-[var(--dp-rule)]/50 pb-0.5"><span>Manchete</span><span>1</span></p>
              <p className="flex justify-between border-b border-dotted border-[var(--dp-rule)]/50 pb-0.5"><span>Mecânicas</span><span>4</span></p>
              <p className="flex justify-between"><span>Classificados</span><span>12</span></p>
            </div>
          </div>
        </div>
      </Folha>

      <p className="mb-2 mt-5 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        Padrão · a errata
      </p>
      <Folha className="!border-2 !border-[var(--dp-rule)]">
        <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "var(--dp-ink-3)" }}>Errata</p>
        <p className="mt-1 text-sm" style={{ color: "var(--dp-ink)" }}>
          Na edição anterior, onde se lia <em>“o componente flutua”</em>, leia-se{" "}
          <em>“o componente é cercado por fio”</em>. Papel não tem elevação. A redação lamenta o
          engano.
        </p>
      </Folha>
    </Chapter>
  )
}

/* ══════════════ 11 · TEMPLATES ══════════════ */
/** Barra de "coluna" — o esqueleto de uma diagramação. */
function Bar({ w = "100%" }: { w?: string }) {
  return <span className="block h-1.5 rounded-none" style={{ width: w, background: "var(--dp-rule)", opacity: 0.32 }} />
}

const CADERNOS = [
  { nome: "Primeira página", desc: "Manchete + 3 colunas + trilho" },
  { nome: "Página interna", desc: "Matéria corrida, sem manchete" },
  { nome: "Classificados", desc: "Colunas estreitas de anúncios" },
  { nome: "Nota / obituário", desc: "Medida cheia, ✝ e fio duplo" },
]

export function ArcaneTemplates() {
  return (
    <Chapter
      id="templates"
      n="11"
      title="Os cadernos"
      lead="As páginas inteiras que a folha compõe — cada uma um arranjo fixo de fios e colunas. Não são maquetes: cada caderno tem a sua diagramação, como a página impressa tem a sua grade."
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CADERNOS.map((c) => (
          <Folha key={c.nome} className="!p-3">
            <div className="border border-[var(--dp-rule)]/40 p-2" style={{ background: "var(--dp-paper)" }}>
              <div className="mx-auto mb-1.5 h-2 w-2/3" style={{ background: "var(--dp-ink)", opacity: 0.7 }} />
              <div className="dp-rule dp-rule--hair !my-1" />
              <div className="mt-1.5 grid grid-cols-3 gap-1">
                <div className="space-y-1"><Bar /><Bar w="90%" /><Bar w="95%" /><Bar w="70%" /></div>
                <div className="space-y-1"><Bar /><Bar w="80%" /><Bar w="92%" /></div>
                <div className="space-y-1"><Bar w="85%" /><Bar w="60%" /><Bar /></div>
              </div>
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--dp-ink)" }}>{c.nome}</p>
            <Nota>{c.desc}</Nota>
          </Folha>
        ))}
      </div>
    </Chapter>
  )
}

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
          <p className="mt-1 text-2xl leading-none" style={{ color: "var(--dp-ink)" }}>
            ❦ ❧ ☞ ¶ § † ‡ ※ ⁂ ✝
          </p>
        </Folha>
      </div>
    </Chapter>
  )
}

/* ══════════════ 16 · CHANGELOG ══════════════ */
const EDICOES = [
  { data: "18 jul 2026", ed: "Nº 4", o: "A folha inteira — o Anfitrião ganha chrome de jornal, do masthead ao expediente" },
  { data: "17 jul 2026", ed: "Nº 3", o: "Três perfis, três sistemas — o Design System separa-se por realm" },
  { data: "17 jul 2026", ed: "Nº 2", o: "Tintas medidas — tabelas de token com contraste WCAG sobre as duas folhas" },
  { data: "15 jul 2026", ed: "Nº 1", o: "Primeira tiragem — o portal dos três multiversos" },
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
            <div key={e.ed} className="flex items-baseline gap-3 border-b border-[var(--dp-rule)]/30 pb-2 last:border-0">
              <span className="w-16 shrink-0 text-[11px]" style={{ color: "var(--dp-sepia)", fontFamily: "var(--dp-head)" }}>
                {e.ed}
              </span>
              <span className="min-w-0 flex-1 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
                {e.o}
              </span>
              <span className="shrink-0 text-[10px] uppercase tracking-wide" style={{ color: "var(--dp-ink-3)" }}>
                {e.data}
              </span>
            </div>
          ))}
        </div>
      </Folha>
    </Chapter>
  )
}
