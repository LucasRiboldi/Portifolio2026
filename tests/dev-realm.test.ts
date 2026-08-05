import { readFileSync, readdirSync } from "node:fs"
import path from "node:path"

import { describe, it, expect } from "vitest"

/**
 * O CONTRATO DO REALM DEV — o que a refatoração consertou, e por isso é testado.
 *
 * Estes testes leem o FONTE, não o HTML renderizado, pelo mesmo motivo do teste
 * das zonas do Anfitrião: são checagens sobre marcação e arquitetura declarada,
 * e assim rodam em `npm run test:unit` sem navegador. O que precisa de
 * navegador — foco visível de fato, ausência de transbordo em 320px, ordem de
 * leitura — continua sendo verificação manual e está dito no fim do arquivo.
 *
 * Cada bloco abaixo trava um defeito REAL encontrado na auditoria. Nenhum deles
 * é hipotético.
 */

const RAIZ = path.join(import.meta.dirname, "..")
const ler = (p: string) => readFileSync(path.join(RAIZ, p), "utf8")

/** Fonte sem comentários — os comentários deste projeto CITAM marcação ao
 *  explicar o que mudou ("antes era um <div>"), e procurar `<div>` no arquivo
 *  cru acusaria a explicação como se fosse o código. */
const semComentarios = (s: string) =>
  s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/^\s*\/\/.*$/gm, "")

/* As folhas também passam pelo filtro: os comentários delas citam o seletor
   antigo (`[class*="dv-"]`) ao explicar por que ele saiu, e a busca acusaria a
   explicação como se o seletor continuasse ativo. */
const TOKENS = semComentarios(ler("src/styles/dev-tokens.css"))
const HUD = semComentarios(ler("src/styles/dev-hud.css"))
const DRACULA = semComentarios(ler("src/styles/dracula.css"))
const LAYOUT = semComentarios(ler("src/app/desenvolvedor/layout.tsx"))
const HOME = semComentarios(ler("src/app/desenvolvedor/page.tsx"))
const PRIMITIVAS = semComentarios(ler("src/components/dev/ui/dev-primitives.tsx"))

/** Todo componente do realm que desenha seletor (`.dv-filter` ou `.dv-tab`).
 *  A lista é explícita de propósito: se alguém acrescentar um seletor novo num
 *  arquivo que não está aqui, o teste não pega — por isso o primeiro caso
 *  abaixo confere que a lista continua completa. */
const CLIENTES = [
  "src/components/dev/lab-view.tsx",
  "src/components/dev/snippets-view.tsx",
  "src/components/dev/dev-toolbox.tsx",
  "src/components/dev/learn-view.tsx",
]

describe("camada de tokens", () => {
  it("dracula.css importa as duas camadas, e nessa ordem", () => {
    const tokens = DRACULA.indexOf('@import "./dev-tokens.css"')
    const hud = DRACULA.indexOf('@import "./dev-hud.css"')
    expect(tokens).toBeGreaterThan(-1)
    expect(hud).toBeGreaterThan(tokens)
  })

  it("nenhum token semântico inventa cor — todos derivam da paleta Dracula", () => {
    // Só as declarações de cor; espaço, raio e duração são valores próprios.
    const cores = [...TOKENS.matchAll(/--dev-(?:surface|line|ink|accent|signal|ok|warn|alert|danger|mark)[\w-]*:\s*([^;]+);/g)]
      .map((m) => m[1] ?? "")
    expect(cores.length).toBeGreaterThan(10)
    expect(cores.filter((v) => !v.includes("var(--d-")).map((v) => v.trim())).toEqual([])
  })

  it("os tokens vivem no escopo `.dracula` e não vazam para o resto do site", () => {
    const foraDoEscopo = TOKENS.includes(":root")
    expect(foraDoEscopo).toBe(false)
  })
})

