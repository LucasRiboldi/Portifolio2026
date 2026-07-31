# Migração: Supabase → Firebase

**Data:** 2026-07-31 · **Commits:** `7f97a9e` … `12fcc5f` (10) ·
**Superfície:** 104 arquivos

---

## 1. Motivo

Decisão do dono do projeto. Restrição adicional levantada durante a execução:
**o projeto deve custar zero**, o que determinou a escolha de mídia (ver §5).

---

## 2. Arquitetura antes e depois

| | Antes | Depois |
|---|---|---|
| Banco | Postgres (Supabase), 29 tabelas | Firestore, 29 coleções |
| Acesso | `@supabase/supabase-js` + `@supabase/ssr` | `firebase-admin` (server-only) |
| Auth | Supabase Auth, GitHub OAuth por **redirect** | Firebase Auth, GitHub OAuth por **popup** + session cookie |
| Sessão | cookies geridos pelo `@supabase/ssr` | cookie assinado pelo Admin SDK |
| Autorização | 63 RLS policies + `is_admin()` | `requireAdmin()` + custom claim |
| Storage | bucket `public-media` | **Vercel Blob** |
| Schema | migrations SQL | `lib/firebase/schema.ts` (declaração) |

---

## 3. Equivalências implementadas

| Supabase | Firebase | Observação |
|---|---|---|
| `select("*").eq().order()` | `buscarLinhas()` | superfície pequena coube atrás de duas funções |
| `maybeSingle()` por PK | `buscarPorId()` | |
| `insert()` | `criarDoc()` / `gravarLote()` | |
| `update().eq("id")` | `atualizarDoc()` | |
| `upsert({id})` | `set(merge)` no id do documento | chave natural vira id |
| `update().eq(campo, v)` | `atualizarOnde()` | `UPDATE … WHERE` não existe; acha e grava em lote |
| `count: exact, head: true` | agregação `count()` | server-side, não lê documentos |
| `default now()` | preenchido por `criarDoc` | ver §4 |
| RLS `*_read_published` | regra `published == true` | |
| RLS `*_admin_write` | **escrita de cliente negada** | mais restritivo que antes |
| `messages_public_insert` | Server Action validada | |
| bucket público | Vercel Blob público | |

---

## 4. Impactos e diferenças de comportamento

**1. `created_at` deixou de ser automático.** Era `default now()` na coluna. E
há uma consequência não óbvia: no Firestore, **documento sem o campo usado no
`orderBy` some do resultado**. Um registro sem `created_at` desapareceria das
listagens. Por isso `criarDoc`/`gravarLote` sempre o gravam.

**2. Filtragem linha a linha virou tudo-ou-nada.** A RLS filtrava
transparentemente; no Firestore, query que peça documento não permitido é
**rejeitada inteira**.

**3. Índices compostos são obrigatórios.** Filtro + ordenação exige índice
declarado. Sem ele a query falha, o repo cai no seed e o site parece funcionar
com o dado errado — sintoma traiçoeiro.

**4. O middleware deixou de validar sessão.** O Admin SDK não roda no Edge. A
verificação real sempre esteve no `requireAdmin()`; o middleware virou filtro de
presença de cookie.

**5. Claims propagam com atraso.** `is_admin()` lia uma tabela a cada query;
custom claims só entram em tokens novos. Mitigado lendo as claims do registro do
usuário, não do cookie.

**6. Só a allowlist recebe sessão.** Antes qualquer conta GitHub logava e o
`/admin` barrava depois. Endurecimento deliberado.

**7. Array dentro de array é proibido.** O `jsonb` aceitava qualquer forma. Caso
real: `prophet_materias.boxes[].rows`. Resolvido em `lib/firebase/nested.ts`,
na fronteira de persistência — os tipos de domínio não mudaram.

**8. O schema deixou de existir como artefato.** As migrations alimentavam o
teste de integridade do painel. `lib/firebase/schema.ts` foi **gerado a partir
das migrations, na última vez em que existiram**, e mantém a verificação viva.

---

## 5. Por que a mídia não foi para o Firebase Storage

O Cloud Storage exige o plano **Blaze** (cartão cadastrado). Firestore e Auth
cabem no plano gratuito. Como o projeto precisa custar zero, a mídia foi para o
**Vercel Blob** — cota inclusa no Hobby, mesma plataforma do site.

**Custo da escolha:** dois fornecedores no backend. **Ganho:** o painel continua
publicando imagem sem redeploy, que é a razão de ele existir.

---

## 6. Dados

Escolha do dono: **re-seed a partir de `src/data/*`**, não exportação do
Postgres. Motivo prático somado: a senha do banco não estava disponível.

**Risco assumido e declarado:** qualquer edição feita pelo `/admin` que não
tenha voltado para o código foi perdida. Não houve como medir quanto.

O seed gravou 19 coleções. Quatro coleções do realm arcane seguem vazias —
sempre estiveram, inclusive no Postgres.

---

## 7. Riscos remanescentes

1. **`/login` 500 em produção** — aberto. Ver `technical-debt.md` §1.
2. **Nenhum fluxo de escrita exercido de verdade** — login, CRUD e upload nunca
   rodaram ponta a ponta.
3. **Projeto Supabase ainda ativo** — de propósito, como rede de segurança.

---

## 8. Checklist de validação

Feito:

- [x] `tsc --noEmit` limpo
- [x] `eslint` sem erros
- [x] 535 testes passando
- [x] `next build` — 93 páginas
- [x] Seed gravou as coleções no Firestore real
- [x] 20 índices publicados e todas as queries compostas respondendo
- [x] Round-trip da matriz aninhada verificado
- [x] Credencial do Admin SDK por env var testada (o caminho da produção)
- [x] Popup de login abre com callback e escopos corretos
- [x] Middleware redireciona `/admin` sem sessão

Pendente:

- [ ] `/login` responder 200 em produção
- [ ] Login completo no browser (0 usuários no Auth)
- [ ] CRUD pelo painel
- [ ] Upload no Vercel Blob
- [ ] Cupom público do jornal
- [ ] Desligar o projeto Supabase

---

## 9. Lições

**O que a arquitetura anterior facilitou:** a interface `NewsRepository` tornou
a migração do agregador indolor — trocou-se a implementação e nada mais mudou.
Os mapeadores por repositório permitiram manter `snake_case` no banco novo sem
tocar em nenhuma página.

**O que custou caro:** três falhas só apareceram fora do ambiente local — CSP
bloqueando o popup (`auth/internal-error`, mensagem que não menciona CSP),
callback do OAuth App herdado do Supabase (o GitHub só valida **depois** do
login, então testar deslogado não detecta), e o empacotamento serverless com
dependências ESM. Nenhuma delas é detectável por `tsc`, teste unitário ou build.

**Conclusão prática:** para migração de backend, um deploy de preview validado
ponta a ponta **antes** de mexer em produção teria encontrado as três.
