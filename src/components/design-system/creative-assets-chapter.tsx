/* ------------------------------------------------------------------
   15.1 · Assets em pares.
   ------------------------------------------------------------------
   O realm já tinha 23 ilustrações SVG espalhadas por quatro arquivos. O que
   faltava não era a vigésima quarta peça: era sistema. Cada categoria abaixo
   vem em DOIS tipos que resolvem problemas diferentes, e o valor do capítulo
   está na regra de escolha entre eles — um par ensina uma decisão, vinte
   peças soltas ensinam um catálogo.
   ------------------------------------------------------------------ */
import {
  ICONES,
  IconeContorno,
  IconeAdesivo,
  SpotMascara,
  SpotFita,
  SpotLata,
  CenaSalto,
  CenaOficina,
  ImagemRetrato,
  ImagemPaisagem,
} from "./creative-assets"

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

/** Cartão de comparação: os dois tipos lado a lado, com a regra de escolha. */
function Par({
  titulo,
  a,
  b,
  regra,
}: {
  titulo: string
  a: { nome: string; quando: string; amostra: React.ReactNode }
  b: { nome: string; quando: string; amostra: React.ReactNode }
  regra: React.ReactNode
}) {
  return (
    <div>
      <Cap>{titulo}</Cap>
      <div className="grid gap-3 sm:grid-cols-2">
        {[a, b].map((t, i) => (
          <Painel key={t.nome}>
            <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-white/10 pb-2">
              <p className="sv-display text-base uppercase leading-none text-white">{t.nome}</p>
              <span className="sv-heavy text-[9px] uppercase tracking-wide text-[var(--sv-yellow)]">
                tipo {i + 1}
              </span>
            </div>
            <div className="grid min-h-[7rem] place-items-center py-2">{t.amostra}</div>
            <p className="mt-2 border-t border-white/10 pt-2 text-[11px] leading-snug text-white/55">
              {t.quando}
            </p>
          </Painel>
        ))}
      </div>
      <Painel className="mt-3">
        <p className="text-[11px] leading-relaxed text-white/60">{regra}</p>
      </Painel>
    </div>
  )
}

