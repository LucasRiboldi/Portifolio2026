"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

/**
 * Placeholder enquanto o pedaço da seção desce. Ocupa altura parecida com a
 * galeria real para o conteúdo abaixo não saltar quando ela entra.
 */
function Loading() {
  return (
    <div className="grid min-h-[420px] place-items-center" role="status">
      <p className="sv-heavy text-xs uppercase tracking-widest text-white/60">
        Abrindo o booster…
      </p>
    </div>
  )
}

/**
 * As oito seções entram por `dynamic` com `ssr: false`.
 *
 * Não é micro-otimização: juntas passam de 80 cartas hi-res mais as folhas de
 * estilo do motor de foil e o tutorial inteiro. Carregadas de uma vez, o
 * visitante paga por oito seções para ver uma. Com o carregamento adiado, o
 * pedaço (e as imagens dentro dele) só desce quando a aba é escolhida.
 *
 * `ssr: false` porque o efeito holográfico depende do ponteiro e não produz
 * nada de útil no HTML do servidor — renderizá-lo lá só somaria peso ao
 * documento.
 */
/* As opções vão inline em cada chamada: o transform do SWC exige objeto
   literal em `next/dynamic` e rejeita uma constante compartilhada. */
const HoloCard = dynamic(
  () => import("@/components/spiderverse/holo-card").then((m) => m.HoloCard),
  { ssr: false, loading: Loading },
)
const PokeHoloGallery = dynamic(
  () => import("@/components/spiderverse/poke-holo-gallery").then((m) => m.PokeHoloGallery),
  { ssr: false, loading: Loading },
)
const ThundercatsGallery = dynamic(
  () => import("@/components/spiderverse/thundercats-gallery").then((m) => m.ThundercatsGallery),
  { ssr: false, loading: Loading },
)
const Stacked3dGallery = dynamic(
  () => import("@/components/spiderverse/stacked-3d-gallery").then((m) => m.Stacked3dGallery),
  { ssr: false, loading: Loading },
)
const Stacked3dHoloGallery = dynamic(
  () => import("@/components/spiderverse/stacked-3d-holo").then((m) => m.Stacked3dHoloGallery),
  { ssr: false, loading: Loading },
)
const HoloTutorial = dynamic(
  () => import("@/components/spiderverse/holo-tutorial").then((m) => m.HoloTutorial),
  { ssr: false, loading: Loading },
)
const HoloRarityCatalog = dynamic(
  () => import("@/components/spiderverse/holo-rarity-catalog").then((m) => m.HoloRarityCatalog),
  { ssr: false, loading: Loading },
)
const HoloBoosterGallery = dynamic(
  () => import("@/components/spiderverse/holo-booster-gallery").then((m) => m.HoloBoosterGallery),
  { ssr: false, loading: Loading },
)

interface Section {
  id: string
  /** Rótulo da aba — curto, cabe numa linha no celular. */
  label: string
  kicker: string
  title: string
  highlight: string
  subtitle: string
  render: () => React.ReactNode
}

const SECTIONS: Section[] = [
  {
    id: "holo",
    label: "Carta LR",
    kicker: "Item raro",
    title: "Carta",
    highlight: "holográfica",
    subtitle:
      "A carta da casa. Mova o ponteiro sobre ela — foil, brilho e tilt reagem, como uma carta rara de verdade.",
    render: () => (
      <div className="mx-auto w-[min(320px,85vw)]">
        <HoloCard />
      </div>
    ),
  },
  {
    id: "colecao",
    label: "Coleção",
    kicker: "Booster aberto",
    title: "A coleção",
    highlight: "completa",
    subtitle:
      "Cartas reais do TCG, uma em cada raridade — holo, cosmos, amazing, full art, VMAX e secreta.",
    render: () => <PokeHoloGallery />,
  },
  {
    id: "thundercats",
    label: "ThunderCats",
    kicker: "Thunder, thunder…",
    title: "Deck",
    highlight: "ThunderCats",
    subtitle:
      "O deck de Commander com proxies temáticos — cada carta com um efeito holográfico do sistema.",
    render: () => <ThundercatsGallery />,
  },
  {
    id: "stacked",
    label: "Stacked 3D",
    kicker: "Camadas em profundidade",
    title: "Stacked",
    highlight: "3D",
    subtitle:
      "Cartas e moedas montadas em planos separados — cada camada flutua num translateZ diferente, então o emblema salta mais que a moldura quando você inclina a peça.",
    render: () => <Stacked3dGallery />,
  },
  {
    id: "stacked-holo",
    label: "Stacked holo",
    kicker: "Os dois sistemas juntos",
    title: "Stacked 3D",
    highlight: "holográfico",
    subtitle:
      "As cartas reais com o foil correndo na face enquanto anel, placa e emblema descolam em profundidades diferentes. Um ponteiro só alimenta os dois efeitos.",
    render: () => <Stacked3dHoloGallery />,
  },
  {
    id: "tutorial",
    label: "Como se faz",
    kicker: "Passo a passo",
    title: "Como se faz",
    highlight: "um holo",
    subtitle:
      "O tutorial completo em português: da posição do ponteiro até o foil metálico e as camadas em 3D. Cada trecho de código é o mesmo que roda na demo ao lado.",
    render: () => <HoloTutorial />,
  },
  {
    id: "raridades",
    label: "Raridades",
    kicker: "Uma a uma",
    title: "Catálogo de",
    highlight: "raridades",
    subtitle:
      "Cada efeito do sistema com a explicação de como ele é feito e o arquivo CSS onde a regra mora — as descrições saíram do código, não da documentação.",
    render: () => <HoloRarityCatalog />,
  },
  {
    id: "booster",
    label: "Booster completo",
    kicker: "O acervo inteiro",
    title: "Booster",
    highlight: "completo",
    subtitle:
      "As 51 cartas restantes do acervo, agrupadas por família de raridade. Cada uma foi identificada abrindo a imagem — o número do arquivo não diz se a 51 é uma VMAX comum ou uma do Shiny Vault.",
    render: () => <HoloBoosterGallery />,
  },
]

