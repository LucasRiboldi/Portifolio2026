/* ------------------------------------------------------------------
   Os patterns do _Dev, em Dracula — composições resolvidas, uma por
   pattern do Criativo (Login, Busca, Multi-step, FAQ). Onde o Criativo
   abre um formulário, aqui é um fluxo de terminal / pipeline.
   ------------------------------------------------------------------ */
import { SubChapter, Surface } from "./dev-chapters"

/** 12 · Login / Auth — autenticação como sessão de terminal. */
export function DevPatternLogin() {
  return (
    <SubChapter
      id="pattern-login"
      n="10.1"
      title="Pattern · Login / Auth"
      lead="Autenticar é abrir uma sessão. Sem card centrado com sombra: um prompt pede o token, o segredo é mascarado, e o exit 0 confirma."
    >
      <Surface>
        <div className="font-mono text-xs leading-relaxed">
          <p>
            <span className="text-[var(--d-green)]">➜</span>{" "}
            <span className="text-[var(--d-cyan)]">~</span> auth login
          </p>
          <p className="text-[var(--d-comment)]">email: lucas@dev.io</p>
          <p className="text-[var(--d-comment)]">
            token: <span className="text-[var(--d-fg)]">••••••••••••</span>
          </p>
          <p className="mt-1 text-[var(--d-green)]">✓ autenticado — sessão aberta (exp 24h)</p>
          <p className="mt-2">
            <span className="text-[var(--d-green)]">➜</span>{" "}
            <span className="text-[var(--d-cyan)]">~</span> <span className="dv-caret" />
          </p>
        </div>
      </Surface>
      <p className="mt-2 font-mono text-[10px] text-[var(--d-comment)]">
        {"// erro → exit 1: 'token inválido', foco volta ao campo"}
      </p>
    </SubChapter>
  )
}

/** 13 · Busca & filtros — ver e alternar no mesmo lugar. */
export function DevPatternSearch() {
  return (
    <SubChapter
      id="pattern-busca"
      n="10.2"
      title="Pattern · Busca & filtros"
      lead="Sem drawer, sem modal: campo, filtros ligados por data-on e a contagem do resultado. O dev quer ver e alternar sem sair da página."
    >
      <Surface>
        <input className="dv-search w-full font-mono text-xs" placeholder="filtrar projetos…" readOnly />
        <div className="dv-controls mt-3 flex flex-wrap items-center gap-2">
          <button type="button" className="dv-filter font-mono text-[10px]" data-on="true">todos</button>
          <button type="button" className="dv-filter font-mono text-[10px]">web</button>
          <button type="button" className="dv-filter font-mono text-[10px]">cli</button>
          <button type="button" className="dv-filter font-mono text-[10px]">lab</button>
          <span className="dv-count ml-auto">7 de 7</span>
        </div>
      </Surface>
    </SubChapter>
  )
}

/** 14 · Multi-step — o formulário multi-etapa é um pipeline de build. */
export function DevPatternMultiStep() {
  const steps = [
    ["install", "done"],
    ["build", "done"],
    ["test", "running"],
    ["deploy", "idle"],
  ] as const
  const color: Record<string, string> = {
    done: "var(--d-green)",
    running: "var(--d-cyan)",
    idle: "var(--d-comment)",
  }
  return (
    <SubChapter
      id="pattern-multi-step"
      n="10.3"
      title="Pattern · Multi-step"
      lead="A jornada em etapas é um pipeline: cada passo tem um estado (done/running/idle), a barra mostra onde se está, e não se pula etapa quebrada."
    >
      <Surface>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {steps.map(([name, st], i) => (
            <span key={name} className="flex items-center gap-2">
              <span className="flex items-center gap-1.5" style={{ color: color[st] }}>
                <span
                  className="grid size-5 place-items-center rounded-full border text-[10px]"
                  style={{ borderColor: color[st] }}
                >
                  {st === "done" ? "✓" : i + 1}
                </span>
                {name}
              </span>
              {i < steps.length - 1 && <span className="text-[var(--d-current)]">──</span>}
            </span>
          ))}
        </div>
        <div className="learn-bar mt-4"><span style={{ width: "62%", background: "var(--d-cyan)" }} /></div>
        <p className="mt-2 font-mono text-[10px] text-[var(--d-comment)]">{"// "}passo 3 de 4 — test em execução</p>
      </Surface>
    </SubChapter>
  )
}

/** 15 · FAQ — perguntas como blocos de comentário que abrem. */
export function DevPatternFaq() {
  const qa = [
    ["por que 3 realms?", "cada perfil tem gramática visual própria; um só sistema mentiria sobre a fonte."],
    ["posso linkar direto uma seção?", "sim — cada capítulo tem #id, ex: /realms/developer#tokens."],
    ["as amostras são reais?", "sim: usam as classes de dracula.css. se uma quebra, quebra aqui."],
  ]
  return (
    <SubChapter
      id="pattern-faq"
      n="10.4"
      title="Pattern · FAQ"
      lead="Pergunta é uma linha de comentário; a resposta abre abaixo. Sem ícone de acordeão desenhado — o [+]/[−] basta."
    >
      <Surface>
        <div className="divide-y divide-[var(--d-current)] font-mono text-xs">
          {qa.map(([q, a], i) => (
            <div key={q} className="py-2">
              <p className="flex gap-2 text-[var(--d-fg)]">
                <span className="text-[var(--d-purple)]">{i === 0 ? "[−]" : "[+]"}</span>
                <span className="text-[var(--d-comment)]">{"// "}{q}</span>
              </p>
              {i === 0 && <p className="mt-1 pl-6 text-[var(--d-fg)]/85">{a}</p>}
            </div>
          ))}
        </div>
      </Surface>
    </SubChapter>
  )
}
