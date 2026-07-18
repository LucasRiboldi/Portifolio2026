/* ------------------------------------------------------------------
   09.8 · Superfícies e 09.9 · Anomalias — a caixa de ferramentas de arte.
   ------------------------------------------------------------------
   Continuação da medição que abriu o capítulo das dimensões. Depois delas,
   o maior bloco indocumentado do Criativo eram duas bibliotecas inteiras:

     sv-surfaces.css   → as texturas de impressão (riso, screentone,
                          misregister, moiré, newsprint, foil, foxing…)
     sv-effects.css    → os efeitos, que o próprio arquivo chama de
                          "Anomalias do Aranhaverso"

   São as peças que dão material ao realm — e enquanto ficaram fora do guia,
   quem precisava de uma textura ou de um glitch reimplementava do zero, com
   valores próprios, ao lado de uma implementação melhor que já existia.
   ------------------------------------------------------------------ */

function Cap({ children }: { children: React.ReactNode }) {
  return (
    <p className="sv-heavy mb-2 text-[11px] uppercase tracking-wide text-[var(--sv-yellow)]">
      {children}
    </p>
  )
}

function Painel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border-[3px] border-black bg-[var(--sv-ink-2)] p-4 shadow-[var(--elevation-2)] ${className}`}
    >
      {children}
    </div>
  )
}

function Secao({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string
  n: string
  title: string
  lead: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={`${n} · ${title}`}
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">{n}</span>
        {title}
      </p>
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/60">{lead}</p>
      {children}
    </section>
  )
}

/**
 * Amostra de textura.
 *
 * `fundo` não é detalhe de demonstração — é a informação mais prática deste
 * capítulo. Metade destas texturas é TINTA (screentone a 55% de preto,
 * respingo quase preto, hachura a 6% de branco, concreto em overlay a 9%): num
 * fundo escuro elas desaparecem, e quem só viu a amostra conclui que a classe
 * está quebrada. A primeira versão desta página cometeu exatamente esse erro,
 * mostrando cinco quadrados vazios.
 */
function Tex({
  cls,
  nome,
  o,
  fundo = "escuro",
}: {
  cls: string
  nome: string
  o: string
  fundo?: "claro" | "escuro"
}) {
  const claro = fundo === "claro"
  return (
    <div>
      {/* `backgroundColor`, nunca o shorthand `background`: o shorthand
          reinicia `background-image`, e como estilo inline vence a folha, ele
          apagava em silêncio toda textura que desenha por background-image
          (ben-day, riso, moiré, foil, hachura e as quatro retículas). */}
      <div
        className={`${cls} relative h-24 w-full overflow-hidden rounded border-[3px] border-black`}
        style={{ backgroundColor: claro ? "#efe6cf" : "var(--sv-ink-2)" }}
        aria-hidden
      />
      <p className="sv-heavy mt-1.5 text-[11px] uppercase text-white/80">
        {nome}
        <span className="ml-1.5 font-normal normal-case text-white/35">
          {claro ? "· tinta" : "· luz"}
        </span>
      </p>
      <p className="text-[10px] leading-snug text-white/45">{o}</p>
      <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.{cls}</code>
    </div>
  )
}

const TEXTURAS: { cls: string; nome: string; o: string; fundo?: "claro" | "escuro" }[] = [
  { cls: "art-tex-benday", nome: "Ben-Day", o: "A retícula original do gibi barato: pontos grossos e regulares." },
  { cls: "art-tex-screentone", nome: "Screentone", o: "A folha adesiva do mangá, aplicada à mão sobre a arte.", fundo: "claro" },
  { cls: "art-tex-newsprint", nome: "Papel-jornal", o: "Fibra e absorção — traz o próprio bege, é a única que define fundo.", fundo: "claro" },
  { cls: "art-tex-misregister", nome: "Fora de registro", o: "A chapa que não alinhou. O erro de impressão que virou estética." },
  { cls: "art-tex-riso", nome: "Risografia", o: "Duas cores sobrepostas, com a terceira nascendo do encontro." },
  { cls: "art-tex-moire", nome: "Moiré", o: "A interferência entre duas retículas. Use com intenção, nunca por acidente." },
  { cls: "art-tex-speedlines", nome: "Linhas de velocidade", o: "O movimento desenhado, herdado do mangá de ação." },
  { cls: "art-tex-spatter", nome: "Respingo", o: "Nanquim sacudido do pincel — tiles de 97 e 61px, primos entre si, para o acaso não virar xadrez.", fundo: "claro" },
  { cls: "art-tex-foil", nome: "Hot foil", o: "O relevo metálico da capa de edição especial." },
  { cls: "art-tex-foxing", nome: "Foxing", o: "As manchas de umidade do papel guardado por décadas.", fundo: "claro" },
  { cls: "art-tex-crosshatch", nome: "Hachura cruzada", o: "Volume feito só de linha, como na gravura." },
  { cls: "art-tex-concrete", nome: "Concreto", o: "Superfície bruta em overlay a 9% — pede um fundo com cor para reagir." },
]

const RETICULAS = [
  { cls: "art-ht-dots", nome: "Pontos", o: "A retícula padrão. Tamanho e cor por --ht-size / --ht-color." },
  { cls: "art-ht-lines", nome: "Linhas", o: "Meio-tom em traço diagonal, mais duro que o ponto." },
  { cls: "art-ht-diamond", nome: "Losango", o: "As duas diagonais cruzadas — mais densa, boa para sombra." },
  { cls: "art-ht-hex", nome: "Hexagonal", o: "Retícula de favo, a mais moderna das quatro." },
]

const EFEITOS = [
  { cls: "fx-3d", nome: "Texto 3D", o: "Seis camadas empilhadas em magenta e ciano — a manchete de capa." },
  { cls: "fx-chroma", nome: "Aberração cromática", o: "O deslocamento RGB pulsando em steps(1)." },
  { cls: "fx-glitch", nome: "Glitch", o: "Dois clones recortados, um por cima e um por baixo do corte." },
  { cls: "fx-holo", nome: "Holográfico", o: "Gradiente iridescente correndo dentro da letra." },
  { cls: "fx-neon", nome: "Neon", o: "Brilho em quatro camadas, com falha de tubo fluorescente." },
]

export function CreativeSurfaces() {
  return (
    <>
      {/* ══════════════ 09.8 · SUPERFÍCIES ══════════════ */}
      <Secao
        id="superficies"
        n="09.8"
        title="Superfícies e texturas"
        lead={
          <>
            Doze texturas de impressão e quatro retículas de meio-tom, todas construídas em CSS puro
            — nenhuma imagem, nenhum arquivo para carregar. Cada uma cita um acidente real da
            impressão em massa: o fora de registro é a chapa que não alinhou, o foxing é o papel
            guardado por décadas, o moiré é a interferência que os impressores passaram um século a
            tentar evitar. Aqui os defeitos são o material.
          </>
        }
      >
        <Cap>as doze texturas</Cap>
        <Painel className="mb-4">
          <p className="text-xs leading-relaxed text-white/60">
            <strong className="text-[var(--sv-yellow)]">Leia o substrato antes de escolher.</strong>{" "}
            Metade destas texturas é <em>tinta</em> — screentone é preto a 55%, respingo é quase
            preto, concreto é overlay a 9%. Sobre fundo escuro elas desaparecem, e a classe parece
            quebrada quando não está. As marcadas{" "}
            <span className="text-white/80">· tinta</span> abaixo aparecem sobre a amostra clara
            justamente por isso; as marcadas <span className="text-white/80">· luz</span> trazem cor
            própria e funcionam sobre qualquer fundo.
          </p>
        </Painel>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TEXTURAS.map((t) => (
            <Tex key={t.cls} {...t} />
          ))}
        </div>

        <div className="mt-8">
          <Cap>as quatro retículas — meio-tom parametrizado</Cap>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RETICULAS.map((t) => (
              <Tex key={t.cls} {...t} />
            ))}
          </div>
          <Painel className="mt-4">
            <p className="text-xs leading-relaxed text-white/60">
              As retículas leem duas variáveis:{" "}
              <code className="text-[var(--sv-cyan)]">--ht-color</code> e{" "}
              <code className="text-[var(--sv-cyan)]">--ht-size</code>. É o que as separa das
              texturas fixas — a mesma classe serve a um fundo escuro e a um claro, bastando trocar
              a tinta. Combine com{" "}
              <code className="text-[var(--sv-cyan)]">.art-ht-overlay</code> para aplicar a retícula
              por cima do conteúdo em vez de atrás dele.
            </p>
          </Painel>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Painel>
            <Cap>contornos</Cap>
            <div className="flex flex-wrap gap-2">
              {["cyan", "magenta", "violet", "lime", "red", "white"].map((c) => (
                <span
                  key={c}
                  className={`art-outline-${c} inline-block border-[3px] border-black px-2 py-1 text-[10px] uppercase text-white/80`}
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/50">
              <code className="text-[var(--sv-cyan)]">.art-outline-*</code> troca só a cor da borda,
              com <code className="text-[var(--sv-cyan)]">!important</code> — serve para destacar um
              painel sem reescrever a peça inteira.
            </p>
          </Painel>

          <Painel>
            <Cap>sombras impressas</Cap>
            <div className="flex flex-wrap items-center gap-5 py-2">
              {["art-shadow-dots", "art-shadow-hatch", "art-shadow-cross"].map((s) => (
                <span
                  key={s}
                  className={`${s} inline-block border-[3px] border-black bg-[var(--sv-ink-2)] px-3 py-2 text-[10px] uppercase text-white/80`}
                >
                  {s.replace("art-shadow-", "")}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/50">
              A sombra não é desfoque: é uma segunda chapa deslocada 7px, preenchida com ponto,
              hachura ou cruzado. É assim que o gibi fazia profundidade sem meio-tom.
            </p>
          </Painel>

          <Painel>
            <Cap>bordas irregulares</Cap>
            <div className="flex flex-wrap items-center gap-4 py-2">
              <span className="art-deckle inline-block border-[3px] border-black bg-[var(--sv-yellow)] px-3 py-2 text-[10px] uppercase text-black">
                deckle
              </span>
              <span className="art-torn inline-block bg-[var(--sv-cyan)] px-3 py-2 text-[10px] uppercase text-black">
                torn
              </span>
              <span className="art-line-rough inline-block border-[3px] border-black px-3 py-2 text-[10px] uppercase text-white/80">
                rough
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/50">
              As três usam <code className="text-[var(--sv-cyan)]">filter: url(#art-rough)</code> —
              um filtro SVG de turbulência que precisa existir no documento. Sem ele, degradam para
              borda reta em silêncio.
            </p>
          </Painel>
        </div>

        <p className="mt-4 font-mono text-[10px] text-white/40">
          .art-tex-* (12) · .art-ht-* (5) · .art-outline-* (6) · .art-shadow-* (3) · .art-deckle ·
          .art-torn · .art-line-rough
        </p>
      </Secao>

      {/* ══════════════ 09.9 · ANOMALIAS ══════════════ */}
      <Secao
        id="anomalias"
        n="09.9"
        title="Anomalias"
        lead={
          <>
            O nome não é meu: <code className="text-[var(--sv-cyan)]">sv-effects.css</code> se
            declara “Anomalias do Aranhaverso” na primeira linha. São os efeitos que rompem a
            superfície — glitch, aberração cromática, holograma, neon, VHS e o portal que gira. No
            filme, uma anomalia é um corpo que não pertence àquela dimensão e por isso pisca; aqui a
            metáfora é literal, e é ela que dita quando usar: <strong>a anomalia marca o que está
            fora do lugar</strong>, não o que é importante.
          </>
        }
      >
        <Cap>os efeitos de texto, ao vivo</Cap>
        <Painel>
          <div className="flex flex-col gap-6">
            <span className="fx-3d sv-display text-4xl uppercase leading-none">Multiverso</span>
            <span className="fx-chroma sv-display text-3xl uppercase leading-none text-white">
              Aberração
            </span>
            <span
              className="fx-glitch sv-display text-3xl uppercase leading-none text-white"
              data-text="Anomalia"
            >
              Anomalia
            </span>
            <span className="fx-holo sv-display text-3xl uppercase leading-none">Holográfico</span>
            <span className="fx-neon text-3xl uppercase leading-none">Neon</span>
          </div>
        </Painel>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Painel>
            <Cap>o glitch pede um atributo</Cap>
            <pre className="overflow-x-auto rounded border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/80">
              <code>{`<span className="fx-glitch" data-text="Anomalia">
  Anomalia
