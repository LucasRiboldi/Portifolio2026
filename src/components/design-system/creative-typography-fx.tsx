/* ------------------------------------------------------------------
   04.1 · Comic FX — o catálogo de efeitos tipográficos do realm.
   ------------------------------------------------------------------
   As classes `.kfx-*` de `comic-fx.css` aplicadas à palavra COMIC, mais os
   tratamentos de manchete (ação/heróis) e alguns exemplos de combinação de
   fontes. É a matéria que dá ao realm o seu repertório de título de capa —
   antes só existia o `.k-3d`; agora são vinte efeitos nomeados e reutilizáveis.

   Cada efeito escala pelo `font-size` (medidas em `em`), então a mesma classe
   serve do chip do catálogo à manchete gigante.
   ------------------------------------------------------------------ */
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"
import { PunkName } from "@/components/comic/punk-name"
import type { CSSProperties } from "react"

/** Os efeitos do catálogo, na ordem. */
const EFFECTS: { n: string; label: string; cls: string }[] = [
  { n: "01", label: "Contorno preto grosso", cls: "kfx-outline" },
  { n: "02", label: "Contorno duplo", cls: "kfx-outline-double" },
  { n: "03", label: "Sombra deslocada", cls: "kfx-shadow-hard" },
  { n: "04", label: "Sombra longa", cls: "kfx-shadow-long" },
  { n: "05", label: "Extrusão 3D", cls: "kfx-3d" },
  { n: "06", label: "Gotejamento de tinta", cls: "kfx-drip" },
  { n: "07", label: "Halftone (pontilhado)", cls: "kfx-halftone" },
  { n: "08", label: "Textura papel antigo", cls: "kfx-paper" },
  { n: "09", label: "Metal escovado", cls: "kfx-brushed" },
  { n: "10", label: "Cromado", cls: "kfx-chrome" },
  { n: "11", label: "Neon brilhante", cls: "kfx-neon" },
  { n: "12", label: "Letras rachadas", cls: "kfx-cracked" },
  { n: "13", label: "Spray / graffiti", cls: "kfx-spray" },
  { n: "14", label: "Pincel seco", cls: "kfx-drybrush" },
  { n: "15", label: "Letras derretendo", cls: "kfx-melt" },
  { n: "16", label: "Explosão atrás", cls: "kfx-burst" },
  { n: "17", label: "Faíscas e partículas", cls: "kfx-sparks" },
  { n: "18", label: "Offset de cores", cls: "kfx-offset" },
  { n: "19", label: "Efeito glitch", cls: "kfx-glitch" },
  { n: "20", label: "Perspectiva inclinada", cls: "kfx-skew" },
  { n: "21", label: "Pixel / 8-bit", cls: "kfx-pixel" },
  { n: "22", label: "Ouro elegante", cls: "kfx-gold" },
  { n: "23", label: "Ransom / recorte", cls: "__ransom" },
  { n: "24", label: "Pincel / graffiti", cls: "kfx-brush" },
  { n: "25", label: "HUD neon", cls: "kfx-hud" },
  { n: "26", label: "Graffiti coroa", cls: "kfx-crown" },
]

/** Biblioteca de assets: a palavra MULTIVERSO em vários tratamentos + legenda. */
const MULTIVERSE_ASSETS: { cls: string; sub: string }[] = [
  { cls: "kfx-gold", sub: "Infinito em todas as direções." },
  { cls: "kfx-brush", sub: "Realidades que colidem. Destinos que se cruzam." },
  { cls: "kfx-hud", sub: "Existem mais mundos do que você imagina." },
  { cls: "kfx-pixel", sub: "Novos mundos carregando…" },
  { cls: "__ransom", sub: "Tantas versões. Tantas verdades." },
  { cls: "kfx-crown", sub: "Quebre as regras. Crie seu universo." },
  { cls: "kfx-3d", sub: "Nenhum limite. Infinitas histórias." },
  { cls: "kfx-glitch", sub: "Cada escolha cria um novo mundo." },
  { cls: "kfx-burst", sub: "Um universo não basta para tantas ideias!" },
]

/** Manchetes de ação: reusa .kfx-3d recolorindo a face/lateral por CSS var. */
const HEROES: { lines: string[]; face: string; side: string }[] = [
  { lines: ["HERO", "MODE"], face: "var(--k-yellow)", side: "var(--k-orange)" },
  { lines: ["MULTI", "VERSO"], face: "var(--k-cyan)", side: "var(--k-blue)" },
  { lines: ["PODER", "MÁXIMO"], face: "var(--k-red)", side: "#7a0f1e" },
]

function heroVars(face: string, side: string) {
  return { "--k-yellow": face, "--k-orange": side } as CSSProperties
}

