# Deploy — Portfólio LR (Vercel + Supabase)

Guia para colocar o site + CMS no ar. O site já roda em **modo fallback** (conteúdo
estático) sem nenhuma configuração; os passos abaixo ativam o CMS em produção.

Projeto Vercel linkado: **portifolio2026** (`.vercel/project.json`).
Deploy automático: cada `git push origin main` dispara um build de produção.

## Ordem recomendada

### 1. Supabase (uma vez)

Siga [`supabase/README.md`](../supabase/README.md):
criar projeto → rodar `0001_schema.sql` e `0002_storage.sql` → inserir seu login
na `admin_allowlist` → configurar GitHub OAuth.

### 2. Preencher `.env.local`

Copie os valores do Supabase (Settings → API) e do Resend para o `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # segredo
ADMIN_GITHUB_LOGIN=LucasRiboldi
RESEND_API_KEY=re_...                  # opcional
CONTACT_TO_EMAIL=lucasriboldi.dev@gmail.com
```

Teste local: `npm run dev` → `/login` → entrar com GitHub → Dashboard → **Popular banco**.

### 3. Enviar as variáveis para o Vercel

Com o `.env.local` preenchido:

```bash
npm run sync:vercel-env          # production + preview + development
# ou um ambiente só:
node scripts/sync-vercel-env.mjs production
```

O script pula variáveis vazias e reaplica as existentes (espelha o `.env.local`).
Alternativa manual: **Vercel → Project → Settings → Environment Variables**.

### 4. Configurar URLs de redirect do Supabase (produção)

Em **Supabase → Authentication → URL Configuration**, adicione a URL de produção
às *Redirect URLs* (ex.: `https://portifolio2026-two.vercel.app/**`). O callback
do GitHub OAuth aponta para `https://<projeto>.supabase.co/auth/v1/callback`.

### 5. Deploy

```bash
git push origin main     # deploy automático
# ou forçar produção pelo CLI:
vercel --prod
```

## Checklist rápido

- [ ] Migrations `0001` e `0002` aplicadas no Supabase
- [ ] Login inserido em `admin_allowlist`
- [ ] GitHub OAuth App criado e provider habilitado no Supabase
- [ ] `.env.local` preenchido e testado com `npm run dev`
- [ ] `npm run sync:vercel-env` executado
- [ ] Redirect URLs de produção no Supabase
- [ ] Deploy feito (`git push` ou `vercel --prod`)
- [ ] `/login` em produção autentica e Dashboard mostra os contadores
- [ ] "Popular banco" rodado em produção (uma vez)

## Segurança

- `SUPABASE_SERVICE_ROLE_KEY` **nunca** vai para o client — usado só em
  `src/lib/supabase/admin.ts` (server). Não commitar `.env.local` (gitignored).
- `/admin` é protegido por middleware + `requireAdmin()` + RLS (`is_admin()`),
  restrito ao login em `ADMIN_GITHUB_LOGIN` / `admin_allowlist`.
