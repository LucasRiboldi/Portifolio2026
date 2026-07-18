/* ------------------------------------------------------------------
   09.13 · Colagem e 09.14 · A camada extrapolada.
   ------------------------------------------------------------------
   Diferente dos capítulos 09.7–09.12, que documentaram o que já existia,
   aqui há as duas coisas:

     - `sv-punk.css` era mais uma biblioteca inteira indocumentada (12
       classes de colagem, incluindo as letras de resgate).
     - `sv-extras.css` é NOVO — anomalias, efeitos de texto, texturas,
       fundos e portais escritos agora para engrossar o material.

   O que NÃO se fez: inventar demo sem CSS por trás. Cada peça abaixo é uma
   classe real, e o arquivo novo é removível sem quebrar nada — é acréscimo,
   não correção.
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

/** Amostra de superfície com legenda. */
function Amostra({
  cls,
  nome,
  o,
  claro = false,
  alto = false,
}: {
  cls: string
  nome: string
  o?: string
  claro?: boolean
  alto?: boolean
}) {
  return (
    <div>
      <div
        className={`${cls} relative w-full overflow-hidden rounded border-[3px] border-black ${alto ? "h-28" : "h-20"}`}
        style={{ backgroundColor: claro ? "#efe6cf" : undefined, color: claro ? "#14100a" : "#fff" }}
        aria-hidden
      />
      <p className="sv-heavy mt-1.5 text-[11px] uppercase text-white/80">{nome}</p>
      {o && <p className="text-[10px] leading-snug text-white/45">{o}</p>}
      <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.{cls}</code>
    </div>
  )
}

