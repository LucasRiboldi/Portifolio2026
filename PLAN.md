# PLAN — rejuvenescimento do portfólio (agosto/2026)

> Plano de trabalho da branch `chore/qualidade-2026-08`. Adaptado de um prompt
> de 8 fases cujas premissas foram verificadas primeiro — o que não se
> sustentou está registrado em "O que foi descartado, e por quê", no fim.
> Marque `[x]` conforme concluir.
>
> **Escopo decidido:** polir dentro da identidade atual (sem redesign),
> documentar só o que falta de verdade, entregar em branch + PR único.

---

# 📍 COMECE AQUI — estado em 2026-08-12

**Branch:** `chore/qualidade-2026-08`, 11 commits, árvore limpa.
**Verde:** `lint`, `tsc --noEmit`, **667 testes**, build de produção.

## O que foi analisado

Registrado para ninguém refazer. "Limpo" aqui significa medido, não presumido.

| Frente | Alcance | Resultado |
|---|---|---|
| Contraste WCAG AA | Home dos 3 realms, medida com luminância real | 54 defeitos → **0**; 11 inconclusivos no `/criativo` |
| Foco visível | `outline-none` e `outline: none` em todo o `src/` | 2 defeitos; 3 suspeitas descartadas com prova |
| Referências ARIA | `aria-describedby` / `labelledby` / `controls` | 1 defeito (id inexistente) |
| Movimento | `prefers-reduced-motion` | 147 usos em 85 arquivos — base já sólida, nada a fazer |
| Arquivos grandes | Todo o `src/`, limite de 450 linhas | 3 acima; 1 acima de 500 (ver pendência **P4**) |
| Código morto | `scripts/` inteiro, resíduo de Supabase | 1 arquivo apagado, 1 caminho corrigido |
| Segurança | Diff completo da branch, 17 arquivos | **Nenhum achado** HIGH ou MEDIUM |
| As 15 skills do prompt | Todas, por HTTP e pela API do GitHub | 13 são 404 (ver **P8**) |
| Linha de base | lint, tsc, testes, build, bundle | 103 kB compartilhados, middleware 32,3 kB |

## O que foi feito

**Acessibilidade** — `SvTooltip` com `aria-describedby` apontando para id
inexistente e sem marca de foco; `.dpx-anchor` sem `:focus-visible` nas 11
seções do índice do jornal; `.k-gal-btn` em 1,32:1 → **12,68:1**;
`--dev-ink-dim` do Dracula em 3,03:1 → **4,55:1**, que zerou 53 reprovações.

**Ferramentas** — `sync:skills` deixou de apagar 54 das 55 skills do site a
cada execução em máquina diferente; `licitacao-133-analyzer` saiu da vitrine
por `NAO_PUBLICAR`; `fix-criativo-covers.mjs` (174 linhas) removido.

**Documentação** — 4 documentos que afirmavam coisas falsas foram corrigidos;
contagem de testes de 640 para 667; `CHANGELOG.md` criado com as 4 versões.

**Fora do projeto** — skill `front-a11y` escrita em `~/.claude/skills/`, com o
método validado aqui e as duas correções do medidor que este trabalho expôs.

## O que falta — ver "Pendências" no fim deste arquivo

`P1` polimento de interação · `P2` os 11 inconclusivos · `P3` contraste nas
páginas internas · `P4` as 737 linhas · `P5` auditoria final · `P6` PR ·
`P7` bump e tag · `P8` skill de animação bloqueada.

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

### Contraste — os três realms, medidos

| Realm | Antes | Depois |
|---|---|---|
| `/desenvolvedor` | **53 reprovações** | **0** |
| `/anfitriao` | — | **0**, já estava limpo |
| `/criativo` | 1 defeito confirmado (setas da galeria) | corrigido; 11 inconclusivos, abaixo |

**A previsão estava errada.** Eu apostava no jornal como pior caso — tinta
sobre papel envelhecido. Ele passou limpo de primeira. Quem reprovava era o
Dracula, e por um motivo só: `--d-comment` (`#6272a4`) dá **3,03:1** sobre o
`#282a36`. Basta para filete e texto grande, reprova para corpo pequeno.

