-- ════════════════════════════════════════════════════════════════════════
--  Realm DAILY PROPHET — conteúdo do jornal de Game Design.
--  Oficina (tutoriais), Caderno (mecânicas), Laboratório (protótipos),
--  Imprensa (recursos/downloads) e A Redação (sobre — linha única).
-- ════════════════════════════════════════════════════════════════════════

-- ─── Oficina do Inventor (tutoriais) ────────────────────────────────────
create table if not exists public.prophet_tutorials (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  summary    text not null default '',
  body       text not null default '',
  difficulty text not null default 'iniciante'
               check (difficulty in ('iniciante','intermediario','avancado')),
  tags       text[] not null default '{}',
  published  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger prophet_tutorials_touch before update on public.prophet_tutorials
  for each row execute function public.touch_updated_at();

-- ─── Caderno das Mecânicas ──────────────────────────────────────────────
create table if not exists public.prophet_mechanics (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  summary    text not null default '',
  body       text not null default '',
  tags       text[] not null default '{}',
  published  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger prophet_mechanics_touch before update on public.prophet_mechanics
  for each row execute function public.touch_updated_at();

-- ─── Laboratório (protótipos/playtests) ─────────────────────────────────
create table if not exists public.prophet_prototypes (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  status      text not null default 'conceito'
                check (status in ('conceito','prototipo','playtest','publicado')),
  players     text not null default '',
  playtime    text not null default '',
  tags        text[] not null default '{}',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── Imprensa do Inventor (print & play / downloads) ────────────────────
create table if not exists public.prophet_resources (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  type        text not null default 'pnp'
                check (type in ('pnp','cartas','tabuleiro','regras','outro')),
  file_url    text,
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── A Redação (sobre — linha única) ────────────────────────────────────
create table if not exists public.prophet_about (
  id        text primary key default 'default',
  author    text not null default '',
  intro     text not null default '',
  passion   text not null default '',
  proposal  text not null default '',
  updated_at timestamptz not null default now()
);
create trigger prophet_about_touch before update on public.prophet_about
  for each row execute function public.touch_updated_at();

-- ─── RLS ────────────────────────────────────────────────────────────────
alter table public.prophet_tutorials  enable row level security;
alter table public.prophet_mechanics  enable row level security;
alter table public.prophet_prototypes enable row level security;
alter table public.prophet_resources  enable row level security;
alter table public.prophet_about      enable row level security;

create policy "ptut_read" on public.prophet_tutorials for select using (published or public.is_admin());
create policy "pmec_read" on public.prophet_mechanics for select using (published or public.is_admin());
create policy "ppro_read" on public.prophet_prototypes for select using (published or public.is_admin());
create policy "pres_read" on public.prophet_resources for select using (published or public.is_admin());
create policy "pabout_read" on public.prophet_about for select using (true);

create policy "ptut_write" on public.prophet_tutorials for all using (public.is_admin()) with check (public.is_admin());
create policy "pmec_write" on public.prophet_mechanics for all using (public.is_admin()) with check (public.is_admin());
create policy "ppro_write" on public.prophet_prototypes for all using (public.is_admin()) with check (public.is_admin());
create policy "pres_write" on public.prophet_resources for all using (public.is_admin()) with check (public.is_admin());
create policy "pabout_write" on public.prophet_about for all using (public.is_admin()) with check (public.is_admin());
