/* ------------------------------------------------------------------
   As quatro seções "extra" do índice (17–20), na língua da folha.
   ------------------------------------------------------------------
   Eu havia julgado que não traduziam para um jornal de 1920 — errei. Cada
   uma tem um equivalente honesto na oficina, e é isso que está aqui:

     17 Seções de página  → os blocos que montam a folha
     18 Retro OS · Temas  → as tiragens (estados da folha)
     19 Lab               → a bancada de provas
     20 Documentação      → o manual da casa

   O que NÃO se faz aqui: inventar "tema de sistema operacional" para um
   jornal. A tiragem é o equivalente real — a mesma matéria impressa noutra
   chapa. Dados de REALM_VARIANTS, não texto solto.
   ------------------------------------------------------------------ */
import type { RealmDesign } from "@/design-system/realms"
import { REALM_VARIANTS } from "@/design-system/realm-variants"
import { Chapter, Folha, Nota } from "./arcane-chapters"

/* ══════════════ 17 · SEÇÕES DE PÁGINA ══════════════ */
const BLOCOS = [
  {
    nome: "Cabeçalho",
    cls: ".dp-masthead",
    o: "Nameplate, data, preço e lema. Abre a folha e não se repete — página interna não tem masthead, tem fólio.",
  },
  {
    nome: "Bloco de manchete",
    cls: ".dp-bighead + .dp-subhead",
    o: "Chapéu, manchete e linha fina, sempre nessa ordem. É o bloco que faz a página ser lida em três segundos.",
  },
  {
    nome: "Corpo em colunas",
    cls: ".dp-lead-body",
    o: "O texto corrido, justificado, de 2 a 4 colunas conforme a largura. É o motor de colunas — nunca aninhar noutro.",
  },
  {
    nome: "Trilho",
    cls: ".dp-col--rail",
    o: "A coluna estreita à direita: índice, breves e classificados. O que não é matéria vive à margem.",
  },
  {
    nome: "Grade de reportagens",
    cls: ".dp-reports",
    o: "Até quatro matérias secundárias no pé da página, cada uma com chapéu e título curto.",
  },
  {
    nome: "Expediente",
    cls: ".dp-colophon + .dp-folio",
    o: "Quem imprime, onde, em que edição — e o fólio que numera a página. Fecha a folha sob fio grosso.",
  },
]

export function ArcaneSecoes() {
  return (
    <Chapter
      id="secoes"
      n="17"
      title="Os blocos da página"
      lead="Uma folha não é uma pilha de componentes: é um punhado de blocos que sempre aparecem na mesma ordem. Cabeçalho em cima, manchete, corpo em colunas, trilho à direita, reportagens no pé, expediente fechando. Quem conhece a ordem lê a página sem procurar."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {BLOCOS.map((b) => (
          <Folha key={b.cls}>
            <div className="flex items-baseline justify-between gap-2 border-b border-[var(--dp-rule)]/40 pb-1.5">
              <span className="text-lg" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
                {b.nome}
              </span>
              <code className="font-mono text-[10px]" style={{ color: "var(--dp-sepia)" }}>
                {b.cls}
              </code>
            </div>
            <p className="mt-2 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              {b.o}
            </p>
          </Folha>
        ))}
      </div>

      {/* A ordem, desenhada */}
      <p className="mb-2 mt-5 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
        A ordem na página
      </p>
      <Folha className="!p-4">
        <div className="border border-[var(--dp-rule)]/40 p-3" style={{ background: "var(--dp-paper)" }}>
          <p className="text-center text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--dp-ink-3)" }}>
            cabeçalho
          </p>
          <div className="dp-rule dp-rule--double !my-1.5" />
          <p className="text-center text-sm" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
            bloco de manchete
          </p>
          <div className="dp-rule !my-1.5" />
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <p className="text-center text-[11px]" style={{ color: "var(--dp-ink-2)" }}>corpo em colunas</p>
            <p className="border-l border-[var(--dp-rule)]/50 text-center text-[11px]" style={{ color: "var(--dp-ink-2)" }}>
              trilho
            </p>
          </div>
          <div className="dp-rule !my-1.5" />
          <p className="text-center text-[11px]" style={{ color: "var(--dp-ink-2)" }}>grade de reportagens</p>
          <div className="dp-rule dp-rule--thick !my-1.5" />
          <p className="text-center text-[10px] uppercase tracking-wide" style={{ color: "var(--dp-ink-3)" }}>
            expediente · fólio
          </p>
        </div>
      </Folha>
    </Chapter>
  )
}

/* ══════════════ 18 · TIRAGENS (o "tema" da folha) ══════════════ */
export function ArcaneTiragens() {
  const tiragens = REALM_VARIANTS.arcane
  return (
    <Chapter
      id="retro-os"
      n="18"
      title="As tiragens"
      lead="Onde os outros universos têm “temas”, a folha tem tiragens: a mesma matéria impressa noutra chapa. Não é um seletor de aparência — é o estado físico do papel, e cada estado muda o que se pode ler nele. Trocáveis ao vivo na Oficina, abaixo."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {tiragens.map((t, i) => (
          <Folha key={t.id}>
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--dp-sepia)" }}>
              Tiragem {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-lg leading-tight" style={{ fontFamily: "var(--dp-head)", color: "var(--dp-ink)" }}>
              {t.label}
            </p>
            <div className="my-2 dp-rule dp-rule--hair" />
            <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
              {t.desc}
            </p>
            <code className="mt-2 block font-mono text-[10px]" style={{ color: "var(--dp-ink-3)" }}>
              .{t.className.split(" ").join(" .")}
            </code>
          </Folha>
        ))}
      </div>
      <Nota>
        A tiragem “envelhecida” não é um filtro bonito: soma a textura de foxing (manchas de umidade)
        à primeira página. É a mesma chapa, guardada na caixa por um século.
      </Nota>
    </Chapter>
  )
}

