# O que falta — backlog acionável

> Pergunte "o que falta?" e comece por aqui. Cada item tem **como fazer** e
> **como saber que ficou pronto**.
>
> Ao concluir um item: remova-o daqui, atualize `PROJECT_STATE.md` e diga no
> commit o que foi verificado de verdade.
>
> **Atualizado:** 2026-08-28 — auditoria técnica completa (QA, segurança,
> performance, a11y, arquitetura) gerou os itens 13–19, seção "🔴 Auditoria
> técnica". Veredito: aprovado com ressalvas, zero Critical. Detalhe em
> `PROJECT_STATE.md` seção 11.
>
> **2026-08-27** — `BLOB_READ_WRITE_TOKEN` do Preview resolvido, uuid moderado
> corrigido, item 8 (login + upload de mídia em preview) fechado, item 7
> avançou de 7 para 9 fontes ativas (`gmt-games`, `plaid-hat`). Ver
> `technical-debt.md`.

---

## ✅ Nenhum defeito de código aberto

O `P9` — a entrada por rolagem do `/desenvolvedor` — fechou em 14/08. Ele
estava diagnosticado ao contrário: o observador **funciona**, e o culpado
**era** o CSS. Registro completo em `PLAN.md`.

---

## 📓 A empreitada de qualidade fechou

