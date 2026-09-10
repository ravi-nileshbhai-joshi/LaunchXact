-- ==============================================================================
-- LaunchXact: Supabase Storage Bucket for Product Logos & Assets
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Create the 'product-logos' public storage bucket if not already present
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'product-logos',
    'product-logos',
    true,
    5242880, -- 5MB limit
    array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
)
on conflict (id) do update set
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];

-- 2. Allow public unauthenticated read of logos
drop policy if exists "Public Access for Product Logos" on storage.objects;
create policy "Public Access for Product Logos"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'product-logos');

-- 3. Allow anonymous & authenticated uploads from LaunchXact API
drop policy if exists "Allow anonymous uploads to product-logos" on storage.objects;
create policy "Allow anonymous uploads to product-logos"
    on storage.objects
    for insert
    to anon, authenticated
    with check (bucket_id = 'product-logos');

-- 4. Allow updating / overwriting files in product-logos
drop policy if exists "Allow updates to product-logos" on storage.objects;
create policy "Allow updates to product-logos"
    on storage.objects
    for update
    to anon, authenticated
    using (bucket_id = 'product-logos');