/* ══════════════ 19 · LAB — a bancada de provas ══════════════ */
export function ArcaneLab() {
  return (
    <Chapter
      id="lab"
      n="19"
      title="A bancada de provas"
      lead="Onde o compositor testa antes de mandar para a rotativa: combinações de ornamento, provas de fio, e as lacunas que ainda não se resolveram. Nada aqui é norma — é oficina. O que der certo sobe para o catálogo; o que não, fica registrado como aviso."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Prova · combinações de ornamento
          </p>
          <div className="space-y-2 text-center" style={{ color: "var(--dp-ink)" }}>
            <p className="text-lg">❦</p>
            <p className="text-lg tracking-[0.4em]">❦ ❧ ❦</p>
            <p className="text-lg">⁂</p>
            <p className="text-sm tracking-[0.3em]">— ❧ —</p>
          </div>
          <Nota>Fecho de matéria, quebra de seção e vinheta de pé. Um ornamento por função.</Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Prova · a capitular em corpos diferentes
          </p>
          <div className="flex items-end gap-4" style={{ color: "var(--dp-ink)", fontFamily: "var(--dp-head)" }}>
            <span className="text-2xl leading-none">A</span>
            <span className="text-4xl leading-none">A</span>
            <span className="text-5xl leading-none">A</span>
          </div>
          <Nota>
            Três linhas é o padrão da casa. Duas some no corpo; quatro rouba a coluna inteira.
          </Nota>
        </Folha>

        <Folha className="sm:col-span-2">
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "#8a3020" }}>
            Lacuna registrada · a gótica que não existe
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            O token <code className="font-mono">--dp-black</code> promete UnifrakturCook, mas nenhum{" "}
            <code className="font-mono">@font-face</code> dessa face é servido pelo projeto: na
            prática ele resolve em Georgia. A amostra abaixo é o que se vê, não o que o token diz.
            Fica na bancada até a face ser fundida — documentar a lacuna é mais honesto que fingir
            que a chapa existe.
          </p>
          <p className="mt-2 text-2xl" style={{ fontFamily: "var(--dp-black)", color: "var(--dp-ink)" }}>
            The Daily Prophet
          </p>
        </Folha>
      </div>
    </Chapter>
  )
}

/* ══════════════ 20 · DOCUMENTAÇÃO — o manual da casa ══════════════ */
export function ArcaneDocumentacao({ d }: { d: RealmDesign }) {
  return (
    <Chapter
      id="documentacao"
      n="20"
      title="O manual da casa"
      lead="Onde a folha guarda as próprias regras — os arquivos reais, não prosa duplicada. Este guia não repete o que o código já diz: aponta para ele. Se divergirem, o código manda, e o guia é que está errado."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Onde mora cada coisa
          </p>
          <dl className="space-y-1.5 text-xs" style={{ color: "var(--dp-ink-2)" }}>
            {[
              ["A identidade do realm", "src/design-system/realms.ts"],
              ["As chapas (CSS)", d.css.map((f) => `src/styles/${f}`).join(" · ")],
              ["As tiragens", "src/design-system/realm-variants.ts"],
              ["O índice das seções", "src/design-system/architecture.ts"],
              ["Este guia", "src/components/design-system/arcane-*.tsx"],
            ].map(([o, onde]) => (
              <div key={o} className="border-b border-[var(--dp-rule)]/30 pb-1 last:border-0">
                <dt style={{ color: "var(--dp-ink-3)" }}>{o}</dt>
                <dd className="font-mono text-[10px]" style={{ color: "var(--dp-ink)" }}>
                  {onde}
                </dd>
              </div>
            ))}
          </dl>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Como se compõe uma página nova
          </p>
          <ol className="space-y-2 text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            <li className="flex gap-2">
              <span style={{ color: "var(--dp-gold)", fontFamily: "var(--dp-head)" }}>01</span>
              <span>
                Envolva tudo em <code className="font-mono">.dp</code> — é a folha: papel, tinta,
                serifa e textura, de uma vez.
              </span>
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--dp-gold)", fontFamily: "var(--dp-head)" }}>02</span>
              <span>
                Monte na ordem dos blocos (seção 17). A folha não improvisa arranjo.
              </span>
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--dp-gold)", fontFamily: "var(--dp-head)" }}>03</span>
              <span>
                Separe com fio, nunca com sombra. Se pediu <code className="font-mono">box-shadow</code>,
                está no realm errado.
              </span>
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--dp-gold)", fontFamily: "var(--dp-head)" }}>04</span>
              <span>
                Escolha a tinta pela seção de acessibilidade — e saiba sobre qual das duas folhas
                vai imprimir.
              </span>
            </li>
          </ol>
        </Folha>
      </div>
    </Chapter>
  )
}
