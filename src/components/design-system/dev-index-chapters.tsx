/* ------------------------------------------------------------------
   Os capítulos do índice que faltavam ao guia de "O _Dev".
   ------------------------------------------------------------------
   O índice do Design System é o mesmo nos três realms (architecture.ts),
   mas cada um o preenche na sua língua. Aqui estão os oito tópicos que
   ainda apareciam apagados na sidebar do _Dev — agora escritos como o
   _Dev fala: config, régua de colunas, glifos de terminal, fluxo de
   comando, git log. Nada de "template de pricing" nem ilustração de
   vazio: o vocabulário é o do editor.

   Reaproveita `Chapter` e `Surface` de dev-chapters.tsx — mesmos tokens
   e classes reais de dracula.css, dentro do escopo `.dracula`.

   Os `id` batem 1:1 com architecture.ts (foundations, grid, iconography,
   content-design, resources, changelog) para a âncora do índice cair no
   lugar certo — são renderizados direto, sem wrapper.

   `patterns` e `templates` são exceção: em developer-guide.tsx eles vivem
   dentro de um <Group id="patterns"|"templates"> junto com as galerias
   dedicadas (DevPatternLogin, DevTplLanding…), porque a seção reúne mais
   de uma fonte. Por isso os Chapter abaixo levam id PRÓPRIO
   (patterns-cmdk, templates-routes) — repetir o id da seção aqui duplicava
   a âncora (dois elementos com o mesmo id é HTML inválido).
   ------------------------------------------------------------------ */

import { Chapter, SubChapter, Surface } from "./dev-chapters"

/* ---------------- 02 · foundations ---------------- */

/** As decisões de base, ditas como um arquivo de config: chave = valor. */
const FOUNDATIONS = [
  { chave: "base", valor: "monospace-first", nota: "o corpo lê como código: fonte mono, ligaduras off" },
  { chave: "ritmo", valor: "8px", nota: "toda distância é múltiplo de 8 — 4 só em detalhe fino" },
  { chave: "medida", valor: "46rem", nota: "largura de leitura, ~72ch, como um wrap de editor" },
  { chave: "raio", valor: "12px", nota: "--d-radius; card e input; nunca pill em superfície" },
  { chave: "traço", valor: "1px --d-current", nota: "a borda é a única separação — sem sombra pesada" },
  { chave: "densidade", valor: "compacta", nota: "IDE, não landing: informação por pixel, não respiro" },
]

/* ---------------- 06 · grid ---------------- */

const BREAKPOINTS = [
  { nome: "sm", px: "640px", col: "4", nota: "telefone deitado" },
  { nome: "md", px: "768px", col: "8", nota: "tablet" },
  { nome: "lg", px: "1024px", col: "12", nota: "índice fixa ao lado" },
  { nome: "xl", px: "1120px", col: "12", nota: "--dv-container: trava a medida" },
]

/* ---------------- 07 · iconography ---------------- */

/**
 * No _Dev o ícone é glifo de terminal, não pictograma desenhado: o mesmo
 * caractere que aparece no build. Peso e grade vêm da fonte mono.
 */
/* ---------------- 13 · content design ---------------- */

const VOZ = [
  { evite: "Ops! Algo deu errado :(", prefira: "erro: build falhou em 2 arquivos" },
  { evite: "Clique aqui para começar", prefira: "➜ npm run dev" },
  { evite: "Nenhum resultado encontrado", prefira: "// nenhum projeto com esse filtro" },
  { evite: "Salvo com sucesso!", prefira: "✓ salvo · 3 arquivos" },
  { evite: "Tem certeza que deseja sair?", prefira: "descartar alterações não commitadas?" },
]

/* ---------------- 15 · resources ---------------- */

const RESOURCES = [
  { cmd: "src/styles/dracula.css", nota: "o tema, escopado em .dracula", tipo: "css" },
  { cmd: "scripts/export-tokens.mjs", nota: "gera tokens.json a partir do código", tipo: "node" },
  { cmd: "npm run storybook", nota: "kit isolado, componente a componente", tipo: "cmd" },
  { cmd: "draculatheme.com", nota: "tema oficial, upstream das cores", tipo: "link" },
]

/* ---------------- 16 · changelog ---------------- */

const CHANGELOG = [
  { hash: "ae25f27", tag: "v0.4.0", tipo: "feat", msg: "índice do _Dev completo: foundations → changelog" },
  { hash: "e3e1d7b", tag: "v0.3.0", tipo: "feat", msg: "portal de entrada dos 3 multiversos" },
  { hash: "4abbaed", tag: "v0.2.1", tipo: "refactor", msg: "rotas centralizadas, realmFromPath unificado" },
  { hash: "b65a4d3", tag: "v0.2.0", tipo: "chore", msg: "Design System separado em três perfis" },
]

const TIPO_COR: Record<string, string> = {
  feat: "var(--d-green)",
  refactor: "var(--d-purple)",
  chore: "var(--d-comment)",
  fix: "var(--d-orange)",
}

