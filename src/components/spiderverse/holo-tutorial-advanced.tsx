"use client"

import { useState } from "react"
import { Code, Nota, Step } from "./holo-tutorial-ui"
import { TutorialCard, TutorialMask, useTutorialPointer } from "./holo-tutorial-demo"

/**
 * Passos 8 a 11 — a anatomia real do sistema poke-holo vendorizado.
 *
 * Diferente dos passos 1-7 (que ensinam a construir do zero), estes leem o
 * CSS que está em /public/poke-holo/css e explicam o que ele faz. Todos os
 * trechos citados foram conferidos contra os arquivos reais; os caminhos
 * estão em cada snippet para quem quiser abrir e comparar.
 */

function MaskDemo() {
  const [masked, setMasked] = useState(true)
  const { ref, handlers } = useTutorialPointer()
  return (
    <div>
      <TutorialMask ref={ref} handlers={handlers} masked={masked} />
      <button
        type="button"
        onClick={() => setMasked((v) => !v)}
        aria-pressed={masked}
        className="sv-heavy mt-3 w-full border-2 border-black bg-[var(--sv-yellow)] px-3 py-2 text-[10px] uppercase tracking-wide text-black transition hover:brightness-95"
      >
        {masked ? "▶ desligar a máscara" : "◀ ligar a máscara"}
      </button>
      <p className="mt-2 text-[11px] leading-snug text-white/55">
        {masked
          ? "O foil só existe nas duas faixas — o resto da carta fica fosco."
          : "Sem máscara o foil vaza para cima do texto e do rodapé."}
      </p>
    </div>
  )
}

