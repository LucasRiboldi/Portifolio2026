/* ------------------------------------------------------------------
   Matérias 09.8 (marcas da casa) e 17.1 (o cabeçalho/nameplate) do
   caderno de componentes do Anfitrião. Extraídas de arcane-components.tsx
   para manter cada arquivo sob 500 linhas. Reusa as primitivas de
   ./arcane-chapters e o rótulo Classes de ./arcane-ui-helpers.
   ------------------------------------------------------------------ */
import { SubChapter, Folha, Nota } from "./arcane-chapters"
import { Classes } from "./arcane-ui-helpers"

/* ══════════════ 09.8 · MARCAS DA CASA ══════════════ */
export function ArcaneMarcas() {
  return (
    <SubChapter
      id="marcas"
      n="09.8"
      title="Carimbo, verbete, vinheta e pé"
      lead="As peças pequenas que ninguém procura no catálogo e todas as páginas acabam precisando: o carimbo que data, o verbete que define, a vinheta que separa sem fio e o pé que numera. São o miúdo da tipografia — e é o miúdo que faz a página parecer composta por alguém."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O carimbo
          </p>
          <div className="dp-stamp">
            Arquivo
            <br />
            18 · VII · 26
          </div>
          <Nota>
            <code className="font-mono">.dp-stamp</code> — filete sépia de 2px, versalete, girado
            −4° e a 72% de opacidade. A inclinação é o ponto: carimbo aplicado à mão nunca sai reto.
          </Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O verbete
          </p>
          <div>
            <p className="dp-term">
              <b>Fólio</b> — <em>o número da página, no pé</em>
            </p>
            <p className="dp-term">
              <b>Olho</b> — <em>citação roubada ao miolo</em>
            </p>
            <p className="dp-term">
              <b>Chapéu</b> — <em>a linha que classifica</em>
            </p>
          </div>
          <Nota>
            <code className="font-mono">.dp-term</code> — versalete no termo, tinta fraca na
            definição, pontilhado entre entradas. É a peça do glossário.
          </Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O par
          </p>
          <div>
            <p className="dp-kv">
              <b>Edição</b> <span>Nº 5</span>
            </p>
            <p className="dp-kv">
              <b>Tiragem</b> <span>31.000</span>
            </p>
            <p className="dp-kv">
              <b>Fecho</b> <span>00h00</span>
            </p>
          </div>
          <Nota>
            <code className="font-mono">.dp-kv</code> — rótulo e valor nas pontas, pontilhado a
            separar. Para ficha técnica; nunca para texto corrido.
          </Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            Vinheta e pé
          </p>
          <div className="dp-orn">⁂</div>
          <div className="dp-foot mt-3">
            <span>Terra-2026</span>
            <span className="dp-folio">— 7 —</span>
            <span>Vol. III</span>
          </div>
          <Nota>
            <code className="font-mono">.dp-orn</code> separa seções sem gastar um fio;{" "}
            <code className="font-mono">.dp-foot</code> distribui as três marcas de registro e o
            fólio ao centro.
          </Nota>
        </Folha>
      </div>

      <Folha className="mt-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "#8a3020" }}>
          Uma ressalva medida, sobre o carimbo
        </p>
        <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
          O carimbo sai em <code className="font-mono">--dp-sepia</code> a 0.58rem — cerca de 9px —
          e ainda por cima a 72% de opacidade, o que derruba o contraste efetivo abaixo dos 4.52:1
          que a tinta mede em cheio. Ele passa como <strong>ornamento datado</strong>, não como
          texto: se a informação do carimbo importar para o leitor (um prazo, um estado), repita-a
          em tinta cheia num <code className="font-mono">.dp-kv</code> ao lado. Carimbo que carrega
          informação única é uma falha de acessibilidade com cara de charme.
        </p>
      </Folha>

      <Classes>.dp-stamp · .dp-term · .dp-kv · .dp-orn · .dp-foot · .dp-folio</Classes>
    </SubChapter>
  )
}

