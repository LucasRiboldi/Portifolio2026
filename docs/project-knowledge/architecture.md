# Arquitetura

> Conhecimento estável. Para o estado do momento (bugs, pendências), veja
> `PROJECT_STATE.md`.

---

## 1. A ideia central

O site funciona **com ou sem backend**. Essa não é uma tolerância a falhas
acrescentada depois: é a decisão que organiza o resto.

Cada repositório de leitura tenta o Firestore e, se não houver credencial ou a
query falhar, devolve o conteúdo versionado em `src/data/*.ts`. Consequências:

- O build permanece verde em qualquer ambiente, inclusive CI sem segredos.
- Um clone novo do repositório roda e mostra o site completo.
- O CMS "liga" quando o Firebase é configurado, sem mudança de código.

**Se você remover um fallback, quebra essa propriedade.** Ela é o motivo de
`buscarLinhas` devolver `null` em erro em vez de lançar.

---

## 2. Camadas

```
Rota (Server Component)
   │
   ├── leitura ──► lib/repos/*          unstable_cache + tag
   │                   └──► lib/firebase/query      buscarLinhas / buscarPorId
   │                            └──► Admin SDK ──► Firestore
   │                   └──► (falhou/sem credencial) ──► src/data/*  [seed]
   │
   └── escrita ──► Server Action
                       ├── requireAdmin()          ◄── autorização real
                       ├── validação zod
                       ├── lib/firebase/collection  criarDoc / atualizarDoc / …
                       └── revalidateTag(tag)
```

**Regra da camada:** a rota nunca conhece o formato do banco. A tradução
`snake_case → camelCase` acontece nos mapeadores (`daLinha`, `rowToProject`) de
cada repositório, e só ali.

---

## 3. Onde o acesso a dados acontece

**Todo acesso a dados é server-side, pelo Admin SDK.** O SDK web do Firebase
serve exclusivamente para o login.

Isso tem três consequências que explicam o resto do sistema:

1. **Superfície de ataque mínima.** Nenhum documento é lido pelo browser, então
   não há query de cliente para abusar.
2. **As Security Rules não são a autorização.** O Admin SDK as ignora por
   definição. Elas negam escrita de cliente em tudo — guardam a porta que o app
   não usa. Ver `auth.md`.
3. **`requireAdmin()` é a autorização de verdade**, chamado no topo de cada
   Server Action e de cada página do painel.

---

## 4. Cache e revalidação

Leituras públicas passam por `unstable_cache` com uma tag por recurso
(`lib/repos/tags.ts`). Toda escrita no painel chama `revalidateTag`, então uma
edição aparece no site em segundos sem redeploy.

O painel é `force-dynamic`: dados ao vivo e sessão por request.

---

## 5. Os três realms

O site é dividido em três "multiversos", configuráveis em `/admin`:

| Realm | Rota | Conteúdo |
|---|---|---|
| `creative` (padrão) | `/criativo` | ateliê, banca, cine, rádio, videoteca, mural, tirinhas |
| `developer` | `/desenvolvedor` | devlogs, ideias, snippets, wiki, laboratório, acervo técnico |
| `arcane` | `/anfitriao` | jornal (Daily Prophet) com matérias e agregador de notícias |

Ordem e realm padrão vivem em `lib/realms.ts`; o que está habilitado vem da
coleção `realms`.

---

## 6. Configuração declarativa do painel

O `/admin` não tem uma tela por entidade. Um único CRUD genérico
(`app/admin/crud-actions.ts`) é dirigido por configuração em
`lib/admin/resource-defs-*.ts`, onde cada recurso declara colunas da lista,
campos do formulário, schema zod e tag de cache.

**Adicionar uma entidade é adicionar uma entrada**, não escrever tela nova. Os
arquivos foram partidos em três (`content`, `media`, `materias`) para respeitar
o teto de 500 linhas.

---

## 7. Prophet Wire (agregador de notícias)

Pipeline autônomo que coleta, analisa com IA, deduplica e publica notícias de
board games no jornal. Disparado por cron via `POST /api/prophet-wire/run`,
protegido por `CRON_SECRET` (falha fechada: sem o segredo, recusa tudo).

A persistência está atrás da interface `NewsRepository`, com duas
implementações: `FirestoreNewsRepository` e `InMemoryNewsRepository`. A escolha
é automática pela presença de credencial. **Foi essa interface que tornou a
migração de banco indolor nesta parte do sistema** — nem o pipeline, nem o
painel, nem a landing mudaram.

---

## 8. Fronteiras de sistema

Pontos onde entrada externa chega e precisa de validação:

| Fronteira | Onde | Proteção |
|---|---|---|
| Formulário do jornal | `app/anfitriao/actions.ts` | zod + tetos de tamanho + armadilha anti-bot |
| Upload de mídia | `app/admin/media/actions.ts` | `requireAdmin` + magic bytes + teto de 5 MB |
| Gatilho do agregador | `api/prophet-wire/run` | `CRON_SECRET`, falha fechada |
| Login | `app/auth/session` | verificação do ID token, nada vindo do client é confiado |

---

## 9. Convenções de estilo arquitetural

- **Interface antes de implementação** quando há chance real de troca
  (`NewsRepository`, `RunStore`).
- **Configuração declarativa** em vez de código repetido (recursos do admin).
- **Helper compartilhado** em vez de cópia (`publishedReader` nos repos).
- **Comentário registra o porquê e o histórico**, especialmente quando a
  escolha parece estranha à primeira vista.

Ver `conventions.md`.