Todas as 53 falhas eram a mesma cor, em 12 classes, sempre como texto. O
conserto foi no token semântico que já existia para o papel: `--dev-ink-dim`
passou a apontar para `--d-comment-texto` (`#7b90cf`, 4,55:1). O `#6272a4`
canônico do Dracula continua onde é filete e ícone.

### Os 11 do `/criativo` ficam por confirmar à vista

São cabeçalhos de capítulo (`k-kicker`, `k-body`) sobre `radial-gradient`.
O medidor compara contra a **parada mais desfavorável** do gradiente — verde
`rgb(157,255,48)` num caso, laranja `rgb(255,107,31)` noutro. É conservador
de propósito, e gera falso positivo quando o texto cai fisicamente sobre a
parte escura.

**Não dá para resolver por medição nesta sessão:** a pane do navegador não
compõe quadros, então não há captura para conferir onde o texto assenta.
Fica registrado como pendência de olho humano, não como defeito.

### Escopo, para quem continuar

**O projeto tem 77 arquivos `page.tsx`.** Auditoria exaustiva não cabe. O
critério usado foi a home de cada realm; para ir além, amostrar uma listagem
e um detalhe por realm. Se as três passam, o padrão do realm está são — os
tokens são compartilhados, então o que escapa é caso isolado.

## Pilar 4 — Polimento de interação, dentro da identidade

Não é redesign. É a diferença entre "funciona" e "responde bem ao toque".

- [ ] Alvos de toque ≥ 44 px no mobile — **mensurável, começar por aqui**
- [ ] Estados de foco nos três realms (o Pilar 3 cobriu dois componentes)
- [ ] Hover consistente em botões, links e cards
- [ ] Estados de carregamento e vazio onde faltarem
- [ ] Springs e durações; nada acima de ~300 ms em resposta a clique

**Restrição:** cada realm mantém a sua linguagem. Consistência aqui significa
*mesma qualidade de resposta*, não mesma aparência.

**O risco deste pilar, dito em voz alta:** "polimento" é o item mais fácil de
transformar em redesign por acúmulo. Cada ajuste parece pequeno e o conjunto
muda a cara do site — que é exatamente o que a decisão de escopo excluiu.
Salvaguarda: só entra mudança que possa ser justificada por um número (alvo
de toque em px, duração em ms, contraste) ou por uma regra de WCAG. Gosto
pessoal fica de fora.

## Pilar 5 — Saúde do código

- [x] **Código morto removido** (12/08): `scripts/fix-criativo-covers.mjs`,
      174 linhas importando `@supabase/supabase-js`, desinstalado. Nenhum
      código o chamava e não estava nos scripts do `package.json`. De quebra,
      `setup-structure.mjs` deixou de recriar `src/lib/supabase` — resíduo da
      migração que teria confundido quem rodasse `npm run setup`
- [ ] `simplify` nos módulos tocados por esta branch
- [ ] `src/app/anfitriao/page.tsx` — **737 linhas**, único acima do limite de
      500 da convenção
- [ ] Sem regressão: `test:unit` verde a cada passo

**Sobre as 737 linhas, antes de alguém partir para cima:** é a home de um
realm, com o conteúdo editorial do jornal embutido no JSX. Quebrar em
componentes é refatoração de arquivo grande **e** movimentação de conteúdo ao
mesmo tempo — a combinação em que "sumiu um pedaço" passa despercebido, e há
regra de preservação de conteúdo valendo.

Se for feito: um commit só para extrair, sem tocar em texto, e comparação do
HTML renderizado antes e depois. Se não der para garantir isso, o débito é
menos ruim que a correção. O item 12 do `technical-debt.md` documenta o mesmo
princípio para o índice derivado.

## Pilar 6 — Documentação (só o que falta)

