-- ════════════════════════════════════════════════════════════════════════
--  MATÉRIAS DAS PÁGINAS INTERNAS — realm Arcane (/anfitriao).
--
--  As matérias nasceram lidas direto de `src/data/anfitriao-materias.ts`, o
--  que significava um deploy para corrigir uma vírgula. Esta tabela põe o
--  jornal na mesma regra do resto do site: o código é a fonte histórica, o
--  banco é a fonte de leitura, e o painel corrige sem build.
--
--  Prefixo `prophet_` por consistência com as tabelas da 0004, que já
--  agrupam o conteúdo deste realm.
-- ════════════════════════════════════════════════════════════════════════

create table if not exists public.prophet_materias (
  id          uuid primary key default gen_random_uuid(),

  -- Identidade e folio
  slug        text not null unique,
  caderno     text not null default 'Oficina',
  -- Numeração romana da página impressa. É texto, não inteiro: o impresso
  -- diz "II", e converter para número perderia a forma que o leitor vê.
  page        text not null default 'II',

  -- Cabeça
  kicker      text not null default '',
  headline    text not null,
  subhead     text not null default '',
  standfirst  text not null default '',
  byline      text not null default '',
  byline_role text not null default '',
  dateline    text not null default '',
  continua_de text,

  -- Corpo
  dropcap     text not null default '',
  open_line   text not null default '',
  -- Blocos são [{ subhead?, paragraphs[] }]. Em jsonb e não em tabela filha
  -- de propósito: a matéria é lida e escrita SEMPRE inteira, nunca por
  -- bloco, e uma tabela filha só acrescentaria junção sem consulta que a
  -- justifique. Mesmo critério do `image`/`entries` da 0007.
  blocos      jsonb not null default '[]'::jsonb,
  pullquote   text not null default '',

  -- Peças de apoio
  figure      jsonb not null default '{"caption":"","credit":""}'::jsonb,
  boxes       jsonb not null default '[]'::jsonb,

  -- Fecho
  sign        text not null default '',
  colofao     jsonb not null default '{}'::jsonb,
  remissoes   jsonb not null default '[]'::jsonb,

  published   boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- As três estruturas repetidas são arrays; um objeto solto ali quebraria o
-- mapeamento no leitor sem erro de banco. O CHECK transforma isso em falha
-- na escrita, que é onde dá para consertar.
alter table public.prophet_materias
  drop constraint if exists prophet_materias_formas;
alter table public.prophet_materias
  add constraint prophet_materias_formas check (
    jsonb_typeof(blocos) = 'array'
    and jsonb_typeof(boxes) = 'array'
    and jsonb_typeof(remissoes) = 'array'
    and jsonb_typeof(figure) = 'object'
    and jsonb_typeof(colofao) = 'object'
  );

drop trigger if exists prophet_materias_touch on public.prophet_materias;
create trigger prophet_materias_touch before update on public.prophet_materias
  for each row execute function public.touch_updated_at();

-- A folha lista as matérias em ordem de página; o índice serve à listagem.
create index if not exists prophet_materias_sort_idx
  on public.prophet_materias (sort, created_at);

-- ─── RLS: leitura pública do publicado, escrita só admin ────────────────
alter table public.prophet_materias enable row level security;

drop policy if exists "prophet_materias_read" on public.prophet_materias;
create policy "prophet_materias_read" on public.prophet_materias
  for select using (published or public.is_admin());

drop policy if exists "prophet_materias_admin_write" on public.prophet_materias;
create policy "prophet_materias_admin_write" on public.prophet_materias
  for all using (public.is_admin()) with check (public.is_admin());
