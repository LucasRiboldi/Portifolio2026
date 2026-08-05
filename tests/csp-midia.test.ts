import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import path from "node:path"

/**
 * O CSP não pode bloquear a própria mídia do site.
 *
 * ------------------------------------------------------------------
 * O DEFEITO QUE ISTO GUARDA
 * ------------------------------------------------------------------
 * O upload de vídeo travava em "enviando… 0%", sem erro na tela. A culpa passou
 * pelo `put()`, pelo store, pelo caminho OIDC e pelo tamanho do arquivo — todos
 * inocentes. O culpado era o nosso próprio `Content-Security-Policy`:
 * `connect-src` não listava o Vercel Blob, então o navegador recusava o PUT
 * antes de sair da máquina.
 *
 * O sintoma enganava por desenho:
 *
 *   • o handshake com `/api/admin/blob-upload` PASSAVA — é a mesma origem,
 *     coberta por `'self'`. O token saía, a barra aparecia, e só então nada
 *     acontecia;
 *   • imagem e áudio pequenos SEMPRE funcionaram, porque sobem pela Server
 *     Action, que também é mesma origem;
 *   • as capas do Blob apareciam normalmente, porque `img-src` permite `https:`
 *     inteiro — o que dava a impressão de que a mídia estava liberada.
 *
 * Só o console do navegador contava a verdade:
 *
 *     Connecting to 'https://…blob.vercel-storage.com/…' violates the
 *     following Content Security Policy directive: "connect-src 'self' …"
 *
 * Este arquivo lê o `next.config.ts` como texto, e não importa o módulo, porque
 * o config puxa plugins e variáveis de ambiente que não têm por que rodar num
 * teste unitário. É a mesma abordagem de `conteudo-publicavel.test.ts`.
 */

const BRUTO = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")

/**
 * O config SEM comentários.
 *
 * Necessário, e a primeira versão deste arquivo errou nisto: os comentários que
 * explicam o CSP citam as mesmas URLs que as diretivas liberam, então um
 * `toContain` sobre o texto cru passava mesmo com a diretiva apagada. Testei
 * removendo `https://vercel.com` do `connect-src` e a suíte seguiu verde — o
 * teste guardava a documentação, não a configuração.
 */
/**
 * Linha a linha, e não por regex de comentário — duas tentativas anteriores
 * morreram aqui, e as duas por causa das próprias URLs:
 *
 *   • `/\/\/[^\n]*$/` apagava de `https://` em diante;
 *   • `/\/\*[\s\S]*?\*\//` via o `/*` de `https://*.public.blob…` como
 *     abertura de comentário e comia o resto da diretiva.
 *
 * Descartar linhas que COMEÇAM com marca de comentário não tem essa armadilha:
 * uma URL nunca começa a linha com `*`, `//` ou `/*`.
 */
const CONFIG = BRUTO.split("\n")
  .filter((linha) => {
    const t = linha.trim()
    return !t.startsWith("*") && !t.startsWith("//") && !t.startsWith("/*")
  })
  .join("\n")

/** Recorta uma diretiva do CSP com o que vier até o fechamento do array/string. */
function trecho(diretiva: string): string {
  const i = CONFIG.indexOf(`"${diretiva}`)
  expect(i, `diretiva ${diretiva} não encontrada no next.config.ts`).toBeGreaterThan(-1)
  return CONFIG.slice(i, i + 500)
}

describe("connect-src", () => {
  it("libera o host para onde o SDK manda os bytes", () => {
    // `defaultVercelBlobApiUrl` do @vercel/blob é https://vercel.com/api/blob.
    // Sem ele, upload direto morre em 0% sem mensagem.
    expect(trecho("connect-src")).toContain("https://vercel.com")
  })

  it("libera os hosts do store do Blob", () => {
    const t = trecho("connect-src")
    expect(t).toContain("blob.vercel-storage.com")
  })

  it("não perdeu o que o login precisa", () => {
    // O popup do GitHub falha como `auth/internal-error` sem estes — mensagem
    // que não menciona CSP em momento nenhum.
    const t = trecho("connect-src")
    expect(t).toContain("https://identitytoolkit.googleapis.com")
    expect(t).toContain("https://securetoken.googleapis.com")
  })
})

describe("media-src", () => {
  it("é declarado", () => {
    // Sem declaração cai no `default-src 'self'`, e aí <audio>/<video> do Blob
    // são recusados: a faixa fica muda e a fita não roda, sem erro visível.
    expect(CONFIG).toContain("media-src")
  })

  it("libera o store público, de onde a faixa e o vídeo são servidos", () => {
    expect(trecho("media-src")).toContain("blob.vercel-storage.com")
  })

  it("mantém 'self', que serve a pasta public/musica", () => {
    expect(trecho("media-src")).toContain("'self'")
  })
})