- [x] `CHANGELOG.md` — as quatro versões, mais a seção *Não lançado* desta
      branch. Começa em `v0.2.0` por decisão declarada no topo do arquivo: os
      285 commits anteriores não têm tag, e reconstruí-los daria um changelog
      inventado com data de hoje
- [ ] Atualizar `docs/project-knowledge/*` com o que esta branch mudou
- [ ] `llms.txt` — **o item mais dispensável de todo o plano.** Este
      repositório já tem `CLAUDE.md`, que faz o mesmo trabalho e é lido de
      fato. Criar um segundo mapa é a divergência do Pilar 6 com outro nome
- [ ] Capturas novas no `README.md`, só se o Pilar 4 alterar o visual

**Não criar** `ARCHITECTURE.md` nem `CONTRIBUTING.md` na raiz: duplicariam
`docs/project-knowledge/architecture.md` e `conventions.md`. Duas fontes do
mesmo fato divergem — foi o defeito corrigido nos commits `782db8c` e
`a530d55`, e não faz sentido reintroduzi-lo de propósito.

## Pilar 7 — Auditoria final

- [x] **Revisão de segurança sobre o diff da branch** — 17 arquivos, **nenhum
      achado HIGH ou MEDIUM**. O único ponto que mereceu análise dedicada foi
      o `esc()` do `sync-skills.mjs`, que gera código por interpolação: escapa
      barra invertida **antes** da aspa, que é a ordem correta, e a descrição
      passa por `\s+ → " "`, então não há injeção por quebra de linha.
      Apagar o `fix-criativo-covers.mjs` **reduziu** superfície: ele consumia
      `SUPABASE_SERVICE_ROLE_KEY`, credencial que ignora RLS
- [x] `test:unit` verde a cada passo — 667, em todos os commits
- [ ] `test:smoke` (exige build; não roda com o dev server no ar)
- [ ] Responsividade em 390 / 768 / 1280 / 1920
- [ ] Build de produção comparado à linha de base do Pilar 1

**`AUDIT_FINAL.md` não será criado.** Seria a terceira fonte do mesmo fato,
ao lado deste arquivo e do `technical-debt.md` — o defeito que esta própria
empreitada corrigiu em outros quatro documentos. O resultado da auditoria
está acima e nas pendências abaixo.

**O que esta revisão NÃO cobre, e é bom dizer:** nenhum arquivo tocado pela
branch atravessa autenticação, autorização ou entrada de usuário.
`requireAdmin()`, `verifySession`, `firestore.rules`, o middleware e a
allowlist do GitHub ficaram intactos — logo, também não foram auditados.

## Pilar 8 — Entrega

- [x] Branch `chore/qualidade-2026-08`, commits coerentes por frente — **11**
- [ ] PR único, com antes/depois e instruções de teste
- [ ] Bump de versão + tag anotada (regra: todo push carrega as duas)

**Sobre o antes/depois em imagem:** a pane do navegador não fica visível
nesta sessão, então captura de tela falha por não haver composição de
quadros. As provas até aqui são numéricas — razão de contraste medida, ids
resolvidos, regras no CSS servido. Se o PR precisar de imagem, ela terá de
sair de uma execução sua com a pane aberta.

---

# 🔖 Pendências — para retomar sem este contexto

Cada uma diz **o que é**, **como fazer** e **como saber que ficou pronto**.
Ordem sugerida: P6 e P7 fecham a entrega; P2 e P3 continuam a auditoria; P1 e
P4 são os caros e opcionais.

## P1 — Polimento de interação (Pilar 4, nada feito)

Alvos de toque ≥ 44 px no mobile, hover consistente, estados de carregamento
e vazio, durações de resposta a clique.

**Comece pelo alvo de toque:** é o único item mensurável sem julgamento. Numa
página aberta, `document.querySelectorAll('button,a[href]')` e o
`getBoundingClientRect()` de cada um, com o viewport em 390 px.

**A salvaguarda vale mais que a lista:** só entra mudança justificável por um
número (px, ms, razão de contraste) ou por regra de WCAG. Sem isso, este
pilar vira redesign por acúmulo — que foi explicitamente excluído do escopo.

