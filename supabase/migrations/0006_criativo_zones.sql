-- ════════════════════════════════════════════════════════════════════════
--  Zonas da landing /criativo — o multiverso pessoal do Lucas.
--
--  Cada tabela alimenta uma "dimensão" da página: ateliê de artes, banca de
--  quadrinhos, cinema, rádio (música), videoteca, mural de recados e tirinhas.
--  Websites e componentes reaproveitam `projects` — não vale duplicar tabela
--  só para mudar o rótulo.
--
--  Segue o mesmo contrato das migrations anteriores: `published` + `sort`,
--  trigger `touch_updated_at` onde há `updated_at`, RLS com leitura pública
--  do publicado e escrita só para admin.
-- ════════════════════════════════════════════════════════════════════════

-- ─── artworks (ilustrações, edições de imagem, experimentos visuais) ─────
create table if not exists public.artworks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  kind        text not null default 'ilustracao'
                check (kind in ('ilustracao','edicao','3d','pixel','vetor','colagem')),
  image       text not null default '',
  tools       text[] not null default '{}',
  year        int not null default extract(year from now()),
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger artworks_touch before update on public.artworks
  for each row execute function public.touch_updated_at();

-- ─── comics (a banca: o que está sendo lido) ────────────────────────────
create table if not exists public.comics (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text not null default '',
  publisher   text not null default '',
  cover_image text not null default '',
  status      text not null default 'lendo'
                check (status in ('lendo','lido','fila','largado')),
  -- 0 = sem nota; 1..5 estrelas.
  rating      int not null default 0 check (rating between 0 and 5),
  note        text not null default '',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── movies (o cine) ────────────────────────────────────────────────────
create table if not exists public.movies (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  director     text not null default '',
  year         int not null default 0,
  poster_image text not null default '',
  status       text not null default 'assistido'
                 check (status in ('assistido','assistindo','fila')),
  rating       int not null default 0 check (rating between 0 and 5),
  note         text not null default '',
  published    boolean not null default true,
  sort         int not null default 0,
  created_at   timestamptz not null default now()
);

-- ─── tracks (a rádio psicodélica) ───────────────────────────────────────
--  `audio_url` aponta para o bucket de mídia ou para /public: o player é
--  local (<audio>), não embed de terceiros.
create table if not exists public.tracks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  artist      text not null default '',
  audio_url   text not null default '',
  cover_image text not null default '',
  note        text not null default '',
  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ─── videos (a videoteca) ───────────────────────────────────────────────
create table if not exists public.videos (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  video_url    text not null default '',
  poster_image text not null default '',
  kind         text not null default 'local'
                 check (kind in ('local','youtube','vimeo')),
  published    boolean not null default true,
  sort         int not null default 0,
  created_at   timestamptz not null default now()
);

-- ─── notes (o mural de recados) ─────────────────────────────────────────
--  Só leitura pública: quem escreve é o admin. Sem formulário público, não
--  há superfície de spam nem fila de moderação para manter.
create table if not exists public.notes (
  id         uuid primary key default gen_random_uuid(),
  title      text not null default '',
  body       text not null default '',
  author     text not null default 'Lucas',
  accent     text not null default 'yellow'
               check (accent in ('yellow','cyan','magenta','lime','orange','violet')),
  pinned     boolean not null default false,
  published  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger notes_touch before update on public.notes
  for each row execute function public.touch_updated_at();

-- ─── strips (tirinhas e piadas) ─────────────────────────────────────────
create table if not exists public.strips (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  image      text not null default '',
  setup      text not null default '',
  punchline  text not null default '',
  published  boolean not null default true,
  sort       int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── RLS ────────────────────────────────────────────────────────────────
alter table public.artworks enable row level security;
alter table public.comics   enable row level security;
alter table public.movies   enable row level security;
alter table public.tracks   enable row level security;
alter table public.videos   enable row level security;
alter table public.notes    enable row level security;
alter table public.strips   enable row level security;

create policy "artworks_read" on public.artworks for select using (published or public.is_admin());
create policy "comics_read"   on public.comics   for select using (published or public.is_admin());
create policy "movies_read"   on public.movies   for select using (published or public.is_admin());
create policy "tracks_read"   on public.tracks   for select using (published or public.is_admin());
create policy "videos_read"   on public.videos   for select using (published or public.is_admin());
create policy "notes_read"    on public.notes    for select using (published or public.is_admin());
create policy "strips_read"   on public.strips   for select using (published or public.is_admin());

create policy "artworks_admin_write" on public.artworks for all using (public.is_admin()) with check (public.is_admin());
create policy "comics_admin_write"   on public.comics   for all using (public.is_admin()) with check (public.is_admin());
create policy "movies_admin_write"   on public.movies   for all using (public.is_admin()) with check (public.is_admin());
create policy "tracks_admin_write"   on public.tracks   for all using (public.is_admin()) with check (public.is_admin());
create policy "videos_admin_write"   on public.videos   for all using (public.is_admin()) with check (public.is_admin());
create policy "notes_admin_write"    on public.notes    for all using (public.is_admin()) with check (public.is_admin());
create policy "strips_admin_write"   on public.strips   for all using (public.is_admin()) with check (public.is_admin());
