/**
 * Dados do Sports Widget (réplica do widget de esportes da nova aba do Firefox).
 *
 * As partidas de "Seguintes" (UPCOMING) foram extraídas fielmente do DOM real
 * capturado do Firefox (torneio estilo Copa do Mundo de 48 seleções, Grupos A–L
 * + mata-mata). Os timestamps são epoch em milissegundos, exatamente como o
 * widget original entrega via `data-l10n-args`.
 *
 * Os resultados (RESULTS) são em sua maioria ILUSTRATIVOS: o DOM capturado só
 * expôs um resultado real (Australia 2–0 Türkiye, em destaque). Os demais servem
 * para demonstrar a aba "Resultados" e podem ser substituídos por dados reais.
 */

export type SportsTab = "results" | "upcoming"

export interface Team {
  /** Nome completo (em inglês, como o widget original exibe). */
  name: string
  /** Código de 3 letras usado no logo/bandeira. "--" para indefinido. */
  code: string
}

export interface Match {
  id: string
  /** Chave da seção: "group-a"…"group-l", "round-32", "round-16". */
  groupKey: string
  home: Team
  away: Team
  /** Início da partida (epoch ms). */
  date: number
  homeScore?: number
  awayScore?: number
  status: "scheduled" | "full-time"
}

/** Rótulos de seção (pt-BR), espelhando os `data-l10n-id` do widget original. */
export const GROUP_LABELS: Record<string, string> = {
  "group-a": "Grupo A",
  "group-b": "Grupo B",
  "group-c": "Grupo C",
  "group-d": "Grupo D",
  "group-e": "Grupo E",
  "group-f": "Grupo F",
  "group-g": "Grupo G",
  "group-h": "Grupo H",
  "group-i": "Grupo I",
  "group-j": "Grupo J",
  "group-k": "Grupo K",
  "group-l": "Grupo L",
  "round-32": "Rodada de 32",
  "round-16": "Rodada de 16",
  "round-8": "Quartas de final",
  "round-4": "Semifinais",
  "round-2": "Final",
}

/** URL da bandeira/logo, igual ao CDN do widget original (Merino). */
export const flagUrl = (code: string) =>
  `https://storage.googleapis.com/merino-images-prod/logos/nations/svg/${code}.svg`

const T = (name: string, code: string): Team => ({ name, code })

/** Seleção "a definir", usada nas fases de mata-mata ainda sem confronto. */
const TBD: Team = T("A definir", "--")

/** As 48 seleções (+ TBD), indexadas pelo código de 3 letras. */
export const TEAMS: Record<string, Team> = {
  "--": TBD,
  AUS: T("Australia", "AUS"),
  TUR: T("Türkiye", "TUR"),
  GER: T("Germany", "GER"),
  CUW: T("Curaçao", "CUW"),
  NLD: T("Netherlands", "NLD"),
  JPN: T("Japan", "JPN"),
  CIV: T("Côte d'Ivoire", "CIV"),
  ECU: T("Ecuador", "ECU"),
  SWE: T("Sweden", "SWE"),
  TUN: T("Tunisia", "TUN"),
  ESP: T("Spain", "ESP"),
  CVI: T("Cabo Verde", "CVI"),
  BEL: T("Belgium", "BEL"),
  EGY: T("Egypt", "EGY"),
  KSA: T("Saudi Arabia", "KSA"),
  URY: T("Uruguay", "URY"),
  IRN: T("IR Iran", "IRN"),
  NZL: T("New Zealand", "NZL"),
  FRA: T("France", "FRA"),
  SEN: T("Senegal", "SEN"),
  IRQ: T("Iraq", "IRQ"),
  NOR: T("Norway", "NOR"),
  ARG: T("Argentina", "ARG"),
  ALG: T("Algeria", "ALG"),
  AUT: T("Austria", "AUT"),
  JOR: T("Jordan", "JOR"),
  PRT: T("Portugal", "PRT"),
  CDR: T("DR Congo", "CDR"),
  ENG: T("England", "ENG"),
  HRV: T("Croatia", "HRV"),
  GHA: T("Ghana", "GHA"),
  PAN: T("Panama", "PAN"),
  UZB: T("Uzbekistan", "UZB"),
  COL: T("Colombia", "COL"),
  CZE: T("Czechia", "CZE"),
  RSA: T("South Africa", "RSA"),
  CHE: T("Switzerland", "CHE"),
  BIH: T("Bosnia and Herzegovina", "BIH"),
  CAN: T("Canada", "CAN"),
  QAT: T("Qatar", "QAT"),
  MEX: T("Mexico", "MEX"),
  KOR: T("Korea Republic", "KOR"),
  USA: T("United States", "USA"),
  PAR: T("Paraguay", "PAR"),
  SCO: T("Scotland", "SCO"),
  MAR: T("Morocco", "MAR"),
  BRA: T("Brazil", "BRA"),
  HAI: T("Haiti", "HAI"),
}

