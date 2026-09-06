-- ==============================================================================
-- LaunchXact: Founder Waitlist & Product Showcase Upgrade Migration
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Add new founder intelligence columns to waitlist_founders
alter table if exists public.waitlist_founders
    add column if not exists stage text,
    add column if not exists monthly_revenue text,
    add column if not exists biggest_problem text,
    add column if not exists slug text,
    add column if not exists metadata jsonb default '{}'::jsonb;

-- 2. Indexes for fast lookups
create index if not exists idx_waitlist_founders_slug 
    on public.waitlist_founders(slug);

create index if not exists idx_waitlist_founders_stage 
    on public.waitlist_founders(stage);

create index if not exists idx_products_slug 
    on public.products(slug);

create index if not exists idx_products_status 
    on public.products(status);

-- 3. Ensure Row Level Security (RLS) policies allow anonymous waitlist submission & public reading of products
alter table public.waitlist_founders enable row level security;
alter table public.products enable row level security;

-- Policy for waitlist_founders: Allow anonymous inserts
drop policy if exists "Allow anonymous inserts to waitlist_founders" on public.waitlist_founders;
create policy "Allow anonymous inserts to waitlist_founders"
    on public.waitlist_founders
    for insert
    to anon, authenticated
    with check (true);

-- Policy for products: Allow anonymous inserts from API
drop policy if exists "Allow anonymous inserts to products" on public.products;
create policy "Allow anonymous inserts to products"
    on public.products
    for insert
    to anon, authenticated
    with check (true);

-- Policy for products: Allow public read of products for showcase pages
drop policy if exists "Allow public read of products" on public.products;
create policy "Allow public read of products"
    on public.products
    for select
    to anon, authenticated
    using (true);
