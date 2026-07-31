# Deploy — Portfólio LR (Vercel + Firebase)

Guia para colocar o site + CMS no ar. O site já roda em **modo fallback** (conteúdo
estático) sem nenhuma configuração; os passos abaixo ativam o CMS em produção.

Projeto Vercel linkado: **portifolio2026** (`.vercel/project.json`).
Deploy automático: cada `git push origin main` dispara um build de produção.

## Ordem recomendada

### 1. Firebase (uma vez)

No [console do Firebase](https://console.firebase.google.com):

1. **Firestore Database** → criar (modo produção).
2. **Authentication** → *Get started* → habilitar o provedor **GitHub**.
   Crie o OAuth App no GitHub (Settings → Developer settings → OAuth Apps) e
   cole `Client ID` / `Client Secret`. O callback é o que o Firebase mostra:
   `https://<projeto>.firebaseapp.com/__/auth/handler`.
3. **Storage** → criar o bucket padrão (necessário para a mídia do painel).
4. **Project settings → Service accounts** → *Generate new private key*.

Publique regras e índices:

```bash
npx firebase-tools deploy --only firestore,storage --project <seu-projeto>
```

### 2. Preencher `.env.local`

Config do SDK web em **Project settings → General → Your apps**; a service
account no passo 1.4. Ver `.env.example` para a lista completa.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<projeto>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<projeto>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<projeto>.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
FIREBASE_PROJECT_ID=<projeto>
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@<projeto>.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
"
ADMIN_GITHUB_LOGIN=LucasRiboldi
```

Em desenvolvimento, as duas últimas do Admin SDK podem ser substituídas pelo
arquivo `serviceAccountKey.json` na raiz (gitignored).

Popular o banco: `npm run db:seed` (pela linha de comando, não exige login) ou
`/login` → Dashboard → **Popular banco**.

### 3. Enviar as variáveis para o Vercel

Com o `.env.local` preenchido:

```bash
npm run sync:vercel-env          # production + preview + development
# ou um ambiente só:
node scripts/sync-vercel-env.mjs production
```

O script pula variáveis vazias e reaplica as existentes (espelha o `.env.local`).
Alternativa manual: **Vercel → Project → Settings → Environment Variables**.

> ⚠️ `FIREBASE_PRIVATE_KEY` tem quebras de linha. Ao colar no painel da Vercel,
> mantenha os `
` escapados — `lib/firebase/admin.ts` os desescapa na leitura.

### 4. Autorizar o domínio de produção no Firebase

Em **Authentication → Settings → Authorized domains**, adicione o domínio de
produção (ex.: `portifolio2026-two.vercel.app`). Sem isso o popup de login é
recusado pelo Firebase.

### 5. Deploy

```bash
git push origin main     # deploy automático
# ou forçar produção pelo CLI:
vercel --prod
```

## Checklist rápido

- [ ] Firestore, Authentication (GitHub) e Storage habilitados no console
- [ ] `firebase-tools deploy --only firestore,storage` executado
- [ ] `.env.local` preenchido e testado com `npm run dev`
- [ ] `npm run db:seed` rodado (uma vez)
- [ ] `npm run sync:vercel-env` executado
- [ ] Domínio de produção em *Authorized domains*
- [ ] Deploy feito (`git push` ou `vercel --prod`)
- [ ] `/login` em produção autentica e Dashboard mostra os contadores

## Segurança

- `FIREBASE_PRIVATE_KEY` **nunca** vai para o client — usada só em
  `src/lib/firebase/admin.ts` (server). Não commitar `.env.local` nem
  `serviceAccountKey.json` (ambos gitignored).
- A config `NEXT_PUBLIC_FIREBASE_*` é pública por design: vai no bundle do
  browser. Quem protege são as Security Rules e o Auth, não o segredo dela.
- `/admin` é protegido por middleware (presença do cookie) + `requireAdmin()`
  (verificação real), restrito ao login em `ADMIN_GITHUB_LOGIN`. O Admin SDK
  ignora Security Rules, então `requireAdmin()` é a autorização, não um reforço.