/* ══════════════ 17.1 · O CABEÇALHO DA FOLHA ══════════════ */
export function ArcaneCabecalho() {
  return (
    <SubChapter
      id="cabecalho"
      n="17.1"
      title="O cabeçalho e o nameplate"
      lead="A peça mais cerimoniosa da folha, e a única que nunca se repete: abre a primeira página e some das internas, que passam a se identificar só pelo fólio. É composta em quatro andares — a linha de registro, o nome, o subtítulo em gótica e o lema —, e cada andar existe para responder a uma pergunta diferente do leitor: onde estou, que jornal é este, de que espécie, e por quê."
    >
      <Folha className="!p-4">
        <div className="dp-masthead">
          <div className="dp-masthead-top">
            <span>Vol. III · Nº 5</span>
            <svg className="dp-crest" viewBox="0 0 48 48" aria-hidden>
              <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <path d="M24 11 L27 20 L36 20 L29 26 L32 35 L24 29 L16 35 L19 26 L12 20 L21 20 Z" fill="currentColor" />
            </svg>
            <span>Preço: um token</span>
          </div>

          <span className="dp-nameplate">
            <h2>
              O Anfitri<span className="dp-amp">ã</span>o
            </h2>
          </span>
          <p className="dp-nameplate-sub">The Daily Prophet</p>

          <p className="dp-motto">
            “A tinta seca; o sistema, não.”
            <small>Fundada em MCMVIII · Impressa na Terra-2026</small>
          </p>

          <div className="dp-dateline">
            <span>Sábado, 18 de julho de 2026</span>
            <span>Edição da manhã</span>
            <span>12 páginas</span>
          </div>

          <div className="dp-sections">
            <a href="#cabecalho">Manchete</a>
            <span>·</span>
            <a href="#cabecalho">Mecânicas</a>
            <span>·</span>
            <a href="#cabecalho">Oficina</a>
            <span>·</span>
            <a href="#cabecalho">Classificados</a>
          </div>
        </div>
      </Folha>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            O nameplate não é um h1
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            <code className="font-mono">.dp-nameplate</code> estiliza{" "}
            <code className="font-mono">:is(h1, h2, h3)</code>, não <code className="font-mono">h1</code>.
            A razão é esta página: na folha real o nameplate <em>é</em> o título do documento, mas
            aqui ele é uma amostra dentro de um guia que já tem o seu h1. Prender o estilo à tag
            obrigaria a duplicar o h1 só para a amostra ficar bonita — e dois h1 quebram a árvore de
            cabeçalhos de quem usa leitor de tela.
          </p>
          <Nota>Mesma armadilha já corrigida no _Dev com <code className="font-mono">.dv-hero</code>.</Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A letra que quebra a caixa
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            <code className="font-mono">.dp-amp</code> devolve uma letra ao itálico da old style
            dentro do nome em tipo de madeira. Nasceu para o “&amp;” dos nomes compostos — que em
            madeira sai grosseiro —, e serve para qualquer caractere que a face talhada não resolve
            bem, como o “ã” acima.
          </p>
          <Nota>Uma exceção por nameplate. Duas e vira efeito.</Nota>
        </Folha>

        <Folha>
          <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "var(--dp-sepia)" }}>
            A folha e o lema
          </p>
          <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
            <code className="font-mono">.dp-sheet</code> é o papel em si: 1180px no máximo, filete
            de 1px nas laterais e nada em cima nem embaixo — porque a folha é cortada nos lados e
            contínua no rolo. <code className="font-mono">.dp-motto</code> traz o lema em itálico e,
            no <code className="font-mono">small</code>, a fundação e a praça.
          </p>
          <Nota>Envolva a página em <code className="font-mono">.dp .dp-sheet</code>, nessa ordem.</Nota>
        </Folha>
      </div>

      <Folha className="mt-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide" style={{ color: "#8a3020" }}>
          Só na primeira página
        </p>
        <p className="text-xs leading-snug" style={{ color: "var(--dp-ink-2)" }}>
          Repetir o cabeçalho na página interna é o erro mais comum de quem compõe uma folha pela
          primeira vez — o instinto de web, onde todo layout carrega o mesmo header. Aqui não: a
          página interna abre direto na matéria e se identifica pelo{" "}
          <code className="font-mono">.dp-foot</code>, com o fólio. O nameplate é uma cerimônia de
          abertura, e cerimônia que se repete deixa de ser cerimônia.
        </p>
      </Folha>

      <Classes>
        .dp-sheet · .dp-masthead · .dp-masthead-top · .dp-crest · .dp-nameplate · .dp-amp ·
        .dp-nameplate-sub · .dp-motto · .dp-dateline · .dp-sections · .dp-lead
      </Classes>
    </SubChapter>
  )
}
