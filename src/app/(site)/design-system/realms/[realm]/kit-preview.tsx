"use client"

/**
 * As folhas dos outros realms só são carregadas nos layouts deles. Aqui elas
 * entram para o preview poder mostrar cada realm na própria linguagem. É
 * seguro: `dracula.css` é escopado em `.dracula` e `daily-prophet.css`/
 * `prophet.css` em `.dp`/`.prophet` — nenhuma declara seletor global.
 */
import "@/styles/dracula.css"
import "@/styles/prophet.css"
import "@/styles/daily-prophet.css"
import "@/styles/daily-prophet-ui.css"
import "@/styles/daily-prophet-kit.css"

import * as React from "react"

import { SvButton } from "@/components/ui/sv-button"
import { SvInput, SvTextarea, SvSelect } from "@/components/ui/sv-input"
import { SvCheckbox, SvRadio, SvSwitch, SvSlider } from "@/components/ui/sv-choice"
import { SvChip, SvTag, SvTabs, SvBreadcrumb } from "@/components/ui/sv-data"
import { SvAlert, SvProgress } from "@/components/ui/sv-feedback"
import type { RealmId } from "@/lib/realms"

/**
 * Preview vivo do kit — os componentes e classes reais, não capturas. Se um
 * deles quebrar, quebra aqui também, que é exatamente o ponto.
 *
 * `scope` aplica a classe que ativa o CSS do realm.
 */
export function RealmKitPreview({ realm, scope }: { realm: RealmId; scope: string }) {
  return (
    <ScopeContext.Provider value={scope}>
      {realm === "creative" && <CreativeKit />}
      {realm === "developer" && <DeveloperKit />}
      {realm === "arcane" && <ArcaneKit />}
    </ScopeContext.Provider>
  )
}

/** O escopo do realm viaja até o Block, que o aplica só na superfície do preview. */
const ScopeContext = React.createContext("")

/* ---------------- Creative ---------------- */

function CreativeKit() {
  return (
    <>
      <Block title="Botões — variantes">
        <div className="flex flex-wrap items-center gap-3">
          <SvButton variant="primary">Primary</SvButton>
          <SvButton variant="secondary">Secondary</SvButton>
          <SvButton variant="outline">Outline</SvButton>
          <SvButton variant="ghost">Ghost</SvButton>
          <SvButton variant="link">Link</SvButton>
        </div>
      </Block>

      <Block title="Botões — tamanhos e formatos">
        <div className="flex flex-wrap items-center gap-3">
          <SvButton size="sm">sm</SvButton>
          <SvButton size="md">md</SvButton>
          <SvButton size="lg">lg</SvButton>
          <SvButton shape="pill">pill</SvButton>
          <SvButton disabled>disabled</SvButton>
        </div>
      </Block>

      <Block title="Inputs">
        <div className="grid gap-3 sm:grid-cols-2">
          <SvInput label="Nome" placeholder="Lucas Riboldi" />
          <SvInput label="Com erro" placeholder="inválido" error="Campo obrigatório" />
          <SvSelect
            label="Realm"
            options={[
              { value: "creative", label: "Creative" },
              { value: "developer", label: "Developer" },
              { value: "arcane", label: "Arcane" },
            ]}
          />
          <SvTextarea label="Mensagem" placeholder="Escreva algo…" />
        </div>
      </Block>

      <Block title="Escolha">
        <div className="flex flex-wrap items-center gap-5">
          <SvCheckbox label="Checkbox" defaultChecked />
          <SvRadio name="preview-radio" label="Radio" defaultChecked />
          <SvSwitch label="Switch" defaultChecked />
        </div>
        <div className="mt-4 max-w-xs">
          <SvSlider label="Slider" defaultValue={60} />
        </div>
      </Block>

      <Block title="Chips & tags">
        <div className="flex flex-wrap items-center gap-2">
          <SvChip color="cyan">cyan</SvChip>
          <SvChip color="magenta">magenta</SvChip>
          <SvChip color="lime">lime</SvChip>
          <SvTag>tag</SvTag>
        </div>
      </Block>

      <Block title="Tabs">
        <SvTabs
          tabs={[
            { id: "a", label: "Cor", content: <p className="text-sm text-white/70">Acento é acento, não fundo.</p> },
            { id: "b", label: "Tipo", content: <p className="text-sm text-white/70">Display em caixa alta, sempre.</p> },
            { id: "c", label: "Sombra", content: <p className="text-sm text-white/70">Dura, nunca difusa.</p> },
          ]}
        />
      </Block>

      <Block title="Navegação">
        <SvBreadcrumb items={[{ label: "Design System", href: "/design-system" }, { label: "Creative" }]} />
      </Block>

      <Block title="Feedback">
        <div className="space-y-3">
          <SvAlert tone="success" title="Deu certo">Tokens sincronizados.</SvAlert>
          <SvProgress value={72} />
        </div>
      </Block>

      <Block title="Superfícies & decoração">
        <div className="flex flex-wrap items-center gap-3">
          <span className="sv-sticker">sticker</span>
          <span className="sv-sticker sv-sticker-cyan">cyan</span>
          <span className="sv-sticker sv-sticker-magenta">magenta</span>
          <span className="sv-sticker sv-sticker-lime">lime</span>
        </div>
      </Block>
    </>
  )
}

