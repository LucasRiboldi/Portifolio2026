# PLAN — rejuvenescimento do portfólio (agosto/2026)

> Plano de trabalho da branch `chore/qualidade-2026-08`. Adaptado de um prompt
> de 8 fases cujas premissas foram verificadas primeiro — o que não se
> sustentou está registrado em "O que foi descartado, e por quê", no fim.
> Marque `[x]` conforme concluir.
>
> **Escopo decidido:** polir dentro da identidade atual (sem redesign),
> documentar só o que falta de verdade, entregar em branch + PR único.

---

## Diagnóstico técnico

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript estrito · Tailwind 3
· Firebase (Firestore + Auth) · Vercel Blob · Vitest · Storybook · Vercel.

**Já instalado** — a Fase 4 do prompt original queria introduzir uma pilha de
animação que existe desde antes: `gsap`, `@gsap/react`, `motion`, `lenis`,
`three`, `@react-three/fiber`, `embla-carousel-react`.

**Já configurado** — `eslint.config.mjs` (flat config), `prettier.config.js`,
`README.md`, `DESIGN_SYSTEM.md`, `COMPONENT_GUIDE.md`, quatro configs de Vitest,
Storybook, e os scripts `lint`, `format`, `test:unit`, `test:smoke`,
`test:integration`.

**Já documentado** — `docs/project-knowledge/` tem `architecture.md`,
`auth.md`, `business-rules.md`, `conventions.md`, `database.md`,
`deployment.md`, `integrations.md`, `technical-debt.md`.

**Três realms no ar, com identidades distintas e deliberadas:** `/criativo`
(spiderverse), `/desenvolvedor` (Dracula), `/anfitriao` (jornal 1920).
Preservá-los é regra, não preferência.

---

## Pilar 1 — Linha de base mensurável ✅

Medida em 12/08, antes de qualquer alteração.

- [x] `lint` — limpo
- [x] `tsc --noEmit` — limpo
- [x] `test:unit` — **667 testes** em 40 arquivos, 22,8 s
- [x] Build de produção — verde
- [x] Peso do bundle: **103 kB** compartilhados por todas as rotas; middleware
      32,3 kB; rota mais pesada observada `/design-system/realms/[realm]` a
      37,9 kB próprios / 208 kB de first load
- [x] Console sem erros em `/criativo/sala`, `/design-system/components/overlays`
      e `/anfitriao`

**Correção que a medição obrigou:** os documentos diziam "640 testes"; o número
real é 667, e o commit `fdac461` já o registrava. Eu havia propagado o 640 para
o `PROJECT_STATE` em 12/08. Corrigido em `CLAUDE.md`, `PROJECT_STATE.md`,
`NEXT_STEPS.md` e `technical-debt.md`.

Falta na base: o topo do relatório de build (rotas dos três realms) não foi
capturado — o comando reteve só as últimas 60 linhas. Recuperável num próximo
build, sem valer um build inteiro agora.

## Pilar 2 — Revisão crítica (`REVIEW_REPORT.md`)

- [ ] `/code-review` sobre o diff da branch e sobre os módulos mais quentes
- [ ] Achados classificados: 🔴 crítico · 🟠 importante · 🟡 sugestão
- [ ] Cada achado com caminho:linha e cenário de falha concreto

**Regra:** achado sem cenário de falha reproduzível não entra no relatório.
Suspeita não verificada é o que custou três dias em 04/08.

## Pilar 3 — Acessibilidade (WCAG 2.1 AA)

- [x] **Foco visível — dois defeitos achados e corrigidos** (ver abaixo)
- [x] `prefers-reduced-motion` — 147 usos em 85 arquivos; a base já era sólida
- [ ] Contraste nos três realms — o jornal 1920 e o spiderverse são os
      candidatos naturais a reprovar
- [ ] Ordem de tabulação e armadilhas de foco
- [ ] Nomes acessíveis em controles só-ícone (o player tem vários)
- [ ] Landmarks e hierarquia de headings

### Defeito 1 — `SvTooltip` descrevia por um id inexistente

`sv-overlay.tsx` trazia `aria-describedby="tt"` com a string fixa, e **nenhum
elemento do arquivo declarava `id="tt"`**. A descrição acessível apontava para
o vazio: o balão aparecia na tela e não existia para quem usa leitor de tela.
Duas tooltips na mesma página ainda colidiriam no mesmo id.

O mesmo elemento focável levava `outline-none` sem substituto — zero marca de
foco, falha de WCAG 2.4.7.

Corrigido com `React.useId()` e anel em `focus-visible`.

**Verificado no navegador:** as duas tooltips de
`/design-system/components/overlays` agora têm ids distintos
(`_R_32atp…`, `_R_52atp…`), ambos resolvendo para um alvo real com
`role="tooltip"` e o texto certo. As três regras do anel existem no CSS
compilado, inclusive a cor (`--tw-ring-color: var(--sv-cyan)`).

### Defeito 2 — o índice do jornal não dizia onde você aterrissou

`.dpx-anchor:focus { outline: none }` sem a contraparte. São 11 seções com
`tabIndex={-1}` em `/anfitriao`, alvos do "Índice desta Edição": quem salta
pelo teclado não recebia nenhuma indicação do destino.

