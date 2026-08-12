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

## Pilar 1 — Linha de base mensurável

Sem número de partida não há como afirmar melhora no fim.

- [ ] `lint`, `tsc --noEmit` e `test:unit` — registrar o estado inicial
- [ ] Build de produção: tempo, número de páginas, avisos
- [ ] Peso do bundle por rota (o `build` do Next já reporta)
- [ ] Console limpo nas rotas principais dos três realms

**Pronto quando:** os números estão neste arquivo e servem de comparação.

## Pilar 2 — Revisão crítica (`REVIEW_REPORT.md`)

- [ ] `/code-review` sobre o diff da branch e sobre os módulos mais quentes
- [ ] Achados classificados: 🔴 crítico · 🟠 importante · 🟡 sugestão
- [ ] Cada achado com caminho:linha e cenário de falha concreto

**Regra:** achado sem cenário de falha reproduzível não entra no relatório.
Suspeita não verificada é o que custou três dias em 04/08.

## Pilar 3 — Acessibilidade (WCAG 2.1 AA)

- [ ] Contraste nos três realms — o jornal 1920 e o spiderverse são os
      candidatos naturais a reprovar
- [ ] Navegação por teclado: foco visível, ordem, armadilhas
- [ ] `prefers-reduced-motion` respeitado em toda animação nova e existente
- [ ] Nomes acessíveis em controles só-ícone (o player tem vários)
- [ ] Landmarks e hierarquia de headings

**Pronto quando:** as violações estão corrigidas ou registradas com
justificativa explícita de por que ficam.

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
