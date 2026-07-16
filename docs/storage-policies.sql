-- ============================================================================
-- Storage — bucket `public-media`: leitura pública, escrita só via service-role.
-- ============================================================================
--
-- POR QUE: até 16/07/2026 o navegador falava direto com o Storage usando a
-- anon key. As policies do Storage enxergam apenas "está autenticado?" — elas
-- não conhecem a allowlist de admin do app (ADMIN_GITHUB_LOGIN), que é regra
-- de aplicação. Ou seja: qualquer pessoa com uma conta Supabase no projeto
-- podia enviar e apagar arquivos, mesmo sem ser admin.
--
-- Agora todo upload/exclusão passa por Server Action (requireAdmin + validação
-- por magic bytes) usando service-role, que IGNORA RLS por definição. Logo o
-- caminho do cliente pode ser fechado sem quebrar o painel.
--
-- COMO APLICAR: Supabase → SQL Editor → cole e rode. É idempotente.
-- Depois, confira em Storage → public-media → Policies: devem restar apenas as
-- duas policies abaixo.
-- ============================================================================

-- 1) O bucket serve imagens no site público: leitura liberada, e não é listável
--    por padrão (o painel lista via service-role).
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do update set public = true;

-- 2) Remove as policies permissivas que liberavam escrita a qualquer sessão.
--    Os nomes cobrem os defaults comuns do assistente do Supabase; se o seu
--    projeto usa outro nome, apague pelo painel (Storage → Policies).
drop policy if exists "public-media insert for authenticated" on storage.objects;
drop policy if exists "public-media update for authenticated"  on storage.objects;
drop policy if exists "public-media delete for authenticated"  on storage.objects;
drop policy if exists "Authenticated users can upload"          on storage.objects;
drop policy if exists "Enable insert for authenticated users only" on storage.objects;
drop policy if exists "Give users access to own folder"         on storage.objects;

-- 3) Estado desejado — só isto deve existir para este bucket.
drop policy if exists "public-media: leitura pública" on storage.objects;
create policy "public-media: leitura pública"
  on storage.objects for select
  to public
  using (bucket_id = 'public-media');

-- Nada de insert/update/delete para anon nem authenticated: sem policy, o RLS
-- nega. O service-role (usado só no servidor) passa por cima e continua
-- escrevendo normalmente.

-- ----------------------------------------------------------------------------
-- CONFERÊNCIA — deve retornar apenas a policy de leitura:
--
--   select policyname, cmd, roles
--   from pg_policies
--   where schemaname = 'storage' and tablename = 'objects'
--     and qual like '%public-media%';
--
-- TESTE DE FOGO (opcional): logado como um usuário comum (não-admin), tente
-- subir um arquivo pelo client — deve falhar com "new row violates row-level
-- security policy". O upload pelo /admin deve continuar funcionando.
-- ----------------------------------------------------------------------------
