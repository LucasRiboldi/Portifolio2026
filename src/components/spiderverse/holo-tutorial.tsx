"use client"

import { useState, type ReactNode } from "react"
import { TutorialCard, TutorialStack, useTutorialPointer } from "./holo-tutorial-demo"
import { Code } from "./holo-tutorial-code"

/**
 * Tutorial "como se faz um holo" — a seção didática de /cards.
 *
 * Regra desta seção: TODO snippet exibido é o código que realmente roda na
 * demo ao lado (holo-tutorial-demo.tsx + holo-tutorial.css). Se um dia
 * divergirem, o tutorial vira mentira — então mexer num exige mexer no outro.
 *
 * Fontes estudadas (clonadas em /public para leitura):
 *   · simeydotme/pokemon-cards-css → public/pokemon-cards-main/src/style.scss
 *   · simeydotme/hover-tilt        → public/hover-tilt-main/packages/hover-tilt
 */

function Step({
  n,
  title,
  children,
  demo,
}: {
  n: number
  title: string
  children: ReactNode
  demo?: ReactNode
}) {
  return (
    <section className="border-t-2 border-white/12 pt-8" aria-label={`Passo ${n}: ${title}`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(200px,260px)] lg:items-start">
        <div className="min-w-0">
          <h3 className="sv-display mb-3 text-xl uppercase text-white">
            <span className="text-[var(--sv-magenta)]">{String(n).padStart(2, "0")}.</span> {title}
          </h3>
          <div className="space-y-4 text-sm leading-relaxed text-white/75">{children}</div>
        </div>
        {demo ? <div className="lg:sticky lg:top-24">{demo}</div> : null}
      </div>
    </section>
  )
}

/** Demo com leitura ao vivo das variáveis — o "console" do passo 1. */
function PointerReadout() {
  const { ref, handlers, readoutRef } = useTutorialPointer({ readout: true })
  return (
    <div>
      <TutorialCard ref={ref} handlers={handlers} />
      <pre
        ref={readoutRef}
        aria-live="off"
        className="tut-code mt-3 !text-[11px]"
        // preenchido pelo rAF; começa no estado de repouso
      >
        <code>{"--mx: 50.00%\n--my: 50.00%\n--o:  0.000"}</code>
      </pre>
    </div>
  )
}

/** Demo do foil com alternância entre camada crua e camada aplicada. */
function ShineDemo() {
  const [raw, setRaw] = useState(false)
  const { ref, handlers } = useTutorialPointer()
  return (
    <div>
      <TutorialCard ref={ref} handlers={handlers} tilt shine raw={raw} />
      <button
        type="button"
        onClick={() => setRaw((v) => !v)}
        aria-pressed={raw}
        className="sv-heavy mt-3 w-full border-2 border-black bg-[var(--sv-yellow)] px-3 py-2 text-[10px] uppercase tracking-wide text-black transition hover:brightness-95"
      >
        {raw ? "▶ ver aplicada (color-dodge)" : "◀ ver a camada crua"}
      </button>
      <p className="mt-2 text-[11px] leading-snug text-white/55">
        {raw
          ? "O gradiente puro, sem filtro nem blend: um arco-íris chapado."
          : "O mesmo gradiente queimado em color-dodge — vira metal."}
      </p>
    </div>
  )
}