## P2 — Os 11 contrastes inconclusivos do `/criativo`

Cabeçalhos de capítulo (`k-kicker`, `k-body`) sobre `radial-gradient`. O
medidor compara contra a parada **mais desfavorável** do gradiente — verde
`rgb(157,255,48)` num caso, laranja `rgb(255,107,31)` noutro — e isso gera
falso positivo quando o texto assenta sobre a parte escura.

**Precisa de olho humano, não de medição.** Nesta sessão a pane do navegador
não compunha quadros, então captura de tela falhava. Abra `/criativo`, olhe
onde o texto cai, e decida caso a caso.

## P3 — Contraste nas páginas internas

Só as **homes** dos três realms foram medidas. O projeto tem **77 arquivos
`page.tsx`**; varrer todos não cabe.

**Critério:** uma listagem e um detalhe por realm. Os tokens são
compartilhados, então se a home e mais duas passam, o padrão do realm está
são e o que escapa é caso isolado.

**Ferramenta:** a skill `front-a11y` em `~/.claude/skills/` carrega o medidor
pronto, já com as duas correções que este trabalho custou (conversão de
`color(srgb …)` por canvas, e exclusão de texto com contorno).

## P4 — `src/app/anfitriao/page.tsx`, 737 linhas

Único arquivo acima do limite de 500 da convenção.

**Não ataque de improviso.** É a home de um realm com o conteúdo editorial do
jornal embutido no JSX: quebrar em componentes é refatoração **e**
movimentação de conteúdo ao mesmo tempo, a combinação em que "sumiu um
pedaço" passa batido — e há regra de preservação de conteúdo valendo.

**Se for fazer:** um commit só de extração, sem tocar em uma vírgula de
texto, e comparação do HTML renderizado antes e depois. Sem essa garantia, o
débito é menos ruim que a correção.

## P5 — Fechar a auditoria

Falta `test:smoke` (exige build feito, e **nunca** com o `next dev` no ar),
responsividade em 390/768/1280/1920, e um build de produção comparado à base:
**103 kB** compartilhados, middleware **32,3 kB**.

## P6 — PR aberto ✅

O antes/depois em imagem depende de uma sessão com a pane do navegador
visível; as provas atuais são numéricas e estão nos commits e no corpo do PR.

## P7 — Lançado como v0.5.0 ✅

Mesclado em 2026-08-13 pelo PR #1, com **merge commit** e não squash: o
`PLAN.md` cita `ad6f175` e `b5c703f`, que são commits da branch, e reescrever
os SHAs deixaria as referências penduradas.

A tag só foi criada **depois** do merge, e a ordem importava: `getVersaoSite`
escolhe a maior semver do repositório inteiro, sem olhar branch. Taguear antes
faria a produção anunciar uma versão que ela não continha.

## P8 — Skill de animação, bloqueada por permissão

`motion-dev-animations-skill` é um dos **dois** repositórios reais da lista
original de 15. O clone foi recusado pelo classificador de permissões nesta
sessão e **não foi contornado**. Se quiser, rode você:

```bash
git clone --depth 1 https://github.com/199-biotechnologies/motion-dev-animations-skill.git ~/.claude/skills/motion-dev-animations
```

Depois dele, `npm run sync:skills` acrescenta a entrada na página — agora sem
apagar as outras 55.

---

## Fora do plano original, feito mesmo assim

Dois defeitos que a própria empreitada revelou, nenhum previsto:

- **`sync:skills` apagava 54 das 55 skills** de `src/data/skills.ts` a cada
  execução em máquina diferente. Tratava `~/.claude/skills` como fonte de
  verdade sobre conteúdo publicado. Passou a ser aditivo, com `--prune` para
  quando a intenção for remover. (`ad6f175`)
- **`licitacao-133-analyzer` fora da página pública**, por decisão do Lucas,
  com a exclusão registrada em `NAO_PUBLICAR` para não voltar na varredura
  seguinte. (`b5c703f`)

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
