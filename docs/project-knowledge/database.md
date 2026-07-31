# Banco de dados — Firestore

> Substitui o antigo `DATABASE_SCHEMA.md`, que descrevia o schema Postgres do
> Supabase. Histórico da conversão em `migrations/supabase-to-firebase.md`.

---

## 1. Modelagem

**Coleções planas, sem subcoleções.** As 29 tabelas do Postgres viraram 29
coleções de mesmo nome. Não houve remodelagem para NoSQL porque não havia
`JOIN` para desfazer: o conteúdo já era plano, cada registro autocontido.

**Os campos continuam em `snake_case`**, iguais às colunas antigas. Decisão
deliberada: os mapeadores `daLinha()`/`rowTo*()` de cada repositório já
traduziam para camelCase, então preservar o formato os manteve intactos e a
fronteira de tradução ficou onde estava.

**A declaração de campos vive em `src/lib/firebase/schema.ts`.** O Firestore é
schemaless; esse arquivo é a referência e alimenta o teste de integridade do
painel. **Ao adicionar campo a um recurso, adicione ali também.**

---

## 2. Identidade dos documentos

O id do documento é a chave natural quando existe — é o que torna o seed
idempotente (rodar duas vezes reescreve o mesmo documento em vez de criar um
irmão). `idNatural()` em `lib/firebase/collection.ts` procura, nesta ordem:
`id` → `key` → `slug`. Sem nenhum, o Firestore gera um id automático.

| Coleção | Id do documento |
|---|---|
| `site_config`, `prophet_about` | `"default"` (registro único) |
| `realms` | `creative` \| `developer` \| `arcane` |
| `page_content` | a `key` da página |
| `posts`, `prophet_materias` | o `slug` |
| `prophet_wire_news` | o `slug` da notícia |
| `prophet_wire_runs` | ISO do início da execução |
| demais | id automático |

---

## 3. As coleções

**Conteúdo do site** — `projects`, `posts`, `skills`, `tools`, `site_config`,
`realms`, `page_content`, `contact_messages`.

**Realm criativo** — `artworks`, `comics`, `movies`, `tracks`, `videos`,
`notes`, `strips`.

**Realm dev** — `devlogs`, `ideas`, `snippets`, `wiki`, `lab_experiments`.

**Realm arcane / jornal** — `prophet_about`, `prophet_materias`,
`prophet_tutorials`, `prophet_mechanics`, `prophet_prototypes`,
`prophet_resources`, `prophet_wire_news`, `prophet_wire_runs`.

**Legado** — `admin_allowlist` existe mas **não é usada**: a allowlist virou a
variável `ADMIN_GITHUB_LOGIN` mais um custom claim.

> `prophet_tutorials`, `prophet_mechanics`, `prophet_prototypes` e
> `prophet_resources` estão **vazias**, e sempre estiveram — inclusive no
> Postgres, onde a migration só criava as tabelas. Não há seed para elas.

---

## 4. Contrato comum

A maioria das coleções segue o mesmo par de campos:

- **`published: boolean`** — filtro de visibilidade pública.
- **`sort: number`** — ordem manual definida no painel.
- **`created_at: string` (ISO)** — sempre gravado.

### Por que `created_at` é obrigatório

No Postgres era `default now()` na coluna. Aqui, quem insere precisa gravar — e
mais importante: **no Firestore, um documento que não tem o campo usado no
`orderBy` simplesmente não aparece no resultado.** Um documento sem `created_at`
sumiria silenciosamente das listagens. Por isso `criarDoc` e `gravarLote` sempre
o preenchem.

---

## 5. Arrays aninhados

**O Firestore recusa array dentro de array.** Não é limite de tamanho: cada
elemento de array precisa ser indexável isoladamente.

Caso real: `prophet_materias.boxes[].rows`, a matriz linhas × colunas das
tabelas dentro de uma matéria. No Postgres era `jsonb` e qualquer forma servia.

Solução em `src/lib/firebase/nested.ts`: envelopa o array interno como
`{ $arr: [...] }` na gravação e desenvelopa na leitura. Fica na fronteira de
persistência, não nos mapeadores de cada entidade, por dois motivos: a restrição
é do Firestore (qualquer entidade futura com matriz esbarraria nela) e os tipos
de domínio não mudam — `MateriaBox.rows` continua `string[][]` para a página.

---

## 6. Índices

`firestore.indexes.json` — 20 índices compostos, publicados no projeto.

Toda query que **filtra por um campo e ordena por outro** exige índice. Sem ele
a query é **rejeitada inteira** (não filtrada parcialmente), `buscarLinhas`
devolve `null` e o repositório cai no seed. O sintoma é traiçoeiro: o site
parece funcionar e o conteúdo do banco não aparece.

Padrões usados:

| Padrão | Coleções |
|---|---|
| `published` + `sort` + `created_at` | zonas criativas, `projects`, `prophet_materias` |
| `published` + `date desc` | `posts`, `devlogs` |
| `published` + `sort` | `ideas`, `snippets`, `wiki`, `lab_experiments`, `prophet_*` |
| `published` + `pinned desc` + `created_at` | `notes` (fixados primeiro) |
| `status` + `published_at desc` | `prophet_wire_news` |

Publicar: `npx firebase-tools deploy --only firestore --project <id>`.
A construção é assíncrona — leva minutos, e até terminar a query falha com
`FAILED_PRECONDITION: index is currently building`.

---

## 7. Políticas de acesso

Ver `auth.md` e `firestore.rules`. Em resumo: leitura pública do que está
publicado, **escrita de cliente negada em tudo**. Toda escrita passa por Server
Action com `requireAdmin()`.

---

## 8. Operações

```bash
npm run db:seed   # popula apenas coleções vazias (idempotente)
npm run db:sync   # insere o que falta em coleções já povoadas
```

`seed` nunca toca em coleção que já tem documentos. `sync` compara por chave
natural e só insere o ausente — **nunca atualiza nem apaga** conteúdo editado no
painel. Exceção deliberada: ao inserir um projeto `featured`, os demais são
desmarcados, já que a home mostra um único destaque.

Ambos rodam pela linha de comando com a service account, sem exigir login — foi
por isso que o script existe, já que o botão do painel depende de sessão.
