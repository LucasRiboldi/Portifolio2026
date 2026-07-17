import type { RealmId } from "@/lib/realms"

/**
 * Registro de motion por realm.
 *
 * Cada entrada é executável: `demo` diz ao MotionLab qual gesto tocar, então
 * a documentação não descreve o movimento — ela o reproduz. Se um easing
 * mudar no código, a demo muda junto; texto solto mentiria em silêncio.
 *
 * O movimento é parte da identidade tanto quanto a cor: o Criativo passa do
 * ponto e volta (spring), o Dev entra e assenta (ease-out), o Anfitrião
 * praticamente não se move — papel não anima.
 */
export type MotionDemo =
  | "pop"        // salto de quadrinho, com overshoot
  | "hero"       // entrada do LCP: só transform, nunca opacity 0
  | "tilt"       // inclina e sobe no hover
  | "spring"     // a curva padrão do Criativo, isolada
  | "shake"      // tremor de impacto
  | "glitchBurst" // rajada de fatias (masthead)
  | "settle"     // entra e assenta, sem passar do ponto
  | "caret"      // cursor do terminal piscando em passos
  | "borderOnly" // hover discreto: muda a borda, não move
  | "typeIn"     // texto surgindo caractere a caractere
  | "scan"       // varredura de scanline no CRT
  | "inkSettle"  // a tinta assentando no papel, letra a letra
  | "linkRule"   // filete que se revela sob o link
  | "none"       // deliberadamente imóvel

export interface MotionEntry {
  name: string
  value: string
  use: string
  demo: MotionDemo
  /** Onde isso roda de verdade no site. Sem isso vira teoria. */
  where: string
}

const CREATIVE_MOTION: MotionEntry[] = [
  { name: "pop", value: "spring · stiffness 260 · damping 18", use: "Entrada de cards — o salto de quadrinho", demo: "pop", where: "BentoGrid, cards do miolo" },
  { name: "heroPop", value: "spring · stiffness 260 · damping 20 · sem fade", use: "Elemento LCP: só transform, nunca opacity 0", demo: "hero", where: "Matéria de capa (primeiro bloco)" },
  { name: "tilt no hover", value: "-translate-y-1 · rotate(-2deg)", use: "Botões e cards ganham vida ao passar o mouse", demo: "tilt", where: "ComicButton, BentoCard, cards de dimensão" },
  { name: "ease.spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)", use: "Padrão do realm — sempre passa do ponto e volta", demo: "spring", where: "Todas as transições do Criativo" },
  { name: "parallax 3D", value: "spring · stiffness 140 · damping 18 · ±7deg", use: "A capa inclina seguindo o ponteiro, como objeto na mesa", demo: "tilt", where: "ComicCover (capa da home)" },
  { name: "glitch burst", value: "steps(1) · 6.5s · rajadas de ~65ms", use: "Fatias do masthead saltam; 90% do ciclo é repouso", demo: "glitchBurst", where: "Masthead LUCAS RIBOLDI" },
  { name: "sv-shake", value: "steps(2) · 4.5s", use: "Tremor de impacto no texto com glitch", demo: "shake", where: ".sv-glitch" },
  { name: "onoma pop", value: "spring · escala 0 → 1 com overshoot", use: "Onomatopeia estoura na tela", demo: "pop", where: "THWIP!, BAM! na home" },
]

const DEVELOPER_MOTION: MotionEntry[] = [
  { name: "caret", value: "blink · steps(2) · 1s", use: "Cursor do terminal — a assinatura do realm", demo: "caret", where: "Prompt do dock e da home _dev" },
  { name: "hover de card", value: "border-color 150ms · sem transform", use: "Discreto: nada salta, só a borda acende", demo: "borderOnly", where: "dv-card" },
  { name: "ease.out", value: "cubic-bezier(0, 0, 0.2, 1)", use: "Padrão — entra e assenta, sem passar do ponto", demo: "settle", where: "Todas as transições do _dev" },
  { name: "type-in", value: "steps(n) · ~40ms por caractere", use: "Texto datilografado, como saída de terminal", demo: "typeIn", where: "Home _dev, logs" },
  { name: "GSAP timeline", value: "timeline sequencial", use: "Stack em movimento na home", demo: "settle", where: "Demo de stack" },
  { name: "scanline", value: "linear · 3s · infinito", use: "Varredura do tubo — só no modo CRT", demo: "scan", where: ".crt (dev-mode.css)" },
]

const ARCANE_MOTION: MotionEntry[] = [
  { name: "quase nenhum", value: "—", use: "Papel não anima. O realm é deliberadamente estático.", demo: "none", where: "Regra geral do Anfitrião" },
  { name: "hover de link", value: "cor → sépia + filete pontilhado", use: "Único feedback interativo da folha", demo: "linkRule", where: "Links do Prophet, PressMark" },
  { name: "ink settle", value: "letra a letra via CSS · ~60ms", use: "A tinta assentando no papel recém-impresso", demo: "inkSettle", where: "Masthead do Arcane na home Creative" },
  { name: "sem parallax", value: "—", use: "Nada segue o ponteiro: a folha está parada sobre a mesa", demo: "none", where: "Regra geral do Anfitrião" },
]

export const REALM_MOTION: Record<RealmId, MotionEntry[]> = {
  creative: CREATIVE_MOTION,
  developer: DEVELOPER_MOTION,
  arcane: ARCANE_MOTION,
}