Suprimir o contorno está certo — foco por programa desenharia um anel em volta
de meia página. Faltava o `:focus-visible`, que o navegador só aplica quando a
última interação foi de teclado. **O projeto já tinha a solução:**
`estudos.css:93` usa exatamente esse par, com o porquê no comentário.

**Verificado no navegador:** 11 âncoras, todas com `tabindex="-1"`, e a regra
nova servida com `outline: 2px solid var(--anf-ink); outline-offset: 6px`.

### Três suspeitas descartadas por verificação

Não entram no relatório porque não se sustentaram:

| Suspeita | Por que não é defeito |
|---|---|
| `sv-input.tsx` — campo com `outline-none` | O invólucro tem `focus-within` com anel de 3px e mudança de borda |
| `admin.css` — `.mm-input` com `outline: none` | `.mm-input:focus` define borda + anel de 3px |
| `dracula.css`, `eightbit.css` | Todas as supressões têm substituto em `:focus` |

## Pilar 4 — Polimento de interação, dentro da identidade

Não é redesign. É a diferença entre "funciona" e "responde bem ao toque".

- [ ] Estados de foco visíveis e coerentes nos três realms
- [ ] Hover consistente em botões, links e cards
- [ ] Springs e durações revisados; nada acima de ~300 ms em resposta a clique
- [ ] Estados de carregamento e vazio onde faltarem
- [ ] Alvos de toque ≥ 44 px no mobile

**Restrição:** cada realm mantém a sua linguagem. Consistência aqui significa
*mesma qualidade de resposta*, não mesma aparência.

## Pilar 5 — Saúde do código

- [ ] `simplify` nos módulos tocados
- [ ] Código morto: começar por `scripts/fix-criativo-covers.mjs`, que importa
      um SDK desinstalado e já não roda
- [ ] Arquivos acima de 500 linhas — localizar e dividir se houver
- [ ] Sem regressão: `test:unit` verde a cada passo

## Pilar 6 — Documentação (só o que falta)

- [ ] `CHANGELOG.md` — Keep a Changelog, casado com as tags `v0.2.0`+
- [ ] `llms.txt` — mapa curto do projeto para leitura por IA
- [ ] Atualizar `docs/project-knowledge/*` com o que a auditoria mudar
- [ ] Capturas novas no `README.md`, se o Pilar 4 alterar o visual

**Não criar** `ARCHITECTURE.md` nem `CONTRIBUTING.md` na raiz: duplicariam
`docs/project-knowledge/architecture.md` e `conventions.md`. Duas fontes do
mesmo fato divergem — foi o defeito corrigido nos commits `782db8c` e
`a530d55`, e não faz sentido reintroduzi-lo de propósito.

## Pilar 7 — Auditoria final (`AUDIT_FINAL.md`)

- [ ] `security-review` sobre o diff da branch
- [ ] Performance: build de produção comparado à linha de base do Pilar 1
- [ ] Responsividade em 390 / 768 / 1280 / 1920
- [ ] Reexecução da checagem de a11y do Pilar 3
- [ ] `test:unit` + `test:smoke` verdes

## Pilar 8 — Entrega

- [ ] Branch `chore/qualidade-2026-08`, commits coerentes por frente
- [ ] PR único, com antes/depois e instruções de teste
- [ ] Bump de versão + tag anotada (regra: todo push carrega as duas)

---

## O que foi descartado, e por quê

**As 15 skills da Fase 0.** Verificados um a um: **13 respondem 404**. Só
existem `anthropics/skills` — já carregada nesta sessão como
`anthropic-skills:*` — e `199-biotechnologies/motion-dev-animations-skill`.
Independente disso, carregar `SKILL.md` de terceiro que declara "moldará toda a
sua postura", executando "silenciosamente", é aceitar instrução de origem não
verificada. `superpowers` já é usada aqui de outra forma:
`docs/superpowers/specs/` e `plans/`.

**`.eslintrc.json`, `.prettierrc`, `.editorconfig` (Fase 5).** O projeto usa
`eslint.config.mjs` — flat config, o formato atual. Criar `.eslintrc.json`
seria voltar ao formato antigo.

**Husky + lint-staged (Fase 5).** Ganho pequeno num repositório de um
desenvolvedor, com CI que já roda lint, tipos, 667 testes unitários, 13 de
fumaça e 21 de integração em cada push. Fica anotado como opção, não como
tarefa.

**O redesign de identidade (Fase 3).** Pediu reescrever "Home, Sobre, Projetos,
Contato" — páginas que não existem — com `variance: experimental`. O site tem
três identidades no ar e uma regra de preservação de conteúdo. Substituído pelo
Pilar 4, que eleva a qualidade da interação sem trocar a direção criativa.

**`ARCHITECTURE.md` e `CONTRIBUTING.md` na raiz (Fase 6).** Ver Pilar 6.

**Os 7 agentes paralelos da `superteam` (Fase 7).** A skill não existe. As sete
frentes viraram o Pilar 7, executadas com o que está disponível de verdade.