describe("acessibilidade", () => {
  it("existe anel de foco para tudo que é focável no realm", () => {
    expect(HUD).toMatch(/:focus-visible\s*\{[^}]*outline:/)
  })

  it("o realm tem landmark `main` e salto para o conteúdo", () => {
    expect(LAYOUT).toContain('<main id="conteudo"')
    expect(LAYOUT).toContain('href="#conteudo"')
  })

  it("movimento reduzido desliga animações por nome, sem varredura por substring", () => {
    // O bloco antigo era `[class*="dv-"] { animation: none !important }`.
    expect(HUD).not.toMatch(/\[class\*=/)
    expect(DRACULA).not.toMatch(/\[class\*="dv-"\]/)
    expect(HUD).toMatch(/prefers-reduced-motion/)
  })

  it("a lista de componentes com seletor está completa", () => {
    // Varre o realm inteiro atrás de quem desenha `.dv-filter`/`.dv-tab`; se
    // aparecer um arquivo fora de CLIENTES, o caso seguinte estaria cego.
    const raiz = path.join(RAIZ, "src/components/dev")
    const arquivos = readdirSync(raiz, { recursive: true, encoding: "utf8" })
      .filter((f) => f.endsWith(".tsx"))
      .filter((f) => /className="[^"]*dv-(?:filter|tab)\b/.test(ler(path.join("src/components/dev", f))))
      .map((f) => `src/components/dev/${f.replace(/\\/g, "/")}`)
    expect(arquivos.sort()).toEqual([...CLIENTES].sort())
  })

  it("todo seletor expõe o próprio estado e declara o tipo do botão", () => {
    for (const arquivo of CLIENTES) {
      const fonte = semComentarios(ler(arquivo))
      // Só os botões que SÃO seletor: `.dv-copy` e afins não têm estado ligado.
      const botoes = [...fonte.matchAll(/<button[\s\S]*?>/g)]
        .map((m) => m[0])
        .filter((b) => /dv-(?:filter|tab)\b/.test(b))
      expect(botoes.length, arquivo).toBeGreaterThan(0)
      for (const b of botoes) {
        expect(b, `${arquivo}: seletor sem aria-pressed`).toContain("aria-pressed")
        expect(b, `${arquivo}: seletor sem type`).toContain('type="button"')
      }
    }
  })

  it("a home não tem mais de um h1", () => {
    expect([...HOME.matchAll(/<h1[\s>]/g)]).toHaveLength(1)
  })
})

describe("componentização", () => {
  it("as páginas do realm não remontam link externo à mão", () => {
    const paginas = [
      "src/app/desenvolvedor/page.tsx",
      "src/app/desenvolvedor/projetos/page.tsx",
      "src/app/desenvolvedor/ferramentas/page.tsx",
      "src/components/dev/lab-view.tsx",
    ]
    const reincidentes = paginas.filter((p) => semComentarios(ler(p)).includes('target="_blank"'))
    expect(reincidentes).toEqual([])
  })

  it("toda seção da home é nomeada por um heading real", () => {
    // DevSection é a única fonte de <section> com título na home; se alguém
    // voltar a soltar um <h2> órfão, o outline do documento achata de novo.
    expect(HOME).not.toMatch(/<h2/)
    expect(PRIMITIVAS).toContain("aria-labelledby")
  })

  it("a home não carrega espaçamento inline — o ritmo vem da escala", () => {
    expect(HOME).not.toMatch(/style=\{\{\s*marginTop/)
  })
})

describe("performance", () => {
  it("a capa de projeto reserva espaço e sai do caminho crítico", () => {
    const projetos = semComentarios(ler("src/app/desenvolvedor/projetos/page.tsx"))
    expect(projetos).toContain('loading="lazy"')
    expect(projetos).toContain("dv-cover")
    expect(HUD).toMatch(/\.dv-cover\s*\{[^}]*aspect-ratio/)
  })

  it("o título das rotas não é mais duplicado", () => {
    expect(LAYOUT).toContain("template:")
  })
})

/**
 * FORA DE COBERTURA (verificação manual, precisa de navegador):
 * - anel de foco realmente visível ao percorrer o dock com Tab;
 * - ausência de transbordo horizontal em 320px e densidade em 2560px;
 * - ordem de leitura do dock grudado ao rolar;
 * - o motor de movimento da home respeitando reduced-motion na prática (a
 *   demo do GSAP, que ocupava esta linha, saiu em 05/08/2026).
 */
