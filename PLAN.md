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
| Contraste WCAG AA | Home dos 3 realms, luminância real; gradiente por amostragem de pixel | 54 defeitos → **0**; os inconclusivos eram falso positivo (**P2**) |
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

**Abertas:** `P8` skill de animação bloqueada por permissão · **`P9`**, novo:
o hover dos cartões do `_dev` não transiciona, e a correção óbvia esconde a
página (nasceu da medição do `P1`).

**Medida e encerrada:** `P1` — durações sem defeito; o que sobrou virou `P9`.

**Fechadas:** `P2` (falso positivo) · `P3` (5 rotas, 3 defeitos) · `P4`
(737 → 363 linhas) · `P5` (build, fumaça, responsividade) · `P6` PR #1 ·
`P7` v0.5.0.

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

- [ ] Alvos de toque ≥ 44 px no mobile — **conforto, não conformidade.** O
      `P5` já fechou o WCAG 2.5.8 (AA), que pede 24 × 24 com exceção de
      espaçamento. Os 44 px são diretriz de plataforma e nível AAA: subir a
      essa barra é decisão de qualidade, e mexe em muita coisa
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

## P1 — Medido em 13/08. Um defeito real achado; a correção NÃO entrou.

O que era mensurável foi medido. O que era gosto ficou de fora, conforme a
salvaguarda deste item.

### Durações de resposta a clique — sem defeito

| Rota | Interativos visíveis | Acima de 300 ms |
|---|---|---|
| `/criativo` | 22 | **0** |
| `/desenvolvedor` | 49 | 4, e nenhum é resposta a clique |

Os quatro do `/desenvolvedor` são entrada por rolagem (`opacity, transform`),
não retorno de toque. O portal tem 600 ms em `flex`, que é a animação dos
painéis de entrada. Nenhum é o caso que o critério visava.

### 🔴 Defeito confirmado: o hover dos cartões do `_dev` não transiciona

`realm-motion.ts:52` documenta: *"hover de card · border-color 150ms ·
discreto, só a borda acende"*. Medido nos três componentes:

```
.dv-stat         transition-property: opacity, transform   (0.5s)
.dv-card         transition-property: opacity, transform   (0.5s)
.dv-radar-item   transition-property: opacity, transform   (0.5s)
```

Nenhum transiciona `border-color`. A regra
`.dracula[data-motor="on"] [data-revelar]` declara `transition` como atalho
completo e, sendo mais específica, **sobrescreve** o
`transition: border-color var(--dev-dur-fast)` de cada componente. A borda
salta no hover. O CSS declara uma intenção que o próprio CSS cancela.

Agravante: o `transition-delay` do escalonamento (até 280 ms) continua
casando depois da entrada — se a transição fosse restaurada sem tratar isso,
o hover passaria a esperar um quarto de segundo.

### Por que a correção não entrou

Troquei a entrada de `transition` para `animation` — que não disputa a
propriedade com ninguém. O hover voltou a ser exatamente o documentado
(`border-color`, `0.15s`, atraso `0s`) e nenhum interativo passou de 300 ms.

**E a página inteira ficou invisível.** Medido pelo mesmo caminho nos dois
estados, para não confundir com artefato de Fast Refresh:

| | elementos revelados | invisíveis |
|---|---|---|
| Original | 0 marcados | **0** |
| Com a correção | 0 marcados | **18** |

Revertido. O defeito é real e está provado; o conserto exige entender por que
`data-visivel` **nunca é marcado** — em nenhuma das duas versões — e a página
mesmo assim aparece. A suspeita é o próprio arquivo avisar: o motor escreve
atributos no DOM que o React renderizou, e um re-render os apaga.

**Quem for mexer precisa da pane do navegador visível para assistir à
entrada acontecer.** Nesta sessão ela não compunha quadros, e trocar a camada
de movimento às cegas foi exatamente o erro que este item alertava.

### Fora de escopo, por decisão e não por esquecimento

- **Alvos de 44 px:** conformidade AA fechou no `P5` (24 × 24 com exceção de
  espaçamento). Os 44 são diretriz de plataforma e nível AAA — subir a barra
  é decisão de qualidade sua, não defeito.
