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

      <p className="mt-4 text-xs leading-snug text-white/55">
        Uso:{" "}
        <code className="text-[var(--sv-cyan)]">
          &lt;button className=&quot;bit-btn bit-corners&quot;&gt;Start&lt;/button&gt;
        </code>
        . A classe <code className="text-[var(--sv-cyan)]">.bit-corners</code> aplica o canto
        serrilhado a qualquer peça do kit.
      </p>
    </section>
  )
}