export function CreativeAssetsChapter() {
  return (
    <section
      id="assets-pares"
      aria-label="15.1 · Assets em pares"
      className="mt-16 scroll-mt-24 border-t-[3px] border-black pt-10"
    >
      <p className="sv-heavy mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        <span className="sv-display mr-2 text-2xl text-[var(--sv-yellow)]">15.1</span>
        Assets em pares
      </p>
      <p className="mb-8 max-w-3xl text-sm leading-relaxed text-white/60">
        O realm já tinha vinte e três ilustrações espalhadas por quatro arquivos. O que faltava não
        era a vigésima quarta peça — era <strong className="text-white/80">sistema</strong>. Cada
        categoria abaixo vem em dois tipos que resolvem problemas diferentes, e o que este capítulo
        documenta é a <em>regra de escolha</em> entre eles. Um par ensina uma decisão; vinte peças
        soltas ensinam um catálogo.
      </p>

      {/* ---------- ÍCONES ---------- */}
      <Par
        titulo="ícones — o mesmo desenho, dois tratamentos"
        a={{
          nome: "Contorno",
          quando:
            "Interface: menu, botão, tabela, campo. Herda a tinta do texto por currentColor, então atravessa as 20 dimensões sem variante.",
          amostra: (
            <div className="flex flex-wrap justify-center gap-4 text-white">
              {ICONES.slice(0, 6).map((i) => (
                <IconeContorno key={i.id} id={i.id} className="size-7" />
              ))}
            </div>
          ),
        }}
        b={{
          nome: "Adesivo",
          quando:
            "Destaque: card de feature, faixa de preço, marcador de seção. Preenchido, borda preta e sombra chapada — é o ícone virado peça colada.",
          amostra: (
            <div className="flex flex-wrap justify-center gap-3">
              {ICONES.slice(0, 4).map((i, n) => (
                <IconeAdesivo
                  key={i.id}
                  id={i.id}
                  className="size-10"
                  cor={
                    ["var(--sv-yellow)", "var(--sv-cyan)", "var(--sv-lime)", "var(--sv-magenta)"][n]
                  }
                />
              ))}
            </div>
          ),
        }}
        regra={
          <>
            <strong className="text-white/80">A geometria é idêntica nos dois.</strong> Os caminhos
            SVG saem de uma lista única (<code className="text-[var(--sv-cyan)]">GLIFOS</code>), e
            só o tratamento muda — é isso que faz disto um sistema e não dois conjuntos. O usuário
            reconhece o mesmo ícone no menu e no card, que é o ponto inteiro de ter uma família.
            <br />
            <br />
            Grade de 24, traço de 2, cantos vivos (
            <code className="text-[var(--sv-cyan)]">strokeLinejoin: miter</code>) — o mesmo raio 0
            do resto do realm. <span className="text-[var(--sv-yellow)]">Regra prática:</span> se o
            ícone está dentro de algo clicável e ao lado de um rótulo, é contorno. Se ele É o
            elemento, é adesivo.
          </>
        }
      />

      {/* ---------- ILUSTRAÇÕES ---------- */}
      <div className="mt-10">
        <Par
          titulo="ilustrações — spot e cena"
          a={{
            nome: "Spot",
            quando:
              "Acompanha um parágrafo sem disputar com ele. Uma cor só (currentColor), sem cenário, legível a 32px.",
            amostra: (
              <div className="flex items-center gap-5 text-[var(--sv-cyan)]">
                <SpotMascara className="size-12" />
                <SpotFita className="size-12 text-[var(--sv-lime)]" />
                <SpotLata className="size-12 text-[var(--sv-magenta)]" />
              </div>
            ),
          }}
          b={{
            nome: "Cena",
            quando:
              "Ocupa a página: hero, estado vazio, 404. Multi-camada, paleta própria, profundidade.",
            amostra: <CenaSalto className="w-full max-w-[15rem] border-[3px] border-black" />,
          }}
          regra={
            <>
              Os dois tipos são <strong className="text-white/80">inversos por desenho</strong>. O
              spot funciona a 32px e vira mancha a 400; a cena funciona a 400 e vira mancha a 32.
              Não existe ilustração que faça as duas coisas — tentar isso é o erro que produz o
              desenho médio que não serve a nenhum tamanho.
              <br />
              <br />
              O spot herda <code className="text-[var(--sv-cyan)]">currentColor</code> e por isso
              atravessa as dimensões; a cena traz paleta própria e por isso{" "}
              <strong className="text-white/80">não</strong> atravessa — cada dimensão que a use
              precisa de uma versão, e é um custo que se aceita conscientemente.
            </>
          }
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Painel>
            <Cap>segunda cena — mesma gramática</Cap>
            <CenaOficina className="w-full border-[3px] border-black" />
            <p className="mt-2 text-[11px] leading-snug text-white/50">
              Fundo em camadas, retícula por cima, silhuetas chapadas e um foco de luz. As duas
              cenas repetem essa estrutura — é o que as faz parecer do mesmo mundo.
            </p>
          </Painel>
          <Painel>
            <Cap>acessibilidade das duas</Cap>
            <p className="text-[11px] leading-relaxed text-white/60">
              Toda peça leva <code className="text-[var(--sv-cyan)]">role=&quot;img&quot;</code> com{" "}
              <code className="text-[var(--sv-cyan)]">aria-label</code> — SVG sem rótulo é invisível
              para leitor de tela, e as 23 ilustrações antigas já seguiam essa regra.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">
              A exceção: quando a ilustração é <em>puramente</em> decorativa e o texto ao lado já
              diz tudo, o correto é{" "}
              <code className="text-[var(--sv-cyan)]">aria-hidden=&quot;true&quot;</code> — rótulo
              redundante é ruído, não acesso. Nas amostras acima elas são o conteúdo, então levam
              rótulo.
            </p>
          </Painel>
        </div>
      </div>

      {/* ---------- IMAGENS ---------- */}
      <div className="mt-10">
        <Par
          titulo="imagens de exemplo — retrato e paisagem"
          a={{
            nome: "Retrato",
            quando:
              "Avatar, autor, depoimento, equipe. Sugere uma pessoa sem inventar um rosto — as iniciais resolvem.",
            amostra: (
              <div className="flex flex-wrap justify-center gap-3">
                {["Lucas Riboldi", "Gwen Stacy", "Miles Morales", "Peni Parker"].map((n) => (
                  <ImagemRetrato key={n} nome={n} className="size-14 text-lg" />
                ))}
              </div>
            ),
          }}
          b={{
            nome: "Paisagem",
            quando:
              "Capa de card, topo de artigo, grade de projetos. Preenche área sem competir com o texto por cima.",
            amostra: <ImagemPaisagem seed="terra-1610" className="w-full max-w-[15rem]" />,
          }}
          regra={
            <>
              As duas são <strong className="text-white/80">geradas, não arquivos</strong>: nenhuma
              requisição de rede, nenhum peso no repositório, e nada para envelhecer. A cor sai de
              um hash do próprio texto — duas pessoas diferentes nunca recebem a mesma, e a mesma
              pessoa recebe sempre a sua, entre recarregamentos e entre páginas.
              <br />
              <br />
              <span className="text-[var(--sv-yellow)]">Por que iniciais e não um rosto:</span>{" "}
              placeholder com foto de pessoa inventada cria expectativa falsa no protótipo e
              constrangimento quando a foto real chega. Inicial é honesta sobre ser provisória.
            </>
          }
        />
      </div>

      <Painel className="mt-8">
        <Cap>o que este capítulo NÃO faz</Cap>
        <p className="text-[11px] leading-relaxed text-white/60">
          Não substitui as 23 ilustrações existentes (
          <code className="text-[var(--sv-cyan)]">illustrations</code>,{" "}
          <code className="text-[var(--sv-cyan)]">illustrations-styles</code>,{" "}
          <code className="text-[var(--sv-cyan)]">punk-illustrations</code>,{" "}
          <code className="text-[var(--sv-cyan)]">art-graphics</code>), que continuam válidas e
          documentadas na seção 15. Acrescenta a camada que faltava por cima delas: o critério de
          escolha. Quem for desenhar a próxima peça agora sabe em qual dos dois tipos ela cai — e
          se não couber em nenhum, isso é sinal de que o sistema precisa de um terceiro, não de mais
          uma exceção.
        </p>
      </Painel>

      <p className="mt-4 font-mono text-[10px] text-white/40">
        IconeContorno · IconeAdesivo (8 glifos) · SpotMascara · SpotFita · SpotLata · CenaSalto ·
        CenaOficina · ImagemRetrato · ImagemPaisagem
      </p>
    </section>
  )
}