/**
 * Submenu das seções de cards.
 *
 * Padrão de abas com `role="tablist"`: setas navegam entre as abas, Home/End
 * saltam para as pontas, e só a aba ativa fica no fluxo de tabulação. É o que o
 * leitor de tela espera de um seletor deste tipo — oito botões soltos
 * obrigariam a tabular por todos antes de chegar ao conteúdo.
 */
export function CardsSections() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(e: React.KeyboardEvent) {
    const last = SECTIONS.length - 1
    let next: number | null = null

    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = last

    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  const section = SECTIONS[active]!

  return (
    <>
      <div
        role="tablist"
        aria-label="Seções de cards"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2 border-b-[3px] border-black/40 pb-4"
      >
        {SECTIONS.map((s, i) => {
          const selected = i === active
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={selected}
              aria-controls={`panel-${s.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "sv-heavy rounded-md border-2 border-black px-3 py-2 text-[11px] uppercase tracking-wide transition-all sm:px-4 sm:text-xs",
                // A aba inativa era `bg-white/5 text-white/70`: sobre um fundo
                // que muda de roxo a azul ao longo da página, o botão às vezes
                // sumia e o rótulo ficava abaixo do contraste mínimo. Um fundo
                // escuro opaco não depende do que passa por baixo.
                selected
                  ? "bg-[var(--sv-yellow)] text-black shadow-[4px_4px_0_0_#000]"
                  : "bg-black/70 text-white hover:-translate-y-0.5 hover:bg-black/85",
              )}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${section.id}`}
        aria-labelledby={`tab-${section.id}`}
        tabIndex={0}
        className="mt-8 focus-visible:outline-none"
      >
        {/*
          O cabeçalho da seção fala a mesma língua do cabeçalho da página, um
          nível abaixo: etiqueta ciano, display do realm e o realce no arco-íris
          da casa.

          Antes cada seção usava um efeito diferente do catálogo Comic FX
          (`kfx-holo`, `kfx-gold`, `kfx-hud`…). Era uma "voz por seção" na
          intenção, mas na prática eram oito famílias de cor a trocar dentro do
          mesmo componente — e cinco delas pintavam o texto com
          `-webkit-text-fill-color: transparent`, apoiado só num gradiente ou
          num contorno de 1px. Sobre o roxo desta página, o `kfx-holo` (oliva) e
          o `kfx-hud` (só contorno ciano) ficavam ilegíveis. O catálogo continua
          no design system, onde é demonstração; aqui o título é navegação e
          precisa de ler igual nas oito abas.
        */}
        <header className="mb-8">
          <span className="sv-caption sv-caption-cyan inline-block text-xs">{section.kicker}</span>
          <h2 className="sv-display fx-shadow-long mt-3 text-3xl uppercase leading-none sm:text-5xl">
            {section.title}{" "}
            <span className="sv-rainbow align-baseline">{section.highlight}</span>
          </h2>
          <p className="sv-heavy mt-3 max-w-2xl text-xs uppercase leading-snug tracking-wide text-white/85 sm:text-sm">
            {section.subtitle}
          </p>
        </header>

        {/* Só a seção ativa é montada: trocar de aba desmonta a anterior e
            libera as imagens dela. */}
        {section.render()}
      </div>
    </>
  )
}
