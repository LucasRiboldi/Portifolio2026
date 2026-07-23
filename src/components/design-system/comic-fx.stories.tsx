import type { Meta, StoryObj } from "@storybook/nextjs-vite"

/**
 * Catálogo Comic FX (`.kfx-*`, comic-fx.css) como stories.
 *
 * Não há componente — são classes CSS aplicáveis a qualquer texto de capa.
 * Cada story renderiza a palavra COMIC com o efeito, e `All` mostra a grade
 * inteira para bater o olho e o addon de a11y varrer contraste/movimento.
 */

const EFFECTS: { cls: string; label: string; glitch?: boolean }[] = [
  { cls: "kfx-outline", label: "Contorno preto" },
  { cls: "kfx-outline-double", label: "Contorno duplo" },
  { cls: "kfx-shadow-hard", label: "Sombra deslocada" },
  { cls: "kfx-shadow-long", label: "Sombra longa" },
  { cls: "kfx-3d", label: "Extrusão 3D" },
  { cls: "kfx-drip", label: "Gotejamento" },
  { cls: "kfx-halftone", label: "Halftone" },
  { cls: "kfx-paper", label: "Papel antigo" },
  { cls: "kfx-brushed", label: "Metal escovado" },
  { cls: "kfx-chrome", label: "Cromado" },
  { cls: "kfx-neon", label: "Neon" },
  { cls: "kfx-cracked", label: "Rachadas" },
  { cls: "kfx-spray", label: "Spray" },
  { cls: "kfx-drybrush", label: "Pincel seco" },
  { cls: "kfx-melt", label: "Derretendo" },
  { cls: "kfx-burst", label: "Explosão" },
  { cls: "kfx-sparks", label: "Faíscas" },
  { cls: "kfx-offset", label: "Offset RGB" },
  { cls: "kfx-glitch", label: "Glitch", glitch: true },
  { cls: "kfx-skew", label: "Perspectiva" },
  { cls: "kfx-pixel", label: "Pixel 8-bit" },
  { cls: "kfx-gold", label: "Ouro" },
  { cls: "kfx-brush", label: "Pincel" },
  { cls: "kfx-hud", label: "HUD neon" },
  { cls: "kfx-crown", label: "Coroa" },
  { cls: "kfx-retro-gold", label: "Retro 3D dourado" },
  { cls: "kfx-whitebrush", label: "Escova branca" },
  { cls: "kfx-web", label: "Teia" },
  { cls: "kfx-doubleexpose", label: "Dupla-exposição" },
  { cls: "kfx-holo", label: "Holograma" },
  { cls: "kfx-neon-anim", label: "Neon-tubo animado" },
]

function Fx({ cls, word = "COMIC", glitch }: { cls: string; word?: string; glitch?: boolean }) {
  return (
    <span className={`kfx ${cls}`} style={{ fontSize: 44 }} {...(glitch ? { "data-text": word } : {})}>
      {word}
    </span>
  )
}

const meta: Meta<typeof Fx> = {
  title: "Realm Criativo/Comic FX",
  component: Fx,
  parameters: { backgrounds: { default: "dark" }, layout: "centered" },
  argTypes: {
    cls: { control: "select", options: EFFECTS.map((e) => e.cls) },
    word: { control: "text" },
  },
  args: { cls: "kfx-3d", word: "COMIC" },
}
export default meta
type Story = StoryObj<typeof Fx>

export const Playground: Story = {}

export const All: Story = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 24,
        listStyle: "none",
        margin: 0,
        padding: 24,
        background: "#0a0a0f",
      }}
    >
      {EFFECTS.map((e) => (
        <li key={e.cls} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Fx cls={e.cls} glitch={e.glitch} />
          <code style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{e.label}</code>
        </li>
      ))}
    </ul>
  ),
}
