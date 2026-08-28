# Changelog

Registro das mudanças que valem para quem usa ou lê o site. Segue
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e
[SemVer](https://semver.org/lang/pt-BR/).

> **De onde este arquivo começa.** O projeto nasceu em 2026-06-10 e passou os
> dois primeiros meses sem versão declarada — a série de tags começa em
> **v0.2.0** (2026-08-05), quando o selo de versão do `/desenvolvedor` passou a
> ler a tag e o número virou informação pública.
>
> Reconstruir o que veio antes exigiria arqueologia sobre 285 commits, e daria
> um changelog inventado com data de hoje. O histórico daquele período está no
> `git log`, que é onde ele é confiável.
>
> **Ao lançar:** todo push carrega bump do `package.json` **e** tag anotada — o
> selo do `/desenvolvedor` lê a tag, não a release. Mova o que está em
> _Não lançado_ para a versão nova, com a data do dia.

---

## [Não lançado]

Nada ainda.

## [0.7.5] — 2026-08-28

Correções das melhorias Medium/Low levantadas pela auditoria de 0.7.4 —
decisão do Lucas foi implementar, não só registrar. Nenhuma mudança de
comportamento visível pretendida, exceto o contraste do rodapé (visual) e o
JSON-LD novo (invisível na página, visível para crawlers).

### Adicionado

- **Structured data (schema.org)** — Person + WebSite via JSON-LD no layout
  raiz, com dados do `site-config`. Canonical por rota ficou de fora de
  propósito: exigiria metadata em ~80 páginas, e um canonical "global"
  apontando tudo para a home seria pior que nenhum. Ver `NEXT_STEPS.md`
  item 18.
- **`Cross-Origin-Opener-Policy: same-origin-allow-popups`** em
  `next.config.ts`. Não usei `same-origin` (o valor mais estrito) porque
  quebra o `signInWithPopup` do login GitHub — o Firebase Auth precisa que o
  popup consiga avisar a janela principal quando termina.

### Corrigido

- **Contraste do rodapé de `/desenvolvedor`** — `.dv-meta dt`/`.k` aplicava
  `opacity: 0.75` em cima de `--dev-ink-dim` (`#7b90cf`, já ajustado numa
  correção de contraste anterior para ~4,56:1). A opacidade extra derrubava
  o resultado renderizado para `#6677a9` sobre `#282a36` — 3,23:1, abaixo do
  4,5:1 que WCAG AA pede. Removida a opacidade; o `text-transform: uppercase`
  já bastava para diferenciar rótulo de valor.
- **Duplicação de `publishedReader`/`reader`** entre `lib/repos/dev.ts`,
  `criativo.ts`, `prophet.ts` e `projects.ts` — quatro reimplementações do
  mesmo "leitor cacheado com fallback ao seed", cada uma com uma variação
  pequena e não documentada. Unificadas em `lib/repos/utils.ts`, preservando
  a única diferença de comportamento real que havia entre elas: `projects.ts`
  só cai no seed quando a consulta falha (`null`), não quando há
  legitimamente zero projetos publicados — os outros três caem no seed nos
  dois casos. Essa diferença agora é explícita (`treatEmptyAsPublished`), não
  um acidente de implementação.

### Avaliado, não executado

- **Dividir os 14 arquivos acima de 500 linhas** (pior caso:
  `design-system/realms.ts`, 1052 linhas, importado por 20 arquivos). O dado
  é declarativo, a divisão seria mecânica, mas o raio de explosão é real e
  esta sessão não tinha ferramenta de browser disponível para conferir
  visualmente as páginas de design system depois de dividir. Ver
  `NEXT_STEPS.md` item 17.
- **As 54 falhas de teste do working tree não commitado** seguem de fora —
  não são desta versão, ver `PROJECT_STATE.md` seção 11 e `NEXT_STEPS.md`
  item 13.

## [0.7.4] — 2026-08-28

Auditoria técnica completa (QA, segurança, performance, acessibilidade,
arquitetura, produção) — sem mudança de comportamento no site. Apenas
documentação; nenhum código de produção foi alterado por esta versão.

### Adicionado

- Registro da auditoria em `PROJECT_STATE.md` (seção 11) e backlog acionável
  correspondente em `NEXT_STEPS.md` (itens 13–19, seção "🔴 Auditoria
  técnica"). Veredito: **aprovado com ressalvas** — zero problemas Critical.

### Corrigido

- Nada nesta versão. Os achados da auditoria (duplicação de
  `publishedReader`, arquivos acima de 500 linhas, contraste do rodapé de
  `/desenvolvedor`, `Cross-Origin-Opener-Policy` ausente, canonical/structured
  data ausentes, cobertura de Storybook em ~2,7%) ficam registrados como
  backlog, não corrigidos automaticamente.

### Observado, não resolvido

- **54 de 675 testes unitários falham num working tree não commitado**
  encontrado no início da auditoria (707 arquivos modificados, com diff
  substancial em `resource-defs-content.ts`, `resource-defs-materias.ts` e
  `extractors.ts`). A origem desse WIP não foi identificada — duas sessões
  Claude diferentes confirmaram que não é trabalho delas. Não confirmado se
  o HEAD commitado também falha. Ver `NEXT_STEPS.md` item 13.

## [0.7.3] — 2026-08-27

Login em preview destravado e cobertura do Prophet Wire ampliada — sem mudança
de comportamento em produção.

### Adicionado

- Domínio de preview (`portifolio2026-preview-lucasriboldis-projects.vercel.app`)
  autorizado em Firebase Authentication → Authorized domains. Login via GitHub
  e upload de mídia validados fim a fim em `/admin` fora de produção/`localhost`
  pela primeira vez.
- Duas fontes do Prophet Wire religadas: `gmt-games` (feed RSS que já existia,
  só não tinha sido notado além da home) e `plaid-hat` (extractor de HTML novo,
  no molde do `uk-games-expo`).

### Corrigido

- **Parser de feeds:** `<link>` relativo em RSS/Atom (ex.: `/news.aspx?id=1`)
  nunca era resolvido contra a URL da fonte — a URL ia quebrada para o
  Firestore. Afetava qualquer feed que devolvesse link relativo, não só o do
  GMT Games, que foi onde apareceu.

### Removido

- `ravensburger` e `spiel-essen` reclassificadas de "falta extractor" para
  "quebrado na origem": a primeira porque o site inteiro foi reestruturado
  (redireciona pra uma home de loja genérica, sem seção de jogos); a segunda
  porque a listagem não expõe data de publicação em lugar nenhum, e um
  extractor sem data sempre devolveria lista vazia.

## [0.7.2] — 2026-08-27

### Corrigido

- **Segurança:** `uuid < 11.1.1` (moderado — bounds check ausente em v3/v5/v6),
  transitivo via `teeny-request` → `@google-cloud/storage` → `firebase-admin`.
  `npm audit fix --force` rebaixaria o `firebase-admin` para `10.3.0`; em vez
  disso, `overrides` no `package.json` força `uuid ^11.1.1` sem tocar a versão
  do `firebase-admin` — mesmo padrão já usado para `jose`/`jwks-rsa`.
  `npm audit` → **0 vulnerabilidades**. `test:unit` (667) e `build` verdes.

## [0.7.1] — 2026-08-27

Varredura de auditoria pós-v0.7.0: dependências mortas, vulnerabilidades e
documentação desatualizada — sem mudança de comportamento.

### Corrigido

- **Segurança:** `postcss` (leitura de `.map` arbitrário) e `sharp` (CVEs de
  `libvips`, severidade alta) atualizados via `npm audit fix`, sem breaking
  change. `uuid` moderado ficou pendente nesta versão — resolvido em
  `[0.7.2]`.
- README citava `Radix / Base UI` e `React Hook Form` na Stack; a migração
  para `@base-ui/react` puro e `FormData` nativa já tinha tornado isso
  desatualizado.

### Removido

- 4 dependências instaladas e nunca importadas: `@hookform/resolvers`, `ai`,
  `radix-ui`, `react-hook-form` — resíduo da migração para `@base-ui/react` +
  `FormData` nativa em formulários. `npm uninstall` tirou 79 pacotes da árvore.

## [0.7.0] — 2026-08-14

> Reconstruído em 27/08 a partir do commit `6d3a807` — a tag existia sem
> entrada aqui.

### Adicionado

- **Microinterações e rolagem suave no Anfitrião e no Criativo.**
  `smooth-scroll-provider.tsx` liga Lenis ao GSAP ScrollTrigger; as colunas
  do Prophet Wire ganharam hover e revelação em cascata
  (`wire-motion.tsx`, em Motion, não GSAP — os dois motores não podem
  compartilhar seletor no mesmo elemento, sob risco de tremor).
- **`tilt-card.tsx`** — inclinação 3D no cursor, no Criativo.
- **`scrub-parallax.tsx`** — parallax vinculado à posição de rolagem (GSAP
  ScrollTrigger).
- **Dois componentes "Magic UI" enxertados**, adaptados de Tailwind 4 para
  Tailwind 3 + tokens `--k-*` do realm: `aurora-text.tsx` (gradiente
  animado em texto) e `animated-shiny-text.tsx` (shimmer sobre glifos).
- **`realm-motion.ts`** — catálogo de padrões de movimento por realm, no
  lugar do que a demo do GSAP (removida na v0.6.0) descrevia antes.

Nenhum arquivo novo passa de 500 linhas; nenhuma duplicação com
`use-magnetic.ts`/`use-mouse-parallax.ts`. Revisão de segurança sobre o
diff: nenhum dos arquivos toca `next.config.ts`, `middleware.ts`,
`firestore.rules` ou `lib/auth/*` — são componentes visuais client-side que
recebem dado já resolvido no servidor, sem leitura de Firestore no browser.

## [0.6.1] — 2026-08-14

> Reconstruído em 27/08 a partir do commit `36a80f5` — a tag existia sem
> entrada aqui.

### Corrigido

- **P9 — hover dos cartões do `_dev` não voltava inteiro, e a entrada por
  rolagem media a transição errada.** A regra de entrada declarava
  `transition`, que substituía a do próprio `.dv-card` mesmo depois de a
  animação terminar — cartão já revelado media `opacity, transform / 0.5s`
  no lugar do `border-color 0.15s, transform 0.15s` que o hover pedia:
  borda saltando, elevação lenta.
- Corrigido trocando a entrada para `@keyframes`, com o estado escondido
  sob `:not([data-visivel])` — a animação deixou de sobrescrever o
  `transition` do elemento. Repouso deixou de ser `opacity: 0`: se a
  revelação falhar, o pior caso é a página sem animação, nunca invisível.
- **O diagnóstico anterior do P9 estava invertido.** O `IntersectionObserver`
  de `home-motor.tsx` sempre funcionou (0 → 17/17 alvos ao rolar) — quem
  mentiu foi a medição feita com a página oculta (`visibilityState: hidden`
  congela `rAF`, transições e `IntersectionObserver`). Remedido com
  Playwright, que sobe um Chromium visível.

## [0.6.0] — 2026-08-13

Continuação da empreitada de qualidade da v0.5.0: auditoria de acessibilidade
levada às páginas internas, o arquivo mais longo do projeto partido, e a
auditoria final fechada.

### Corrigido

- **Etiqueta de categoria do cartão de projeto** — branco a 12 px sobre o
  gradiente laranja→rosa dava **2,80:1**. A tinta passou a ser escura
  (`--k-ink`, **5,38:1**); o gradiente da marca fica intacto.
- **"Voltar para a capa", em `/criativo/sala`** — `--k-lime` sobre a zona
  clara dava **1,02:1**, invisível na prática. Passou a usar `--k-zone-ink`,
  o par que a zona já declarava: **14,9:1**.
- **Separador `·` do rodapé** — 1,74:1 e sem marcação. Ganhou `aria-hidden`,
  porque é delimitador e não conteúdo, e opacidade de 20% para 50%.
- **Linhas de escolha do cupom do jornal** — o alvo clicável é o `<label>`, e
  ele media 320 × 15 px empilhado a 19 px, abaixo dos 24 × 24 do WCAG 2.5.8
  (AA) e fora da exceção de espaçamento. Agora 26 px de altura.

### Alterado

- **`anfitriao/page.tsx` partido em três** (737 → 363 linhas), único arquivo
  acima do limite de 500 da convenção. Extração pura: o JSX foi movido
  verbatim, e o HTML servido — texto visível e esqueleto de tags — tem hash
  idêntico antes e depois. Nada do que a página mostra mudou.

### Documentação

- Os contrastes marcados como inconclusivos no `/criativo` foram medidos por
  amostragem de pixel e **não eram defeito** — falso positivo do medidor, que
  tomava a parada mais desfavorável de gradientes empilhados como se fosse o
  fundo. O pior deles media 1,16:1 pela parada e **12,11:1** de verdade.
  Nenhuma alteração de código.
- **`motion-dev-animations` instalada** em `~/.claude/skills/`, depois de o
  `SKILL.md` ser lido e vetado por inteiro. Fora do repositório do site; entra
  aqui só porque aparece na página `/desenvolvedor/skills`.

### Conhecido e não corrigido

- **A entrada por rolagem do `/desenvolvedor` nunca dispara.** O
  `IntersectionObserver` não marca elemento nenhum, e por isso o hover dos
  cartões não transiciona. Duas correções pelo CSS foram tentadas e
  revertidas: restauram o hover e escondem 18 elementos, porque o `transition`
  da regra de entrada é o que segura a página visível. O alvo é
  `home-motor.tsx`. Ver `PLAN.md`, `P9`.

[0.6.0]: https://github.com/LucasRiboldi/Portifolio2026/compare/v0.5.0...v0.6.0

## [0.5.0] — 2026-08-13

Empreitada de qualidade da branch `chore/qualidade-2026-08` (PR #1). Nada aqui
muda o que o site mostra; muda quem consegue usá-lo e o que a documentação
afirma.

### Corrigido

- **Texto apagado do realm dev reprovava contraste.** `--d-comment`
  (`#6272a4`), a cor _comment_ canônica do Dracula, dá 3,03:1 sobre o fundo
  `#282a36` — abaixo dos 4,5:1 que o WCAG AA pede para corpo pequeno. Eram 53
  elementos na home, em 12 classes, todos entre 9,6 px e 13,1 px. O token
  semântico `--dev-ink-dim` passou a apontar para `--d-comment-texto`
  (`#7b90cf`, 4,55:1). O `#6272a4` segue onde é filete e ícone.
- **Setas da galeria do `/criativo` estavam quase invisíveis.** `.k-gal-btn`
  tomava a superfície da zona (`--k-zone-card`) com a tinta global
  (`--k-ink`): na zona Banca isso dava glifo quase preto sobre azul-marinho,
  1,32:1. Passou a usar `--k-zone-ink`, o par que o sistema já definia. Agora
  12,68:1.
- **Descrição acessível do `SvTooltip` apontava para o vazio.** O
  `aria-describedby` trazia a string fixa `"tt"` e nenhum elemento declarava
  esse id — o balão aparecia na tela e não existia para leitor de tela. Duas
  tooltips na mesma página ainda colidiriam. Agora usa `useId()`.
- **Elemento focável do `SvTooltip` não mostrava foco.** Tinha `outline-none`
  sem substituto. Ganhou anel em `focus-visible`.
- **O "Índice desta Edição" do `/anfitriao` não dizia onde você aterrissou.**
  As 11 seções-alvo zeravam o contorno sem a contraparte `:focus-visible`.
  Quem saltava pelo teclado ficava sem indicação do destino.

### Alterado

- **`npm run sync:skills` deixou de ser destrutivo.** Tratava
  `~/.claude/skills` como fonte de verdade sobre conteúdo publicado e removia
  do site toda skill não instalada na máquina — 54 das 55 entradas numa
  execução. Agora é aditivo; a limpeza antiga vive em `--prune`.
- **`licitacao-133-analyzer` saiu da página `/desenvolvedor/skills`.** É
  ferramenta de trabalho, sem relação com o que o portfólio mostra. A exclusão
  mora em `NAO_PUBLICAR`, no script, para não voltar na varredura seguinte.

### Removido

- **`scripts/fix-criativo-covers.mjs`** (174 linhas). Correção pontual de
  `UPDATE` no Supabase, de execução única e já executada, importando um SDK
  desinstalado. Nenhum código a chamava.
- **`src/lib/supabase` saiu do `scripts/setup-structure.mjs`.** Quem rodasse
  `npm run setup` ganhava a pasta vazia de um banco abandonado, ao lado do
  `src/lib/firebase` que é o de verdade.

### Documentação

- Quatro documentos afirmavam coisas que deixaram de ser verdade entre 31/07 e
  05/08. O pior caso: `technical-debt.md` abria com "`/login` responde 500 em
  produção" sob o cabeçalho **Crítico**, um bug morto em 31/07. Sete dos treze
  itens já estavam fechados.
- A contagem de testes nos documentos (`640`) estava desatualizada. São **667**.
- `PLAN.md` novo, com o registro do que foi descartado do plano original e por
  quê.

---

## [0.4.0] — 2026-08-06

### Alterado

- **O exemplar deixou de ser da revista e passou a ser do site.** A moldura
  saiu de `.cp-page`, que só existia em duas páginas, e foi para
  `.k-exemplar`, que envolve o `<main>` do layout `(site)`. Cada página virou
  fascículo do mesmo exemplar — mesma largura, mesma moldura, mesmo fundo.
- `--container-2xl` passou a apontar para `--cp-mag` em vez de ter número
  próprio. Esse token já divergiu duas vezes em silêncio (1200 contra 1400,
  depois 1400 contra 900).

### Corrigido

- Dois títulos do `/dimensoes` transbordavam depois do estreitamento. Os nomes
  são desenhados na fonte da própria dimensão, e algumas são muito mais largas
  que uma sans. Removido o degrau `sm:text-3xl`.

## [0.3.1] — 2026-08-06

### Corrigido

- **O selo de versão anunciava v0.2.0 com a v0.3.0 no ar.** A cadeia era
  `release → tag → package.json`, e a release é passo manual e opcional
  enquanto a tag é obrigatória em todo push. Invertido para
  `tag → release → package.json`, com comparação numérica nível a nível — não
  pela ordem que a API devolve, que não é documentada.

## [0.3.0] — 2026-08-06

### Adicionado

- **A revista do `/criativo`**: formato de exemplar em 900 px com moldura,
  galeria em carrossel com virada de folha, e arte de capa no herói.
- Rádio, videoteca e tirinhas saíram da capa para `/criativo/sala` — as cinco
  que ficaram são de _fazer_, estas três de _consumir_.

### Corrigido

- Quatro manchetes usavam `clamp(..., Xvw, ...)`, proporcional à **janela**.
  Com o exemplar de largura fixa, a janela crescia e a caixa não.

## [0.2.0] — 2026-08-05

Primeira versão declarada. Antes disto o projeto viveu dois meses sem tag.

### Adicionado

- Home do realm `/desenvolvedor` reescrita.
- Rota de DevLog individual em `/desenvolvedor/devlog/[slug]`.
- **Selo de versão** no `/desenvolvedor` — o motivo de a série de tags
  existir.
- Extractor de HTML do Prophet Wire, com o `uk-games-expo` como primeiro caso.

### Corrigido

- Gen Con de volta ao agregador, e três fontes registradas como "404" que
  eram diagnóstico errado: o Kosmos tinha feed vazio, não ausente; o
  `uk-games-expo` mudou de caminho; e o `portal-games` responde 200 para
  qualquer URL, inclusive inventada.

[Não lançado]: https://github.com/LucasRiboldi/Portifolio2026/compare/v0.6.0...HEAD
[0.5.0]: https://github.com/LucasRiboldi/Portifolio2026/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/LucasRiboldi/Portifolio2026/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/LucasRiboldi/Portifolio2026/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/LucasRiboldi/Portifolio2026/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/LucasRiboldi/Portifolio2026/releases/tag/v0.2.0