export function CreativeTypographyFx() {
  return (
    <section id="typography-fx" aria-label="04.1 · Comic FX" className="mt-12 scroll-mt-24">
      <DsSectionTitle id="typography-fx" n="04.1">
        Comic FX — efeitos de título
      </DsSectionTitle>
      <DsLead>
        Vinte tratamentos nomeados para texto de capa, cada um uma classe{" "}
        <code className="text-[var(--sv-cyan)]">.kfx-*</code> reutilizável. Todos escalam pelo{" "}
        <code className="text-[var(--sv-cyan)]">font-size</code> (medidas em <code>em</code>), então
        a mesma classe serve na manchete e no rótulo. Fundo escuro de propósito: é onde a tinta e o
        brilho ganham contraste.
      </DsLead>

      {/* --- Ação / Heróis: manchetes compostas --------------------------- */}
      <p className="sv-heavy mb-3 mt-8 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-yellow)]">
        Ação / Heróis
      </p>
      <div className="grid gap-4 rounded-lg border-[3px] border-black bg-[#0a0a0f] p-6 sm:grid-cols-3">
        {HEROES.map((h) => (
          <div key={h.lines.join("")} className="flex flex-col items-center justify-center gap-1 py-4">
            {h.lines.map((line) => (
              <span key={line} className="kfx kfx-3d text-4xl sm:text-5xl" style={heroVars(h.face, h.side)}>
                {line}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* --- Combinações de tipografia ------------------------------------ */}
      <p className="sv-heavy mb-3 mt-8 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        Combinações de tipografia
      </p>
      <div className="grid gap-4 rounded-lg border-[3px] border-black bg-[#0a0a0f] p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center gap-0.5 py-3 text-center">
          <span className="kfx kfx-outline-double text-3xl">Leitura</span>
          <span className="text-lg italic text-white/70" style={{ fontFamily: "var(--font-bebas)" }}>e</span>
          <span className="kfx kfx-shadow-hard text-2xl">Trilha</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 py-3 text-center">
          <span className="kfx kfx-chrome text-3xl">Artes</span>
          <span className="kfx kfx-neon text-2xl">&amp;</span>
          <span className="kfx kfx-outline text-2xl">Ilustra</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-0.5 py-3 text-center">
          <span className="kfx kfx-3d text-3xl">Multi</span>
          <span className="kfx kfx-offset text-2xl">Expansão</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 py-3 text-center">
          <span className="kfx kfx-burst text-3xl">Boom!</span>
          <span className="kfx kfx-chrome text-2xl">Nova</span>
        </div>
      </div>

      {/* --- catálogo de efeitos tipográficos ----------------------------- */}
      <p className="sv-heavy mb-3 mt-8 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-cyan)]">
        {EFFECTS.length} efeitos tipográficos
      </p>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border-[3px] border-black bg-black sm:grid-cols-3 lg:grid-cols-5">
        {EFFECTS.map((e) => (
          <li key={e.n} className="flex flex-col items-center gap-3 bg-[#0a0a0f] px-3 py-6">
            {e.cls === "__ransom" ? (
              // Ransom = recorte de revista, letra a letra: é o PunkName.
              <PunkName className="text-3xl">COMIC</PunkName>
            ) : (
              <span
                className={`kfx ${e.cls} text-3xl`}
                {...(e.cls === "kfx-glitch" ? { "data-text": "COMIC" } : {})}
              >
                COMIC
              </span>
            )}
            <span className="text-center text-[10px] uppercase leading-tight tracking-wide text-white/55">
              {e.n}. {e.label}
            </span>
          </li>
        ))}
      </ul>

      {/* --- Biblioteca de assets: cards MULTIVERSO ----------------------- */}
      <p className="sv-heavy mb-3 mt-10 text-[11px] uppercase tracking-[0.2em] text-[var(--sv-magenta)]">
        Biblioteca de assets — MULTIVERSO
      </p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MULTIVERSE_ASSETS.map((a) => (
          <li
            key={a.sub}
            className="flex min-h-[168px] flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border-[3px] border-black bg-[radial-gradient(120%_100%_at_50%_0%,#171226,#08070d)] px-4 py-8 text-center"
          >
            {a.cls === "__ransom" ? (
              <PunkName className="text-2xl sm:text-[2rem]">MULTIVERSO</PunkName>
            ) : (
              <span
                className={`kfx ${a.cls} text-2xl sm:text-[2rem]`}
                {...(a.cls === "kfx-glitch" ? { "data-text": "MULTIVERSO" } : {})}
              >
                MULTIVERSO
              </span>
            )}
            <span className="k-kicker text-[10px] leading-snug text-white/55">{a.sub}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-snug text-white/55">
        Uso:{" "}
        <code className="text-[var(--sv-cyan)]">
          &lt;span className=&quot;kfx kfx-chrome text-5xl&quot;&gt;TÍTULO&lt;/span&gt;
        </code>
        . O glitch (19) precisa de <code className="text-[var(--sv-cyan)]">data-text</code> igual ao
        conteúdo. As faces do 3D (05) recolorem via <code className="text-[var(--sv-cyan)]">--k-yellow</code>{" "}
        / <code className="text-[var(--sv-cyan)]">--k-orange</code>, como nas manchetes acima.
      </p>
    </section>
  )
}
