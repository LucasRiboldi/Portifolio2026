import { DIMENSIONS, dimClass } from "@/components/spiderverse/sv-canvas"
import type { RealmId } from "@/lib/realms"

/**
 * Versões de cada realm — o mesmo kit, impresso noutra chapa.
 *
 * Não há um conceito único servindo os três: "dimensão" é vocabulário do
 * Criativo (Aranhaverso). Forçá-lo nos outros seria enfeite vazio — um jornal
 * de 1920 em "neon Mumbattan" não quer dizer nada. Então cada universo lista
 * as variações que EXISTEM nele:
 *
 *   Criativo    → as 20 dimensões de arte (sv-dim-*)
 *   Dev         → os modos do terminal (Dracula, sober, CRT, retro-OS)
 *   Anfitrião   → os estados da folha impressa (primeira página, interna, envelhecida)
 *
 * `className` é aplicada na superfície do preview; `scope` do realm continua
 * valendo por fora.
 */
export interface RealmVariant {
  id: string
  label: string
  /** Classe aplicada ao preview. Vazia = o estado padrão do realm. */
  className: string
  desc: string
}

const CREATIVE_VARIANTS: RealmVariant[] = DIMENSIONS.map(d => ({
  id: d.id,
  label: d.label,
  className: dimClass[d.id],
  desc: `Terra-${d.earth} · ${d.desc}`,
}))

const DEVELOPER_VARIANTS: RealmVariant[] = [
  { id: "dracula", label: "Dracula", className: "", desc: "Padrão do realm — a paleta do editor, roxo profundo e verde menta" },
  { id: "sober", label: "Sober", className: "sober", desc: "Modo contido: corta o neon e o exagero, para leitura longa" },
  { id: "crt", label: "CRT", className: "crt", desc: "Monitor de fósforo — scanlines e brilho de tubo" },
  { id: "os-95", label: "OS 95", className: "os-95", desc: "Janela cinza, bisel duro e barra de título azul" },
  { id: "os-xp", label: "OS XP", className: "os-xp", desc: "Bordas arredondadas e azul Luna" },
  { id: "os-mac", label: "OS Mac", className: "os-mac", desc: "Barra clara com semáforo e sombra suave" },
]

const ARCANE_VARIANTS: RealmVariant[] = [
  { id: "dp", label: "Primeira página", className: "dp", desc: "A capa do Prophet: manchete, colunas e expediente" },
  { id: "prophet", label: "Página interna", className: "prophet", desc: "Matéria corrida — capitular, colunas estreitas, sem manchete" },
  { id: "aged", label: "Envelhecida", className: "dp art-tex-foxing", desc: "A mesma folha esquecida na caixa: manchas de umidade e amarelado" },
]

export const REALM_VARIANTS: Record<RealmId, RealmVariant[]> = {
  creative: CREATIVE_VARIANTS,
  developer: DEVELOPER_VARIANTS,
  arcane: ARCANE_VARIANTS,
}

/** Rótulo do seletor — o conceito tem nome diferente em cada universo. */
export const VARIANT_LABEL: Record<RealmId, string> = {
  creative: "Dimensão",
  developer: "Modo",
  arcane: "Estado da folha",
}
