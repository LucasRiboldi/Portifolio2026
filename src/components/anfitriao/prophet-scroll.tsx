"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

/**
 * O MOTOR DE ROLAGEM da folha — GSAP + ScrollTrigger.
 *
 * ## Por que GSAP aqui e Motion nas colunas
 *
 * Divisão por natureza do efeito, não por gosto. As colunas do Wire reagem a
 * PONTEIRO e a estado (hover, foco, montagem) — território de Motion, que
 * pensa em componente e ciclo de vida. O que esta peça faz é ligar propriedade
 * a POSIÇÃO DE ROLAGEM em elementos que o servidor já imprimiu e que nenhum
 * componente de cliente possui. ScrollTrigger foi feito para isso, e faz com
 * um observador só para a página inteira.
 *
 * A regra que evita o pior bug possível dessa mistura: **nenhum seletor daqui
 * pode casar com elemento que o Motion controla.** Duas bibliotecas escrevendo
 * `transform` no mesmo nó brigam a cada quadro, e o sintoma é tremor. Por isso
 * a lista abaixo evita `.dpx-news` e tudo que vive dentro dele.
 *
 * ## Por que não renderiza nada
 *
 * Mesmo motivo do `MotorDeMovimento` do realm dev: a folha é uma árvore de
 * componentes de servidor, e transformá-la em cliente para ganhar movimento
 * mandaria o jornal inteiro pelo fio duas vezes (HTML + payload de hidratação).
 * Este componente devolve `null` e só enriquece o que já chegou pronto.
 *
 * ## O estado de repouso é o estado visível
 *
 * Nada aqui esconde conteúdo por CSS. Quem entra por rolagem começa em
 * `autoAlpha: 0` escrito pelo PRÓPRIO script, depois de ele montar — sem
 * JavaScript, com JavaScript quebrado ou com movimento reduzido, a folha
 * aparece inteira e parada. É a mesma regra que o realm dev aprendeu a duras
 * penas: `opacity: 0` na folha de estilo transforma qualquer falha de script
 * em página em branco.
 */

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function ProphetScroll() {
  /* Sem a opção `scope`, e isso é decisão, não esquecimento: `scope` faz o
     GSAP resolver os seletores APENAS entre os descendentes do ref. Como os
     alvos daqui são o HTML que o servidor imprimiu — e que este componente não
     contém —, um escopo faria zero seletor casar e o motor rodaria em silêncio
     sem animar nada. A limpeza não depende disso: o `useGSAP` reverte tudo o
     que foi criado dentro da função, escopado ou não. */
  useGSAP(() => {
    /* `matchMedia` é o contrato de acessibilidade: o que está aqui dentro
         só existe para quem NÃO pediu movimento reduzido, e o GSAP desfaz
         tudo sozinho — inclusive os estilos inline — se a preferência mudar
         no meio da sessão. Um `if` no topo não daria essa reversão. */
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* ── 1. A gravura da bancada respira com a página ──
           Deslocamento em porcentagem da própria altura, não em pixels: a
           moldura muda de tamanho entre celular e desktop, e um valor fixo
           que fica discreto em telas grandes viraria salto no celular. */
      gsap.to("#anf-ilustracoes img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: "#anf-ilustracoes",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })

      /* ── 2. Os fios duplos se desenham ──
           O fio é a pontuação da diagramação do jornal; vê-lo ser traçado é o
           gesto mais fiel ao impresso que esta página pode dar. `scaleX` a
           partir da margem esquerda, como a régua do diagramador. */
      /* Restrito a `#folha` (o `<main>`): os mesmos fios existem no
           CABEÇALHO do layout, acima da dobra. Um `gsap.from` os deixaria em
           `scaleX: 0` até o gatilho disparar, e o topo da folha abriria sem as
           suas duas réguas — piscada logo no primeiro quadro. */
      gsap.utils
        .toArray<HTMLElement>("#folha .hr-double-top, #folha .hr-double-bottom")
        .forEach((fio) => {
          gsap.from(fio, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: fio, start: "top 92%", once: true },
          })
        })

      /* ── 3. O quadro do mercado entra linha a linha ──
           Cotação é lista de valores: entrar de uma vez é um bloco cinza, e
           entrar em cascata deixa o olho percorrer na ordem em que se lê. */
      gsap.from("#anf-mercado .newspaper-weather-cities li", {
        autoAlpha: 0,
        y: 10,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: "#anf-mercado",
          start: "top 80%",
          once: true,
        },
      })

      /* ── 4. O erro de registro do número da página ──
           `.dpx-misregister` imita a impressão fora de esquadro. Ligar o
           deslocamento à rolagem faz o registro "acertar" conforme o número
           sobe — o defeito de impressão vira gesto. */
      gsap.fromTo(
        ".newspaper-teaser-page",
        { xPercent: -3 },
        {
          xPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: ".newspaper-teaser",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      )

      /* ── 5. O texto vertical da Oficina desliza ──
           Ele já é vertical no original; acompanhar a rolagem dá a ele o
           movimento de um marcador de página descendo pela coluna. */
      gsap.to(".helper-verticaltext", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "#anf-colunas-texto",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })

      /* ── 6. A faixa EXCLUSIVO chega antes de tudo ──
           Única entrada acima da dobra, e por isso a mais curta: quem acabou
           de abrir a folha não deve esperar para ler a manchete. */
      gsap.from("#anf-manchete-principal .newspaper-exclusive-box", {
        autoAlpha: 0,
        scale: 0.94,
        duration: 0.5,
        ease: "back.out(1.6)",
      })
    })

    return () => mm.revert()
  })

  /* Não renderiza nada — nem um nó vazio. A folha é uma grelha de seis colunas
     e qualquer elemento aqui entraria como célula dela. */
  return null
}