Lançada como **v0.5.0** (PR #1) e continuada até a **v0.6.0**. O registro do
que foi analisado, medido e decidido está no **`PLAN.md`** — inclusive as
suspeitas que **não** viraram defeito, para ninguém refazer a investigação.

Saíram de lá, e por isso não estão mais nesta lista: código morto da era
Supabase, o `sync:skills` que apagava o site, e a contagem de testes errada
nos documentos.

---

## Estado em uma linha

Site no ar em **v0.6.0**, login e CRUD funcionando, **667 testes** verdes,
build de produção sem avisos. Acessibilidade auditada e conforme em WCAG 2.1
AA nas rotas amostradas — contraste, foco, ARIA e alvo de toque. **O upload de
mídia funciona fim a fim** — imagem, áudio, PDF e vídeo, verificado em produção
em 05/08 com um mp4 de 9,19 MB que sobe e toca na videoteca.

**O que resta é conteúdo e higiene de credencial, não código quebrado.**

Eram **três** defeitos independentes, e o diagnóstico antigo culpava um quarto
que não existia:

1. `/admin/media` apagava arquivo em uso sem avisar — o 404 era referência
   pendurada, não falha de escrita;
2. tudo entre 4,5 e 25 MB morria na Server Action, porque `SERVER_ACTION_LIMIT`
   ignorava o corte real da plataforma;
3. o **CSP** não liberava o Vercel Blob em `connect-src`, então o upload direto
   era bloqueado pelo navegador — e `media-src` nem existia, o que bloquearia a
   reprodução também.

O Prophet Wire foi exercitado no mesmo dia: pipeline, dedup e histórico
funcionam, e a auditoria de fontes levou o relatório a **`errors: 0`** — ao
preço da cobertura, que caiu para **7 fontes ativas** de 24 (item 7).

**A lição que sobra:** o sintoma ("o arquivo não chega") apontava para o
armazenamento, e o culpado estava no `next.config.ts`. Quando um upload trava
sem erro na tela, **o console do navegador é o primeiro lugar a olhar** — ele
dizia exatamente qual diretiva bloqueava, desde o começo.

<details>
<summary>O que o rediagnóstico de 04/08 desmontou</summary>

O item 1 antigo dizia: _"o `put()` devolve URL sem persistir, e o suspeito é o
caminho OIDC"_. Falso, e custou três dias de suspeita no lugar errado.

- **`put()` persiste.** Reproduzido com `.mp3` e as opções exatas da action:
  `head()` e `list()` enxergam, e a URL pública devolve **200**.
- **Um `put()` que falha não produz o sintoma.** Pelo caminho OIDC ele **lança**;
  a action cai no `catch` e devolve erro — nenhuma URL é gravada. Logo, toda URL
  no Firestore veio de um `put()` que criou o objeto de verdade.
- **A causa era apagar, não gravar.** `/admin/media` listava o store cru e
  deixava excluir qualquer arquivo com um clique, sem saber o que estava em uso.
- **Outras correções:** `/login` responde 200 (o 500 registrado no `CLAUDE.md`
  não existia mais); eram 615 testes, não 580.

**Lição de método, e é a parte que vale guardar:** o doc afirmava que o
diagnóstico exigia o token do Blob e por isso era impossível. O token estava no
`.env.local` o tempo todo, e a URL do Blob é pública — um `curl` bastava. O que
de fato travou foi o doc ter **elidido o nome do arquivo** (`eec0125e-….mp3`).
Ao registrar uma URL quebrada, registre-a inteira.

</details>

---

# 🔴 Auditoria técnica (28/08/2026)

> Gerado pela auditoria completa registrada em `PROJECT_STATE.md` seção 11.
> Nenhum item aqui é Critical; o item 13 é o único High.

## 13. Confirmar se as 54 falhas de teste também estão no HEAD commitado

O working tree tinha 707 arquivos modificados não commitados quando a
auditoria rodou, com diff substancial (não só formatação) em
`resource-defs-content.ts`, `resource-defs-materias.ts` e `extractors.ts`.
Duas sessões Claude diferentes confirmaram que não é trabalho delas — a
origem não foi identificada.

**Como fazer:** `git stash && npm run test:unit && git stash pop` (ou
pergunte a quem deixou esse WIP aberto, se você lembrar). **Como saber que
ficou pronto:** os 675 testes voltam a passar, ou você sabe exatamente quais
54 falham no HEAD e por quê — e decide se commita o WIP ou descarta.

## 14. Unificar o leitor cacheado duplicado (`publishedReader`/`reader`)

`lib/repos/dev.ts:37`, `criativo.ts:33`, `prophet.ts:48` e `projects.ts:31`
reimplementam a mesma leitura cacheada com fallback ao seed, cada um com uma
pequena variação. Contradiz o que este backlog e o `README.md` afirmam sobre
os leitores compartilharem `publishedReader`.

**Como fazer:** extrair para `lib/repos/utils.ts`, com seed opcional (o caso
do `criativo.ts`), e migrar os 4 pontos de uso. **Como saber que ficou
pronto:** os 4 arquivos importam a mesma função e `npm run test:unit`
continua verde.

## 15. Corrigir contraste do rodapé de `/desenvolvedor`

Labels do rodapé (`footer.dv-section > dl.dv-meta`) em `#6677a9` sobre
`#282a36` dão 3.23:1 — WCAG AA pede 4.5:1. Achado por Lighthouse+axe real,
não só leitura de token.

**Como fazer:** trocar o token de cor do label ou aumentar peso/tamanho da
fonte. **Como saber que ficou pronto:** o audit `color-contrast` do
Lighthouse não aparece mais nessa página.

## 16. Adicionar `Cross-Origin-Opener-Policy`

Os outros 6 headers de segurança (CSP, HSTS, X-Content-Type-Options,
Referrer-Policy, Permissions-Policy, X-Frame-Options) já existem em
`next.config.ts` e foram confirmados por `curl` real; falta só o COOP.

**Como fazer:** adicionar `Cross-Origin-Opener-Policy: same-origin` ao array
de headers. **Como saber que ficou pronto:** `curl -I` contra produção
mostra o header.

## 17. Dividir os arquivos acima de 500 linhas

14 arquivos violam o limite do `CLAUDE.md`. Pior caso:
`src/design-system/realms.ts` (1052 linhas), depois `architecture.ts` (615),
`registry.ts` (612); na camada de dados, `src/lib/repos/tech-feed.ts` (566).

**Como fazer:** extrair por seção/responsabilidade, sem trocar
comportamento — comece pelo pior caso. **Como saber que ficou pronto:**
`find src -name "*.ts*" | xargs wc -l | sort -rn | head` não mostra nada
acima de 500.

## 18. Canonical + structured data

Nenhuma página verificada tem `<link rel="canonical">` nem
`application/ld+json`.

**Como fazer:** adicionar no `generateMetadata`/layout raiz (schema
Person/WebSite para a home, Article para devlogs). **Como saber que ficou
pronto:** `curl` no HTML mostra as duas tags nas rotas principais.

## 19. Ampliar cobertura de Storybook

6 de 226 componentes têm `.stories.tsx` (~2,7%). `@storybook/addon-a11y` já
está configurado, mas sem stories não há o que ele audite.

**Como fazer:** priorizar `components/ui/*` (reusados em várias páginas)
antes de `design-system/*` (mais específicos). **Como saber que ficou
pronto:** sem meta fixa — combine um número realista com o Lucas antes de
começar.

---

# 🟡 Conteúdo

## 1. A zona Rádio toca, mas com uma faixa só — e uma delas é muda

**Conferido em 12/08, no navegador, contra o banco de produção.** A descrição
antiga ("está sem música") deixou de valer quando você subiu o áudio do
"Samurai Blue" — o item 2 registrou a subida e este aqui não acompanhou.

Estado real da coleção `tracks`:

| Faixa        | `audio_url`                          | Situação                                          |
| ------------ | ------------------------------------ | ------------------------------------------------- |
| Samurai Blue | Blob, **200**, 0,91 MB, `audio/mpeg` | **toca** — 44,8 s, `readyState` 4 na página       |
| sirius       | vazio                                | entra na playlist rotulada "sem áudio" e não toca |

`public/musica/` continua só com o `README.md`, então a playlist inteira vem do
banco.

**Não é bug** — o mecanismo está íntegro dos dois lados: a pasta é lida por
`getPlaylistFromFolder`, o banco por `repos/criativo`, e as duas fontes são
somadas em `ZoneRadio`. O `MusicPlayer` já trata o vazio (mensagem própria) e
já rotula a faixa sem arquivo. Zero erro de CSP no console.

**O que falta é conteúdo, e só você tem os arquivos.** Dois caminhos, nenhum
passando por editar o seed:

1. jogar o mp3 em `public/musica/` e commitar — o `README.md` de lá explica a
   convenção `Artista - Título.mp3`;
2. cadastrar em `/admin → Rádio`, que aceita capa e comentário.

**Os dois funcionam hoje** — o teto de 4,5 MB deixou de barrar o caminho 2 em
04/08. Um mp3 de até 25 MB sobe pelo painel.

**Decisão pendente sobre a "sirius":** ou recebe o arquivo, ou sai do ar
(`published: false` pelo `/admin`). Deixá-la publicada e muda repõe exatamente
o que a limpeza de 04/08 tirou do seed — um aviso de "sem áudio" permanente,
que o comentário em `src/data/criativo-zones.ts:258` registra como erro a não
repetir.

## 2. Repor o que falta de mídia

A limpeza de 04/08 zerou campos, não recuperou arquivos. Você já repôs o pôster
e o vídeo do "Samurai Blue" e o áudio da faixa homônima. Sobra pouco:

| Documento                 | Falta                      |
| ------------------------- | -------------------------- |
| `tracks` · "Samurai Blue" | `cover_image`              |
| `tracks` · "sirius"       | `audio_url`, `cover_image` |

As outras quatro fitas da videoteca (`Making of`, `Diário de um bug`, `Letragem`,
`Retrato em 32×32`) têm pôster mas `video_url` vazio — nunca tiveram vídeo, então
mostram só a capa. Não é regressão; é conteúdo a fazer, se você quiser.

## 3. Reescrever o conteúdo do arcano

As quatro páginas (`/anfitriao/oficina`, `/mecanicas`, `/laboratorio`,
`/imprensa`) estão no ar com 12 documentos **escritos pelo Claude, saindo com a
sua assinatura**. Nada afirma histórico pessoal e nenhum `file_url` aponta para
arquivo inexistente — mas é rascunho.

**Armadilha:** `db:sync` escreve no banco e **não revalida o cache**. Publicando
por linha de comando, as páginas servem cache antigo até um deploy novo. Pelo
botão do `/admin`, não.

---

# 🔑 Credenciais — higiene pendente

**Ordem importa**: gerar a nova credencial e atualizá-la em todos os ambientes
ANTES de invalidar a antiga — inverter derruba o backend no intervalo.

## 4. Rotacionar a chave de conta de serviço do Firebase

Console do Google Cloud → IAM → Contas de serviço → `firebase-adminsdk-fbsvc`
→ Chaves → criar nova. Depois: substituir `serviceAccountKey.json`; atualizar
`FIREBASE_PRIVATE_KEY` e `FIREBASE_CLIENT_EMAIL` na Vercel em **Production E
Preview**; redeploy; conferir `/login` → 200; só então apagar a antiga.

<details>
<summary>Armadilhas do processo</summary>

**Não dá para copiar de produção:** as variáveis são _sensitive_;
`vercel env pull` devolve `[SENSITIVE]`. Os valores vêm de fora.

**`vercel link` e `vercel env pull` sobrescrevem o `.env.local`** sem avisar.
Faça cópia antes.

**O `parseEnv` de `scripts/sync-vercel-env.mjs`** lê linha a linha, então só
aceita a `FIREBASE_PRIVATE_KEY` em uma única linha com `\n` escapados. Em 31/07
a chave foi enviada direto do `serviceAccountKey.json`, escapada em memória e
passada por stdin ao CLI, sem tocar o `.env.local` — é como refazer com
segurança.

</details>

## 5. Revogar o token antigo da Vercel

A variável de usuário `VERCEL_TOKEN` **já não existe** nesta máquina (conferido
em 01/08); o CLI usa credencial própria. Falta revogar o token antigo em
https://vercel.com/account/tokens, se ainda estiver listado.

---

# 🟠 Validação restante

## 6. Confirmar o gatilho do Prophet Wire **em produção**

O caminho feliz foi **provado em 05/08**, mas contra o build local com um
`CRON_SECRET` de teste — não contra o deploy. O que ficou provado:

|                             | Resultado                                                                 |
| --------------------------- | ------------------------------------------------------------------------- |
| Sem header / segredo errado | 401, como esperado                                                        |
| Segredo certo               | 200, pipeline roda                                                        |
| Persistência                | acervo cresceu 22 → 29 → 46 rascunhos                                     |
| Histórico                   | as duas execuções registradas (4 → 6 runs)                                |
| **Dedup**                   | **funciona** — 46 docs, 46 hashes/slugs/títulos distintos, zero repetidos |

A segunda execução criou 17 documentos, e por um momento isso pareceu
duplicação. Não era: os 17 eram inéditos, e o log mostra a dedução acontecendo
(`entrada: 23, ineditos: 17, descartados: 6`). Contar o crescimento do acervo
não distingue "duplicou" de "achou coisa nova" — conferir hash é o que
distingue.

**Falta só rodar contra produção**, que é onde o `CRON_SECRET` de verdade e o
agendamento vivem:

```bash
curl -i -X POST https://portifolio2026-two.vercel.app/api/prophet-wire/run -H "Authorization: Bearer SEU_SEGREDO"
```

**Ao ler o relatório:** `published: 0` é o esperado com `publishMode:
"rascunho"`. **`errors: 0` agora é alcançável** — foi o resultado da última
execução local, depois da auditoria de fontes do item 7. Se aparecer erro em
produção, é fonte que caiu desde então.

## 7. Recuperar cobertura: 15 das 24 fontes estão desligadas

Sinal limpo (**`errors: 0`**), cobertura subindo. Ativas: `bgg-blog`,
`dice-tower`, `stonemaier`, `leder-games`, `reddit-boardgames`, `gen-con`,
`uk-games-expo` (extractor de HTML) e, desde 27/08, **`gmt-games`** e
**`plaid-hat`** — 9 de 24.

Cada desligada tem motivo e data no comentário, em `lib/prophet-wire/sources.ts`.

| Barreira                            | Fontes                                                                                                | O que destravaria                                    |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Anti-bot por impressão TLS**      | `cmon`, `icv2-games`, `fantasy-flight`, `czech-games`, `origins`, `kickstarter-tabletop`, `gamefound` | Cliente HTTP que imite navegador. Ver a nota abaixo. |
| **Sem feed — precisa de extractor** | _(nenhuma pendente agora — ver caixa abaixo)_                                                         | —                                                    |
| **Limite de taxa do Reddit**        | `reddit-soloboardgaming`, `reddit-boardgamedeals`                                                     | Cliente autenticado (OAuth) no lugar do RSS público. |
| **Vazio ou quebrado na origem**     | `kosmos`, `portal-games`, `asmodee`, `bgg-hotness`, `ravensburger`, `spiel-essen`                     | Esperar. Nada a fazer do nosso lado.                 |

<details>
<summary>O que a recuperação de 27/08 apurou — duas religadas, duas descartadas por bom motivo</summary>

Das quatro fontes do grupo "sem feed", **duas tinham feed escondido e nenhuma
precisou de extractor de verdade** (uma precisou, mas já existia molde):

- **`gmt-games` — resolvido sem extractor.** A home (que não tem `<item>`) tem
  um link discreto "News RSS" pra `NewsRSS.aspx` — RSS 2.0 completo, com
  `<pubDate>` e tudo. O registry antigo só tinha checado a home; a fonte virou
  `kind: "rss"` apontando pro feed de verdade. Achado colateral: o `<link>`
  desse feed vem **relativo** (`/news.aspx?showarticle=593`), e o parser nunca
  resolvia isso contra a URL da fonte — bug de verdade, não só deste feed.
  Corrigido em `parser.ts` (`absolutizar`), com teste cobrindo o caso.
- **`plaid-hat` — extractor novo**, seguindo o molde do `uk-games-expo`: corta
  por `<article id="post-...">`, sem regex sobre a página inteira. A data não
  aparece em texto na listagem — só no próprio link (`/news/AAAA/MM/DD/slug/`)
  — então `dataPlaidHat` lê dali.
- **`ravensburger` — não é "sem extractor", é site reestruturado.** O domínio
  `.org` inteiro dá 301 pra uma home de loja genérica (`ravensburger.com`,
  `lang="de"`), sem seção de jogos ou notícias em lugar nenhum. Movido pro
  grupo "quebrado na origem" — não há o que raspar até acharem um caminho novo.
- **`spiel-essen` — extraível, mas sem data em lugar nenhum.** A listagem tem
  título, resumo e link limpos, mas **zero data** — nem na listagem, nem na
  página do artigo individual. `withinWindow` descarta todo item sem
  `publishedAt`; um extractor aqui sempre devolveria lista vazia, o "seca em
  silêncio" que o resto do módulo existe pra evitar. Movido pro mesmo grupo do
  `ravensburger`.

**Verificado contra payload real, não só fixture:** rodei o parser de verdade
(`tsx`) contra o RSS do GMT e o HTML do Plaid Hat baixados ao vivo — títulos,
links absolutos e datas batem, incluindo nos itens fora da fixture de teste.

</details>

<details>
<summary>O que a caça aos 404 de 05/08 apurou — e corrigiu</summary>

Dos quatro registrados como "404", **um foi recuperado e três estavam mal
diagnosticados por mim**:

- **`gen-con` — resolvido.** As notícias viraram um blog à parte:
  `https://gencon.blog/feed/`, 10 itens, RSS de verdade. Religada, e já trouxe
  item novo na execução seguinte.
- **`kosmos` — não era 404.** A loja é Shopify, e o feed **existe** em
  `/blogs/news.atom` — só que **vazio**, zero `<entry>`. A URL no registry já é
  a certa; religue quando eles publicarem.
- **`uk-games-expo` — não era 404.** As notícias mudaram para `/content/news/`,
  que responde 200. Mas não há feed em variante nenhuma, e a página não anuncia
  um. Precisa de extractor.
- **`portal-games` — não era 404.** O site responde **200 para qualquer
  caminho**, inclusive inventado, servindo sempre a mesma página. Está quebrado
  ou parqueado.

**Técnica que funcionou e vale repetir:** autodescoberta pela home (`<link
rel="alternate">`) não achou nada em nenhum dos quatro. O que resolveu foi
reconhecer a **plataforma** — o Kosmos tinha `/products/` na home, marca de
Shopify, e Shopify sempre expõe `/blogs/<handle>.atom`. Foi assim que o feed
apareceu, mesmo vazio.

</details>

**A nota que importa, sobre o anti-bot:** o `cmon` responde **200 no `curl`** com
o nosso User-Agent e **403 no `fetch` do Node**. Não é o UA — é o Cloudflare
lendo a impressão TLS do cliente. **Trocar User-Agent não resolve.**

**Sobre o Reddit:** medi com as três em fila e **3 s de pausa** — só a primeira
passa. O limite é por IP, não por concorrência.

# 🟢 Melhorias

## 8. Login e upload de mídia em preview — RESOLVIDO em 27/08

Cada preview ganha URL com hash único e o Firebase Auth exige domínio na
allowlist — não há curinga. **Decidido em 27/08:** branch fixa `preview`.

**O push para `origin/preview` não disparou deploy automático** — o
webhook Git→Vercel não reagiu a essa branch (outras branches já dispararam
preview deploy antes; vale investigar no dashboard da Vercel por quê).
Contornado com deploy manual + alias fixo:

```bash
git checkout preview && git pull
npx vercel deploy                              # cria um deploy Preview novo
npx vercel alias set <url-do-deploy-acima> portifolio2026-preview-lucasriboldis-projects.vercel.app
```

O domínio `portifolio2026-preview-lucasriboldis-projects.vercel.app` já está
no ar (responde 302 em `/portal`, verificado em 27/08) e **já foi autorizado**
em Firebase Console → Authentication → Settings → Authorized domains (27/08,
manual — sem CLI/API disponível para essa parte). Detalhes em
`docs/project-knowledge/auth.md` §6.1.

`BLOB_READ_WRITE_TOKEN` já foi adicionado ao ambiente Preview em 27/08
(`vercel env add`). **Login validado fim a fim em 27/08:** popup do GitHub
completou, sessão criada, `/admin` carregou com dados reais do Firestore (7
projetos, 54 skills, 7 ferramentas). **Upload de mídia validado no mesmo dia:**
PNG de teste enviado em `/admin/media`, apareceu na galeria (que já lista os
arquivos reais — preview lê o mesmo Firestore/Blob de produção) e foi
removido em seguida. Item fechado.

## 9. A varredura de usos relê o banco a cada exclusão

`mapearUsosDeMidia` lê todas as coleções declaradas para responder "este arquivo
está em uso?". São ~170 documentos e roda só no painel, então hoje não incomoda.

Se um dia incomodar, a saída não é cachear — é gravar o vínculo na hora em que a
URL entra no documento, em vez de descobri-lo depois. **Não faça antes de doer:**
o índice derivado é o que não pode dessincronizar.

## 10. Convenção de idioma mista na camada de dados

`buscarLinhas` vs. `listContactMessages`. Padronizar **ao tocar em cada módulo**,
não num varredão — renomear tudo de uma vez produz diff enorme, sem
comportamento novo, que atrapalha o `git blame` do resto.

---

# 🔵 Higiene

## 11. Desligar o projeto Supabase

**Conferido em 01/08, reconferido em 04/08 — seguro apagar:**

| Checagem                          | Resultado                |
| --------------------------------- | ------------------------ |
| Dependência no `package.json`     | nenhuma                  |
| `@supabase/supabase-js` instalado | não                      |
| **URLs do Supabase no Firestore** | **0**, em 170 documentos |

As menções que sobram são conteúdo editorial (snippets, ADRs, tags).

**O arquivo morto já saiu:** `scripts/fix-criativo-covers.mjs` foi apagado em
12/08. Era correção pontual de UPDATE no Supabase, de execução única e já
executada, importando um SDK desinstalado. `scripts/setup-structure.mjs`
deixou de recriar `src/lib/supabase` na mesma data.

**Como:** https://app.supabase.com → projeto → Settings → General → Delete
project. **Irreversível.**

## 12. CSP com `unsafe-inline` em `script-src`

Compromisso de um CSP por header, sem nonce por request. Um CSP estrito exigiria
middleware em todas as rotas. Registrado em `next.config.ts`.

---

## Como usar este arquivo

```
"o que falta?"        → leia daqui, de cima para baixo
"resolve o item N"    → o passo a passo está no item
"terminei o item N"   → remova-o, atualize PROJECT_STATE.md
```

Contexto de apoio: `CLAUDE.md` (arquitetura e restrições),
`PROJECT_STATE.md` (estado do momento),
`docs/project-knowledge/` (conhecimento estável).
