-- ════════════════════════════════════════════════════════════════════════
--  projects.slug e projects.readme — colunas que o código sempre usou e
--  nenhuma migration jamais criou.
--
--  O painel oferece os dois campos, `repos/projects.ts` os lê (declarados
--  como opcionais em `ProjectRowExt`, o que escondeu o problema) e a rota
--  /desenvolvedor/projetos/[slug] depende do slug para existir.
--
--  Em produção as colunas provavelmente foram criadas à mão pelo Studio, e
--  por isso ninguém notou. Num banco levantado só pelas migrations — que é o
--  caso de qualquer ambiente novo — salvar um projeto pelo painel falha com
--  «column "slug" does not exist», e as páginas de README nunca funcionam.
--
--  `if not exists` em tudo: esta migration precisa ser inofensiva no banco
--  que já tem as colunas.
-- ════════════════════════════════════════════════════════════════════════

alter table public.projects add column if not exists slug   text;
alter table public.projects add column if not exists readme text;

-- Slug é endereço: /desenvolvedor/projetos/<slug>. Dois projetos com o mesmo
-- slug fariam um deles ficar inalcançável, e o índice parcial deixa isso
-- falhar na escrita — onde dá para consertar — em vez de na navegação.
-- Parcial (`where slug is not null`) porque projeto sem página de README é
-- legítimo: a maioria dos projetos não tem uma.
create unique index if not exists projects_slug_key
  on public.projects (slug)
  where slug is not null;
