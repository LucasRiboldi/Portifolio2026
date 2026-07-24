/**
 * PROPHET WIRE — configuração central do agregador.
 *
 * Ponto único onde se ajusta o comportamento do sistema sem tocar em código
 * de módulo. As fases seguintes (scheduler, publisher) leem daqui.
 */

import type { NewsStatus } from "./types"

export interface ProphetWireConfig {
  /**
   * Quantos campos de notícia a landing page exibe.
   * A Fase 0 pede 6 — este é o número que a página respeita.
   */
  readonly newsFields: number
  /**
   * Modo de publicação do pipeline:
   *   "rascunho"   → notícias entram como rascunho, revisão humana antes de ir ao ar.
   *   "automatico" → publica direto ao passar na deduplicação e na IA.
   */
  readonly publishMode: "rascunho" | "automatico"
  /** Janela de coleta: só considerar notícias das últimas N horas. */
  readonly collectWindowHours: number
  /** Fuso/horário (cron) da execução diária. Lido pelo scheduler (fase futura). */
  readonly cron: string
}

export const config: ProphetWireConfig = {
  newsFields: 6,
  publishMode: "rascunho",
  collectWindowHours: 24,
  cron: "0 6 * * *",
}

/** Status inicial derivado do modo de publicação. */
export function initialStatus(): NewsStatus {
  return config.publishMode === "automatico" ? "publicado" : "rascunho"
}
