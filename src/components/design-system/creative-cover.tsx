/* ------------------------------------------------------------------
   09.11 · A capa e 09.12 · Interação — o que fecha o catálogo do Criativo.
   ------------------------------------------------------------------
   Últimos dois blocos da medição. `comic-cover.css` é um sistema de capa de
   revista completo — 372 linhas, vinte classes, do nameplate com preenchimento
   ao código de barras — e não aparecia em lugar nenhum do guia. `retro-os.css`
   é a janela de sistema operacional que a seção 18 usa como tema, mas cujas
   peças nunca foram catalogadas.

   No fim vão as utilidades de interação: as classes que definem como este
   realm responde ao ponteiro. São quatro linhas de CSS cada e decidem a
   personalidade inteira do sistema — vale documentá-las como componente.
   ------------------------------------------------------------------ */
import { ComicCover } from "@/components/home/comic-cover"

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

export function CreativeCover() {
  return (
    <>
      {/* ══════════════ 09.11 · A CAPA ══════════════ */}
      <Secao
        id="capa"
        n="09.11"
        title="A capa de revista"
        lead={
          <>
            Um sistema inteiro de capa de gibi — nameplate, faixa de preço, tarja lateral, selo de
            edição, código de barras — que existia em{" "}
            <code className="text-[var(--sv-cyan)]">comic-cover.css</code> e não aparecia no guia.
            Cada peça corresponde a um elemento obrigatório da banca: a capa de revista é um dos
            layouts mais regulamentados que existem, porque precisa ser lida de relance num
            expositor com outras cinquenta ao lado.
          </>
        }
      >
        <Cap>a capa montada — a peça real da home, não uma reprodução</Cap>
        {/* Composição, não cópia. A primeira versão deste capítulo escrevia a
            marcação da capa à mão e saiu quebrada — nameplate sobre o título,
            selo cortado —, porque as peças cc-* dependem de uma estrutura e de
            uma altura que eu supus em vez de ler. O componente abaixo é o que
            serve a home: se ele quebrar, quebra aqui, que é o ponto. É também
            o princípio que este guia declara desde o primeiro capítulo e que
            eu havia violado. */}
        <div className="mx-auto max-w-2xl">
          <ComicCover headingAs="h2" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Painel>
            <Cap>o nameplate em três camadas</Cap>
            <p className="text-[11px] leading-relaxed text-white/60">
              <code className="text-[var(--sv-cyan)]">.cc-masthead-fill</code> é o nome preenchido;{" "}
              <code className="text-[var(--sv-cyan)]">-ghost</code> e{" "}
              <code className="text-[var(--sv-cyan)]">-ghost-2</code> são duas cópias deslocadas
              atrás, criando a profundidade impressa sem uma única sombra. É a mesma técnica do{" "}
              <code className="text-[var(--sv-cyan)]">.fx-3d</code> de 09.9, feita com elementos em
              vez de <code className="text-[var(--sv-cyan)]">text-shadow</code> — aqui cada camada
              precisa de cor e recorte próprios.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/50">
              As cópias levam <code className="text-[var(--sv-cyan)]">aria-hidden</code>: são a mesma
              palavra três vezes, e sem isso o leitor de tela anuncia o nome em triplicado.
            </p>
          </Painel>

          <Painel>
            <Cap>as faixas obrigatórias</Cap>
            <p className="text-[11px] leading-relaxed text-white/60">
              <code className="text-[var(--sv-cyan)]">.cc-band</code> no topo carrega número e
              etiquetas; <code className="text-[var(--sv-cyan)]">.cc-band-bottom</code> fecha com o
              código de barras. <code className="text-[var(--sv-cyan)]">.cc-spine</code> é a lombada
              à esquerda — a tarja que aparece quando a revista está empilhada.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/50">
              O código de barras é decoração:{" "}
              <code className="text-[var(--sv-cyan)]">.cc-barcode-bars</code> é um gradiente
              repetido, não um EAN real. Se algum dia precisar de código válido, ele terá de virar
              imagem — o gradiente não codifica número nenhum.
            </p>
          </Painel>

          <Painel>
            <Cap>fundo e movimento</Cap>
            <p className="text-[11px] leading-relaxed text-white/60">
              <code className="text-[var(--sv-cyan)]">.cc-aura</code> é o halo radial atrás do
              título; <code className="text-[var(--sv-cyan)]">.cc-speed</code> são as linhas de
              velocidade que saem do centro. Os dois são{" "}
              <code className="text-[var(--sv-cyan)]">::before</code> absolutos e exigem{" "}
              <code className="text-[var(--sv-cyan)]">position: relative</code> +{" "}
              <code className="text-[var(--sv-cyan)]">overflow: hidden</code> no{" "}
              <code className="text-[var(--sv-cyan)]">.cc-cover</code>, senão vazam para fora da
              capa.
            </p>
          </Painel>
        </div>

        <p className="mt-4 font-mono text-[10px] text-white/40">
          .cc-cover · .cc-aura · .cc-speed · .cc-spine · .cc-band · .cc-band-bottom · .cc-strip ·
          .cc-masthead · -fill · -ghost · -ghost-2 · .cc-line-title · .cc-issue · .cc-burst ·
          -yellow · .cc-tag · -pop · .cc-barcode · -bars
        </p>
      </Secao>

      {/* ══════════════ 09.12 · INTERAÇÃO ══════════════ */}
      <Secao
        id="interacao"
        n="09.12"
        title="Interação e Retro OS"
        lead={
          <>
            Quatro utilidades de hover que cabem em quatro linhas de CSS cada e decidem a
            personalidade inteira do realm — e a janela de sistema operacional que a seção 18 usa
            como tema, cujas peças nunca foram catalogadas. Passe o ponteiro em tudo abaixo: é a
            única seção do guia em que ler não basta.
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Painel>
            <Cap>as quatro utilidades — experimente</Cap>
            <div className="flex flex-col gap-4">
              <span className="art-hover-jitter inline-block w-fit cursor-default border-[3px] border-black bg-[var(--sv-yellow)] px-3 py-2 text-[11px] uppercase text-black">
                hover-jitter
              </span>
              <span className="art-hover-ink inline-block w-fit cursor-default border-[3px] border-black bg-[var(--sv-cyan)] px-3 py-2 text-[11px] uppercase text-black">
                hover-ink
              </span>
              <a href="#interacao" className="art-link w-fit text-sm text-white">
                art-link — a sublinha que cresce
              </a>
              <span className="art-kinetic inline-block w-fit text-sm text-white">
                art-kinetic
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-white/55">
              <code className="text-[var(--sv-cyan)]">.art-hover-jitter</code> gira −1,2° e sobe 2px
              com curva <em>spring</em>: é o desalinho de colagem, não elevação de card.{" "}
              <code className="text-[var(--sv-cyan)]">.art-link</code> cresce a sublinha de 0 a 100%
              e responde também a <code className="text-[var(--sv-cyan)]">:focus-visible</code> — o
              teclado recebe o mesmo gesto que o mouse, que é o detalhe que a maioria esquece.
            </p>
          </Painel>

          <Painel>
            <Cap>tratamentos de texto</Cap>
            <div className="flex flex-col gap-3">
              <span className="art-chroma-soft sv-display text-2xl uppercase text-white">
                Chroma soft
              </span>
              <span className="art-rgb-offset sv-display text-2xl uppercase text-white">
                RGB offset
              </span>
              <span className="sv-outline-text sv-display text-3xl uppercase">Outline</span>
              <span className="art-underline text-sm text-white">Sublinhado desenhado</span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-white/55">
              <code className="text-[var(--sv-cyan)]">.art-chroma-soft</code> é a aberração cromática
              em 0,6px — a versão que dá para usar em texto corrido, ao contrário do{" "}
              <code className="text-[var(--sv-cyan)]">.fx-chroma</code> de 09.9, que pulsa e só serve
              a título. <code className="text-[var(--sv-cyan)]">.art-rgb-offset</code> faz o mesmo
              por <code className="text-[var(--sv-cyan)]">drop-shadow</code>, o que preserva a
              seleção de texto.
            </p>
          </Painel>
        </div>

        <div className="mt-6">
          <Cap>a janela de sistema — três eras</Cap>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["os-95", "Windows 95", "Bisel duro, cinza 3D, botões com relevo invertido no clique."],
              ["os-xp", "Windows XP", "Azul Luna, cantos arredondados, gradiente na barra."],
              ["os-mac", "Mac OS clássico", "Listras na barra de título, borda fina, tipografia condensada."],
            ].map(([cls, nome, o]) => (
              <div key={cls}>
                <div className={`os-window ${cls}`}>
                  <div className="os-titlebar">
                    <span className="os-title">portfolio.exe</span>
                    <span className="os-btns">
                      <button type="button" aria-label="Minimizar">
                        _
                      </button>
                      <button type="button" aria-label="Fechar">
                        ×
                      </button>
                    </span>
                  </div>
                  <div className="os-body">
                    <p>Uma janela de verdade, com as peças reais do tema.</p>
                    <button type="button" className="os-btn mt-2">
                      OK
                    </button>
                  </div>
                </div>
                <p className="sv-heavy mt-1.5 text-[11px] uppercase text-white/80">{nome}</p>
                <p className="text-[10px] leading-snug text-white/45">{o}</p>
                <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.os-window .{cls}</code>
              </div>
            ))}
          </div>
          <Painel className="mt-4">
            <p className="text-[11px] leading-relaxed text-white/60">
              A estrutura é sempre a mesma —{" "}
              <code className="text-[var(--sv-cyan)]">.os-window</code> &gt;{" "}
              <code className="text-[var(--sv-cyan)]">.os-titlebar</code> (com{" "}
              <code className="text-[var(--sv-cyan)]">.os-title</code> e{" "}
              <code className="text-[var(--sv-cyan)]">.os-btns</code>) +{" "}
              <code className="text-[var(--sv-cyan)]">.os-body</code>. A era é só uma classe a mais,
              exatamente como as dimensões de 09.7 fazem com o canvas. Dois sistemas de tema no
              mesmo realm, com a mesma arquitetura.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/50">
              <span className="text-[var(--sv-yellow)]">Acessibilidade:</span> os botões da barra são{" "}
              <code className="text-[var(--sv-cyan)]">&lt;button&gt;</code> com{" "}
              <code className="text-[var(--sv-cyan)]">aria-label</code> — &quot;_&quot; e
              &quot;×&quot; não dizem nada a quem ouve a página. Se a janela for decorativa e não
              funcional, o conjunto inteiro leva{" "}
              <code className="text-[var(--sv-cyan)]">aria-hidden</code> em vez de botões falsos
              tabuláveis.
            </p>
          </Painel>
        </div>

        <p className="mt-4 font-mono text-[10px] text-white/40">
          .art-hover-jitter · .art-hover-ink · .art-link · .art-kinetic · .art-chroma-soft ·
          .art-rgb-offset · .art-underline · .sv-outline-text · .os-window · .os-titlebar ·
          .os-title · .os-btns · .os-body · .os-btn · .os-inset · .os-95 · .os-xp · .os-mac
        </p>
      </Secao>
    </>
  )
}
