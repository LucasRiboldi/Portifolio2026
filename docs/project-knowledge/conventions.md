# Convenções

---

## Idioma

- **Comentários e documentação em português.**
- **Identificadores de domínio em inglês** quando já estabelecidos no schema:
  `published`, `sort`, `slug`, `created_at`.
- Funções novas da camada de dados em português (`buscarLinhas`, `criarDoc`,
  `gravarLote`) — foi a escolha feita na migração; mantenha a coerência dentro
  de cada módulo em vez de padronizar tudo de uma vez.

## Comentários

**Explique o porquê, não o quê.** O código já diz o que faz.

Merece comentário: decisão que parece estranha à primeira vista, restrição
externa (limite do Firestore, comportamento do Next), armadilha já vivida,
alternativa descartada e o motivo.

Não merece: repetir a assinatura da função, narrar o óbvio.

```ts
// ✅ registra a restrição e a consequência
// Documento sem o campo ordenado some de queries com orderBy — por isso
// created_at é sempre gravado.

// ❌ narra o óbvio
// Cria um documento no Firestore
```

## Arquivos

- **Máximo 500 linhas.** Quando estourar, parta por eixo semântico — foi o que
  aconteceu com `resource-defs-{content,media,materias}.ts`.
- Nunca salve arquivo de trabalho ou teste na raiz: use `src/`, `tests/`,
  `docs/`, `scripts/`.
- Scripts temporários seguem o padrão `_*.mjs` (gitignored).

## Camada de dados

- **Leitura** por `lib/firebase/query.ts`; **escrita** por
  `lib/firebase/collection.ts`. Não chame `getDb()` direto de uma rota.
- Todo leitor público usa `unstable_cache` com tag de `lib/repos/tags.ts`.
- Toda escrita revalida a tag correspondente.
- **Erro de leitura devolve `null`**, e o repositório cai no seed. Não lance:
  isso quebraria a propriedade de funcionar sem backend.

## Server Actions

Padrão obrigatório:

```ts
"use server"

export async function acao(...): Promise<ActionResult> {
  await adminContext()              // 1. requireAdmin — sempre primeiro
  const parsed = schema.safeParse(...)  // 2. validação zod
  if (!parsed.success) return fail(...)
  try { /* 3. escrita */ } catch (err) { return fail(...) }
  revalidate(TAG)                   // 4. revalidação
  return ok()
}
```

O `requireAdmin()` não é reforço — **é a autorização**. O Admin SDK ignora
Security Rules.

## Tipagem

- `strict` ligado. **Sem `any`**; use `unknown` e estreite.
- Tipos de linha (`ProjectRow`, `MateriaRow`) descrevem o **formato do banco**,
  em snake_case. Tipos de domínio são camelCase.
- A tradução acontece nos mapeadores (`daLinha`, `rowToProject`) e **só ali**.

## Componentes

- Server Component por padrão. `"use client"` só quando há estado, efeito ou
  evento.
- `"use client"` **não impede o SSR**: o componente é renderizado no servidor
  para o HTML inicial. Dependência pesada ou ESM-only deve ser carregada por
  import dinâmico dentro da função — foi o que se fez em
  `lib/firebase/client.ts`.
- Indicador de UI baseado em estado de login não pode tornar a página dinâmica;
  use `useAuthState`, que roda só no client e preserva o ISR.

## Testes

- **Sem rede e sem credencial.** Um teste que consulta o Firestore de verdade
  está errado — injete o fake (`setDefaultRepository`, mock de
  `@/lib/firebase/query`).
- Teste que depende de arquivo local (como `serviceAccountKey.json`) passa em CI
  e falha na máquina de quem tem acesso: o pior tipo de falha.
- Testes de integridade leem o próprio código-fonte para garantir que
  configuração e implementação não divergem. Ao mudar um contrato, atualize-os.

## Git

- Mensagem em português, imperativo, explicando **por que** — o diff já mostra o
  quê.
- Commit por marco concluído e verificado, não por sessão.
- **O que não foi verificado não entra na mensagem como se tivesse sido.**
- Sem `Co-Authored-By` neste repositório.

## Documentação

- Uma fonte de verdade por assunto. Descobriu algo relevante? Atualize
  `docs/project-knowledge/`, `CLAUDE.md` e `PROJECT_STATE.md` — não deixe o
  conhecimento só no código nem só no chat.
- Documento vazio é pior que documento ausente: promete e não entrega.
