import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, it, expect } from "vitest"

import { zones, index, coupon } from "@/lib/anfitriao-prophet"

/**
 * O CONTRATO DA FOLHA — o que já quebrou, e por isso é testado.
 *
 * A primeira página d'O Anfitrião tem uma regra estrutural simples e uma
 * história de a violar em silêncio: TODA zona do sumário precisa existir como
 * seção na página, e toda seção ancorada precisa aparecer no sumário. Quando
 * as duas listas divergiram, o menu passou a oferecer destinos que não
 * levavam a lugar nenhum — e nada avisou.
 *
 * Estes testes leem o FONTE da página, não o HTML renderizado. É deliberado:
 * a checagem é sobre marcação declarada, não sobre resultado de execução, e
 * assim ela roda em `npm run test:unit` (node puro, dois segundos) em vez de
 * exigir navegador. O que precisa de navegador — rolagem, foco, ausência de
 * transbordo horizontal — não cabe aqui e continua sendo verificação manual;
 * está dito no fim deste arquivo para não se fingir cobertura que não existe.
 */

const RAIZ = path.join(import.meta.dirname, "..")
const FONTE = readFileSync(path.join(RAIZ, "src/app/anfitriao/page.tsx"), "utf8")

/**
 * A página sem comentários.
 *
 * Necessário porque os comentários deste projeto CITAM marcação ao explicar o
 * que mudou — "estes três eram `<h1>`", "um `<img>` sem dimensão". Buscar
 * `<h1>` no arquivo cru acusaria a explicação como se fosse a marcação, e o
 * teste falharia por ler a documentação. Aqui as duas coisas são separadas:
 * `PAGINA` é o que o navegador recebe, `FONTE` é o arquivo inteiro.
 */
const PAGINA = FONTE.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")

describe("zonas e âncoras", () => {
  it("toda zona do sumário tem uma seção com o mesmo id na página", () => {
    const semSecao = zones.filter((z) => !PAGINA.includes(`id="${z.id}"`))
    expect(semSecao.map((z) => z.id)).toEqual([])
  })

  it("toda âncora `anf-*` da página está no sumário", () => {
    const naPagina = [...PAGINA.matchAll(/id="(anf-[a-z-]+)"/g)].map((m) => m[1])
    // `Set<string>`: `zones` é `as const`, e sem alargar o tipo o `has`
    // recusaria comparar com um id lido do arquivo.
    const conhecidas = new Set<string>(zones.map((z) => z.id))
    expect(naPagina.filter((id) => id && !conhecidas.has(id))).toEqual([])
  })

  it("cada âncora é focável — sem `tabindex=-1` o teclado não a alcança", () => {
    /**
     * O salto do sumário move a rolagem E o foco (ver `zone-link.tsx`). Uma
     * seção que não seja focável por programa rola sem levar o cursor de
     * teclado junto — foi exatamente o defeito das âncoras antigas.
     */
    const semFoco = zones.filter((z) => {
      const i = PAGINA.indexOf(`id="${z.id}"`)
      if (i === -1) return true
      // A abertura da tag vai do `<` anterior ao `>` seguinte.
      const abertura = PAGINA.slice(PAGINA.lastIndexOf("<", i), PAGINA.indexOf(">", i))
      return !abertura.includes("tabIndex={-1}")
    })
    expect(semFoco.map((z) => z.id)).toEqual([])
  })

  it("nenhum id se repete — id duplicado é HTML inválido e só o primeiro rola", () => {
    const ids = [...PAGINA.matchAll(/id="(anf-[a-z-]+)"/g)].map((m) => m[1])
    expect(ids.length).toBe(new Set(ids).size)
  })
})

describe("índice impresso do rodapé", () => {
  it("aponta para as mesmas zonas do sumário, na mesma ordem", () => {
    const ancoras = index.filter((i) => i.href.startsWith("#")).map((i) => i.href.slice(1))
    expect(ancoras).toEqual(zones.filter((z) => z.id !== "anf-indice").map((z) => z.id))
  })

  it("não cita a si mesmo — um sumário que se lista é ruído", () => {
    expect(index.some((i) => i.href === "#anf-indice")).toBe(false)
  })
})

describe("hierarquia de títulos", () => {
  it("a página não declara `<h1>` — ele é da cabeceira, no layout", () => {
    /**
     * Havia cinco `<h1>` aqui. Um documento tem um título; o resto é
     * subordinação. O único da rota é "Daily Prophet", no `layout.tsx`.
     */
    expect(PAGINA).not.toMatch(/<h1[\s>]/)
  })

  it("não pula de h2 para h4", () => {
    const niveis = [...PAGINA.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]))
    expect(niveis.length).toBeGreaterThan(0)
    expect(niveis.some((n) => n > 3)).toBe(false)
  })
})

describe("gravuras", () => {
  it("nenhuma `<img>` crua — tudo passa pelo otimizador", () => {
    expect(PAGINA).not.toMatch(/<img[\s>]/)
  })
})

describe("cupom", () => {
  it("tem endereço de retorno — `contact_messages.email` é obrigatório", () => {
    expect(coupon.fields.email?.label).toBeTruthy()
  })

  it("a cadência tem exatamente uma opção padrão", () => {
    expect(coupon.cadence.options.filter((o) => o.default)).toHaveLength(1)
  })
})

/**
 * ------------------------------------------------------------------
 * O QUE ESTES TESTES NÃO COBREM
 * ------------------------------------------------------------------
 * Por honestidade, e para que ninguém leia "24 arquivos passaram" como
 * garantia do que não foi verificado:
 *
 *   • Ausência de rolagem horizontal nos breakpoints (320–2560).
 *   • Abertura/fechamento do menu, laço de foco, ESC, trava de rolagem.
 *   • Gravação real do cupom no Supabase — depende de env configurado.
 *   • Deslocamento de layout (CLS) e a chegada da face-título.
 *
 * Tudo isso exige navegador e foi verificado à mão com Playwright durante a
 * refatoração. Virar suíte automatizada é trabalho próprio, com o plugin de
 * browser do vitest — que hoje falha na inicialização (ver o cabeçalho de
 * `vitest.unit.config.ts`).
 */
