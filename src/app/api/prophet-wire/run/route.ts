/**
 * PROPHET WIRE — gatilho diário do pipeline (Parte 12).
 *
 * A Vercel Cron chama este endpoint no horário declarado em `vercel.json`
 * (espelho de `config.cron`), enviando `Authorization: Bearer $CRON_SECRET`.
 * A rota monta as dependências reais e executa `runPipeline()` uma vez.
 *
 * LIMITAÇÃO CONHECIDA, declarada de propósito: o repositório em uso é o
 * in-memory, que vive só enquanto a invocação serverless existe — ou seja, hoje
 * a execução processa as fontes e produz o relatório, mas NÃO persiste entre
 * execuções (e portanto a deduplicação entre dias não tem memória). Isso passa a
 * valer de verdade quando a Parte 10 (repositório Supabase) entrar; a troca é de
 * uma linha aqui, porque tudo fala com a interface `NewsRepository`.
 *
 * Mesma razão para a IA: enquanto não houver `ANTHROPIC_API_KEY` e um cliente
 * real, o `FallbackAIClient` mantém o pipeline rodando com o conteúdo bruto.
 */

import { NextResponse } from "next/server"

import { runPipeline } from "@/lib/prophet-wire/pipeline"
import { authorizeCron } from "@/lib/prophet-wire/cron-auth"
import { FetchHttpClient } from "@/lib/prophet-wire/http-client"
import { FallbackAIClient } from "@/lib/prophet-wire/ai-client"
import { defaultRepository } from "@/data/prophet-wire"
import { defaultRunStore } from "@/lib/prophet-wire/run-store"
import { config } from "@/lib/prophet-wire/config"

/** Nunca cachear: cada chamada é uma execução real. */
export const dynamic = "force-dynamic"
/** Coleta de dezenas de fontes leva mais que o default de 10s. */
export const maxDuration = 300

/**
 * Trava de execução concorrente. O pipeline bate em dezenas de fontes; duas
 * execuções sobrepostas dobram o custo de rede/IA e disputam a deduplicação.
 *
 * ALCANCE REAL, declarado: esta trava é de PROCESSO. Ela impede sobreposição
 * dentro da mesma instância serverless (cron atrasado que encavala, disparo
 * manual repetido), mas NÃO coordena instâncias diferentes — para isso seria
 * preciso um lock compartilhado (Vercel KV/Upstash), decisão que fica para
 * quando houver o repositório persistente da Parte 10.
 */
let running: Promise<unknown> | null = null

async function handle(request: Request) {
  const auth = authorizeCron(request.headers.get("authorization"))
  if (!auth.authorized) {
    // Resposta genérica: não revela se o segredo existe ou está errado.
    // O motivo detalhado fica só no log privado do projeto, onde serve para
    // diagnosticar cron mal configurado.
    console.warn("[prophet-wire] gatilho recusado", { reason: auth.reason })
    return NextResponse.json({ error: "não autorizado" }, { status: 401 })
  }

  if (running) {
    console.warn("[prophet-wire] execução já em andamento — chamada ignorada")
    return NextResponse.json({ error: "execução já em andamento" }, { status: 409 })
  }

  // A trava é liberada no `finally` mesmo se o pipeline explodir — do
  // contrário uma falha deixaria o endpoint travado até a instância reciclar.
  const execution = runPipeline({
    http: new FetchHttpClient(),
    ai: new FallbackAIClient(),
    repo: defaultRepository(),
    logging: { echo: true, minLevel: "info" },
  })
  running = execution

  try {
    const report = await execution
    // Registra no histórico para o painel admin ler.
    await defaultRunStore().record(report)
    // Devolve só o resumo — as entradas completas ficam no log da execução.
    return NextResponse.json({
      startedAt: report.startedAt,
      finishedAt: report.finishedAt,
      durationMs: report.durationMs,
      counters: report.counters,
      publishMode: config.publishMode,
    })
  } finally {
    running = null
  }
}

/** A Vercel Cron dispara com GET. */
export async function GET(request: Request) {
  return handle(request)
}

/** POST permite disparo manual com o mesmo segredo. */
export async function POST(request: Request) {
  return handle(request)
}