/* ---------------- Developer ---------------- */

function DeveloperKit() {
  return (
    <>
      <Block title="Hero & prompt">
        <div className="dv-hero" style={{ padding: 0 }}>
          <p className="term">
            <span className="tok-fn">const</span> dev = <span className="tok-str">&quot;Lucas&quot;</span>
          </p>
          <h3 className="dv-title" style={{ fontSize: "1.5rem" }}>
            Construo <span className="g">produtos</span> e <span className="c">experimentos</span>.
          </h3>
        </div>
      </Block>

      <Block title="Card">
        <article className="dv-card">
          <div className="flex items-center justify-between gap-2">
            <h3>Projeto exemplo</h3>
            <span className="dv-status done">★ destaque</span>
          </div>
          <p>Separação por borda, não por sombra. Raio de 12px.</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="dv-tag">TypeScript</span>
            <span className="dv-tag">Next.js</span>
            <span className="dv-tag">Supabase</span>
          </div>
          <a className="dv-link mt-3 inline-block text-sm" href="#kit">
            ❯ abrir repositório
          </a>
        </article>
      </Block>

      <Block title="Contadores">
        <div className="dv-stats">
          {[
            { n: 12, l: "projetos", c: "var(--d-green)" },
            { n: 7, l: "experimentos", c: "var(--d-cyan)" },
            { n: 34, l: "snippets", c: "var(--d-pink)" },
          ].map((s) => (
            <div key={s.l} className="dv-stat">
              <div className="n" style={{ color: s.c }}>{s.n}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Abas">
        <div className="dv-tabs">
          <button className="dv-tab" data-active="true">todos</button>
          <button className="dv-tab">web</button>
          <button className="dv-tab">cli</button>
        </div>
      </Block>

      <Block title="Paleta em uso">
        <div className="dv-chip-row">
          {[
            ["green", "--d-green"],
            ["cyan", "--d-cyan"],
            ["purple", "--d-purple"],
            ["pink", "--d-pink"],
            ["orange", "--d-orange"],
            ["yellow", "--d-yellow"],
            ["red", "--d-red"],
          ].map(([n, v]) => (
            <span key={n} className="dv-tag" style={{ color: `var(${v})`, borderColor: `var(${v})` }}>
              {n}
            </span>
          ))}
        </div>
      </Block>

      <Block title="Estado vazio">
        <div className="dv-empty">Nenhum item ainda — adicione em /admin.</div>
      </Block>
    </>
  )
}

/* ---------------- Arcane ---------------- */

function ArcaneKit() {
  return (
    <>
      <Block title="Cabeçalho">
        <div className="dp-masthead" style={{ paddingTop: 0 }}>
          <div className="dp-nameplate">
            {/* h3, não h1: isto é amostra dentro do guia, que já tem o seu h1.
                O CSS aceita h1/h2/h3 justamente para o nível ser do contexto. */}
            <h3 style={{ fontSize: "2.5rem" }}>Daily Prophet</h3>
            <p className="dp-nameplate-sub">Crônica das artes de mesa</p>
          </div>
          <hr className="dp-rule--hair" />
        </div>
      </Block>

      <Block title="Manchete & capitular">
        <p className="dp-kicker">Edição Especial</p>
        <h2 className="dp-bighead" style={{ fontSize: "2rem" }}>A REGRA QUE DESAPARECE</h2>
        <p className="dp-subhead">Como cartão e madeira viram memória</p>
        <hr className="dp-rule--double" />
        <div className="dp-lead-body">
          <p>
            <span className="dp-cap">T</span>
            odo jogo começa por uma pergunta, e a pergunta jamais é sobre o tema. Dessa pergunta nasce
            a mecânica: a peça, a carta, o dado.
          </p>
          <blockquote className="dp-pull">Um bom protótipo é feio de propósito.</blockquote>
        </div>
      </Block>

      <Block title="Figura emoldurada">
        <figure className="dp-figure" style={{ maxWidth: 320 }}>
          <div className="dp-plate">
            <div className="img-frame img-wide img-empty" role="img" aria-label="Campo de imagem" />
          </div>
          <figcaption className="dp-figcaption">Fig. I — campo de imagem no padrão 16/9.</figcaption>
        </figure>
      </Block>

      <Block title="Caixas, anúncio e fios">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="dp-box dp-box--heavy">
            <p className="dp-box-title">Números desta Casa</p>
            <p className="dp-kv"><b>Protótipos</b><span>XII+</span></p>
            <p className="dp-kv"><b>Folhas ao cesto</b><span>CDXVII</span></p>
          </div>
          <div className="dp-box">
            <p className="dp-box-title">Curiosidades</p>
            <ul><li>O «meeple» só ganhou nome em 2000.</li></ul>
          </div>
          <div className="dp-ad">
            <p className="dp-ad-head">CARTÃO DE PRIMEIRA</p>
            <p>Gramaturas de 250 a 350g, corte e vinco sob medida.</p>
            <p className="dp-ad-sign">Prelo &amp; Vinco, Lda.</p>
          </div>
        </div>
        <div className="dp-orn" aria-hidden>❦ ❧ ❦</div>
      </Block>

      <Block title="Índice">
        <nav className="dp-index">
          <span className="dp-index-item">
            <span>Laboratório de Protótipos</span>
            <span className="dp-index-dots" aria-hidden />
            <b>IV</b>
          </span>
        </nav>
      </Block>

      {/* A camada de interface. Este kit mostrava só peças editoriais — o
          realm não tinha botão, campo nem tabela, então não havia o que
          mostrar. Com `daily-prophet-ui.css` passa a haver, e o kit equipara
          finalmente os blocos que o Criativo e o _Dev sempre tiveram. */}
      <Block title="Botões — variantes e tamanhos">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="dp-btn dp-btn--primary">Publicar</button>
          <button type="button" className="dp-btn">Guardar prova</button>
          <button type="button" className="dp-btn dp-btn--ghost">Ver arquivo</button>
          <button type="button" className="dp-btn dp-btn--danger">Recolher</button>
          <button type="button" className="dp-btn" disabled>Na prensa…</button>
        </div>
        <hr className="dp-rule dp-rule--hair" />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="dp-btn dp-btn--sm">pequeno</button>
          <button type="button" className="dp-btn">médio</button>
          <button type="button" className="dp-btn dp-btn--lg">grande</button>
          <button type="button" className="dp-btn dp-btn--double">fio duplo</button>
        </div>
      </Block>

      <Block title="Campos & escolha">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="dp-field">
              <label className="dp-label" data-required="true" htmlFor="kit-nome">Nome</label>
              <input id="kit-nome" className="dp-input" placeholder="como deve sair impresso" />
            </div>
            <div className="dp-field">
              <label className="dp-label" htmlFor="kit-obs">Observações</label>
              <textarea id="kit-obs" rows={2} className="dp-input dp-input--boxed" />
              <p className="dp-help">A caixa é a exceção — texto longo pede área.</p>
            </div>
            <div className="dp-field">
              <label className="dp-label" htmlFor="kit-err">Tiragem</label>
              <input id="kit-err" className="dp-input" aria-invalid="true" defaultValue="0" />
              <p className="dp-error">Mínimo de quinhentos exemplares.</p>
            </div>
          </div>
          <div>
            <label className="dp-choice">
              <input type="checkbox" className="dp-check" defaultChecked />
              <span>Edição da manhã</span>
            </label>
            <label className="dp-choice">
              <input type="checkbox" className="dp-check" />
              <span>Classificados</span>
            </label>
            <hr className="dp-rule dp-rule--hair" />
            <label className="dp-choice">
              <input type="radio" name="kit-entrega" className="dp-check dp-check--radio" defaultChecked />
              <span>Ao domicílio</span>
            </label>
            <label className="dp-choice">
              <input type="radio" name="kit-entrega" className="dp-check dp-check--radio" />
              <span>Levantar na oficina</span>
            </label>
            <div className="dp-tabs" role="tablist" aria-label="Cadernos" style={{ marginTop: "0.9rem" }}>
              {["Manchete", "Oficina", "Anúncios"].map((c, i) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  className="dp-tab"
                  aria-selected={i === 0}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Block>

      <Block title="Selos, carimbo e assinatura">
        <div className="flex flex-wrap items-center justify-around gap-4">
          <div className="dp-seal">Prelo &amp; Vinco<br />MCMVIII</div>
          <div className="dp-seal dp-seal--ink" style={{ width: "4rem", height: "4rem" }}>Aprovado</div>
          <div className="dp-seal dp-seal--void" style={{ width: "4rem", height: "4rem" }}>Sem efeito</div>
          <div className="dp-postmark">Expedido<b>18 · VII · 26</b>Terra-2026</div>
          <div className="dp-signature" style={{ maxWidth: "12rem" }}>
            <p className="dp-autograph">L. Riboldi</p>
            <div className="dp-signature-line">
              <p className="dp-signature-name">Lucas F. Riboldi</p>
              <p className="dp-signature-role">Compositor-chefe</p>
            </div>
          </div>
        </div>
      </Block>

      <Block title="Tabela, etiquetas e marcadores">
        <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
          <table className="dp-table">
            <caption>Tiragem por caderno</caption>
            <thead>
              <tr><th>Caderno</th><th className="num">Páginas</th><th className="num">Exemplares</th></tr>
            </thead>
            <tbody>
              <tr><td>Manchete</td><td className="num">4</td><td className="num">31.000</td></tr>
              <tr><td>Mecânicas</td><td className="num">6</td><td className="num">28.400</td></tr>
              <tr><td>Classificados</td><td className="num">2</td><td className="num">31.000</td></tr>
            </tbody>
          </table>
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="dp-tag">rascunho</span>
              <span className="dp-tag">em prova</span>
              <span className="dp-tag dp-tag--ink">no prelo</span>
            </div>
            <ul className="dp-list dp-list--fleuron" style={{ marginTop: "0.7rem" }}>
              <li>Composição</li>
              <li>Impressão</li>
              <li>Expedição</li>
            </ul>
          </div>
        </div>
      </Block>

      <Block title="Letras desenhadas">
        <p style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
          <span className="dp-initial">O</span>
          compositor abre a matéria com a inicial em caixa e fecha os números em{" "}
          <span className="dp-oldstyle">1908</span> com algarismo antigo, que desce abaixo da linha
          e convive com o texto sem gritar. Em <span className="dp-sc">versalete verdadeiro</span> o
          nome da casa, e as frações saem em <span className="dp-frac">1/2</span> e{" "}
          <span className="dp-frac">3/4</span>.
        </p>
      </Block>
    </>
  )
}

/**
 * O título fica FORA do escopo (é voz do Design System, não do realm) e a
 * superfície DENTRO — assim `.dracula` e `.dp` pintam o próprio fundo.
 */
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  const scope = React.useContext(ScopeContext)
  return (
    <div className="mb-6">
      <p className="sv-heavy mb-2 text-[11px] uppercase tracking-wide text-[var(--sv-yellow)]">{title}</p>
      <div className={`overflow-hidden rounded-md border-2 border-black p-4 ${scope || "bg-[var(--sv-ink-2)]/60"}`}>
        {children}
      </div>
    </div>
  )
}
