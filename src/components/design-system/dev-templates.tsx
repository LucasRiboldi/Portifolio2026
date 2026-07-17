/* ------------------------------------------------------------------
   Os templates do _Dev, em Dracula — páginas inteiras montadas com o
   kit, uma por template do Criativo (Landing, Dashboard, Artigo,
   Pricing, Perfil, Docs, Changelog, Coming soon). Mockups compactos,
   todos com as classes reais do realm.
   ------------------------------------------------------------------ */
import { Chapter, Surface } from "./dev-chapters"

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-[var(--d-current)] bg-[var(--d-bg)] p-3">
      <p className="mb-2 font-mono text-[10px] text-[var(--d-comment)]">{label}</p>
      {children}
    </div>
  )
}

const bar = (w: string, c = "var(--d-current)") => (
  <span className="block h-2 rounded" style={{ width: w, background: c }} />
)

/** 16 · Landing */
export function DevTplLanding() {
  return (
    <Chapter id="tpl-landing" n="16" title="Template · Landing" lead="A home do dev: hero com prompt, contadores e grade de projetos.">
      <Surface>
        <Frame label="landing.tsx · /desenvolvedor">
          <div className="dv-hero !mt-0 !p-3">
            <p className="term font-mono text-[10px]"><span className="tok-fn">ship</span>()</p>
            <h1 className="font-mono !text-lg"><span className="g">código</span> <span className="p">que roda</span>.</h1>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["12", "7", "31"].map((n) => (
              <div key={n} className="rounded border border-[var(--d-current)] p-2 text-center font-mono text-sm text-[var(--d-green)]">{n}</div>
            ))}
          </div>
        </Frame>
      </Surface>
    </Chapter>
  )
}

/** 17 · Dashboard */
export function DevTplDashboard() {
  return (
    <Chapter id="tpl-dashboard" n="17" title="Template · Dashboard" lead="Painel de controle: sidebar de rotas, faixa de métricas, tabela de builds.">
      <Surface>
        <Frame label="dashboard.tsx">
          <div className="flex gap-2">
            <div className="w-20 shrink-0 space-y-1.5">{bar("100%")}{bar("70%")}{bar("85%", "var(--d-purple)")}</div>
            <div className="flex-1 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {["cpu", "mem", "req"].map((m) => (
                  <div key={m} className="rounded border border-[var(--d-current)] p-1.5 text-center font-mono text-[10px] text-[var(--d-cyan)]">{m}</div>
                ))}
              </div>
              <div className="space-y-1.5">{bar("90%")}{bar("60%")}{bar("75%")}</div>
            </div>
          </div>
        </Frame>
      </Surface>
    </Chapter>
  )
}

/** 18 · Artigo */
export function DevTplArticle() {
  return (
    <Chapter id="tpl-artigo" n="18" title="Template · Artigo" lead="O devlog longo: título, metadados e corpo com blocos de código (.dv-prose).">
      <Surface>
        <Frame label="article.tsx · /devlog/[slug]">
          <p className="font-mono text-sm text-[var(--d-cyan)]">Como separei o DS em 3 realms</p>
          <p className="font-mono text-[10px] text-[var(--d-comment)]">2026-07-16 · 6 min</p>
          <div className="mt-2 space-y-1.5">{bar("100%")}{bar("95%")}</div>
          <pre className="mt-2 rounded border border-[var(--d-current)] bg-[var(--d-bg-2)] p-2 font-mono text-[10px] text-[var(--d-green)]">const realms = 3</pre>
        </Frame>
      </Surface>
    </Chapter>
  )
}

/** 19 · Pricing */
export function DevTplPricing() {
  const plans = [
    ["free", "$0", "var(--d-comment)"],
    ["pro", "$12", "var(--d-purple)"],
    ["team", "$40", "var(--d-cyan)"],
  ] as const
  return (
    <Chapter id="tpl-pricing" n="19" title="Template · Pricing" lead="Planos como tiers de conta: três colunas, o do meio destacado pela borda acesa.">
      <Surface>
        <div className="grid grid-cols-3 gap-2">
          {plans.map(([name, price, c], i) => (
            <div key={name} className="rounded-[10px] border p-3 text-center" style={{ borderColor: i === 1 ? "var(--d-purple)" : "var(--d-current)" }}>
              <p className="font-mono text-[10px] uppercase text-[var(--d-comment)]">{name}</p>
              <p className="font-mono text-lg" style={{ color: c }}>{price}</p>
              <p className="mt-1 font-mono text-[9px] text-[var(--d-comment)]">/mês</p>
            </div>
          ))}
        </div>
      </Surface>
    </Chapter>
  )
}

