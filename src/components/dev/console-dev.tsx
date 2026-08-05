"use client"

import { useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState, type FormEvent } from "react"

/**
 * CONSOLE — o terminal navegável da home.
 *
 * ## Por que existe
 *
 * O realm inteiro é vestido de terminal, mas até aqui nada nele respondia. Um
 * console de verdade fecha essa promessa: é a peça mais divertida da página e,
 * ao mesmo tempo, a mais útil — `ir projetos` chega ao destino sem tirar a mão
 * do teclado, e `ls` responde "o que tem aqui?" sem rolagem.
 *
 * ## O que ele NÃO é
 *
 * Não executa nada, não fala com servidor, não guarda estado entre visitas. O
 * repertório é uma tabela fechada declarada abaixo; entrada desconhecida vira
 * mensagem de erro com sugestão. Isso é deliberado: um campo de texto na home
 * que aceitasse comando arbitrário seria superfície de ataque sem nenhum
 * ganho.
 *
 * ## Acessibilidade
 *
 * A saída é uma `aria-live="polite"`: quem usa leitor de tela ouve a resposta
 * sem precisar caçar a região. E o console é ATALHO, nunca a única via — todo
 * destino daqui também está no dock, que é a navegação de verdade do realm.
 */

/** Destinos digitáveis. Espelham o dock, que continua sendo a navegação
 *  canônica do realm — aqui entram só os apelidos curtos de digitar. */
const DESTINOS: Record<string, { rota: string; o_que: string }> = {
  inicio: { rota: "/desenvolvedor", o_que: "esta página" },
  projetos: { rota: "/desenvolvedor/projetos", o_que: "projetos publicados" },
  lab: { rota: "/desenvolvedor/laboratorio", o_que: "experimentos em curso" },
  tools: { rota: "/desenvolvedor/ferramentas", o_que: "utilitários que rodam no navegador" },
  codigo: { rota: "/desenvolvedor/codigo", o_que: "snippets e boilerplates" },
  skills: { rota: "/desenvolvedor/skills", o_que: "catálogo de habilidades" },
  learn: { rota: "/desenvolvedor/learn", o_que: "trilhas de estudo por linguagem" },
  java: { rota: "/desenvolvedor/java", o_que: "trilha de Java em oito etapas" },
  estante: { rota: "/desenvolvedor/estante", o_que: "livros e certificações" },
  estudos: { rota: "/desenvolvedor/estudos/banco-de-dados", o_que: "aulas do 3º semestre" },
  portal: { rota: "/portal", o_que: "troca de universo" },
}

type Tipo = "eco" | "saida" | "erro" | "ok"

interface Linha {
  id: number
  tipo: Tipo
  texto: string
}

const ABERTURA: Omit<Linha, "id">[] = [
  { tipo: "ok", texto: "console do laboratório — v1" },
  { tipo: "saida", texto: "digite `ajuda` para ver o que dá para fazer aqui." },
]

