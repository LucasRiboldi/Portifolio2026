# Deploy

> Substitui `docs/deploy.md`.

---

## Ambientes

| Ambiente | Origem | URL |
|---|---|---|
| Local | `npm run dev` | `localhost:3000` |
| Preview | push em branch | `*-lucasriboldis-projects.vercel.app` |
| Produção | push em `main` | `portifolio2026-two.vercel.app` |

Projeto Vercel: **portifolio2026**, com integração Git ativa — `git push origin
main` dispara build de produção.

---

## Variáveis de ambiente

### Firebase (client) — públicas por design

Vão para o bundle do browser. Quem protege são as Security Rules e o Auth, não o
segredo delas.

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     # inerte: Storage não é usado
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Admin SDK — segredo, só servidor

```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

> **A chave privada precisa ficar em UMA linha, entre aspas, com os `\n`
> escapados.** `lib/firebase/admin.ts` os desescapa na leitura. Uma chave colada
> em várias linhas é lida truncada e falha em produção como *invalid PEM* —
> longe da causa. `scripts/sync-vercel-env.mjs` aborta se detectar isso.

Em desenvolvimento, `serviceAccountKey.json` na raiz substitui as duas.
**Ele não existe na Vercel** (é gitignored): sem as variáveis, produção cai no
conteúdo estático e o `/admin` fica inacessível.

### Demais

```
BLOB_READ_WRITE_TOKEN   # injetado ao vincular o Blob store ao projeto
ADMIN_GITHUB_LOGIN      # allowlist de um
GITHUB_TOKEN            # opcional
CRON_SECRET             # obrigatório para o agregador
RESEND_API_KEY          # opcional
CONTACT_TO_EMAIL        # opcional
```

Sincronizar: `npm run sync:vercel-env` (envia o `.env.local` para production,
preview e development, pulando vazias).

> ⚠️ `vercel env pull` **sobrescreve** o `.env.local` com o que existe na
> Vercel. Variáveis que só existem localmente somem. Sincronize antes de puxar.

---

## Primeira configuração

1. **Firestore** → criar (modo produção).
2. **Authentication** → habilitar provedor GitHub; criar o OAuth App com
   callback `https://<projeto>.firebaseapp.com/__/auth/handler`; adicionar o
   domínio de produção em *Authorized domains*.
3. **Vercel Blob** → criar store e **vincular ao projeto**.
4. **Service account** → Project settings → Service accounts → gerar chave.
5. Regras e índices:
   ```bash
   npx firebase-tools deploy --only firestore --project <projeto>
   ```
6. Popular: `npm run db:seed`.
7. `npm run sync:vercel-env` e `git push origin main`.

---

## Checklist

- [ ] Firestore e Authentication (GitHub) habilitados
- [ ] Callback do OAuth App = `.../__/auth/handler` do Firebase
- [ ] Domínio de produção em *Authorized domains*
- [ ] Blob store criado **e vinculado**
- [ ] `firebase-tools deploy --only firestore` executado
- [ ] `.env.local` completo e testado com `npm run dev`
- [ ] `npm run db:seed` rodado
- [ ] `npm run sync:vercel-env` executado
- [ ] `/login` em produção responde 200 e autentica

---

## Armadilhas conhecidas

**Bundling serverless.** `firebase-admin` arrasta dependências ESM-only
(`node-fetch` v3 e família, `jose`). No lambda da Vercel isso pode virar
`require() of ES Module`. Mitigado com `serverExternalPackages` em
`next.config.ts`. **Não reproduz localmente** — `next dev`, `next build` e
`next start` resolvem ESM e CJS sem ajuda. Ver `technical-debt.md`.

**Rotas dinâmicas vs. estáticas.** O erro acima só aparece na primeira rota
**dinâmica** que toca o Admin SDK em runtime (`/login`). As demais são
pré-renderizadas no build e nunca o executam em produção.

**Build local com o dev server no ar.** `npm run build` sobrescreve o `.next/` e
o `next dev` passa a dar 404 nos chunks. Pare o dev, `rm -rf .next`, suba de
novo.

---

## CI

Não há pipeline de CI configurado. Validação hoje é local:

```bash
npx tsc --noEmit && npm run lint && npm run test:unit && npm run build
```

Registrado como pendência em `technical-debt.md`.
