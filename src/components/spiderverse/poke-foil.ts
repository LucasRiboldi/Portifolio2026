/**
 * Nomenclatura dos foils do poke-holo.
 *
 * Um foil se chama:   {id}_foil_{tipo}_{variante}_2x.webp
 * A carta se chama:   {ID}_hires.png
 *
 * A tradução de ID para id segue três regras, deduzidas dos arquivos que
 * existem em /public/poke-holo:
 *
 *   1. numérico puro  → minúsculo e preenchido com zeros até 3 dígitos
 *                       49_hires.png   → 049_foil_holo_reverse_2x.webp
 *                       138_hires.png  → 138_foil_holo_sunpillar_2x.webp
 *   2. prefixo TG/SV  → prefixo mantido, tudo em minúsculo
 *                       TG17_hires.png → tg17_foil_etched_sunpillar_2x.webp
 *                       SV023_hires.png→ sv023_foil_etched_sunpillar_2x.webp
 *   3. prefixo SWSH   → o prefixo CAI, sobra só o número
 *                       SWSH181_hires.png → 181_foil_etched_sunpillar_2x.webp
 *
 * `tipo` é o acabamento da impressão (etched = gravado em relevo, holo =
 * liso) e `variante` diz a que raridade aquele foil pertence — é por isso
 * que não basta casar o número: um foil `holo_reverse` só faz sentido numa
 * carta reverse holo.
 *
 * ATENÇÃO — não temos máscaras. No CDN do projeto original o MESMO nome de
 * arquivo existe em /foils/ e em /masks/ (a máscara é o recorte, o foil é a
 * textura). A cópia local só trouxe o diretório /foils/, então o `--mask`
 * não pode ser preenchido a partir daqui.
 */

/** A que raridade cada variante de foil pertence. */
export const VARIANTE_PARA_RARIDADE: Record<string, string[]> = {
  holo_reverse: ["reverse holo"],
  holo_sunpillar: ["rare holo v"],
  holo_rainbow: ["trainer gallery rare holo", "rare rainbow"],
  etched_sunpillar: ["rare ultra", "rare holo vmax", "rare holo vstar"],
  etched_swsecret: ["rare secret", "rare holo vmax"],
}

/**
 * Foils presentes em /public/poke-holo, por id já normalizado.
 * Uma carta pode ter mais de um (o 138 tem reverse e sunpillar), por isso
 * o valor é uma lista de variantes.
 */
const DISPONIVEIS: Record<string, string[]> = {
  "018": ["etched_sunpillar"],
  "029": ["etched_sunpillar"],
  "031": ["etched_sunpillar"],
  "049": ["holo_reverse"],
  "051": ["etched_sunpillar"],
  "068": ["holo_reverse"],
  "085": ["holo_reverse"],
  "116": ["holo_reverse"],
  "120": ["holo_reverse"],
  "127": ["holo_reverse"],
  "138": ["holo_reverse", "holo_sunpillar"],
  "150": ["holo_reverse"],
  "160": ["etched_swsecret"],
  "167": ["etched_sunpillar"],
  "173": ["holo_reverse"],
  "176": ["etched_sunpillar"],
  "177": ["etched_sunpillar"],
  "181": ["etched_sunpillar"],
  "183": ["etched_sunpillar"],
  "186": ["etched_sunpillar"],
  "196": ["etched_sunpillar"],
  "200": ["etched_sunpillar"],
  "214": ["etched_sunpillar"],
  "245": ["etched_sunpillar"],
  "250": ["etched_sunpillar"],
  "271": ["etched_swsecret"],
  sv023: ["etched_sunpillar"],
  sv076: ["etched_sunpillar"],
  sv093: ["etched_sunpillar"],
  sv094: ["etched_sunpillar"],
  sv110: ["etched_sunpillar"],
  tg05: ["holo_rainbow"],
  tg16: ["etched_sunpillar"],
  tg17: ["etched_sunpillar"],
  tg18: ["etched_sunpillar"],
  tg26: ["etched_sunpillar"],
  tg27: ["etched_sunpillar"],
}

/** Aplica as três regras de tradução de ID da carta para id do foil. */
export function normalizaId(idCarta: string): string {
  const id = idCarta.toLowerCase()
  if (/^swsh\d+$/.test(id)) return id.replace(/^swsh/, "") // regra 3
  if (/^(tg|sv)\d+$/.test(id)) return id // regra 2
  if (/^\d+$/.test(id)) return id.padStart(3, "0") // regra 1
  return id
}

/** Extrai o ID de um caminho tipo `/poke-holo/TG17_hires.png`. */
export function idDaCarta(img: string): string {
  return img.split("/").pop()?.replace(/_hires\.png$/i, "") ?? ""
}

/**
 * Devolve o caminho do foil da carta, ou undefined se não houver um
 * compatível. Só devolve quando a variante do arquivo corresponde à
 * raridade pedida — casar apenas o número aplicaria, por exemplo, um foil
 * de reverse holo numa carta comum.
 */
export function foilDaCarta(img: string, raridade: string): string | undefined {
  const id = normalizaId(idDaCarta(img))
  const variantes = DISPONIVEIS[id]
  if (!variantes) return undefined

  const compativel = variantes.find((v) =>
    (VARIANTE_PARA_RARIDADE[v] ?? []).includes(raridade)
  )
  if (!compativel) return undefined

  return `/poke-holo/${id}_foil_${compativel}_2x.webp`
}