export function ConsoleDev({ versao }: { versao: string }) {
  const router = useRouter()
  const idCampo = useId()
  const [linhas, setLinhas] = useState<Linha[]>(() =>
    ABERTURA.map((l, i) => ({ ...l, id: i })),
  )
  const [valor, setValor] = useState("")
  /** Histórico para ↑/↓, do mais recente ao mais antigo. */
  const historico = useRef<string[]>([])
  const posicao = useRef(-1)
  const fim = useRef<HTMLDivElement>(null)
  const proximoId = useRef(ABERTURA.length)

  /* Rolar só a caixa de saída, e não a página: `scrollIntoView` puro
     arrastaria a janela inteira para o console a cada comando, sequestrando a
     leitura de quem só estava passando o olho. */
  useEffect(() => {
    const caixa = fim.current?.parentElement
    if (caixa) caixa.scrollTop = caixa.scrollHeight
  }, [linhas])

  function escrever(novas: Omit<Linha, "id">[]) {
    setLinhas((atuais) => [
      ...atuais,
      ...novas.map((l) => ({ ...l, id: proximoId.current++ })),
    ])
  }

  function executar(bruto: string) {
    const entrada = bruto.trim()
    if (!entrada) return

    historico.current.unshift(entrada)
    posicao.current = -1
    escrever([{ tipo: "eco", texto: entrada }])

    const [comando = "", ...resto] = entrada.toLowerCase().split(/\s+/)
    const argumento = resto.join(" ")

    switch (comando) {
      case "ajuda":
      case "help":
        return escrever([
          { tipo: "saida", texto: "ls .............. lista as áreas do laboratório" },
          { tipo: "saida", texto: "ir <área> ....... vai até uma delas" },
          { tipo: "saida", texto: "sobre ........... quem escreve isto aqui" },
          { tipo: "saida", texto: "versao .......... qual corte está no ar" },
          { tipo: "saida", texto: "limpar .......... recomeça a tela" },
          { tipo: "saida", texto: "(↑ e ↓ percorrem o que você já digitou)" },
        ])

      case "ls":
      case "dir":
        return escrever(
          Object.entries(DESTINOS).map(([nome, d]) => ({
            tipo: "saida" as const,
            texto: `${nome.padEnd(10, " ")} ${d.o_que}`,
          })),
        )

      case "ir":
      case "cd": {
        const alvo = DESTINOS[argumento]
        if (!alvo) {
          return escrever([
            {
              tipo: "erro",
              texto: argumento
                ? `não conheço "${argumento}". \`ls\` mostra o que existe.`
                : "faltou dizer para onde. exemplo: ir projetos",
            },
          ])
        }
        escrever([{ tipo: "ok", texto: `indo para ${alvo.rota}…` }])
        router.push(alvo.rota)
        return
      }

      case "sobre":
        return escrever([
          { tipo: "saida", texto: "Lucas Riboldi — eternamente um estudante, curioso e futricador." },
          { tipo: "saida", texto: "este site é o caderno; o resto é consequência." },
        ])

      case "versao":
      case "version":
        return escrever([{ tipo: "ok", texto: `${versao} — o número vem do repositório, não daqui.` }])

      case "limpar":
      case "clear":
        proximoId.current = 0
        return setLinhas([])

      /* Os dois abaixo não fazem nada. Estão aqui porque alguém VAI tentar, e
         uma resposta escrita é mais divertida que "comando não encontrado". */
      case "sudo":
        return escrever([{ tipo: "erro", texto: "aqui ninguém é root. nem eu." }])

      case "cafe":
      case "café":
        return escrever([{ tipo: "ok", texto: "☕ preparando… (erro 418: isto é um bule)" }])

      default:
        return escrever([
          { tipo: "erro", texto: `comando desconhecido: ${comando}` },
          { tipo: "saida", texto: "`ajuda` lista tudo o que este console entende." },
        ])
    }
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault()
    executar(valor)
    setValor("")
  }

  /** ↑/↓ percorrem o histórico, como em qualquer terminal. */
  function aoTeclar(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
    if (historico.current.length === 0) return
    e.preventDefault()
    const passo = e.key === "ArrowUp" ? 1 : -1
    posicao.current = Math.min(
      historico.current.length - 1,
      Math.max(-1, posicao.current + passo),
    )
    setValor(posicao.current < 0 ? "" : (historico.current[posicao.current] ?? ""))
  }

  return (
    <div className="dv-console">
      <div className="dv-console-saida" aria-live="polite" aria-label="Saída do console">
        {linhas.map((l) => (
          <p key={l.id} className="dv-console-linha" data-tipo={l.tipo}>
            {l.texto}
          </p>
        ))}
        <div ref={fim} />
      </div>
      <form className="dv-console-entrada" onSubmit={aoEnviar}>
        <label htmlFor={idCampo} className="sr-only">
          Comando do console
        </label>
        <span className="dv-console-prompt" aria-hidden>
          $
        </span>
        <input
          id={idCampo}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={aoTeclar}
          className="dv-console-campo"
          placeholder="ajuda"
          autoComplete="off"
          spellCheck={false}
          /* `autoFocus` não: a home abre no topo, e roubar o foco para um
             campo lá embaixo saltaria a página inteira ao carregar. */
        />
        <button type="submit" className="dv-console-ok">
          executar
        </button>
      </form>
    </div>
  )
}