/**
 * Cada seção do índice como uma entrada nomeada, para o corpo do _Dev
 * (developer-guide.tsx) poder posicioná-las na ordem do índice — intercaladas
 * com as seções do scaffold compartilhado (introduction, tokens, colors…).
 */
export const DEV_INDEX: Record<string, React.ReactNode> = {
  foundations: (
      <Chapter
        id="foundations"
        n="02"
        title="Foundations"
        lead={
          <>
            As decisões de base ditas como um arquivo de config: chave{" "}
            <span className="text-[var(--d-pink)]">=</span> valor. Antes de cor e componente vêm o
            ritmo, a medida e a densidade — e a primeira decisão do _Dev é que o corpo lê como
            código, não como revista.
          </>
        }
      >
        <Surface>
          <div className="font-mono text-xs leading-relaxed">
            <p className="mb-2 text-[var(--d-comment)]">{"# _dev.foundations"}</p>
            {FOUNDATIONS.map((f) => (
              <p key={f.chave} className="flex flex-wrap items-baseline gap-x-2 py-0.5">
                <span className="text-[var(--d-cyan)]">{f.chave}</span>
                <span className="text-[var(--d-pink)]">=</span>
                <span className="text-[var(--d-yellow)]">{f.valor}</span>
                <span className="text-[var(--d-comment)]">{"// "}{f.nota}</span>
              </p>
            ))}
          </div>
        </Surface>
      </Chapter>

  ),
  grid: (
      <Chapter
        id="grid"
        n="06"
        title="Grid"
        lead={
          <>
            A grelha do _Dev é a régua de colunas do editor: uma medida travada em{" "}
            <code className="text-[var(--sv-cyan)]">1120px</code> e breakpoints escritos como as{" "}
            <em>media queries</em> que já existem no CSS. Sem colunas mágicas — a coluna é o guia de
            80/120 caracteres.
          </>
        }
      >
        <Surface>
          {/* régua monoespaçada: guia de coluna do terminal */}
          <div className="overflow-x-auto font-mono text-[10px] text-[var(--d-comment)]">
            <p className="whitespace-pre">
              {"col  1        10        20        30        40        50        60      72"}
            </p>
            <p className="whitespace-pre text-[var(--d-current)]">
              {"     " + "·".repeat(66)}
            </p>
            <p className="whitespace-pre">
              <span className="text-[var(--d-green)]">     |</span>
              <span className="text-[var(--d-fg)]">{" largura de leitura — ~72ch / 46rem "}</span>
              <span className="text-[var(--d-orange)]">|</span>
            </p>
          </div>
        </Surface>

        <div className="mt-3">
          <Surface>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="text-[var(--d-comment)]">
                    <th className="py-1 pr-3 font-normal">breakpoint</th>
                    <th className="py-1 pr-3 font-normal">min-width</th>
                    <th className="py-1 pr-3 font-normal">colunas</th>
                    <th className="py-1 font-normal">nota</th>
                  </tr>
                </thead>
                <tbody>
                  {BREAKPOINTS.map((b) => (
                    <tr key={b.nome} className="border-t border-[var(--d-current)]">
                      <td className="py-1.5 pr-3 text-[var(--d-pink)]">{b.nome}</td>
                      <td className="py-1.5 pr-3 text-[var(--d-yellow)]">{b.px}</td>
                      <td className="py-1.5 pr-3 text-[var(--d-fg)]">{b.col}</td>
                      <td className="py-1.5 text-[var(--d-comment)]">{b.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </div>
      </Chapter>

  ),
  /* `iconography` mudou-se para dev-icons-motion.tsx — o capítulo ganhou
     grade, alinhamento óptico e regras de acessibilidade. */
  patterns: (
      <SubChapter
        id="patterns-cmdk"
        n="10.5"
        title="Patterns"
        lead={
          <>
            Composição resolvida, na forma do _Dev: um <strong>command palette</strong>. Onde o
            Criativo abre um menu, aqui se digita. O padrão é sempre o mesmo — atalho, campo, lista
            filtrada, ação — porque é como o dev já navega o próprio editor.
          </>
        }
      >
        <Surface>
          <div className="mx-auto max-w-md rounded-lg border border-[var(--d-current)] bg-[var(--d-bg-2)] p-3">
            <div className="flex items-center gap-2 border-b border-[var(--d-current)] pb-2">
              <span className="font-mono text-xs text-[var(--d-purple)]">⌘K</span>
              <span className="font-mono text-xs text-[var(--d-fg)]">buscar projeto</span>
              <span className="dv-caret ml-0.5" />
            </div>
            <ul className="mt-2 space-y-0.5 font-mono text-xs">
              <li className="flex items-center justify-between rounded bg-[var(--d-current)] px-2 py-1.5 text-[var(--d-fg)]">
                <span>
                  <span className="text-[var(--d-green)]">➜</span> portfolio-2026
                </span>
                <span className="text-[10px] text-[var(--d-comment)]">↵ abrir</span>
              </li>
              <li className="flex items-center justify-between px-2 py-1.5 text-[var(--d-comment)]">
                <span>
                  <span className="text-[var(--d-comment)]">➜</span> daily-prophet-engine
                </span>
                <span className="text-[10px]">web</span>
              </li>
              <li className="flex items-center justify-between px-2 py-1.5 text-[var(--d-comment)]">
                <span>
                  <span className="text-[var(--d-comment)]">➜</span> sports-widget
                </span>
                <span className="text-[10px]">lab</span>
              </li>
            </ul>
          </div>
        </Surface>
      </SubChapter>

  ),
  templates: (
      <SubChapter
        id="templates-routes"
        n="11.9"
        title="Templates"
        lead={
          <>
            As páginas inteiras que o kit monta — listadas como arquivos, porque é o que são. Cada
            uma vive de verdade sob <code className="text-[var(--sv-cyan)]">/desenvolvedor</code>; o
            template não é maquete, é a rota.
          </>
        }
      >
        <Surface>
          <div className="font-mono text-xs">
            {[
              ["landing.tsx", "/desenvolvedor", "hero + stats + grid de projetos", "var(--d-green)"],
              ["projetos.tsx", "/desenvolvedor/projetos", "busca + filtros + estados", "var(--d-cyan)"],
              ["devlog.tsx", "/desenvolvedor/devlog", "timeline versionada", "var(--d-purple)"],
              ["learn.tsx", "/desenvolvedor/learn", "trilhas + gamificação", "var(--d-orange)"],
            ].map(([file, rota, desc, cor]) => (
              <div
                key={file}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-[var(--d-current)] py-2 last:border-0"
              >
                <span style={{ color: cor as string }}>{file}</span>
                <span className="text-[var(--d-yellow)]">{rota}</span>
                <span className="text-[var(--d-comment)]">{"// "}{desc}</span>
              </div>
            ))}
          </div>
        </Surface>
      </SubChapter>

  ),
  "content-design": (
      <Chapter
        id="content-design"
        n="13"
        title="Content Design"
        lead={
          <>
            A voz do _Dev é a do compilador: minúscula, terse, imperativa. Não pede desculpa nem usa
            emoji de alívio — diz <em>o quê</em>, <em>onde</em> e <em>quantos</em>. O erro é uma
            mensagem de log, não um pop-up simpático.
          </>
        }
      >
        <Surface>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-[var(--d-comment)]">
                  <th className="py-1 pr-4 font-normal">✗ evite</th>
                  <th className="py-1 font-normal">✓ prefira</th>
                </tr>
              </thead>
              <tbody>
                {VOZ.map((v) => (
                  <tr key={v.prefira} className="border-t border-[var(--d-current)] align-top">
                    <td className="py-1.5 pr-4 text-[var(--d-red)] line-through decoration-[var(--d-current)]">
                      {v.evite}
                    </td>
                    <td className="py-1.5 text-[var(--d-green)]">{v.prefira}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </Chapter>

  ),
  resources: (
      <Chapter
        id="resources"
        n="15"
        title="Resources"
        lead={
          <>
            Recurso, no _Dev, é <strong>arquivo e comando</strong> — não um botão de download.
            Copia-se o caminho, roda-se o script. Cada linha abaixo é executável ou aponta para o
            código real.
          </>
        }
      >
        <Surface>
          <div className="space-y-1.5">
            {RESOURCES.map((r) => (
              <div
                key={r.cmd}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded border border-[var(--d-current)] bg-[var(--d-bg-2)] px-3 py-2"
              >
                <span className="rounded bg-[var(--d-current)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--d-comment)]">
                  {r.tipo}
                </span>
                <code className="font-mono text-xs text-[var(--d-cyan)]">{r.cmd}</code>
                <span className="text-[10px] text-[var(--d-comment)]">{"// "}{r.nota}</span>
              </div>
            ))}
          </div>
        </Surface>
      </Chapter>

  ),
  changelog: (
      <Chapter
        id="changelog"
        n="16"
        title="Changelog"
        lead={
          <>
            O histórico do _Dev é literalmente um <code className="text-[var(--sv-cyan)]">git log</code>{" "}
            com <em>semver</em>: hash, tag, tipo e a mensagem. Documentar versão em prosa é reescrever
            o que o próprio repositório já registra — aqui a fonte é o commit.
          </>
        }
      >
        <Surface>
          <div className="font-mono text-[11px] leading-relaxed">
            {CHANGELOG.map((c) => (
              <div key={c.hash} className="flex flex-wrap items-baseline gap-x-2 py-1">
                <span className="text-[var(--d-orange)]">{c.hash}</span>
                <span className="rounded bg-[var(--d-current)] px-1.5 text-[10px] text-[var(--d-yellow)]">
                  {c.tag}
                </span>
                <span style={{ color: TIPO_COR[c.tipo] ?? "var(--d-fg)" }}>{c.tipo}:</span>
                <span className="text-[var(--d-fg)]">{c.msg}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] text-[var(--d-comment)]">
            {"// git log --oneline --decorate — fonte: o repositório"}
          </p>
        </Surface>
      </Chapter>
  ),
}

/** Conveniência: todas as seções do índice do _Dev, na ordem de declaração. */
export function DevIndexChapters() {
  return <>{Object.values(DEV_INDEX)}</>
}
