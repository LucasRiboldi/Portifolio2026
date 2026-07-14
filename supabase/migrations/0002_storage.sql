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
