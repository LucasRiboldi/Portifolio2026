"use client"

import { useEffect } from "react"

/**
 * MOTOR DE MOVIMENTO da home do realm dev.
 *
 * ## Por que um componente só, e não um por efeito
 *
 * A home é uma árvore de Server Components: nenhum dado dela vive no cliente,
 * e transformar cada zona em componente de cliente para ganhar uma animação
 * mandaria o conteúdo inteiro pelo fio duas vezes (HTML + payload de
 * hidratação). Este componente não renderiza nada — devolve `null` — e apenas
 * ENRIQUECE o HTML que o servidor já mandou. É a diferença entre uma página
 * que anima e uma página que roda em React no cliente.
 *
 * ## Por que os efeitos são ligados por atributo no `<html>`... (na raiz `.dracula`)
 *
 * O CSS de repouso é o estado VISÍVEL. As regras que escondem para depois
 * revelar só valem sob `[data-motor="on"]`, atributo que este efeito escreve
 * depois de montar. Consequência: sem JavaScript, com JavaScript quebrado, ou
 * com `prefers-reduced-motion`, a página aparece inteira e parada — nunca em
 * branco. Foi a razão de não usar `opacity: 0` direto na folha.
 *
 * ## Sobre escrever no DOM que o React renderizou
 *
 * O contador reescreve o texto de um nó que veio do servidor. É seguro AQUI e
 * não em geral: esta subárvore não tem estado de cliente, então o React não
 * re-renderiza e não sobrescreve o valor. Se um dia a home virar interativa de
 * verdade, o contador precisa virar componente com `useState`.
 */

/** Duração da contagem. Curta o bastante para não atrasar quem está lendo. */
const DUR_CONTAGEM = 900

/** Curva de saída — rápida no começo, assenta no fim. */
const suavizar = (t: number) => 1 - Math.pow(1 - t, 3)

export function MotorDeMovimento() {
  useEffect(() => {
    const raiz = document.querySelector<HTMLElement>(".dracula")
    if (!raiz) return

    /* Movimento reduzido não é "menos animação": é nenhuma. Sem o atributo,
       todas as regras de entrada ficam inertes e o conteúdo nasce visível. */
    const parado = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (parado.matches) return

    const alvos = [...document.querySelectorAll<HTMLElement>("[data-revelar]")]

    /* O que JÁ está na tela é marcado como visível ANTES de ligar o motor.
       Sem esta volta, o `data-motor` esconderia o topo da página no instante
       da hidratação e o IntersectionObserver o traria de volta no quadro
       seguinte — um piscar em conteúdo que o leitor já estava lendo. Só entra
       animado o que ainda não foi visto. */
    const alturaJanela = window.innerHeight
    for (const el of alvos) {
      if (el.getBoundingClientRect().top < alturaJanela) el.dataset.visivel = "true"
    }

    raiz.dataset.motor = "on"

    const limpezas: (() => void)[] = [
      () => {
        delete raiz.dataset.motor
      },
    ]

    /* ── Entrada por rolagem ────────────────────────────────────────────
       `unobserve` depois de revelar: a animação é de chegada, não de
       ida-e-volta. Reanimar ao rolar para cima transformaria a leitura em
       vaivém. */
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          el.dataset.visivel = "true"
          observador.unobserve(el)
          contar(el)
        }
      },
      // 12% em vez de 0: assim o bloco começa a entrar já dentro da tela, e
      // não no exato pixel da borda, onde a animação passa despercebida.
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    )
    for (const el of alvos) {
      // Os de cima já apareceram; só contam. O observador cuida do resto.
      if (el.dataset.visivel === "true") contar(el)
      else observador.observe(el)
    }
    limpezas.push(() => observador.disconnect())

    /* ── Contadores ─────────────────────────────────────────────────────
       Disparam junto com a revelação do bloco que os contém: contar antes de
       o número estar na tela é contar para ninguém. */
    function contar(escopo: HTMLElement) {
      const numeros = escopo.matches("[data-contador]")
        ? [escopo]
        : [...escopo.querySelectorAll<HTMLElement>("[data-contador]")]

      for (const el of numeros) {
        const alvo = Number(el.dataset.contador)
        if (!Number.isFinite(alvo) || alvo === 0) continue
        const inicio = performance.now()
        const passo = (agora: number) => {
          const t = Math.min(1, (agora - inicio) / DUR_CONTAGEM)
          el.textContent = String(Math.round(suavizar(t) * alvo))
          if (t < 1) requestAnimationFrame(passo)
        }
        requestAnimationFrame(passo)
      }
    }

    /* ── Holofote do cursor ─────────────────────────────────────────────
       Cada cartão guarda a posição do ponteiro em coordenada PRÓPRIA
       (`--mx`/`--my` em %), e o brilho do `::before` segue de lá. Guardar no
       contêiner não funcionaria: o gradiente precisa saber onde o mouse está
       DENTRO daquele cartão, não dentro da grade.

       O trabalho é adiado para o próximo quadro porque `pointermove` dispara
       dezenas de vezes por segundo e escrever estilo a cada evento força
       recálculo de layout fora de hora. */
    const zonas = document.querySelectorAll<HTMLElement>("[data-spot]")
    const soltarZona: (() => void)[] = []

    for (const zona of zonas) {
      let pendente = false
      let ultimo: PointerEvent | null = null

      const aplicar = () => {
        pendente = false
        const ev = ultimo
        if (!ev) return
        const cartao = (ev.target as HTMLElement | null)?.closest<HTMLElement>(".dv-card, [data-spot-item]")
        if (!cartao) return
        const r = cartao.getBoundingClientRect()
        cartao.style.setProperty("--mx", `${((ev.clientX - r.left) / r.width) * 100}%`)
        cartao.style.setProperty("--my", `${((ev.clientY - r.top) / r.height) * 100}%`)
      }

      const aoMover = (ev: PointerEvent) => {
        ultimo = ev
        if (pendente) return
        pendente = true
        requestAnimationFrame(aplicar)
      }

      zona.addEventListener("pointermove", aoMover, { passive: true })
      soltarZona.push(() => zona.removeEventListener("pointermove", aoMover))
    }
    limpezas.push(() => soltarZona.forEach((f) => f()))

    return () => limpezas.forEach((f) => f())
  }, [])

  return null
}
