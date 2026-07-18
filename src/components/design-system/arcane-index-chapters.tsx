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
import { Chapter, Folha, Nota } from "./arcane-chapters"

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

        {/* A hierarquia de filetes NÃO se documenta aqui: ela é a matéria 02.1,
            logo abaixo. Este bloco existia duplicado — as mesmas quatro
            espessuras, com as mesmas legendas, em dois lugares da folha. Uma
            errata futura corrigiria um e esqueceria o outro. */}

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

      {/* Escala — a diferença que separa ornamento de ícone */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            São tipo, não desenho
          </p>
          <div className="flex items-end gap-4" style={{ color: "var(--dp-ink)" }}>
            <span className="text-sm leading-none">❦</span>
            <span className="text-xl leading-none">❦</span>
            <span className="text-3xl leading-none">❦</span>
            <span className="text-5xl leading-none">❦</span>
          </div>
          <Nota>
            Por serem caracteres, obedecem a <code className="font-mono">font-size</code> e{" "}
            <code className="font-mono">color</code> — não têm fill, stroke nem viewBox. Herdam a
            tinta do texto ao redor, como qualquer letra.
          </Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Em contexto — o fecho de matéria
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            …e a rotativa parou às três da manhã, quando o último caderno desceu para a expedição.
            O silêncio na oficina durou o tempo de um cigarro.
          </p>
          <p className="mt-2 text-center text-lg" style={{ color: "var(--dp-ink-3)" }}>
            ❦
          </p>
          <Nota>O fleurão fecha a matéria — poupa o leitor de procurar se o texto continua.</Nota>
        </Folha>
      </div>

      <Folha className="mt-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "#8a3020" }}>
          Quando não usar
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["✕ Como botão", "Ornamento não é alvo de clique. Um link se anuncia com palavra e filete."],
            ["✕ Em fila decorativa", "Três fleurões seguidos viram enfeite. Um ornamento tem função ou não entra."],
            ["✕ Colorido", "Sépia e ouro pontuam; o resto é tinta. Ornamento em cor vira logotipo."],
          ].map(([t, o]) => (
            <div key={t}>
              <p className="text-xs" style={{ color: "var(--dp-ink)" }}>{t}</p>
              <Nota>{o}</Nota>
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
        Padrão · a continuação
      </p>
      <Folha>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              …o Ministério não quis comentar até o fecho desta edição, mas fontes da própria
              repartição confirmam que a portaria já circula assinada desde
            </p>
            <p className="mt-1 text-right text-[11px] italic" style={{ color: "var(--dp-sepia)" }}>
              Continua na pág. 4 ▸
            </p>
          </div>
          <div className="border-t border-[var(--dp-rule)]/40 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <p className="text-[11px] italic" style={{ color: "var(--dp-sepia)" }}>
              ◂ Continuação da pág. 1
            </p>
            <p className="mt-1 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              a semana passada. A reportagem apurou ainda que dois cadernos foram recolhidos antes
              da distribuição.
            </p>
          </div>
        </div>
        <Nota>
          O papel tem tamanho fixo: quando a matéria não cabe, ela salta — nunca encolhe a fonte. O
          salto precisa de destino (pág. 4) e de origem (pág. 1), senão o leitor se perde.
        </Nota>
      </Folha>

      <p className="mb-2 mt-5 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        Padrão · a coluna de classificados
      </p>
      <Folha>
        <div className="grid gap-x-5 gap-y-3 sm:grid-cols-3">
          {[
            { t: "Vende-se", c: "Vassoura Nimbus, pouco uso, cabo de freixo. Tratar na oficina.", a: "— Q. Quidditch" },
            { t: "Procura-se", c: "Compositor com prática em tipo de madeira. Paga-se bem.", a: "— Esta folha" },
            { t: "Achados", c: "Coruja cinzenta entregue sem bilhete. Reclamar no expediente.", a: "— Redação" },
          ].map((ad) => (
            <div key={ad.t} className="border-t border-[var(--dp-rule)]/40 pt-2 first:border-0 sm:border-0">
              <p className="text-xs uppercase tracking-wide" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
                {ad.t}
              </p>
              <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--dp-ink-2)" }}>{ad.c}</p>
              <p className="mt-1 text-[10px] italic" style={{ color: "var(--dp-ink-3)" }}>{ad.a}</p>
            </div>
          ))}
        </div>
        <Nota>Colunas estreitas, título em versalete, assinatura ao pé. Quem paga, assina.</Nota>
      </Folha>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Padrão · a errata
          </p>
          <Folha className="!border-2 !border-[var(--dp-rule)] h-full">
            <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "var(--dp-ink-3)" }}>Errata</p>
            <p className="mt-1 text-sm" style={{ color: "var(--dp-ink)" }}>
              Na edição anterior, onde se lia <em>“o componente flutua”</em>, leia-se{" "}
              <em>“o componente é cercado por fio”</em>. Papel não tem elevação. A redação lamenta o
              engano.
            </p>
          </Folha>
        </div>
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Padrão · a nota de falecimento
          </p>
          <Folha className="h-full text-center">
            <p className="text-lg" style={{ color: "var(--dp-ink-3)" }}>✝</p>
            <div className="mx-auto my-1 max-w-[10rem] dp-rule dp-rule--double" />
            <p className="text-sm" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
              A rotativa nº 2
            </p>
            <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              1908 — 2026. Serviu a esta casa por cento e dezoito anos. O expediente agradece.
            </p>
          </Folha>
        </div>
      </div>
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
