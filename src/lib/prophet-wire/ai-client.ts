/**
 * PROPHET WIRE — porta única para a IA (Bloco C).
 *
 * O Analyzer (Parte 8) e o Generator (Parte 9) NÃO conhecem a API do Claude:
 * falam com esta interface `AIClient`. Isso mantém o pipeline testável (os
 * testes injetam um cliente fake) e permite plugar o SDK real numa parte
 * futura sem tocar em quem consome.
 *
 * A impl entregue agora é o `FallbackAIClient`: quando não há chave/serviço,
 * `complete()` devolve `null`, sinalizando "IA indisponível". Analyzer e
 * Generator tratam esse `null` mantendo o item bruto — o pipeline nunca trava
 * por falta de IA. Não é placeholder: é a política de degradação declarada.
 */

/** Requisição de completude de texto — o mínimo que os dois módulos precisam. */
export interface AICompletionRequest {
  /** Instrução de sistema (papel/estilo). */
  system?: string
  /** Conteúdo do usuário (a notícia + o que extrair/gerar). */
  prompt: string
  /** Teto de tokens da resposta. */
  maxTokens?: number
  /** Temperatura (0 = determinístico). */
  temperature?: number
}

/**
 * Contrato de IA. `complete` devolve o texto da resposta OU `null` quando a IA
 * está indisponível (sem chave, sem rede, cota estourada). Nunca lança por
 * indisponibilidade — o `null` é o canal para isso.
 */
export interface AIClient {
  complete(request: AICompletionRequest): Promise<string | null>
}

/**
 * Cliente de degradação: sempre indisponível. É o default do pipeline enquanto
 * a `ANTHROPIC_API_KEY` não estiver configurada e o cliente real do SDK não
 * for plugado. Mantém tudo funcionando com o conteúdo bruto do Normalizer.
 */
export class FallbackAIClient implements AIClient {
  async complete(): Promise<string | null> {
    return null
  }
}

/** Extrai o primeiro objeto JSON de um texto (a IA às vezes embrulha em prosa). */
export function extractJson(text: string): unknown | null {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}