let _seq = 0

/** Lookup seguro por código (cai em TBD se não encontrar). */
const team = (code: string): Team => TEAMS[code] ?? TBD

/** Fábrica de partida agendada (aba "Seguintes"). */
function u(groupKey: string, hc: string, ac: string, date: number): Match {
  return {
    id: `u${_seq++}`,
    groupKey,
    home: team(hc),
    away: team(ac),
    date,
    status: "scheduled",
  }
}

/** Fábrica de partida encerrada (aba "Resultados"). */
function r(
  groupKey: string,
  hc: string,
  hs: number,
  ac: string,
  as: number,
  date: number,
): Match {
  return {
    id: `r${_seq++}`,
    groupKey,
    home: team(hc),
    away: team(ac),
    date,
    homeScore: hs,
    awayScore: as,
    status: "full-time",
  }
}

/**
 * Próximas partidas — extraídas na ordem exata do DOM do Firefox.
 * (Fase de grupos por rodada, depois Rodada de 32 e Rodada de 16.)
 */
export const UPCOMING: Match[] = [
  u("group-e", "GER", "CUW", 1781456400000),
  u("group-f", "NLD", "JPN", 1781467200000),
  u("group-e", "CIV", "ECU", 1781478000000),
  u("group-f", "SWE", "TUN", 1781488800000),
  u("group-h", "ESP", "CVI", 1781539200000),
  u("group-g", "BEL", "EGY", 1781550000000),
  u("group-h", "KSA", "URY", 1781560800000),
  u("group-g", "IRN", "NZL", 1781571600000),
  u("group-i", "FRA", "SEN", 1781636400000),
  u("group-i", "IRQ", "NOR", 1781647200000),
  u("group-j", "ARG", "ALG", 1781658000000),
  u("group-j", "AUT", "JOR", 1781668800000),
  u("group-k", "PRT", "CDR", 1781715600000),
  u("group-l", "ENG", "HRV", 1781726400000),
  u("group-l", "GHA", "PAN", 1781737200000),
  u("group-k", "UZB", "COL", 1781748000000),
  u("group-a", "CZE", "RSA", 1781798400000),
  u("group-b", "CHE", "BIH", 1781809200000),
  u("group-b", "CAN", "QAT", 1781820000000),
  u("group-a", "MEX", "KOR", 1781830800000),
  u("group-d", "USA", "AUS", 1781895600000),
  u("group-c", "SCO", "MAR", 1781906400000),
  u("group-c", "BRA", "HAI", 1781915400000),
  u("group-d", "TUR", "PAR", 1781924400000),
  u("group-f", "NLD", "SWE", 1781974800000),
  u("group-e", "GER", "CIV", 1781985600000),
  u("group-e", "ECU", "CUW", 1782000000000),
  u("group-f", "TUN", "JPN", 1782014400000),
  u("group-h", "ESP", "KSA", 1782057600000),
  u("group-g", "BEL", "IRN", 1782068400000),
  u("group-h", "URY", "CVI", 1782079200000),
  u("group-g", "NZL", "EGY", 1782090000000),
  u("group-j", "ARG", "AUT", 1782147600000),
  u("group-i", "FRA", "IRQ", 1782162000000),
  u("group-i", "NOR", "SEN", 1782172800000),
  u("group-j", "JOR", "ALG", 1782183600000),
  u("group-k", "PRT", "UZB", 1782234000000),
  u("group-l", "ENG", "GHA", 1782244800000),
  u("group-l", "PAN", "HRV", 1782255600000),
  u("group-k", "COL", "CDR", 1782266400000),
  u("group-b", "CHE", "CAN", 1782327600000),
  u("group-b", "BIH", "QAT", 1782327600000),
  u("group-c", "SCO", "BRA", 1782338400000),
  u("group-c", "MAR", "HAI", 1782338400000),
  u("group-a", "CZE", "MEX", 1782349200000),
  u("group-a", "RSA", "KOR", 1782349200000),
  u("group-e", "CUW", "CIV", 1782417600000),
  u("group-e", "ECU", "GER", 1782417600000),
  u("group-f", "JPN", "SWE", 1782428400000),
  u("group-f", "TUN", "NLD", 1782428400000),
  u("group-d", "TUR", "USA", 1782439200000),
  u("group-d", "PAR", "AUS", 1782439200000),
  u("group-i", "NOR", "FRA", 1782500400000),
  u("group-i", "SEN", "IRQ", 1782500400000),
  u("group-h", "CVI", "KSA", 1782518400000),
  u("group-h", "URY", "ESP", 1782518400000),
  u("group-g", "EGY", "IRN", 1782529200000),
  u("group-g", "NZL", "BEL", 1782529200000),
  u("group-l", "PAN", "ENG", 1782594000000),
  u("group-l", "HRV", "GHA", 1782594000000),
  u("group-k", "COL", "PRT", 1782603000000),
  u("group-k", "CDR", "UZB", 1782603000000),
  u("group-j", "ALG", "AUT", 1782612000000),
  u("group-j", "JOR", "ARG", 1782612000000),
  u("round-32", "--", "--", 1782673200000),
  u("round-32", "--", "--", 1782752400000),
  u("round-32", "--", "--", 1782765000000),
  u("round-32", "--", "--", 1782781200000),
  u("round-32", "--", "--", 1782838800000),
  u("round-32", "--", "--", 1782853200000),
  u("round-32", "--", "--", 1782867600000),
  u("round-32", "--", "--", 1782921600000),
  u("round-32", "--", "--", 1782936000000),
  u("round-32", "--", "--", 1782950400000),
  u("round-32", "--", "--", 1783018800000),
  u("round-32", "--", "--", 1783033200000),
  u("round-32", "--", "--", 1783047600000),
  u("round-32", "--", "--", 1783101600000),
  u("round-32", "--", "--", 1783116000000),
  u("round-32", "--", "--", 1783128600000),
  u("round-16", "--", "--", 1783184400000),
  u("round-16", "--", "--", 1783198800000),
  u("round-16", "--", "--", 1783281600000),
]