/** 20 · Perfil */
export function DevTplProfile() {
  return (
    <Chapter id="tpl-perfil" n="20" title="Template · Perfil" lead="A página do dev: avatar mono, bio, stack em tags e heatmap de contribuição.">
      <Surface>
        <Frame label="profile.tsx">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--d-purple)] font-mono text-sm text-[var(--d-bg)]">LR</span>
            <div>
              <p className="font-mono text-sm text-[var(--d-fg)]">@lucasriboldi</p>
              <p className="font-mono text-[10px] text-[var(--d-comment)]">full-stack · Dracula enjoyer</p>
            </div>
          </div>
          <div className="dv-chip-row mt-2"><span className="dv-tag">next</span><span className="dv-tag">ts</span><span className="dv-tag">rust</span></div>
          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="size-2 rounded-[2px]" style={{ background: i % 4 === 0 ? "var(--d-green)" : "var(--d-current)" }} />
            ))}
          </div>
        </Frame>
      </Surface>
    </Chapter>
  )
}

/** 21 · Documentação */
export function DevTplDocs() {
  return (
    <Chapter id="tpl-docs" n="21" title="Template · Documentação" lead="Docs técnica: índice à esquerda, conteúdo com code fences, âncoras por seção.">
      <Surface>
        <Frame label="docs.tsx">
          <div className="flex gap-3">
            <div className="w-20 shrink-0 space-y-1 font-mono text-[10px]">
              <p className="text-[var(--d-purple)]"># start</p>
              <p className="text-[var(--d-comment)]"># api</p>
              <p className="text-[var(--d-comment)]"># cli</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {bar("100%")}{bar("80%")}
              <pre className="rounded border border-[var(--d-current)] bg-[var(--d-bg-2)] p-1.5 font-mono text-[10px] text-[var(--d-green)]">npm i @lr/ds</pre>
            </div>
          </div>
        </Frame>
      </Surface>
    </Chapter>
  )
}

/** 22 · Changelog */
export function DevTplChangelog() {
  return (
    <Chapter id="tpl-changelog" n="22" title="Template · Changelog" lead="Histórico versionado: um git log com semver, tag e tipo de commit.">
      <Surface>
        <div className="font-mono text-[11px] leading-relaxed">
          {[["v0.4.0", "feat", "índice do _Dev completo", "var(--d-green)"], ["v0.3.0", "feat", "portal dos 3 multiversos", "var(--d-green)"], ["v0.2.1", "refactor", "rotas centralizadas", "var(--d-purple)"]].map(([tag, tipo, msg, c]) => (
            <div key={tag} className="flex flex-wrap items-baseline gap-2 py-1">
              <span className="rounded bg-[var(--d-current)] px-1.5 text-[10px] text-[var(--d-yellow)]">{tag}</span>
              <span style={{ color: c as string }}>{tipo}:</span>
              <span className="text-[var(--d-fg)]">{msg}</span>
            </div>
          ))}
        </div>
      </Surface>
    </Chapter>
  )
}

/** 23 · Coming soon */
export function DevTplComingSoon() {
  return (
    <Chapter id="tpl-coming-soon" n="23" title="Template · Coming soon" lead="A página de espera do dev: um build em andamento, não um contador com flores.">
      <Surface>
        <div className="dv-empty !mt-0">
          <p className="font-mono text-xs text-[var(--d-comment)]">{"// "}deploy agendado</p>
          <p className="mt-1 font-mono text-sm text-[var(--d-fg)]">
            <span className="text-[var(--d-cyan)]">building</span> <span className="dv-caret" />
          </p>
          <div className="learn-bar mx-auto mt-3 max-w-[200px]"><span style={{ width: "45%", background: "var(--d-purple)" }} /></div>
        </div>
      </Surface>
    </Chapter>
  )
}