- **Consistência de hover, springs, densidade:** não há número que sustente.
  É gosto, e a salvaguarda deste item o exclui.

## P2 — Resolvido ✅ (2026-08-13): eram falso positivo, todos

**Nenhum defeito. Nenhuma alteração de código.** Os inconclusivos eram ruído
do meu instrumento, não contraste ruim.

**O que estava errado.** O medidor comparava contra a parada mais
desfavorável do gradiente. Mas as seções do `/criativo` empilham camadas —
um `radial-gradient` **semitransparente** sobre um `linear-gradient` de base:

```
radial-gradient(circle at 80% 10%, rgba(157,255,47,0.5), transparent 45%),
linear-gradient(155deg, #2b0a4d, #571496 60%, …)
```

Tomar o verde `rgba(157,255,47,0.5)` como fundo ignora três coisas de uma
vez: ele tem 50% de alfa, está centrado em `80% 10%`, e some aos 45%. O texto
reprovado estava em **x = 0,19** — do outro lado da seção, sobre o roxo.

**Como foi resolvido sem captura de tela.** A pane do navegador continua sem
compor quadros, então em vez de olhar, medi: renderizei a pilha de fundo de
cada seção num `foreignObject` de SVG, desenhei no canvas e li **o pixel
exato sob cada texto**. A técnica está na skill `front-a11y`.

| Texto | Pela pior parada | Real | Alvo |
|---|---|---|---|
| Terra-1610 · Spray | 1,16 | **12,11** | 4,5 |
| Ilustração, vetor, pixel | 1,16 | **8,54** | 4,5 |
| Peça 01 · code | 3,73 | **6,99** | 4,5 |
| Terra-42 · Projeção | 2,65 | **15,73** | 4,5 |
| Filmes que mexeram… | 2,65 | **10,16** | 4,5 |

Duas varreduras independentes, uma com a página parada e outra rolando em
passos: **0 reprovações**, pior aprovado em 6,99 — 55% acima do limite,
nenhum caso marginal.

**Duas lições que valem mais que o resultado:**

1. **Lista vazia é ambígua.** "0 reprovações" e "0 medições" produzem a mesma
   saída. Só passei a confiar depois de instrumentar: 44 textos sobre
   gradiente, 44 medidos, 0 falhas de render.
2. **A revelação por rolagem esconde a página do medidor.** Elemento em
   `opacity: 0` é pulado, e com razão. Mas isso limitava a varredura à dobra:
   a página tem 9041 px e 223 textos ficavam fora. Daí a segunda passada,
   medindo a cada parada da rolagem.

## P3 — Resolvido ✅ (2026-08-13): 5 rotas amostradas, 3 defeitos

Amostragem em vez de varredura: **77 arquivos `page.tsx`** não cabem em
empreitada nenhuma, e os tokens são compartilhados — se a home e mais duas
passam, o padrão do realm está são.

| Rota | Medidos | Reprovavam | Depois |
|---|---|---|---|
| `/desenvolvedor/projetos` (listagem) | 54 | 0 | 0 |
| `/portfolio` (listagem) | 48 | **5** | **0** |
| `/criativo/sala` (detalhe) | 34 | **1** | **0** |
| `/anfitriao/materia/[slug]` (detalhe) | 60 | 0 | 0 |
| `/desenvolvedor/devlog/[slug]` (detalhe) | 47 | 0 | 0 |

Zero falhas de render em todas — o contador confirma que os zeros são
medição, não omissão.

### O que foi corrigido

**Etiqueta de categoria do `ProjectCard`** — branco a 12 px sobre o gradiente
laranja→rosa da marca: **2,80:1** na ponta laranja, 3,53:1 na rosa. Trocada a
tinta para `--k-ink` (**5,38:1** no pior ponto) em vez de escurecer o
gradiente, que é elemento de identidade (`--gradient-text`).

**"Voltar para a capa", em `/criativo/sala`** — `--k-lime` sobre a zona
clara: **1,02:1**, invisível na prática. É o mesmo defeito das setas da
galeria: token de acento global sobre superfície de zona, ignorando o
`--k-zone-ink` que a zona declara. Agora **14,9:1**.

