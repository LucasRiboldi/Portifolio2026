import type { Meta, StoryObj } from "@storybook/nextjs-vite"

/**
 * Web kit 8-bit (`.bit-*`, eightbit.css) como stories.
 *
 * São classes CSS, não componentes; cada story monta uma peça do kit em markup
 * puro para o addon de a11y varrer e para o catálogo servir de referência viva.
 */
const meta: Meta = {
  title: "Realm Criativo/Web kit 8-bit",
  parameters: { backgrounds: { default: "dark" }, layout: "padded" },
}
export default meta
type Story = StoryObj

export const Botoes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <button type="button" className="bit-btn bit-corners">Ciano</button>
      <button type="button" className="bit-btn bit-btn--magenta bit-corners">Magenta</button>
      <button type="button" className="bit-btn bit-btn--lime bit-corners">Lime</button>
      <button type="button" className="bit-btn bit-btn--yellow bit-corners">Amarelo</button>
    </div>
  ),
}

export const Janela: Story = {
  render: () => (
    <div className="bit-window bit-corners" style={{ maxWidth: 360 }}>
      <div className="bit-window__bar">
        <span>MULTIVERSO.EXE</span>
        <span className="bit-window__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="bit-window__body">
        <p>Aperte START para atravessar a fenda.</p>
      </div>
    </div>
  ),
}

export const MenuDePause: Story = {
  render: () => (
    <ul className="bit-menu" role="menu" aria-label="Pausa" style={{ maxWidth: 240, border: "3px solid #000", background: "#0f0e22" }}>
      {["Continuar", "Inventário", "Opções", "Sair"].map((item, i) => (
        <li key={item}>
          <button type="button" className="bit-menu__item" role="menuitem" aria-current={i === 0 ? "true" : undefined}>
            {item}
          </button>
        </li>
      ))}
    </ul>
  ),
}

export const Inventario: Story = {
  render: () => (
    <div className="bit-inventory" style={{ maxWidth: 280 }}>
      <div className="bit-slot"><span className="bit-ico bit-ico--coin" /></div>
      <div className="bit-slot"><span className="bit-ico bit-ico--star" /></div>
      <div className="bit-slot"><span className="bit-ico bit-ico--mushroom" /></div>
      <div className="bit-slot"><span className="bit-ico bit-ico--key" /></div>
      <div className="bit-slot"><span className="bit-ico bit-ico--potion" /></div>
    </div>
  ),
}

export const Icones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
      {["coin", "star", "mushroom", "key", "potion"].map((n) => (
        <span key={n} className={`bit-ico bit-ico--${n}`} aria-label={n} role="img" />
      ))}
    </div>
  ),
}

export const Controles: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, color: "#eae6ff" }}>
      <label className="bit-toggle">
        <input type="checkbox" defaultChecked aria-label="Som" />
        <span className="bit-toggle__track" aria-hidden />
      </label>
      <label className="bit-check">
        <input type="checkbox" defaultChecked />
        <span className="bit-check__box" aria-hidden />
        Tela cheia
      </label>
      <label className="bit-radio">
        <input type="radio" name="d" defaultChecked />
        <span className="bit-radio__box" aria-hidden />
        Normal
      </label>
    </div>
  ),
}

export const Baloes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
      <span className="bit-balloon">Aperte ▶ para atravessar!</span>
      <span className="bit-balloon bit-balloon--tip">+50 XP · combo</span>
    </div>
  ),
}
