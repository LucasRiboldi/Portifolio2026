# Supabase — setup do CMS

O painel `/admin` e o CMS usam **Supabase** (Postgres + Auth + Storage). Enquanto
não estiver configurado, o site funciona com o conteúdo estático (`src/data/*.ts`)
e `/admin` fica bloqueado.

## 1. Criar o projeto

1. Crie um projeto em https://app.supabase.com.
2. Em **Project Settings → API**, copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (**segredo**, só server)

## 2. Rodar as migrations

No **SQL Editor** do Supabase, execute na ordem:

1. `supabase/migrations/0001_schema.sql` — tabelas, RLS, `is_admin()`, allowlist.
2. `supabase/migrations/0002_storage.sql` — bucket de mídia + políticas.

Depois, registre seu login do GitHub na allowlist:

```sql
insert into public.admin_allowlist (github_login) values ('lucasriboldi');
```

## 3. GitHub OAuth

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Homepage URL: a URL do site (ou `http://localhost:3000` em dev).
   - Authorization callback URL: `https://<SEU-PROJETO>.supabase.co/auth/v1/callback`
2. No Supabase → **Authentication → Providers → GitHub**: cole `Client ID` e
   `Client Secret` e habilite.
3. Em **Authentication → URL Configuration**, adicione as Redirect URLs do site
   (`http://localhost:3000/**` e a de produção `/**`).

## 4. Variáveis de ambiente

Copie `.env.example` para `.env.local` (dev) e preencha. Na **Vercel**, defina as
mesmas variáveis (Project → Settings → Environment Variables).

```
NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…
ADMIN_GITHUB_LOGIN=LucasRiboldi
RESEND_API_KEY=…            # opcional (e-mail do contato)
CONTACT_TO_EMAIL=…          # opcional
```

## 5. Popular o banco

Suba o site, entre em `/login` com o GitHub autorizado e, no **Dashboard** do
admin, clique em **“Popular banco com o conteúdo atual”**. Isso copia o conteúdo
estático para o Supabase (idempotente — só popula tabelas vazias).

Pronto: edições no `/admin` aparecem no site em segundos (ISR + revalidateTag).