Escurecer o lime até passar exigiria `#457015`, que já é oliva — não
preservaria acento nenhum. O caráter de link fica com a seta e o hover, que
já existiam.

**Separador `·` do rodapé** — 1,74:1 a 20% de opacidade. Ganhou `aria-hidden`
(é delimitador, não conteúdo) e subiu para 50%.

### Uma lacuna do medidor que isto expôs

O filtro pula elemento com `opacity: 0`, mas olha só a **própria** opacidade,
não a dos ancestrais. A etiqueta do `ProjectCard` vive dentro de um
`opacity-0 group-hover:opacity-100` — ela foi medida porque a opacidade dela
é 1. Deu certo por acaso, e é o caso certo: elemento revelado no hover
**precisa** passar quando aparece. Mas a regra inversa não vale — há texto
oculto por ancestral que o medidor conta como visível.

## P4 — Resolvido ✅ (2026-08-13): 737 → 363 linhas

Feito sob a condição que este item exigia: extração pura, **sem tocar numa
vírgula de texto**, com o HTML servido comparado antes e depois.

| Arquivo | Linhas |
|---|---|
| `src/app/anfitriao/page.tsx` | **363** |
| `src/components/anfitriao/prophet-caderno.tsx` | 318 |
| `src/components/anfitriao/wire-column.tsx` | 89 |

Nenhum arquivo do `src/` passa de 500 linhas.

### A prova

Antes de mexer, um snapshot do HTML servido: só o **texto visível** e o
**esqueleto** (tag + classe, na ordem). Script e estilo ficam de fora — eles
mudam entre builds mesmo sem alteração de código, e comparar isso seria ruído.

```
antes.texto.txt      3DDFEFD72F9BB3A3     antes.esqueleto.txt   762B076F5774A68E
depois.texto.txt     3DDFEFD72F9BB3A3     depois.esqueleto.txt  762B076F5774A68E
```

343 linhas de texto e 568 elementos, dos dois lados. Hash idêntico.

### O que foi movido, e por quê nessa ordem

1. **As três auxiliares** (`Plate`, `NewsPlate`, `WireColumn`) — UI pura, zero
   texto editorial. Risco nulo, e já tirava 87 linhas.
2. **O caderno** — as quatro bandas ao pé da folha, que a documentação do
   próprio arquivo já tratava como unidade. Cortado **por script**, com guarda
   de sanidade nas bordas: se as linhas não fossem as esperadas, abortava em
   vez de cortar no lugar errado. Copiar à mão 304 linhas é como se perde um
   pedaço.

### O que a comparação de HTML NÃO pegou

Dois testes quebraram, e o HTML estava idêntico o tempo todo:
`tests/anfitriao-zonas.test.ts` lê o **fonte** para conferir que toda zona do
sumário tem seção com o mesmo id. Com as âncoras em outro arquivo, ele passou
a ver meia página.

A correção foi ampliar a lista de arquivos que o teste lê, não afrouxar a
asserção — o contrato é sobre a marcação da primeira página, e em que arquivo
ela mora é decisão de organização sobre a qual o teste não deve ter opinião.

**A lição:** prova de renderização e prova de fonte pegam coisas diferentes.
Só a primeira teria deixado passar um teste cego a metade da página.

## P5 — Resolvido ✅ (2026-08-13)

**Build de produção:** verde, **zero avisos**, 85 rotas. Comparado à base:

| Métrica | Base (12/08) | Agora |
|---|---|---|
| First Load JS compartilhado | 103 kB | **103 kB** |
| Middleware | 32,3 kB | **32,3 kB** |

Os hashes dos chunks compartilhados também são idênticos — as correções foram
token de CSS e atributo, que não entram no bundle. Rota mais pesada:
`/criativo`, 231 kB de first load.

**Fumaça:** **13 de 13** contra o build de produção, na porta 3100.

**Responsividade — zero transbordo horizontal** em toda a matriz medida:

| Rota | 390 | 768 | 1280 | 1920 |
|---|---|---|---|---|
| `/criativo` | ✅ | ✅ | — | ✅ |
| `/anfitriao` | ✅ | — | — | ✅ |
| `/desenvolvedor` | ✅ | — | ✅ | — |

