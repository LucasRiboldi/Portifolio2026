/* ------------------------------------------------------------------
   04.2 · Web kit 8-bit — a dimensão videogame do realm.
   ------------------------------------------------------------------
   Um kit de UI em pixel: janela, painel, botões com estado pressionado,
   badges, barras de vida/progresso segmentadas, input e ícones em CSS. As
   classes vivem em `eightbit.css` (namespace `bit-`), com a fonte Pixelify e
   cantos serrilhados por clip-path. É o repertório retrô para montar telas de
   "dimensão 8-bit" sem sair do design system.
   ------------------------------------------------------------------ */
import { DsSectionTitle, DsLead } from "@/design-system/ds-ui"

export function CreativeEightBitKit() {
  return (
    <section id="web-kit-8bit" aria-label="04.2 · Web kit 8-bit" className="mt-12 scroll-mt-24">
      <DsSectionTitle id="web-kit-8bit" n="04.2">
        Web kit 8-bit
      </DsSectionTitle>
      <DsLead>
        A dimensão videogame: um kit de interface em pixel — janela, painéis,
        botões que afundam ao clicar, barras de vida, badges e input. Tudo com{" "}
        <code className="text-[var(--sv-cyan)]">.bit-*</code>, a fonte Pixelify e cantos
        serrilhados. Paleta de neon limitada, sombra dura, nada arredondado.
      </DsLead>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Janela retrô */}
        <div className="bit-window bit-corners">
          <div className="bit-window__bar">
            <span>MULTIVERSO.EXE</span>
            <span className="bit-window__dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="bit-window__body">
            <p>Bem-vindo à dimensão 8-bit. Aperte START para atravessar a fenda.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className="bit-btn bit-corners">
                ▶ Start
              </button>
              <button type="button" className="bit-btn bit-btn--magenta bit-corners">
                Opções
              </button>
            </div>
          </div>
        </div>

        {/* Painel de status */}
        <div className="bit-panel bit-corners">
          <p className="text-[0.68rem] uppercase text-[var(--k-cyan)]">Status do jogador</p>

          <div className="mt-3 space-y-3 text-[0.66rem]">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="bit-heart" aria-hidden />
                <span>HP</span>
              </div>
              <div className="bit-progress bit-progress--hp">
                <div className="bit-progress__fill" style={{ width: "72%" }} />
              </div>
            </div>
            <div>
              <p className="mb-1">XP</p>
              <div className="bit-progress">
                <div className="bit-progress__fill" style={{ width: "45%" }} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bit-badge">Nível 8</span>
            <span className="bit-badge" style={{ background: "var(--k-lime)", color: "#0c1800" }}>
              Combo x3
            </span>
            <span className="bit-badge" style={{ background: "var(--k-yellow)", color: "#1a1500" }}>
              +500 pts
            </span>
          </div>
        </div>

        {/* Botões — variantes e estado */}
        <div className="bit-panel bit-corners">
          <p className="text-[0.68rem] uppercase text-[var(--k-cyan)]">Botões</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" className="bit-btn bit-corners">Ciano</button>
            <button type="button" className="bit-btn bit-btn--magenta bit-corners">Magenta</button>
            <button type="button" className="bit-btn bit-btn--lime bit-corners">Lime</button>
            <button type="button" className="bit-btn bit-btn--yellow bit-corners">Amarelo</button>
          </div>
          <p className="mt-3 text-[0.6rem] leading-snug text-white/50">
            Clique: o botão afunda <code className="text-[var(--sv-cyan)]">--bit-s</code> e some a
            sombra — o feedback físico do arcade.
          </p>
        </div>

        {/* Formulário */}
        <div className="bit-panel bit-corners">
          <p className="text-[0.68rem] uppercase text-[var(--k-cyan)]">Entrar na fenda</p>
          <div className="mt-3 space-y-3">
            <input className="bit-input bit-corners" placeholder="NOME DO HERÓI" aria-label="Nome" />
            <input className="bit-input bit-corners" placeholder="CÓDIGO DA DIMENSÃO" aria-label="Código" />
            <button type="button" className="bit-btn bit-btn--lime bit-corners w-full justify-center">
              Confirmar ▶
            </button>
          </div>
        </div>
      </div>

      {/* --- Segunda leva: menu, diálogo, inventário, high-score, ícones,
          controles e balão (CR-8B1…8B7) ------------------------------------ */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* CR-8B1 · Menu de pause */}
        <div className="bit-window bit-corners">
          <div className="bit-window__bar">
            <span>Pausa</span>
            <span className="bit-window__dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
          </div>
          <ul className="bit-menu" role="menu" aria-label="Menu de pause">
            <li>
              <button type="button" className="bit-menu__item" role="menuitem" aria-current="true">
                Continuar
              </button>
            </li>
            <li>
              <button type="button" className="bit-menu__item" role="menuitem">
                Inventário
              </button>
            </li>
            <li>
              <button type="button" className="bit-menu__item" role="menuitem">
                Opções
              </button>
            </li>
            <li>
              <button type="button" className="bit-menu__item" role="menuitem" aria-disabled="true">
                Salvar (indisponível)
              </button>
            </li>
            <li>
              <button type="button" className="bit-menu__item" role="menuitem">
                Sair da dimensão
              </button>
            </li>
          </ul>
        </div>

        {/* CR-8B2 · Caixa de diálogo RPG */}
        <div className="bit-panel bit-corners">
          <span className="bit-dialog__speaker">Guardião da Fenda</span>
          <p className="bit-dialog">
            <span className="bit-dialog__text">
              Poucos atravessam a Terra-138 e voltam para contar…
            </span>
          </p>
          <span className="bit-dialog__more" aria-hidden>
            ▼ continuar
          </span>
        </div>

        {/* CR-8B3 · Inventário */}
        <div className="bit-panel bit-corners">
          <p className="mb-3 text-[0.68rem] uppercase text-[var(--k-cyan)]">Inventário</p>
          <div className="bit-inventory">
            <div className="bit-slot">
              <span className="bit-ico bit-ico--coin" aria-label="Moeda" role="img" />
              <span className="bit-slot__qty">9</span>
            </div>
            <div className="bit-slot">
              <span className="bit-ico bit-ico--star" aria-label="Estrela" role="img" />
            </div>
            <div className="bit-slot">
              <span className="bit-ico bit-ico--mushroom" aria-label="Cogumelo" role="img" />
              <span className="bit-slot__qty">3</span>
            </div>
            <div className="bit-slot">
              <span className="bit-ico bit-ico--key" aria-label="Chave" role="img" />
            </div>
            <div className="bit-slot">
              <span className="bit-ico bit-ico--potion" aria-label="Poção" role="img" />
              <span className="bit-slot__qty">2</span>
            </div>
            <div className="bit-slot bit-slot--empty" aria-hidden />
            <div className="bit-slot bit-slot--empty" aria-hidden />
            <div className="bit-slot bit-slot--empty" aria-hidden />
            <div className="bit-slot bit-slot--empty" aria-hidden />
            <div className="bit-slot bit-slot--empty" aria-hidden />
          </div>
        </div>

        {/* CR-8B4 · Placar de recordes */}
        <div className="bit-panel bit-corners">
          <p className="mb-3 text-[0.68rem] uppercase text-[var(--k-cyan)]">High scores</p>
          <table className="bit-score">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Herói</th>
                <th scope="col">Pontos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>LUC</td>
                <td>138000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>AAA</td>
                <td>92500</td>
              </tr>
              <tr>
                <td>3</td>
                <td>BOB</td>
                <td>77010</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CR-8B6 · Controles pixel */}
        <div className="bit-panel bit-corners">
          <p className="mb-3 text-[0.68rem] uppercase text-[var(--k-cyan)]">Controles</p>
          <div className="space-y-3">
            <label className="bit-toggle">
              <input type="checkbox" defaultChecked aria-label="Som" />
              <span className="bit-toggle__track" aria-hidden />
            </label>
            <label className="bit-check">
              <input type="checkbox" defaultChecked />
              <span className="bit-check__box" aria-hidden />
              Tela cheia
            </label>
            <div className="flex flex-col gap-2">
              <label className="bit-radio">
                <input type="radio" name="dificuldade" defaultChecked />
                <span className="bit-radio__box" aria-hidden />
                Normal
              </label>
              <label className="bit-radio">
                <input type="radio" name="dificuldade" />
                <span className="bit-radio__box" aria-hidden />
                Difícil
              </label>
            </div>
          </div>
        </div>

        {/* CR-8B7 · Tooltip / balão de fala */}
        <div className="bit-panel bit-corners flex flex-wrap items-end gap-6">
          <div>
            <p className="mb-4 text-[0.68rem] uppercase text-[var(--k-cyan)]">Balões</p>
            <span className="bit-balloon">Aperte ▶ para atravessar!</span>
          </div>
          <span className="bit-balloon bit-balloon--tip">+50 XP · combo mantido</span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-snug text-white/55">
        Uso:{" "}
        <code className="text-[var(--sv-cyan)]">
          &lt;button className=&quot;bit-btn bit-corners&quot;&gt;Start&lt;/button&gt;
        </code>
        . A classe <code className="text-[var(--sv-cyan)]">.bit-corners</code> aplica o canto
        serrilhado a qualquer peça do kit. O diálogo (
        <code className="text-[var(--sv-cyan)]">.bit-dialog__text</code>) usa animação de máquina de
        escrever e o balão (<code className="text-[var(--sv-cyan)]">.bit-balloon</code>) traz o rabicho
        serrilhado — ambos respeitam <code className="text-[var(--sv-cyan)]">prefers-reduced-motion</code>.
      </p>
    </section>
  )
}
