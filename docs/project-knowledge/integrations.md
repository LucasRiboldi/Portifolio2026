# Integrações e serviços externos

---

## Mapa

| Serviço | Papel | Criticidade | Custo |
|---|---|---|---|
| **Firebase Firestore** | banco principal | alta — sem ele o site cai no seed | gratuito (Spark) |
| **Firebase Auth** | login do admin | alta — sem ele não há painel | gratuito (Spark) |
| **Vercel** | hospedagem, build, CDN | alta | gratuito (Hobby) |
| **Vercel Blob** | mídia do painel | média — só afeta upload | incluso no Hobby |
| **GitHub OAuth** | identidade do admin | alta | gratuito |
| **GitHub API** | id numérico → username | média — só no login | gratuito |
| **IA (Vercel AI SDK)** | análise do agregador | baixa — recurso isolado | conforme provedor |

---

## Firebase

**Projeto:** `portifolio-ac32a`

Dois SDKs, com papéis separados e não intercambiáveis:

- **Admin SDK** (`firebase-admin`, server-only) — todo acesso a dados. Ignora
  Security Rules. Credencial por `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`
  ou pelo `serviceAccountKey.json` local.
- **SDK web** (`firebase`, client) — **apenas o login**. Carregado sob demanda
  (import dinâmico), não no bundle inicial.

**O Storage do Firebase não é usado:** exige o plano Blaze, com cartão. Como o
projeto precisa custar zero, a mídia foi para o Vercel Blob. O campo
`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` permanece por fazer parte da config padrão
do SDK, mas está inerte.

---

## Vercel Blob

Store `portfolio-midia`, público. Objetos sob o prefixo `public-media/`.

O token `BLOB_READ_WRITE_TOKEN` é injetado ao **vincular o store ao projeto**
(Storage → store → Connect Project) — criar o store não basta.

Sem token, o painel abre normalmente e o upload recusa com aviso claro. **Quem
sabe se a mídia está configurada é o servidor**; os componentes não têm gate
próprio, para não existirem duas verdades que divergem.

---

## GitHub

Duas integrações distintas:

1. **OAuth App** — identidade do admin. Callback obrigatoriamente
   `https://<projeto>.firebaseapp.com/__/auth/handler`. Ver `auth.md`.
2. **API pública** — traduz o id numérico do provider no username, uma vez por
   login. `GITHUB_TOKEN` é opcional e só eleva o rate limit.

---

## Prophet Wire — fontes externas

O agregador consome feeds públicos de board games (`lib/prophet-wire/sources.ts`)
e usa IA para análise e redação (`ai-client.ts`).

Cuidados já embutidos:

- **Timeout e limites** no cliente HTTP.
- **Deduplicação por hash** antes de qualquer chamada cara de IA.
- **`image-resolver`** ainda hotlinka imagens da fonte — está registrado em
  `technical-debt.md` como risco de privacidade (revela o IP do leitor ao
  domínio de origem).

---

## Serviços opcionais

| Variável | Serviço | Se ausente |
|---|---|---|
| `RESEND_API_KEY` | e-mail transacional | recurso de e-mail inativo |
| `CONTACT_TO_EMAIL` | destino do contato | idem |
| `GITHUB_TOKEN` | rate limit da API | 60 req/h em vez de 5000 |
| `CRON_SECRET` | gatilho do agregador | **endpoint recusa tudo** |

---

## Dependência que não existe mais

**Supabase.** Removido por completo em 2026-07-31 — código, dependências,
migrations e policies. O projeto antigo continua no ar como rede de segurança e
deve ser desligado depois de validado o Firebase. Ver
`migrations/supabase-to-firebase.md`.