</span>`}</code>
            </pre>
            <p className="mt-2 text-[11px] leading-snug text-white/55">
              Os dois clones saem de{" "}
              <code className="text-[var(--sv-cyan)]">content: attr(data-text)</code>. Esquecer o{" "}
              <code className="text-[var(--sv-cyan)]">data-text</code> não quebra nada — o efeito
              simplesmente não aparece, que é a pior espécie de falha: silenciosa. Se o glitch não
              apareceu, é isto.
            </p>
          </Painel>

          <Painel>
            <Cap>superfície e forma</Cap>
            <div className="flex flex-wrap items-center gap-5 py-1">
              <span className="fx-portal inline-block size-16" aria-hidden />
              <span className="fx-sticker inline-block bg-[var(--sv-yellow)] px-3 py-2 text-[11px] uppercase text-black">
                sticker
              </span>
              <span className="fx-vhs relative inline-block overflow-hidden border-[3px] border-black bg-[var(--sv-violet)] px-4 py-3 text-[11px] uppercase text-white">
                vhs
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/55">
              <code className="text-[var(--sv-cyan)]">.fx-portal</code> é o anel cônico girando;{" "}
              <code className="text-[var(--sv-cyan)]">.fx-sticker</code> dobra o canto inferior
              direito; <code className="text-[var(--sv-cyan)]">.fx-vhs</code> sobrepõe scanlines em{" "}
              <code className="text-[var(--sv-cyan)]">multiply</code>. Todos exigem{" "}
              <code className="text-[var(--sv-cyan)]">position: relative</code> no elemento.
            </p>
          </Painel>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Painel>
            <Cap>as quatro fontes experimentais</Cap>
            <div className="space-y-2">
              {[
                ["fx-font-nabla", "Nabla", "Variável cromática — vem colorida da própria face"],
                ["fx-font-monoton", "Monoton", "Traço vazado de letreiro neon"],
                ["fx-font-glitch", "Glitch", "Monoespaçada corrompida"],
                ["fx-font-shade", "Shade", "Sombreada, de cartaz antigo"],
              ].map(([cls, nome, o]) => (
                <div key={cls} className="flex items-baseline gap-3">
                  <span className={`${cls} text-2xl leading-none text-white`}>{nome}</span>
                  <span className="text-[10px] leading-snug text-white/45">{o}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/50">
              Carregadas por <code className="text-[var(--sv-cyan)]">next/font</code> no layout, não
              por <code className="text-[var(--sv-cyan)]">@import</code>. São faces de display: uma
              palavra, um título — nunca um parágrafo.
            </p>
          </Painel>

          <Painel>
            <Cap>movimento reduzido — tratado, e é a regra</Cap>
            <p className="text-[11px] leading-relaxed text-white/60">
              As oito animações desta biblioteca (
              <code className="text-[var(--sv-cyan)]">fx-chroma</code>,{" "}
              <code className="text-[var(--sv-cyan)]">fx-glitch</code>,{" "}
              <code className="text-[var(--sv-cyan)]">fx-holo</code>,{" "}
              <code className="text-[var(--sv-cyan)]">fx-neon</code>,{" "}
              <code className="text-[var(--sv-cyan)]">fx-vhs</code>,{" "}
              <code className="text-[var(--sv-cyan)]">fx-portal</code>,{" "}
              <code className="text-[var(--sv-cyan)]">fx-float</code>) desligam em{" "}
              <code className="text-[var(--sv-cyan)]">prefers-reduced-motion</code> — e o texto
              continua legível em todas, porque nenhuma delas carrega informação no gesto.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              É o teste que vale para qualquer anomalia nova:{" "}
              <strong className="text-white/80">desligue a animação e leia</strong>. Se algo se
              perdeu, o efeito estava a carregar significado que devia estar escrito.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/50">
              Cuidado à parte com <code className="text-[var(--sv-cyan)]">fx-chroma</code> e{" "}
              <code className="text-[var(--sv-cyan)]">fx-glitch</code>: o deslocamento de canais
              reduz legibilidade mesmo parado. Título curto, nunca corpo de texto.
            </p>
          </Painel>
        </div>

        <p className="mt-4 font-mono text-[10px] text-white/40">
          .fx-3d · .fx-chroma · .fx-glitch[data-text] · .fx-holo · .fx-neon · .fx-vhs · .fx-portal ·
          .fx-sticker · .fx-float · .fx-grain · .fx-font-* (4)
        </p>
      </Secao>
    </>
  )
}
