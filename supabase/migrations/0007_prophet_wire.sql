-- ════════════════════════════════════════════════════════════════════════
--  PROPHET WIRE — persistência do agregador de notícias (Parte 10).
--  Acervo de notícias (`NewsRepository`) + histórico de execuções (`RunStore`).
--  Escrito e lido pelo servidor com o cliente service-role (cron + admin);
--  RLS existe como segunda linha de defesa caso um client anon algum dia
--  fale com estas tabelas.
-- ════════════════════════════════════════════════════════════════════════

-- ─── Acervo de notícias ──────────────────────────────────────────────────
create table if not exists public.prophet_wire_news (
  slug             text primary key,
  hash             text not null,
  title            text not null,
  subtitle         text not null default '',
  summary          text not null default '',
  dropcap          text not null default '',
  note             text not null default '',
  category         text not null,
  subcategory      text not null default '',
  tags             text[] not null default '{}',
  image            jsonb not null default '{"src":null,"alt":"","caption":""}'::jsonb,
  designer         text,
  publisher        text,
  mechanics        text[],
  player_count     text,
  play_time        text,
  complexity       text,
  year             int,
  seo_title        text,
  meta_description text,
  keywords         text[],
  hashtags         text[],
  source_name      text not null,
  source_url       text not null,
  published_at     timestamptz not null,
  status           text not null default 'rascunho' check (status in ('rascunho','publicado')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists prophet_wire_news_hash_idx on public.prophet_wire_news (hash);
create index if not exists prophet_wire_news_status_idx on public.prophet_wire_news (status, published_at desc);
create trigger prophet_wire_news_touch before update on public.prophet_wire_news
  for each row execute function public.touch_updated_at();

-- ─── Histórico de execuções ──────────────────────────────────────────────
create table if not exists public.prophet_wire_runs (
  id           text primary key,
  started_at   timestamptz not null,
  finished_at  timestamptz not null,
  duration_ms  int not null,
  counters     jsonb not null,
  entries      jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists prophet_wire_runs_started_idx on public.prophet_wire_runs (started_at desc);

-- ─── RLS ────────────────────────────────────────────────────────────────
alter table public.prophet_wire_news enable row level security;
alter table public.prophet_wire_runs enable row level security;

create policy "pwnews_read" on public.prophet_wire_news for select using (status = 'publicado' or public.is_admin());
create policy "pwnews_write" on public.prophet_wire_news for all using (public.is_admin()) with check (public.is_admin());

create policy "pwruns_read" on public.prophet_wire_runs for select using (public.is_admin());
create policy "pwruns_write" on public.prophet_wire_runs for all using (public.is_admin()) with check (public.is_admin());
