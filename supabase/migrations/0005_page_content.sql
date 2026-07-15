-- ════════════════════════════════════════════════════════════════════════
--  Conteúdo editorial por página (kicker/título/highlight/subtítulo).
--  Uma linha por página (key = identificador). Fallback no código quando vazio.
-- ════════════════════════════════════════════════════════════════════════
create table if not exists public.page_content (
  key        text primary key,
  kicker     text not null default '',
  title      text not null default '',
  highlight  text not null default '',
  subtitle   text not null default '',
  updated_at timestamptz not null default now()
);

do $$ begin
  drop trigger if exists page_content_touch on public.page_content;
  create trigger page_content_touch before update on public.page_content
    for each row execute function public.touch_updated_at();
end $$;

alter table public.page_content enable row level security;
drop policy if exists page_content_read on public.page_content;
drop policy if exists page_content_write on public.page_content;
create policy page_content_read on public.page_content for select using (true);
create policy page_content_write on public.page_content for all
  using (public.is_admin()) with check (public.is_admin());

notify pgrst, 'reload schema';
