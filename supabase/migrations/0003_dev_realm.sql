-- ════════════════════════════════════════════════════════════════════════
--  Realm DEV — conteúdo exclusivo do universo Developer.
--  DevLogs, Ideias, Snippets (Código), Wiki e Laboratório.
--  (Projetos e Ferramentas reaproveitam as tabelas existentes.)
-- ════════════════════════════════════════════════════════════════════════

-- ─── devlogs (registro cronológico) ─────────────────────────────────────
create table if not exists public.devlogs (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  date       date not null default current_date,
  summary    text not null default '',
  body       text not null default '',
  tags       text[] not null default '{}',
  published  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger devlogs_touch before update on public.devlogs
  for each row execute function public.touch_updated_at();

-- ─── ideas (backlog de projetos/MVPs) ───────────────────────────────────
create table if not exists public.ideas (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  status      text not null default 'idea'
                check (status in ('idea','mvp','building','paused','done')),
  tags        text[] not null default '{}',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── snippets (Código: reutilizáveis/boilerplates) ──────────────────────
create table if not exists public.snippets (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  language    text not null default 'ts',
  description text not null default '',
  code        text not null default '',
  tags        text[] not null default '{}',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── wiki (documentação/cheatsheets) ────────────────────────────────────
create table if not exists public.wiki (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  category   text not null default 'Geral',
  body       text not null default '',
  published  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger wiki_touch before update on public.wiki
  for each row execute function public.touch_updated_at();

-- ─── lab_experiments (Laboratório) ──────────────────────────────────────
create table if not exists public.lab_experiments (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  status      text not null default 'wip'
                check (status in ('wip','playtest','stable','archived')),
  stack       text[] not null default '{}',
  demo_url    text,
  repo_url    text,
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── RLS (leitura pública dos publicados; escrita só admin) ─────────────
alter table public.devlogs         enable row level security;
alter table public.ideas           enable row level security;
alter table public.snippets        enable row level security;
alter table public.wiki            enable row level security;
alter table public.lab_experiments enable row level security;

create policy "devlogs_read" on public.devlogs for select using (published or public.is_admin());
create policy "ideas_read" on public.ideas for select using (published or public.is_admin());
create policy "snippets_read" on public.snippets for select using (published or public.is_admin());
create policy "wiki_read" on public.wiki for select using (published or public.is_admin());
create policy "lab_read" on public.lab_experiments for select using (published or public.is_admin());

create policy "devlogs_admin_write" on public.devlogs for all using (public.is_admin()) with check (public.is_admin());
create policy "ideas_admin_write" on public.ideas for all using (public.is_admin()) with check (public.is_admin());
create policy "snippets_admin_write" on public.snippets for all using (public.is_admin()) with check (public.is_admin());
create policy "wiki_admin_write" on public.wiki for all using (public.is_admin()) with check (public.is_admin());
create policy "lab_admin_write" on public.lab_experiments for all using (public.is_admin()) with check (public.is_admin());
