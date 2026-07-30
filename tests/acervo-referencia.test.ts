import { describe, it, expect } from "vitest"

import {
  certificacoes,
  designPatterns,
  javaCheatSheets,
  javaRoadmap,
  livros,
} from "@/data/dev"

/**
 * O acervo de referência NÃO passa pelo Supabase.
 *
 * Os cinco acervos do realm dev (devlogs, lab, snippets, wiki, ideas) são lidos
 * do banco e têm `conteudo-publicavel.test.ts` guardando o caminho de
 * publicação. Este aqui é o oposto por decisão: material de estudo revisado em
 * pull request, não conteúdo editorial de painel — ver o cabeçalho de
 * `src/data/dev/java.ts`.
 *
 * Isso troca a classe de defeito, não a elimina. Sem banco não há CHECK de
 * migration nem chave única: uma etapa duplicada, uma ordem fora de sequência ou
 * um status inválido passariam pelo TypeScript sem reclamação e só apareceriam
 * na tela, torto. É esse silêncio que os testes abaixo quebram.
 */

describe("roadmap de Java", () => {
  it("a ordem é uma sequência sem buraco nem repetição", () => {
    // A trilha é lida como progressão; um salto de 3 para 5 faria o leitor
    // procurar uma etapa que não existe.
    const ordens = javaRoadmap.map((e) => e.ordem)
    expect(ordens).toEqual(Array.from({ length: javaRoadmap.length }, (_, i) => i + 1))
  })

  it("não repete título", () => {
    const titulos = javaRoadmap.map((e) => e.titulo)
    expect(titulos.filter((t, i) => titulos.indexOf(t) !== i)).toEqual([])
  })

  it("toda etapa declara critério de conclusão e ao menos um tópico", () => {
    // Etapa sem critério nunca termina — é a falha que o roadmap existe para
    // evitar, então ela não pode entrar no próprio roadmap.
    const incompletas = javaRoadmap.filter((e) => !e.criterio.trim() || e.topicos.length === 0)
    expect(incompletas.map((e) => e.titulo)).toEqual([])
  })

  it("há no máximo uma etapa em estudo", () => {
    // Duas em curso significaria que o marcador "estudando agora" da home
    // escolheria uma delas arbitrariamente.
    const estudando = javaRoadmap.filter((e) => e.status === "estudando")
    expect(estudando.length).toBeLessThanOrEqual(1)
  })

  it("o progresso é monotônico: nada concluído depois de algo planejado", () => {
    // Uma etapa concluída após uma planejada indicaria pulo na trilha, que
    // contradiz a promessa de que cada etapa assume a anterior resolvida.
    const primeiroPlanejado = javaRoadmap.findIndex((e) => e.status === "planejado")
    if (primeiroPlanejado === -1) return
    const concluidoDepois = javaRoadmap
      .slice(primeiroPlanejado)
      .filter((e) => e.status === "concluido")
    expect(concluidoDepois.map((e) => e.titulo)).toEqual([])
  })
})

describe("cheat sheets de Java", () => {
  it("o slug é único — é a chave da rota", () => {
    const slugs = javaCheatSheets.map((f) => f.slug)
    expect(slugs.filter((s, i) => slugs.indexOf(s) !== i)).toEqual([])
  })

  it("o slug é seguro para URL", () => {
    const invalidos = javaCheatSheets.filter((f) => !/^[a-z0-9-]+$/.test(f.slug))
    expect(invalidos.map((f) => f.slug)).toEqual([])
  })

  it("nenhuma folha está vazia e todo item tem código", () => {
    const vazias = javaCheatSheets.filter(
      (f) => f.itens.length === 0 || f.itens.some((i) => !i.codigo.trim()),
    )
    expect(vazias.map((f) => f.slug)).toEqual([])
  })
})

describe("design patterns", () => {
  it("não repete nome", () => {
    const nomes = designPatterns.map((p) => p.nome)
    expect(nomes.filter((n, i) => nomes.indexOf(n) !== i)).toEqual([])
  })

  it("todo cartão diz quando evitar", () => {
    // É o campo que separa referência de propaganda de padrão, e o único que
    // alguém teria preguiça de preencher.
    const semEvitar = designPatterns.filter((p) => !p.evitar.trim())
    expect(semEvitar.map((p) => p.nome)).toEqual([])
  })

  it("as três famílias do GoF estão representadas", () => {
    const familias = new Set(designPatterns.map((p) => p.categoria))
    expect([...familias].sort()).toEqual(["comportamental", "criacional", "estrutural"])
  })
})

describe("estante", () => {
  it("não repete título de livro", () => {
    const titulos = livros.map((l) => l.titulo)
    expect(titulos.filter((t, i) => titulos.indexOf(t) !== i)).toEqual([])
  })

  it("só livro lido tem nota", () => {
    // Avaliar o que não se leu seria inventar; a UI conta com isso para decidir
    // se desenha as estrelas.
    const naoLidoComNota = livros.filter((l) => l.status !== "lido" && l.nota > 0)
    expect(naoLidoComNota.map((l) => l.titulo)).toEqual([])
  })

  it("a nota fica entre 1 e 5 quando existe", () => {
    const foraDaFaixa = livros.filter((l) => l.nota !== 0 && (l.nota < 1 || l.nota > 5))
    expect(foraDaFaixa.map((l) => l.titulo)).toEqual([])
  })

  it("todo livro justifica por que está na lista", () => {
    const semComentario = livros.filter((l) => !l.comentario.trim())
    expect(semComentario.map((l) => l.titulo)).toEqual([])
  })
})

describe("certificações", () => {
  it("não repete nome", () => {
    const nomes = certificacoes.map((c) => c.nome)
    expect(nomes.filter((n, i) => nomes.indexOf(n) !== i)).toEqual([])
  })

  it("a url de verificação, quando existe, é https", () => {
    const inseguras = certificacoes.filter((c) => c.url && !c.url.startsWith("https://"))
    expect(inseguras.map((c) => c.nome)).toEqual([])
  })

  it("certificação obtida não fica datada no futuro", () => {
    const anoAtual = new Date().getFullYear()
    const futuras = certificacoes.filter((c) => c.status === "obtida" && c.ano > anoAtual)
    expect(futuras.map((c) => c.nome)).toEqual([])
  })
})

describe("o acervo não está vazio", () => {
  it.each([
    ["roadmap", javaRoadmap.length],
    ["cheat sheets", javaCheatSheets.length],
    ["patterns", designPatterns.length],
    ["livros", livros.length],
    ["certificações", certificacoes.length],
  ])("%s tem conteúdo", (_nome, total) => {
    expect(total).toBeGreaterThan(3)
  })
})
