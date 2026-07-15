-- ═══ SETUP COMPLETO — cole tudo no SQL Editor do Supabase e clique RUN ═══
-- Gerado automaticamente: schema + storage + allowlist do admin.

-- ════════════════════════════════════════════════════════════════════════
--  Portfólio LR — schema inicial (projects, posts, skills, tools, config,
--  realms, mensagens de contato) + allowlist de admin + RLS.
--  Rode no SQL Editor do Supabase (ou via `supabase db push`).
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── Allowlist de admin (github login, minúsculo) ───────────────────────
create table if not exists public.admin_allowlist (
  github_login text primary key
);

-- helper: a sessão atual é de um admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowlist a
    where a.github_login = lower(
      coalesce(
        auth.jwt() -> 'user_metadata' ->> 'user_name',
        auth.jwt() ->> 'user_name'
      )
    )
  );
$$;

-- trigger genérico de updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── projects ───────────────────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  category    text not null check (category in ('design','code','art','image')),
  tags        text[] not null default '{}',
  cover_image text not null default '',
  href        text,
  featured    boolean not null default false,
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

-- ─── posts ──────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text not null default '',
  date            date not null default current_date,
  reading_minutes int not null default 1,
  tags            text[] not null default '{}',
  accent          text not null default 'magenta'
                    check (accent in ('magenta','cyan','lime','violet')),
  body            text not null default '',
  published       boolean not null default true,
  sort            int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

-- ─── skills ─────────────────────────────────────────────────────────────
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  command     text not null default '',
  description text not null default '',
  category    text not null check (category in
                ('frontend','design','performance','quality','system','git','orchestration')),
  sort        int not null default 0
);

-- ─── tools ──────────────────────────────────────────────────────────────
create table if not exists public.tools (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  type        text not null check (type in
                ('webapp','cli','extension','bot','script','plugin')),
  stack       text[] not null default '{}',
  emoji       text not null default '',
  demo_url    text,
  github_url  text,
  sort        int not null default 0
);

-- ─── site_config (linha única) ──────────────────────────────────────────
create table if not exists public.site_config (
  id             text primary key default 'default',
  name           text not null default '',
  title          text not null default '',
  description    text not null default '',
  github         text not null default '',
  linkedin       text not null default '',
  email          text not null default '',
  location       text not null default '',
  og_title       text,
  og_description text,
  updated_at     timestamptz not null default now()
);
create trigger site_config_touch before update on public.site_config
  for each row execute function public.touch_updated_at();

-- ─── realms ─────────────────────────────────────────────────────────────
create table if not exists public.realms (
  id             text primary key check (id in ('creative','developer','arcane')),
  label          text not null,
  glyph          text not null default '',
  enabled        boolean not null default true,
  is_default     boolean not null default false,
  morph_label    text not null default '',
  aria           text not null default '',
  arcane_content jsonb,
  sort           int not null default 0
);

-- ─── contact_messages ───────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════════════
--  RLS
-- ════════════════════════════════════════════════════════════════════════
alter table public.projects         enable row level security;
alter table public.posts            enable row level security;
alter table public.skills           enable row level security;
alter table public.tools            enable row level security;
alter table public.site_config      enable row level security;
alter table public.realms           enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_allowlist  enable row level security;

-- Leitura pública: projects/posts só publicados; resto livre.
create policy "projects_read_published" on public.projects
  for select using (published or public.is_admin());
create policy "posts_read_published" on public.posts
  for select using (published or public.is_admin());
create policy "skills_read" on public.skills for select using (true);
create policy "tools_read"  on public.tools  for select using (true);
create policy "site_read"   on public.site_config for select using (true);
create policy "realms_read" on public.realms for select using (true);

-- Escrita: só admin.
create policy "projects_admin_write" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());
create policy "posts_admin_write" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());
create policy "skills_admin_write" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());
create policy "tools_admin_write" on public.tools
  for all using (public.is_admin()) with check (public.is_admin());
create policy "site_admin_write" on public.site_config
  for all using (public.is_admin()) with check (public.is_admin());
create policy "realms_admin_write" on public.realms
  for all using (public.is_admin()) with check (public.is_admin());

-- Mensagens de contato: qualquer um insere; só admin lê/atualiza.
create policy "messages_public_insert" on public.contact_messages
  for insert with check (true);
create policy "messages_admin_read" on public.contact_messages
  for select using (public.is_admin());
create policy "messages_admin_update" on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());

-- Allowlist: só admin lê (service-role ignora RLS para semear).
create policy "allowlist_admin_read" on public.admin_allowlist
  for select using (public.is_admin());


-- ════════════════════════════════════════════════════════════════════════
--  Storage — bucket público de mídia + políticas.
--  Leitura pública; upload/remoção só para admin (allowlist via is_admin()).
-- ════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do nothing;

-- Leitura pública dos arquivos do bucket.
create policy "public_media_read" on storage.objects
  for select using (bucket_id = 'public-media');

-- Upload só admin.
create policy "public_media_admin_insert" on storage.objects
  for insert with check (bucket_id = 'public-media' and public.is_admin());

-- Update/replace só admin.
create policy "public_media_admin_update" on storage.objects
  for update using (bucket_id = 'public-media' and public.is_admin());

-- Remoção só admin.
create policy "public_media_admin_delete" on storage.objects
  for delete using (bucket_id = 'public-media' and public.is_admin());


-- ─── Allowlist do admin (seu GitHub) ───
insert into public.admin_allowlist (github_login) values ('lucasriboldi')
  on conflict (github_login) do nothing;
