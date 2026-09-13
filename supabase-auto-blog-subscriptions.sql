-- ==============================================================================
-- LaunchXact: Auto Blog Generator & Organic SEO Engine Schema
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- (Safe to run: Idempotent tables, indexes, and RLS policies)
-- ==============================================================================

-- 1. Create subscriptions & entitlement table
create table if not exists public.auto_blog_subscriptions (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    website_url text,
    status text not null default 'active', -- 'active', 'fast_track_free', 'expired', 'cancelled'
    plan text not null default 'monthly_79', -- 'monthly_79', 'fast_track_bonus'
    fast_track_claimed_at timestamp with time zone,
    expires_at timestamp with time zone default (now() + interval '30 days'),
    webhook_url text,                       -- Founder's CMS webhook URL
    cms_platform text default 'custom',    -- 'wordpress', 'ghost', 'webflow', 'make', 'custom'
    posts_generated integer default 0,
    license_key text,                       -- Dodo Payments Pro License Key
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Ensure license_key column exists if table was already created
alter table public.auto_blog_subscriptions add column if not exists license_key text;

-- 2. Create verified Dodo Payments license keys table
create table if not exists public.auto_blog_licenses (
    id uuid primary key default gen_random_uuid(),
    license_key text unique not null,
    product_id text default 'pdt_0NnNR9SDx6pIDWEid6EOK',
    email text,
    domain text,
    status text not null default 'active',
    activated_at timestamp with time zone default now(),
    last_verified_at timestamp with time zone default now()
);

-- 2. Create generated & published articles archive
create table if not exists public.auto_blog_posts (
    id uuid primary key default gen_random_uuid(),
    email text,
    website_url text not null,
    title text not null,
    slug text not null,
    target_keyword text not null,
    meta_description text,
    reading_time text,
    word_count integer,
    seo_score integer default 95,
    markdown_content text not null,
    html_content text,
    status text not null default 'draft', -- 'draft', 'verified', 'published', 'failed'
    published_via text default 'download', -- 'webhook', 'download', 'clipboard'
    webhook_response jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now(),
    published_at timestamp with time zone
);

-- 3. Create demo usage table (Enforce 1 demo per founder / domain)
create table if not exists public.auto_blog_demo_usage (
    id uuid primary key default gen_random_uuid(),
    domain text not null,
    ip_address text,
    target_keyword text,
    created_at timestamp with time zone default now()
);

-- 4. Indexes for fast query lookups
create index if not exists idx_auto_blog_sub_email 
    on public.auto_blog_subscriptions(email);

create index if not exists idx_auto_blog_sub_status 
    on public.auto_blog_subscriptions(status, expires_at);

create index if not exists idx_auto_blog_posts_email 
    on public.auto_blog_posts(email, created_at desc);

create index if not exists idx_auto_blog_posts_url 
    on public.auto_blog_posts(website_url, created_at desc);

create index if not exists idx_auto_blog_demo_domain 
    on public.auto_blog_demo_usage(domain);

create index if not exists idx_auto_blog_demo_ip 
    on public.auto_blog_demo_usage(ip_address);

create index if not exists idx_auto_blog_licenses_key 
    on public.auto_blog_licenses(license_key);

create index if not exists idx_auto_blog_sub_license 
    on public.auto_blog_subscriptions(license_key);

-- 5. Enable Row Level Security (RLS)
alter table public.auto_blog_subscriptions enable row level security;
alter table public.auto_blog_licenses enable row level security;
alter table public.auto_blog_posts enable row level security;
alter table public.auto_blog_demo_usage enable row level security;

-- 6. Safe Idempotent Policies
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'auto_blog_licenses' 
          and policyname = 'Allow public and service_role to manage auto_blog_licenses'
    ) then
        create policy "Allow public and service_role to manage auto_blog_licenses"
            on public.auto_blog_licenses
            for all
            to anon, authenticated, service_role
            using (true)
            with check (true);
    end if;
end $$;
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'auto_blog_subscriptions' 
          and policyname = 'Allow public and service_role to manage auto_blog_subscriptions'
    ) then
        create policy "Allow public and service_role to manage auto_blog_subscriptions"
            on public.auto_blog_subscriptions
            for all
            to anon, authenticated, service_role
            using (true)
            with check (true);
    end if;
end $$;

do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'auto_blog_posts' 
          and policyname = 'Allow public and service_role to manage auto_blog_posts'
    ) then
        create policy "Allow public and service_role to manage auto_blog_posts"
            on public.auto_blog_posts
            for all
            to anon, authenticated, service_role
            using (true)
            with check (true);
    end if;
end $$;

do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'auto_blog_demo_usage' 
          and policyname = 'Allow public and service_role to manage auto_blog_demo_usage'
    ) then
        create policy "Allow public and service_role to manage auto_blog_demo_usage"
            on public.auto_blog_demo_usage
            for all
            to anon, authenticated, service_role
            using (true)
            with check (true);
    end if;
end $$;