export function HoloTutorial() {
  return (
    <div className="mt-10 space-y-12">
      <Step
        n={1}
        title="O JS não desenha nada"
        demo={<PointerReadout />}
      >
        <p>
          A primeira coisa a desaprender: <b className="text-white">nenhuma dessas cartas é
          desenhada em JavaScript</b>. O script tem um único trabalho — traduzir a posição do
          ponteiro em variáveis CSS. O desenho inteiro é CSS reagindo a essas variáveis.
        </p>
        <p>
          Isso importa por dois motivos. O navegador consegue tratar o resultado como composição
          (rápido), e o efeito continua existindo se o JS falhar — a carta só fica parada.
        </p>
        <p>
          Passe o mouse na carta ao lado e veja as três variáveis mudarem. Normalizamos a posição
          para <code className="text-[var(--sv-cyan)]">0–100%</code> e guardamos um{" "}
          <code className="text-[var(--sv-cyan)]">--o</code> (de <i>opacity</i>) que vale 1 com o
          ponteiro presente e 0 quando ele sai.
        </p>
        <Code
          lang="ts"
          highlight={[6, 7, 8]}
          code={`function move(e: React.PointerEvent) {
  const r = el.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width   // 0..1
  const py = (e.clientY - r.top) / r.height   // 0..1

  el.style.setProperty("--mx", \`\${px * 100}%\`)
  el.style.setProperty("--my", \`\${py * 100}%\`)
  el.style.setProperty("--o", "1")
}`}
        />
      </Step>

      <Step
        n={2}
        title="A inclinação, e a pegadinha dos eixos"
        demo={<TiltDemo />}
      >
        <p>
          A carta inclina com <code className="text-[var(--sv-cyan)]">perspective()</code> seguido
          das duas rotações. A ordem importa: a perspectiva precisa vir <b className="text-white">
          antes</b> na mesma declaração, senão as rotações acontecem num espaço já achatado e o
          efeito some.
        </p>
        <p>
          Aqui mora a pegadinha que mais confunde quem lê o projeto original: mover o ponteiro na{" "}
          <b className="text-white">horizontal</b> tem que girar a carta em torno do eixo{" "}
          <b className="text-white">vertical</b> (Y). Ou seja, o X do ponteiro alimenta o{" "}
          <code className="text-[var(--sv-cyan)]">rotateY</code>, e o Y alimenta o{" "}
          <code className="text-[var(--sv-cyan)]">rotateX</code> — cruzado. No{" "}
          <code>pokemon-cards-css</code> isso fica escondido porque a variável se chama{" "}
          <code className="text-[var(--sv-cyan)]">--rx</code> mas é usada em{" "}
          <code>rotateY()</code>. Não é erro deles; é só um nome que engana.
        </p>
        <p>
          O sinal do eixo vertical também é invertido (<code>0.5 − py</code>, não{" "}
          <code>py − 0.5</code>): puxar o ponteiro para cima deve levantar a borda de cima em
          direção a você.
        </p>
        <Code
          lang="css"
          highlight={[2]}
          code={`.card {
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
}`}
        />
        <Code
          lang="ts"
          highlight={[1, 2]}
          code={`rx: (0.5 - py) * 22   // ponteiro em Y  → rotateX  (sinal invertido)
ry: (px - 0.5) * 22   // ponteiro em X  → rotateY`}
        />
      </Step>

      <Step n={3} title="O foil: um arco-íris que corre ao contrário" demo={<ShineDemo />}>
        <p>
          Esta é a ideia central de todo o efeito, e ela é surpreendentemente simples: um{" "}
          <code className="text-[var(--sv-cyan)]">repeating-linear-gradient</code> de cores
          saturadas — os <i>sunpillars</i> — cuja{" "}
          <code className="text-[var(--sv-cyan)]">background-position</code> se move quando o
          ponteiro se move.
        </p>
        <p>
          Mas com duas torções que fazem toda a diferença. A primeira: o foil corre{" "}
          <b className="text-white">contra</b> o ponteiro, e com ganho. A fórmula{" "}
          <code>(50% − --bx) × 2.6 + 50%</code> inverte o sentido (por causa do{" "}
          <code>50% −</code>) e exagera o deslocamento (o <code>× 2.6</code>). É isso que imita
          luz refletindo numa superfície inclinada: o reflexo desliza mais rápido que a mão, e no
          sentido oposto.
        </p>
        <p>
          A segunda torção é o acabamento. Um gradiente arco-íris sozinho parece decoração de
          festa. O que o transforma em metal é a dupla{" "}
          <code className="text-[var(--sv-cyan)]">filter</code> +{" "}
          <code className="text-[var(--sv-cyan)]">mix-blend-mode: color-dodge</code>: o contraste
          alto esmaga os meios-tons em faixas duras, e o <i>color-dodge</i> só clareia onde já
          havia luz — as sombras da arte por baixo continuam escuras. Aperte o botão da demo para
          ver a camada crua.
        </p>
        <Code
          lang="css"
          highlight={[13, 14, 15, 18, 19]}
          code={`.card__shine {
  background-image: repeating-linear-gradient(110deg,
    hsl(2,   100%, 73%)  0%,
    hsl(53,  100%, 69%)  5%,
    hsl(93,  100%, 69%) 10%,
    hsl(176, 100%, 76%) 15%,
    hsl(228, 100%, 74%) 20%,
    hsl(283, 100%, 73%) 25%,
    hsl(2,   100%, 73%) 30%);
  background-size: 400% 400%;

  /* corre CONTRA o ponteiro (50% - x), com ganho (× 2.6) */
  background-position:
    calc(((50% - var(--bx)) * 2.6) + 50%)
    calc(((50% - var(--by)) * 3.5) + 50%);

  /* sem estas duas linhas é festa junina; com elas, é metal */
  filter: brightness(0.8) contrast(2.1) saturate(0.85);
  mix-blend-mode: color-dodge;
  opacity: var(--o);
}`}
        />
        <p className="rounded border-l-4 border-[var(--sv-yellow)] bg-white/5 py-2 pl-3 text-[13px]">
          <b className="text-white">Detalhe do original:</b> antes de virar{" "}
          <code>--bx</code>, o valor passa por um remapeamento de{" "}
          <code>0–100%</code> para <code>37–63%</code>. O foil anda menos que o ponteiro na
          origem, para depois ser multiplicado — sem isso o gradiente sai da carta nos cantos.
        </p>
      </Step>

      <Step n={4} title="O reflexo especular" demo={<GlareDemo />}>
        <p>
          O foil dá a iridescência, mas falta o brilho que <i>segue</i> o dedo — o reflexo da
          fonte de luz na superfície plastificada. Esse é o mais fácil dos três: um{" "}
          <code className="text-[var(--sv-cyan)]">radial-gradient</code> centrado exatamente na
          posição do ponteiro.
        </p>
        <p>
          O blend aqui é <code className="text-[var(--sv-cyan)]">overlay</code>, não{" "}
          <i>color-dodge</i>. A diferença de comportamento é o ponto: o <i>overlay</i> clareia os
          claros <b className="text-white">e escurece os escuros</b>. Por isso o gradiente termina
          em preto translúcido — a borda oposta ao ponteiro fica mais escura, e é esse
          escurecimento que dá volume à carta.
        </p>
        <Code
          lang="css"
          highlight={[3, 6, 8]}
          code={`.card__glare {
  background: radial-gradient(
    farthest-corner circle at var(--mx) var(--my),
    rgba(255,255,255,0.75) 10%,
    rgba(255,255,255,0.28) 24%,
    rgba(0,0,0,0.5) 90%   /* escurece o lado oposto = volume */
  );
  mix-blend-mode: overlay;
  opacity: var(--o);
}`}
        />
      </Step>

      <Step n={5} title="O peso: por que a carta não pode obedecer na hora">
        <p>
          Com o que temos até aqui, a carta funciona — e parece barata. O motivo é que ela
          obedece instantaneamente, e objetos com massa não fazem isso.
        </p>
        <p>
          O projeto original resolve com <i>springs</i> do Svelte. Sem essa dependência, um
          suavizador exponencial em <code className="text-[var(--sv-cyan)]">requestAnimationFrame
          </code> faz o mesmo papel em cinco linhas: a cada quadro, o valor atual caminha uma
          fração <code>k</code> da distância até o alvo.
        </p>
        <p>
          O detalhe que vende a ilusão é usar <b className="text-white">dois</b> valores de{" "}
          <code>k</code>. Durante a interação, <code>0.35</code> — perseguição rápida, a carta
          gruda no ponteiro. Ao sair, <code>0.06</code> — assentamento lento, como um objeto
          pesado voltando ao lugar. É essa assimetria que dá a sensação de peso.
        </p>
        <Code
          lang="ts"
          highlight={[3, 9, 12]}
          code={`function tick() {
  for (const key of KEYS) {
    cur[key] += (target[key] - cur[key]) * k   // caminha uma fração
  }
  escreveVariaveis(cur)
  if (!chegou) requestAnimationFrame(tick)
}

ease = 0.35   // no move:  gruda no ponteiro

// no leave:
ease = 0.06   // assenta devagar — o "peso"`}
        />
        <p className="rounded border-l-4 border-[var(--sv-cyan)] bg-white/5 py-2 pl-3 text-[13px]">
          <b className="text-white">Pare o loop.</b> Quando todos os valores chegam ao alvo, não
          agende o próximo quadro. Um <code>rAF</code> eterno por carta custa bateria à toa — e
          numa galeria são dezenas deles.
        </p>
      </Step>

      <Step n={6} title="Empilhar em 3D: profundidade por fator" demo={<StackDemo />}>
        <p>
          O <code>hover-tilt</code> resolve outro problema: fazer partes da carta{" "}
          <b className="text-white">descolarem</b> dela. A técnica tem duas peças. O contêiner
          precisa de <code className="text-[var(--sv-cyan)]">transform-style: preserve-3d</code>{" "}
          (sem isso os filhos são achatados no plano do pai), e cada camada recebe um{" "}
          <code className="text-[var(--sv-cyan)]">translateZ</code> proporcional.
        </p>
        <p>
          O que produz o parallax não é o <code>translateZ</code> em si — é a{" "}
          <b className="text-white">diferença de fator</b> entre as camadas. Fundo em 0, moldura em
          1×, emblema em 2×: quando a carta inclina, o emblema percorre o dobro do caminho da
          moldura, e o olho lê isso como profundidade.
        </p>
        <p>
          Multiplicar a profundidade por <code>--o</code> faz as camadas decolarem ao entrar e
          pousarem ao sair, em vez de ficarem permanentemente flutuando.
        </p>
        <Code
          lang="css"
          highlight={[3, 8]}
          code={`.stack {
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;   /* sem isto, tudo achata */
}

.layer {
  /* --z é o FATOR: 0 = fundo, 1 = moldura, 2 = emblema */
  transform: translateZ(calc(var(--o) * 40px * var(--z)));
}`}
        />
        <p className="rounded border-l-4 border-[var(--sv-magenta)] bg-white/5 py-2 pl-3 text-[13px]">
          <b className="text-white">A armadilha que custa horas:</b>{" "}
          <code>mix-blend-mode</code> em um filho <b className="text-white">achata o{" "}
          <code>preserve-3d</code> do pai direto</b> — e o foil dos passos 3 e 4 é feito de blend
          modes. Ao juntar os dois sistemas, a carta inteira (com shine e glare dentro) tem que
          morar em <b className="text-white">uma única</b> camada, para que os blends fiquem como
          netos do contêiner 3D, e não como filhos. O mesmo vale para{" "}
          <code>will-change: opacity</code> e para <code>container-type</code>.
        </p>
      </Step>

      <Step n={7} title="O que separa a demo do código de produção">
        <p>
          Três coisas que não aparecem em nenhum tutorial de efeito, e que decidem se ele pode ir
          para um site de verdade.
        </p>
        <p>
          <b className="text-white">Movimento é opcional.</b> Todo o efeito precisa desaparecer
          sob <code className="text-[var(--sv-cyan)]">prefers-reduced-motion</code>. Não é
          preciosismo: para quem tem sensibilidade vestibular, uma galeria dessas causa mal-estar
          físico.
        </p>
        <p>
          <b className="text-white">A carta não é uma imagem decorativa.</b> Se ela abre um
          popover, é um <code>&lt;button&gt;</code> com{" "}
          <code className="text-[var(--sv-cyan)]">aria-expanded</code>, fecha no{" "}
          <code>Esc</code> e é alcançável por teclado. As camadas de efeito levam{" "}
          <code className="text-[var(--sv-cyan)]">pointer-events: none</code> e{" "}
          <code>aria-hidden</code>, senão viram armadilhas de foco e de clique.
        </p>
        <p>
          <b className="text-white">Blend mode e filtro são caros.</b> Cada carta com{" "}
          <i>color-dodge</i> + <code>filter</code> é uma camada que o compositor precisa
          rasterizar. Numa galeria com dezenas delas isso é sentido — inclusive nesta página, que
          hoje carrega mais de 60 cartas. A saída é renderizar sob demanda por viewport.
        </p>
        <Code
          lang="css"
          highlight={[2, 3, 4]}
          code={`@media (prefers-reduced-motion: reduce) {
  .card       { transform: none !important; }
  .card__shine,
  .card__glare { opacity: 0.22; background-position: 50% 50%; }
}`}
        />
      </Step>

      <section className="border-t-2 border-white/12 pt-8">
        <h3 className="sv-display mb-3 text-xl uppercase text-white">Créditos e fontes</h3>
        <p className="text-sm leading-relaxed text-white/75">
          As duas técnicas são de <b className="text-white">Simon Goellner (simeydotme)</b>, e
          este tutorial é uma leitura do código-fonte dos projetos dele — as cartas desta página
          são uma reconstrução, não uma cópia colada.
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-white/75">
          <li>
            →{" "}
            <a
              className="text-[var(--sv-cyan)] underline underline-offset-2"
              href="https://github.com/simeydotme/pokemon-cards-css"
              target="_blank"
              rel="noreferrer noopener"
            >
              simeydotme/pokemon-cards-css
            </a>{" "}
            — o foil, as raridades e as máscaras (
            <a
              className="text-[var(--sv-cyan)] underline underline-offset-2"
              href="https://poke-holo.simey.me/"
              target="_blank"
              rel="noreferrer noopener"
            >
              demo ao vivo
            </a>
            )
          </li>
          <li>
            →{" "}
            <a
              className="text-[var(--sv-cyan)] underline underline-offset-2"
              href="https://github.com/simeydotme/hover-tilt"
              target="_blank"
              rel="noreferrer noopener"
            >
              simeydotme/hover-tilt
            </a>{" "}
            — o tilt genérico e o empilhamento 3D
          </li>
        </ul>
      </section>
    </div>
  )
}

/* ---- Demos simples (as compostas ficam acima) ---------------------------- */

function TiltDemo() {
  const { ref, handlers } = useTutorialPointer()
  return <TutorialCard ref={ref} handlers={handlers} tilt />
}

function GlareDemo() {
  const { ref, handlers } = useTutorialPointer()
  return <TutorialCard ref={ref} handlers={handlers} tilt shine glare />
}

function StackDemo() {
  const { ref, handlers } = useTutorialPointer()
  return <TutorialStack ref={ref} handlers={handlers} />
}
