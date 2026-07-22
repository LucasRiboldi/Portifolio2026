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
 * As três galerias entram por `dynamic` com `ssr: false`.
 *
 * Não é micro-otimização: juntas somam ~30 imagens hi-res mais as folhas de
 * estilo do motor de foil. Carregadas de uma vez, o visitante paga por três
 * seções para ver uma. Com o carregamento adiado, o pedaço (e as imagens
 * dentro dele) só desce quando a aba é escolhida.
 *
 * `ssr: false` porque o efeito holográfico depende do ponteiro e não produz
 * nada de útil no HTML do servidor — renderizá-lo lá só somaria peso ao
 * documento.
 */
const HoloCard = dynamic(() => import("@/components/spiderverse/holo-card").then((m) => m.HoloCard), {
  ssr: false,
  loading: Loading,
})

const PokeHoloGallery = dynamic(
  () => import("@/components/spiderverse/poke-holo-gallery").then((m) => m.PokeHoloGallery),
  { ssr: false, loading: Loading },
)

const ThundercatsGallery = dynamic(
  () => import("@/components/spiderverse/thundercats-gallery").then((m) => m.ThundercatsGallery),
  { ssr: false, loading: Loading },
)

interface Section {
  id: string
  label: string
  kicker: string
  subtitle: string
}

const SECTIONS: Section[] = [
  {
    id: "holo",
    label: "Carta LR",
    kicker: "Item raro",
    subtitle:
      "A carta da casa. Mova o ponteiro sobre ela — foil, brilho e tilt reagem, como uma carta rara de verdade.",
  },
  {
    id: "colecao",
    label: "Coleção completa",
    kicker: "Booster aberto",
    subtitle:
      "Cartas reais do TCG, uma em cada raridade — holo, cosmos, amazing, full art, VMAX e secreta.",
  },
  {
    id: "thundercats",
    label: "Deck ThunderCats",
    kicker: "Thunder, thunder…",
    subtitle:
      "O deck de Commander com proxies temáticos — cada carta com um efeito holográfico do sistema.",
  },
]

/**
 * Submenu das seções de cards.
 *
 * Padrão de abas com `role="tablist"`: setas navegam entre as abas, Home/End
 * saltam para as pontas, e só a aba ativa fica no fluxo de tabulação. É o que o
 * leitor de tela espera de um seletor deste tipo — uma fileira de botões soltos
 * obrigaria a tabular por todas antes de chegar ao conteúdo.
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
                "sv-heavy rounded-md border-2 border-black px-4 py-2 text-xs uppercase tracking-wide transition-all",
                selected
                  ? "bg-[var(--sv-yellow)] text-black shadow-[4px_4px_0_0_#000]"
                  : "bg-white/5 text-white/70 hover:-translate-y-0.5 hover:text-white",
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
        <header className="mb-8">
          <span className="sv-caption inline-block text-xs">{section.kicker}</span>
          <p className="sv-heavy mt-3 max-w-2xl text-xs uppercase leading-snug tracking-wide text-white/70 sm:text-sm">
            {section.subtitle}
          </p>
        </header>

        {/* Só a seção ativa é montada: trocar de aba desmonta a anterior e
            libera as imagens dela. */}
        {section.id === "holo" && (
          <div className="mx-auto w-[min(320px,85vw)]">
            <HoloCard />
          </div>
        )}
        {section.id === "colecao" && <PokeHoloGallery />}
        {section.id === "thundercats" && <ThundercatsGallery />}
      </div>
    </>
  )
}