/** Escreve uma palavra em recortes, um <span> por letra. */
function Resgate({ texto, papeis }: { texto: string; papeis: string[] }) {
  return (
    <span className="fx-ransom text-2xl">
      {texto.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className={`fx-ransom-piece fx-ransom-piece--${papeis[i % papeis.length]}`}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

export function CreativeExtras() {
  return (
    <>
      {/* ══════════════ 09.13 · COLAGEM ══════════════ */}
      <Secao
        id="colagem"
        n="09.13"
        title="Colagem e letras de resgate"
        lead={
          <>
            <code className="text-[var(--sv-cyan)]">sv-punk.css</code> era outra biblioteca inteira
            fora do guia: doze classes de colagem herdadas do Spider-Punk — spray, papel rasgado,
            fita cruzada, contorno de marcador. No centro delas estavam as letras de resgate, que
            existiam cruas: borda preta e sombra, todas iguais. Uma nota de resgate real é feita de
            revistas <em>diferentes</em>, e é o desencontro de papéis, cores e ângulos que faz a
            leitura funcionar. As variantes de recorte abaixo são novas.
          </>
        }
      >
        <Cap>as letras de resgate — oito papéis de recorte</Cap>
        <Painel>
          <div className="flex flex-col gap-5">
            <Resgate texto="ARANHAVERSO" papeis={["paper", "news", "glossy", "pop", "cold", "kraft"]} />
            <Resgate texto="ANOMALIA" papeis={["negative", "news", "cut", "paper"]} />
            <Resgate texto="CANON" papeis={["taped", "glossy", "kraft", "pop"]} />
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-white/55">
            Nenhuma letra leva classe de rotação. Os ângulos saem de{" "}
            <code className="text-[var(--sv-cyan)]">:nth-child</code> com passos primos entre si
            (3n+1, 3n+2, 5n+3, 7n+5), então numa palavra curta eles nunca repetem em fase — escreva
            a palavra e ela já sai torta do jeito certo. É a mesma lógica dos três ângulos de painel
            em 09.10 e dos tiles de respingo em 09.8.
          </p>
        </Painel>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Painel>
            <Cap>os papéis, um a um</Cap>
            <div className="flex flex-wrap gap-2">
              {[
                ["paper", "miolo creme"],
                ["news", "papel-jornal"],
                ["glossy", "revista"],
                ["pop", "revista pop"],
                ["cold", "revista fria"],
                ["kraft", "pardo"],
                ["negative", "negativo"],
                ["taped", "com fita"],
                ["cut", "tesoura"],
              ].map(([v, nome]) => (
                <span key={v} className="inline-flex flex-col items-center gap-1">
                  <span className={`fx-ransom-piece fx-ransom-piece--${v} text-lg`}>Aa</span>
                  <code className="font-mono text-[9px] text-white/40">--{v}</code>
                  <span className="text-[9px] text-white/35">{nome}</span>
                </span>
              ))}
            </div>
          </Painel>

          <Painel>
            <Cap>o resto da colagem — o que já existia</Cap>
            <div className="flex flex-wrap items-center gap-4">
              <span className="fx-spray inline-block size-16 rounded" aria-hidden />
              <span className="fx-collage inline-block bg-[var(--sv-cyan)] px-4 py-3 text-[11px] uppercase text-black">
                colagem
              </span>
              <span className="fx-tape-x inline-block bg-[var(--sv-paper)] px-4 py-3 text-[11px] uppercase text-black">
                fita X
              </span>
              <span className="fx-slap inline-block bg-[var(--sv-lime)] px-3 py-2 text-[11px] uppercase text-black">
                slap
              </span>
              <span className="fx-marker text-xl uppercase text-[var(--sv-yellow)]">marcador</span>
              <span className="fx-riso text-xl uppercase text-white">riso</span>
              <span className="fx-chroma-punk text-xl uppercase text-white">punk</span>
            </div>
            <p className="mt-3 text-[11px] leading-snug text-white/50">
              <code className="text-[var(--sv-cyan)]">.fx-spray</code> e{" "}
              <code className="text-[var(--sv-cyan)]">.fx-screentone</code> usam{" "}
              <code className="text-[var(--sv-cyan)]">currentColor</code>: a tinta do spray é a cor
              do elemento, então uma classe serve a todas as dimensões.
            </p>
          </Painel>
        </div>

        <p className="mt-4 font-mono text-[10px] text-white/40">
          .fx-ransom · .fx-ransom-piece + 9 variantes · .fx-spray · .fx-collage · .fx-marker ·
          .fx-zigzag · .fx-riso · .fx-screentone · .fx-slap · .fx-tape-x · .fx-chroma-punk ·
          .fx-bolts
        </p>
      </Secao>

      {/* ══════════════ 09.14 · CAMADA EXTRAPOLADA ══════════════ */}
      <Secao
        id="extrapolado"
        n="09.14"
        title="A camada extrapolada"
        lead={
          <>
            Peças novas, escritas em{" "}
            <code className="text-[var(--sv-cyan)]">sv-extras.css</code> para engrossar o material
            do realm: mais oito anomalias, seis tratamentos de texto, sete texturas, treze fundos e
            três portais. O arquivo é removível — nada aqui corrige nada, tudo é acréscimo
            deliberado, e essa separação é o que impede a camada extrema de contaminar a base.
          </>
        }
      >
        {/* anomalias */}
        <Cap>anomalias — segunda leva</Cap>
        <Painel className="mb-4">
          <p className="text-xs leading-relaxed text-white/60">
            <strong className="text-[var(--sv-yellow)]">Anomalia age sobre conteúdo.</strong> Ao
            contrário das texturas de 09.8, que pintam a superfície, estas distorcem o que está
            dentro — chuvisco sobre um quadrado vazio não mostra nada, e xerox de um vazio devolve um
            branco. Por isso cada amostra abaixo carrega uma cena, e não um quadrado. A primeira
            versão desta página errou exatamente isso.
          </p>
        </Painel>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["fx-static", "Chuvisco", "TV sem sinal, em steps(3).", false],
            ["fx-tear", "Rasgo", "A página partida ao meio.", false],
            ["fx-xerox", "Xerox", "Fotocópia estourada e suja.", true],
            ["fx-burn", "Queimado", "A borda que o fogo comeu.", false],
            ["fx-scanjump", "Salto de sinc.", "A faixa que escorrega e volta.", false],
            ["fx-echo", "Eco", "O rastro de quem atravessou.", false],
          ].map(([cls, nome, o, claro]) => (
            <div key={cls as string}>
              <div
                className={`${cls} relative flex h-28 w-full items-center justify-center overflow-hidden rounded border-[3px] border-black p-3`}
                style={{
                  backgroundColor: claro ? "#efe6cf" : "var(--sv-ink-2)",
                  color: claro ? "#14100a" : "#fff",
                }}
                {...(cls === "fx-echo" ? { "data-text": "ECO" } : {})}
              >
                {/* A cena: uma palavra e uma retícula, para o efeito ter o que
                    distorcer. Sem conteúdo, metade destas classes não desenha. */}
                <span className="sv-display text-xl uppercase">
                  {cls === "fx-echo" ? "ECO" : "SINAL"}
                </span>
                {cls !== "fx-echo" && (
                  <span
                    className="art-ht-dots pointer-events-none absolute inset-0 opacity-40"
                    style={{ ["--ht-color" as string]: "currentColor", ["--ht-size" as string]: "7px" }}
                    aria-hidden
                  />
                )}
              </div>
              <p className="sv-heavy mt-1.5 text-[11px] uppercase text-white/80">{nome as string}</p>
              <p className="text-[10px] leading-snug text-white/45">{o as string}</p>
              <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.{cls as string}</code>
            </div>
          ))}

          <div>
            <div className="relative h-28 w-full overflow-hidden rounded border-[3px] border-black bg-[#efe6cf]">
              <span className="fx-dither absolute inset-0" aria-hidden />
              <span className="absolute inset-0 grid place-items-center sv-display text-xl uppercase text-black">
                DITHER
              </span>
            </div>
            <p className="sv-heavy mt-1.5 text-[11px] uppercase text-white/80">Dither 1-bit</p>
            <p className="text-[10px] leading-snug text-white/45">
              Trama ordenada em multiply — precisa de camada própria.
            </p>
            <code className="font-mono text-[9px] text-[var(--sv-cyan)]">.fx-dither</code>
          </div>
        </div>
        <Painel className="mt-3">
          <p className="text-[11px] leading-relaxed text-white/55">
            <code className="text-[var(--sv-cyan)]">.fx-echo</code> lê{" "}
            <code className="text-[var(--sv-cyan)]">data-text</code>, como{" "}
            <code className="text-[var(--sv-cyan)]">.fx-glitch</code> (09.9) e{" "}
            <code className="text-[var(--sv-cyan)]">.sv-doubleexpose</code> (09.10) — a terceira peça
            do sistema com esse contrato, e a terceira que falha em silêncio sem o atributo. Se for
            escrever a quarta, considere um componente React que garanta o par.
          </p>
        </Painel>

        {/* texto */}
        <div className="mt-8">
          <Cap>tratamentos de texto — segunda leva</Cap>
          <Painel>
            <div className="flex flex-col gap-5">
              <span className="fx-shadow-long sv-display text-3xl uppercase text-[var(--sv-yellow)]">
                Sombra longa
              </span>
              <span className="fx-outline-double sv-display text-3xl uppercase">Contorno duplo</span>
              <span className="fx-cut sv-display text-3xl uppercase">Recortado</span>
              <span
                className="fx-stack sv-display text-3xl uppercase text-[var(--sv-yellow)]"
                data-text="Empilhado"
              >
                Empilhado
              </span>
              <span className="fx-emboss sv-display text-3xl uppercase">Relevo seco</span>
              <span className="fx-warp sv-display text-3xl uppercase text-white">
                {"Ondulado".split("").map((c, i) => (
                  <span key={i} className="ch">
                    {c}
                  </span>
                ))}
              </span>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-white/50">
              <code className="text-[var(--sv-cyan)]">.fx-warp</code> exige um{" "}
              <code className="text-[var(--sv-cyan)]">&lt;span class=&quot;ch&quot;&gt;</code> por
              caractere — é o preço de ondular sem JavaScript. Para texto que muda em runtime, gere
              os spans no componente; para título fixo, escreva à mão.{" "}
              <code className="text-[var(--sv-cyan)]">.fx-emboss</code> deixa a letra{" "}
              <strong className="text-white/75">transparente</strong>: sobre fundo liso ela some, e
              é assim mesmo — relevo seco é ausência de tinta, precisa de textura por baixo.
            </p>
          </Painel>
        </div>

        {/* texturas */}
        <div className="mt-8">
          <Cap>texturas — segunda leva</Cap>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Amostra cls="art-tex-linen" nome="Linho" o="A trama da capa dura." claro />
            <Amostra cls="art-tex-corrugated" nome="Ondulado" o="A onda do papelão." />
            <Amostra cls="art-tex-tape" nome="Fita" o="Faixa translúcida com brilho." />
            <Amostra cls="art-tex-perforation" nome="Picote" o="A perfuração do bloco." claro />
            <Amostra cls="art-tex-grid-fine" nome="Milimetrada" o="A folha técnica." />
            <Amostra cls="art-tex-stipple" nome="Pontilhismo" o="Gravura só de pontos." claro />
            <Amostra cls="art-tex-woodcut" nome="Xilogravura" o="O sulco da goiva." claro />
          </div>
        </div>

        {/* fundos */}
        <div className="mt-8">
          <Cap>gradientes — sete novos, somando doze</Cap>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Amostra cls="bg-grad-aurora" nome="Aurora" />
            <Amostra cls="bg-grad-ember" nome="Brasa" />
            <Amostra cls="bg-grad-ultraviolet" nome="Ultravioleta" />
            <Amostra cls="bg-grad-oil" nome="Óleo" />
            <Amostra cls="bg-grad-dusk" nome="Crepúsculo" />
            <Amostra cls="bg-grad-newsprint" nome="Papel-jornal" />
            <Amostra cls="bg-grad-mono" nome="Mono" />
          </div>
        </div>

        <div className="mt-8">
          <Cap>fundos padronados — e os que desvanecem</Cap>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Amostra cls="bg-rays" nome="Raios" o="Leque cônico de 6°." />
            <Amostra cls="bg-checker" nome="Xadrez" o="Damas de 22px." />
            <Amostra cls="bg-stripes-diag" nome="Listras" o="Diagonais a 45°." />
            <Amostra cls="bg-dots-fade" nome="Pontos que somem" o="Máscara vertical." />
            <Amostra cls="bg-grid-fade" nome="Grade radial" o="Máscara circular." />
            <Amostra cls="bg-halftone-fade" nome="Retícula em fuga" o="Máscara diagonal." />
          </div>
          <Painel className="mt-3">
            <p className="text-[11px] leading-relaxed text-white/55">
              Os três <em>fade</em> usam{" "}
              <code className="text-[var(--sv-cyan)]">mask-image</code> em vez de sobrepor um
              gradiente do fundo por cima. A diferença é prática: com máscara, o padrão desaparece de
              verdade e deixa passar o que estiver atrás — troque a dimensão e ele continua correto.
              Com gradiente sobreposto, você teria de repintar a máscara em cada uma das vinte.
            </p>
          </Painel>
        </div>

        {/* portais */}
        <div className="mt-8">
          <Cap>portais — três formas novas</Cap>
          <Painel>
            <div className="flex flex-wrap items-center justify-around gap-8 py-2">
              <span className="fx-portal inline-block size-24" aria-hidden />
              <span className="fx-portal-hex inline-block size-24" aria-hidden />
              <span className="fx-portal-shatter inline-block size-24" aria-hidden />
              <span className="fx-portal-slit inline-block h-24 w-16" aria-hidden />
            </div>
            <div className="mt-3 grid gap-2 text-[11px] leading-snug text-white/55 sm:grid-cols-2">
              <p>
                <code className="text-[var(--sv-cyan)]">.fx-portal</code> — o anel cônico girando,
                que já existia. É o portal genérico do colisor.
              </p>
              <p>
                <code className="text-[var(--sv-cyan)]">.fx-portal-hex</code> — o hexágono limpo da
                Spider-Society: tecnologia, não acidente.
              </p>
              <p>
                <code className="text-[var(--sv-cyan)]">.fx-portal-shatter</code> — o estilhaço, para
                quando a fenda foi aberta à força.
              </p>
              <p>
                <code className="text-[var(--sv-cyan)]">.fx-portal-slit</code> — o corte fino, o mais
                discreto dos quatro. Cabe em linha de texto.
              </p>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-white/50">
              Só o primeiro anima. Os três novos são forma pura em{" "}
              <code className="text-[var(--sv-cyan)]">clip-path</code> — combine com{" "}
              <code className="text-[var(--sv-cyan)]">.fx-float</code> ou{" "}
              <code className="text-[var(--sv-cyan)]">.sv-blend</code> se quiser movimento, em vez de
              embutir animação em cada um.
            </p>
          </Painel>
        </div>

        <p className="mt-4 font-mono text-[10px] text-white/40">
          .fx-static · .fx-tear · .fx-xerox · .fx-burn · .fx-dither · .fx-scanjump · .fx-echo ·
          .fx-shadow-long · .fx-outline-double · .fx-cut · .fx-stack · .fx-emboss · .fx-warp ·
          .art-tex-linen · -corrugated · -tape · -perforation · -grid-fine · -stipple · -woodcut ·
          .bg-grad-* (7) · .bg-rays · .bg-checker · .bg-stripes-diag · .bg-dots-fade ·
          .bg-grid-fade · .bg-halftone-fade · .fx-portal-hex · -shatter · -slit
        </p>
      </Secao>
    </>
  )
}
