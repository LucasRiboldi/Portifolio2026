/**
 * PROPHET WIRE — cliente HTTP injetável do Collector.
 *
 * O Collector (Parte 4) não chama `fetch` direto: recebe um `HttpClient`. Isso
 * torna a coleta testável sem rede (os testes injetam um fake que devolve
 * fixtures) e concentra num só lugar as políticas de timeout, User-Agent e
 * tratamento de status HTTP.
 */

/** Resposta de texto de uma requisição bem-sucedida. */
export interface HttpResponse {
  status: number
  /** Corpo como texto (RSS/HTML/JSON são todos texto aqui). */
  body: string
}

export interface HttpRequestOptions {
  /** Aborta a requisição após N ms. */
  timeoutMs?: number
  /** Cabeçalhos extras (ex.: Accept). */
  headers?: Record<string, string>
}

/** Contrato de busca — a única porta de rede do Collector. */
export interface HttpClient {
  get(url: string, options?: HttpRequestOptions): Promise<HttpResponse>
}

/** Erro de rede/timeout, distinguível de um status HTTP ruim. */
export class HttpError extends Error {
  constructor(
    message: string,
    readonly url: string,
    readonly cause?: unknown,
  ) {
    super(message)
    this.name = "HttpError"
  }
}

const DEFAULT_TIMEOUT_MS = 15_000
const DEFAULT_UA =
  "ProphetWire/0.1 (+https://lucasriboldi.dev; agregador de notícias de board games)"

/**
 * Implementação real sobre o `fetch` global (Node 18+ / Next runtime).
 * Aplica timeout via `AbortController` e transforma falha de rede em `HttpError`.
 */
export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly defaults: HttpRequestOptions = {},
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async get(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse> {
    const timeoutMs = options.timeoutMs ?? this.defaults.timeoutMs ?? DEFAULT_TIMEOUT_MS
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await this.fetchImpl(url, {
        signal: controller.signal,
        headers: { "User-Agent": DEFAULT_UA, ...this.defaults.headers, ...options.headers },
      })
      const body = await res.text()
      return { status: res.status, body }
    } catch (cause) {
      const reason = cause instanceof Error && cause.name === "AbortError" ? "timeout" : "falha de rede"
      throw new HttpError(`GET ${url}: ${reason}`, url, cause)
    } finally {
      clearTimeout(timer)
    }
  }
}
