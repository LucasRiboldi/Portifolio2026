-- ════════════════════════════════════════════════════════════════════════
--  REALMS DEV + DAILY PROPHET — setup idempotente e re-executável.
--  Pode rodar quantas vezes quiser: cria o que falta, recria triggers/policies.
--  Cole TUDO no SQL Editor do Supabase e clique RUN.
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── Funções auxiliares (garantidas) ────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_allowlist a
    where a.github_login = lower(
      coalesce(auth.jwt() -> 'user_metadata' ->> 'user_name', auth.jwt() ->> 'user_name')
    )
  );
$$;

-- ════════════════════════════════════════════════════════════════════════
--  REALM DEV
-- ════════════════════════════════════════════════════════════════════════
create table if not exists public.devlogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null,
  date date not null default current_date,
  summary text not null default '', body text not null default '',
  tags text[] not null default '{}',
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text not null default '',
  status text not null default 'idea' check (status in ('idea','mvp','building','paused','done')),
  tags text[] not null default '{}',
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.snippets (
  id uuid primary key default gen_random_uuid(),
  title text not null, language text not null default 'ts',
  description text not null default '', code text not null default '',
  tags text[] not null default '{}',
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.wiki (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null,
  category text not null default 'Geral', body text not null default '',
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.lab_experiments (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text not null default '',
  status text not null default 'wip' check (status in ('wip','playtest','stable','archived')),
  stack text[] not null default '{}', demo_url text, repo_url text,
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════
--  REALM DAILY PROPHET
-- ════════════════════════════════════════════════════════════════════════
create table if not exists public.prophet_tutorials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null,
  summary text not null default '', body text not null default '',
  difficulty text not null default 'iniciante' check (difficulty in ('iniciante','intermediario','avancado')),
  tags text[] not null default '{}',
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.prophet_mechanics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title text not null,
  summary text not null default '', body text not null default '',
  tags text[] not null default '{}',
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.prophet_prototypes (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text not null default '',
  status text not null default 'conceito' check (status in ('conceito','prototipo','playtest','publicado')),
  players text not null default '', playtime text not null default '',
  tags text[] not null default '{}',
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.prophet_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text not null default '',
  type text not null default 'pnp' check (type in ('pnp','cartas','tabuleiro','regras','outro')),
  file_url text,
  published boolean not null default true, sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.prophet_about (
  id text primary key default 'default',
  author text not null default '', intro text not null default '',
  passion text not null default '', proposal text not null default '',
  updated_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════
--  Triggers de updated_at (idempotentes)
-- ════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['devlogs','wiki','prophet_tutorials','prophet_mechanics','prophet_about']
  loop
    execute format('drop trigger if exists %I on public.%I', t||'_touch', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_at()', t||'_touch', t);
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════
--  RLS + policies (idempotentes): leitura pública dos publicados, escrita admin
-- ════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array['devlogs','ideas','snippets','wiki','lab_experiments',
                           'prophet_tutorials','prophet_mechanics','prophet_prototypes','prophet_resources','prophet_about']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t||'_read', t);
    execute format('drop policy if exists %I on public.%I', t||'_write', t);

    if t = 'prophet_about' then
      execute format('create policy %I on public.%I for select using (true)', t||'_read', t);
    else
      execute format('create policy %I on public.%I for select using (published or public.is_admin())', t||'_read', t);
    end if;
    execute format('create policy %I on public.%I for all using (public.is_admin()) with check (public.is_admin())', t||'_write', t);
  end loop;
end $$;

-- Recarrega o schema cache do PostgREST (evita "schema cache" ao inserir).
notify pgrst, 'reload schema';