### Um defeito de alvo de toque, e uma correção de critério

O plano dizia "alvos ≥ 44 px". **O número está errado para AA:** 44 px é
diretriz de plataforma (Apple HIG, Material) e nível AAA. O WCAG **2.5.8
(AA)** pede **24 × 24**, com exceção quando o espaçamento entre centros
alcança 24 px.

Pelo critério certo, quase tudo passa: no `/criativo` a 768 px havia 12 alvos
abaixo de 24, e **os 12 passam pela exceção** — a menor distância ao vizinho
era 64 px.

**O que reprovou de verdade:** as quatro linhas de escolha do cupom do jornal.
E o defeito não estava onde o medidor apontou primeiro:

- o medidor acusou o `<input type=radio>`, de 12 × 12 px;
- mas o alvo clicável é o `<label>` em volta — **320 × 15 px**, empilhado a
  19 px entre centros. Reprova nas duas contas;
- e o radio, isolado, teria a exceção de "controle do agente de usuário"…
  se `.dpx-check` não definisse `width: 0.9em`. O autor mexeu, então não tem.

Corrigido com `min-height: 1.625rem` no label — 26 px, e não os 24 do
critério, porque o navegador arredonda e 24 exato ficava na fronteira.
Medido depois: 26 px, zero reprovações.

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

## P9 — Diagnosticado (13/08). A causa é o observador, não o CSS.

**O sintoma visível** é o hover dos cartões do `_dev`, que não transiciona.
**A causa raiz é outra, e mais séria:** a entrada por rolagem nunca acontece.

### O que ficou provado

**1. O `IntersectionObserver` não marca nada.** Rolei os 5406 px da página
inteira, em passos de 400 px: **zero** elementos com `data-visivel`. E o laço
que marca no carregamento (`home-motor.tsx:57`) também não marca, porque
**nenhum dos 18 nasce dentro da janela** — todos ficam abaixo da dobra.

**2. O React não apaga o atributo.** Escrevi `data-visivel="true"` à mão e ele
sobreviveu. A hipótese registrada antes — de que um re-render limparia o que o
motor escreve — está **descartada**.

**3. O `transition` da regra de entrada é o que segura a página de pé.** Este
é o achado que explica tudo:

| Regra de entrada | Página | Hover |
|---|---|---|
| Com `transition` (atual) | visível | **quebrado** |
| Sem `transition` (2 tentativas) | **18 invisíveis** | correto |

Com `transition`, a mudança de opacidade 1 → 0 fica pendente e nunca completa
para conteúdo que nunca foi pintado. Sem ele, o `opacity: 0` aplica na hora —
e como nada nunca é revelado, **fica invisível para sempre**.

O `transition` estava mascarando um observador quebrado. Tirá-lo não causa o
defeito: **expõe** o que já estava lá.

### Por que não corrigi

Tentei duas vezes, medindo por navegação limpa (não `reload`, que confunde com
Fast Refresh). As duas restauraram o hover exatamente como o guia documenta —
`border-color`, `0.15s`, atraso `0s`, zero acima de 300 ms — e as duas
apagaram a página. Revertidas, árvore idêntica ao commit.

**Consertar o CSS sem consertar o observador troca um defeito visível por um
pior.** A ordem certa é: primeiro fazer a revelação funcionar, depois libertar
o `transition`.

### Onde começar

O alvo é `src/components/dev/home-motor.tsx`, não a folha de estilo. Descobrir
por que o observador não dispara com `{ threshold: 0.12, rootMargin: "0px 0px
-40px 0px" }` sobre os 18 alvos. **Exige a pane do navegador visível** — é
preciso ver a entrada acontecer, e nesta sessão ela não compunha quadros.

**Uma coisa que continua inexplicada:** com a regra atual, `getComputedStyle`
devolve opacidade **1** mesmo com o seletor casando, o motor ligado e sem
`data-visivel`. Conferi que a folha está ativa, sem `media`, sem `@layer`, e
que a regra está no CSS servido. Isso pede o painel de estilos do DevTools,
que eu não tenho aqui.

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