export function HoloTutorialAdvanced() {
  return (
    <>
      <Step n={8} title="A anatomia real: três camadas, não uma" demo={<ShineLayersDemo />}>
        <p>
          Até aqui usamos <b className="text-white">uma</b> camada de foil. O sistema real usa{" "}
          <b className="text-white">três</b>, e elas não são três elementos: são o{" "}
          <code className="text-[var(--sv-cyan)]">.card__shine</code> mais os seus{" "}
          <code className="text-[var(--sv-cyan)]">::before</code> e{" "}
          <code className="text-[var(--sv-cyan)]">::after</code>, todos empilhados no mesmo{" "}
          <code>grid-area: 1/1</code>.
        </p>
        <p>
          O truque é o que muda entre elas. Existem seis cores base (
          <code className="text-[var(--sv-cyan)]">--sunpillar-1</code> a{" "}
          <code>--sunpillar-6</code>) e seis apelidos (<code>--sunpillar-clr-1</code> a{" "}
          <code>-6</code>). Cada camada <b className="text-white">rotaciona a associação</b>: no{" "}
          <code>::before</code>, o apelido 1 aponta para a cor 5; no <code>::after</code>, para a
          6. As três camadas desenham o mesmo gradiente com as cores deslocadas, e correm em
          velocidades diferentes — a interferência entre elas é o que dá profundidade ao foil, em
          vez de uma faixa colorida chapada.
        </p>
        <p>
          Repare também no <code className="text-[var(--sv-cyan)]">translateZ</code> de cada uma:
          1px, 1px e 1.2px, com o glare em 1.41px. São valores mínimos, só para forçar uma ordem
          de empilhamento estável em 3D sem depender de <code>z-index</code>.
        </p>
        <Code
          lang="css"
          highlight={[9, 10, 17, 18]}
          code={`/* public/poke-holo/css/cards/base.css */

:root {
  --sunpillar-1: hsl(2, 100%, 73%);    /* … até --sunpillar-6 */
}

.card__shine:before {
  /* apelido 1 recebe a cor 5: o arco-íris começa deslocado */
  --sunpillar-clr-1: var(--sunpillar-5);
  --sunpillar-clr-2: var(--sunpillar-6);
  grid-area: 1/1;              /* empilha no mesmo lugar */
  transform: translateZ(1px);
}

.card__shine:after {
  /* mais um passo de rotação */
  --sunpillar-clr-1: var(--sunpillar-6);
  --sunpillar-clr-2: var(--sunpillar-1);
  transform: translateZ(1.2px);
}`}
        />
      </Step>

      <Step n={9} title="--foil e --mask: as duas imagens da carta real" demo={<MaskDemo />}>
        <p>
          Aqui está a resposta para por que essas cartas parecem reais e um gradiente genérico
          não. Cada carta traz <b className="text-white">duas imagens próprias</b>, digitalizadas
          da impressão de verdade:
        </p>
        <Code
          lang="css"
          highlight={[2, 3, 6, 7]}
          code={`/* o desenho do foil daquela carta específica */
--foil: url(https://poke-holo.b-cdn.net/foils/swsh12pt5/foils/
            upscaled/160_foil_etched_swsecret_2x.webp);

/* onde, na carta, existe foil impresso */
--mask: url(https://poke-holo.b-cdn.net/foils/swsh12pt5/masks/
            upscaled/160_foil_etched_swsecret_2x.webp);`}
        />
        <p>
          As duas são a <b className="text-white">mesma carta</b> (o 160 do set{" "}
          <code>swsh12pt5</code>) em papéis diferentes. O{" "}
          <code className="text-[var(--sv-cyan)]">--foil</code> é a textura: o padrão gravado que a
          gráfica aplicou, com as suas linhas e o seu relevo. Entra como mais uma{" "}
          <code>background-image</code> na pilha da camada.
        </p>
        <p>
          O <code className="text-[var(--sv-cyan)]">--mask</code> é o recorte: uma imagem em tons
          de cinza onde o branco marca onde há foil e o transparente marca onde não há. Ela é
          aplicada com <code className="text-[var(--sv-cyan)]">mask-image</code>, e é o que impede
          o brilho de escorrer para cima do texto de ataque, do rodapé e da borda amarela — áreas
          que, na carta física, são papel fosco.
        </p>
        <p>
          É isso que a descrição do projeto original chama de{" "}
          <i>&ldquo;background uses a foil and a mask layer&rdquo;</i>. Sem a máscara, a carta
          inteira brilha e o efeito entrega que é falso. Experimente desligar na demo.
        </p>
        <Code
          lang="css"
          highlight={[5, 13]}
          code={`/* base.css — só as cartas com a classe .masked recortam */
.card.masked .card__shine,
.card.masked .card__shine:before,
.card.masked .card__shine:after {
  mask-image: var(--mask);
  mask-size: cover;
  mask-position: center center;
}

/* secret-rare.css — o foil entra como imagem na pilha */
.card[data-rarity="rare secret"] .card__shine:before {
  background-image:
    var(--foil),
    linear-gradient(45deg, hsl(46,95%,50%), hsl(52,100%,69%)),
    radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsla(10,20%,90%,0.95) 10%, hsl(0,0%,0%) 70%);
  background-blend-mode: hard-light, multiply;
  mix-blend-mode: lighten;
}`}
        />
        <Nota cor="cyan">
          <b className="text-white">A demo ao lado usa um gradiente como máscara</b>, não a
          máscara oficial da carta — não temos esses arquivos no repositório. O mecanismo é
          idêntico (o alfa da máscara decide o que aparece); só a origem da imagem muda.
        </Nota>
      </Step>

      <Step n={10} title="A nomenclatura dos arquivos de foil">
        <p>
          O sistema não guarda um mapa de carta para foil: ele{" "}
          <b className="text-white">deriva o nome do arquivo</b>. Vale a pena entender o padrão,
          porque é ele que permite acrescentar cartas sem editar tabela nenhuma.
        </p>
        <Code
          lang="ts"
          highlight={[4, 7, 10]}
          code={`carta:  {ID}_hires.png
foil:   {id}_foil_{tipo}_{variante}_2x.webp

// 1. numérico → minúsculo, com zeros à esquerda até 3 dígitos
     49_hires.png  →  049_foil_holo_reverse_2x.webp

// 2. prefixo TG/SV → mantido, em minúsculo
     TG17_hires.png →  tg17_foil_etched_sunpillar_2x.webp

// 3. prefixo SWSH → o prefixo CAI, sobra o número
     SWSH181_hires.png → 181_foil_etched_sunpillar_2x.webp`}
        />
        <p>
          <code className="text-[var(--sv-cyan)]">tipo</code> é o acabamento da impressão:{" "}
          <code>etched</code> (gravado, com relevo) ou <code>holo</code> (liso). E{" "}
          <code className="text-[var(--sv-cyan)]">variante</code> diz{" "}
          <b className="text-white">a que raridade aquele foil pertence</b> —{" "}
          <code>sunpillar</code>, <code>swsecret</code>, <code>reverse</code>,{" "}
          <code>rainbow</code>.
        </p>
        <p>
          Essa última parte é a que evita um bug silencioso: não basta casar o número. O arquivo{" "}
          <code>116_foil_holo_reverse_2x.webp</code> existe, mas se a carta 116 estiver sendo
          exibida como comum, aplicá-lo põe um foil de reverse holo numa carta que não deveria
          brilhar. Por isso a derivação aqui só devolve o caminho quando a variante corresponde à
          raridade pedida.
        </p>
        <Nota cor="yellow">
          <b className="text-white">O mesmo nome serve a dois arquivos diferentes.</b> No CDN do
          projeto original, <code>160_foil_etched_swsecret_2x.webp</code> existe tanto em{" "}
          <code>/foils/</code> quanto em <code>/masks/</code> — mesmo nome, imagens distintas: uma
          é a textura, a outra é o recorte. O caminho é que diz qual é qual.
        </Nota>
      </Step>

      <Step n={11} title="clip-path: a janela holo muda de lugar por estágio" demo={<ClipDemo />}>
        <p>
          Numa holo clássica o brilho não cobre a carta toda: ele vive{" "}
          <b className="text-white">dentro da janela de arte</b>. E a janela não fica no mesmo
          lugar em todas as cartas — uma Básica, uma Estágio 1 e uma de Treinador têm molduras
          diferentes.
        </p>
        <p>
          A solução do projeto é ter um <code className="text-[var(--sv-cyan)]">clip-path</code>{" "}
          por formato, escolhido pelo atributo <code>data-subtypes</code> no HTML. A Básica usa um{" "}
          <code>inset()</code> simples; a de Estágio precisa de um{" "}
          <code className="text-[var(--sv-cyan)]">polygon()</code> porque a moldura tem o recorte
          diagonal do selo de evolução no canto.
        </p>
        <p>
          É a isto que a frase do original se refere:{" "}
          <i>
            &ldquo;a combination of repeating gradients and filters, with clip-path to mask the
            holo areas for each stage&rdquo;
          </i>
          . Três ferramentas somadas — gradiente repetido para a cor, filtro para o acabamento
          metálico, e clip-path para dizer onde tudo isso pode aparecer.
        </p>
        <Code
          lang="css"
          highlight={[4, 7, 10, 11, 15, 18]}
          code={`/* cards.css — uma janela por formato de moldura */
.card {
  /* Básica: retângulo simples */
  --clip: inset(9.85% 8% 52.85% 8%);

  /* Treinador: a janela é menor e mais baixa */
  --clip-trainer: inset(14.5% 8.5% 48.2% 8.5%);

  /* Estágio: polígono, por causa do selo de evolução no canto */
  --clip-stage: polygon(91.5% 9.85%, 57% 9.85%, 54% 12%,
    17% 12%, 16% 14%, 12% 16%, 8% 16%, 8% 47.15%, 92% 47.15%);
}

/* regular-holo.css — o seletor escolhe pelo data-subtypes */
.card[data-rarity="rare holo"] .card__shine { clip-path: var(--clip); }

.card[data-rarity="rare holo"][data-subtypes^="stage"] .card__shine {
  clip-path: var(--clip-stage);
}`}
        />
        <Nota cor="magenta">
          <b className="text-white">Por que o nosso deck ThunderCats não usa isso.</b> Esses
          recortes são medidos na moldura Pokémon. Numa carta de Magic eles caem no lugar errado —
          por isso a galeria ThunderCats só usa efeitos de carta inteira (V, VMAX, rainbow,
          secreta), e nenhum dos que dependem de <code>clip-path</code>.
        </Nota>
      </Step>

      <Step n={12} title="Os dois blends fazem coisas diferentes">
        <p>
          Esta distinção confunde quase todo mundo, e sem ela o CSS das raridades fica
          ilegível. São dois <i>blends</i> com escopos completamente diferentes.
        </p>
        <p>
          <code className="text-[var(--sv-cyan)]">background-blend-mode</code> funciona{" "}
          <b className="text-white">dentro</b> de um único elemento: quando você empilha várias{" "}
          <code>background-image</code> na mesma regra, ele diz como cada uma se combina com a de
          baixo. É blend <i>interno</i> — nada fora do elemento participa.
        </p>
        <p>
          <code className="text-[var(--sv-cyan)]">mix-blend-mode</code> funciona{" "}
          <b className="text-white">para fora</b>: pega o resultado final do elemento e o combina
          com o que está atrás dele na página — no nosso caso, a arte da carta.
        </p>
        <p>
          A secreta dourada usa os dois na mesma regra, e é um bom exemplo de leitura: quatro
          imagens de fundo (dois glitters, um cônico, um radial) são combinadas entre si por{" "}
          <code>background-blend-mode</code>, e só então o conjunto inteiro é queimado sobre a
          carta por <code>mix-blend-mode: color-dodge</code>.
        </p>
        <Code
          lang="css"
          highlight={[4, 5, 6, 7, 12, 15]}
          code={`/* secret-rare.css */
.card[data-rarity="rare secret"] .card__shine {
  background-image:
    var(--glitter),          /* 1 */
    var(--glitter),          /* 2 — mesma imagem, outra posição */
    conic-gradient(…),       /* 3 */
    radial-gradient(…);      /* 4 — no ponto do ponteiro */

  background-position: 45% 45%, 55% 55%, center, center;

  /* como as QUATRO se combinam ENTRE SI, dentro do elemento */
  background-blend-mode: soft-light, hard-light, overlay;

  /* como o RESULTADO se combina com a carta atrás */
  mix-blend-mode: color-dodge;

  /* o brilho responde à distância do ponteiro ao centro */
  filter: brightness(calc(0.4 + (var(--pointer-from-center) * 0.2)))
          contrast(1) saturate(2.7);
}`}
        />
        <Nota cor="yellow">
          Os dois glitters são <b className="text-white">a mesma imagem</b> em posições diferentes
          (45%/45% e 55%/55%). Ao deslizarem em sentidos opostos, os pontos brilhantes se cruzam e
          cintilam — é assim que se faz purpurina sem simular partícula nenhuma.
        </Nota>
      </Step>
    </>
  )
}

/* ---- Demos dos passos avançados ----------------------------------------- */

function ShineLayersDemo() {
  const { ref, handlers } = useTutorialPointer()
  return <TutorialCard ref={ref} handlers={handlers} tilt shine glare />
}

function ClipDemo() {
  const { ref, handlers } = useTutorialPointer()
  return (
    <div>
      <TutorialCard ref={ref} handlers={handlers} tilt shine glare clip />
      <p className="mt-2 text-[11px] leading-snug text-white/55">
        Com <code>clip-path</code>: o foil não passa da janela de arte.
      </p>
    </div>
  )
}