/**
 * Resultados encerrados. O primeiro é o destaque real capturado do DOM
 * (Australia 2–0 Türkiye); os demais são ilustrativos (ver nota no topo).
 */
export const RESULTS: Match[] = [
  r("group-d", "AUS", 2, "TUR", 0, 1781283600000),
  r("group-d", "USA", 1, "PAR", 1, 1781272800000),
  r("group-c", "BRA", 3, "HAI", 0, 1781262000000),
  r("group-c", "SCO", 0, "MAR", 2, 1781251200000),
  r("group-a", "MEX", 2, "RSA", 1, 1781197200000),
  r("group-a", "CZE", 1, "KOR", 1, 1781186400000),
  r("group-b", "CHE", 3, "QAT", 1, 1781175600000),
  r("group-b", "CAN", 0, "BIH", 0, 1781164800000),
]

/**
 * Fuso fixo para formatação. Os dados capturados estão em horário de Brasília;
 * fixar o fuso mantém SSR e cliente idênticos (evita erro de hidratação) e
 * reproduz exatamente os horários do widget original. Para exibir no fuso local
 * do visitante, remova `timeZone` e renderize os horários apenas no cliente.
 */
const TIME_ZONE = "America/Sao_Paulo"

/** Formata a hora no padrão do widget (24h, pt-BR): "14:00". */
export function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(ms)
}

/** Data curta, como nas linhas da lista: "14 de jun.". */
export function formatDateShort(ms: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    timeZone: TIME_ZONE,
  }).format(ms)
}

/** Data longa, usada nos rótulos de acessibilidade: "14 de junho". */
export function formatDateLong(ms: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: TIME_ZONE,
  }).format(ms)
}
