-- ==============================================================================
-- LaunchXact: Social Distribution Agent Schema
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- (Safe to run: Creates new table, indexes, and policies. No data is deleted.)
-- ==============================================================================

create table if not exists public.agent_distribution_posts (
    id uuid primary key default gen_random_uuid(),
    platform text not null,               -- 'x', 'linkedin', 'indiehackers'
    tool_id text not null,                -- 'saas-readiness-grader', 'true-cost-of-payments', etc.
    angle text not null,                  -- 'contrarian_take', 'hard_math_teardown', 'build_in_public_milestone', etc.
    hook text not null,                   -- Opening hook / title
    content text not null,                -- Full generated post / article body
    thread_items jsonb default '[]'::jsonb, -- Array of thread items for X (if thread mode)
    utm_url text not null,                -- Target URL with full UTM campaign attribution
    status text not null default 'draft', -- 'draft', 'scheduled', 'published', 'failed'
    external_post_id text,                -- Remote ID on X / LinkedIn / IH
    external_post_url text,               -- Public URL to the published post
    error_message text,                   -- Error message if dispatch failed
    metrics jsonb default '{}'::jsonb,    -- Engagements, clicks, impressions
    created_at timestamp with time zone default now(),
    published_at timestamp with time zone
);

-- High-performance query indexes
create index if not exists idx_agent_posts_created_at
    on public.agent_distribution_posts(created_at desc);

create index if not exists idx_agent_posts_platform_status
    on public.agent_distribution_posts(platform, status, created_at desc);

create index if not exists idx_agent_posts_tool_id
    on public.agent_distribution_posts(tool_id, created_at desc);

-- Enable Row Level Security (RLS)
alter table public.agent_distribution_posts enable row level security;

-- Policy: Allow service_role and authenticated queries full access
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'agent_distribution_posts' 
          and policyname = 'Allow service_role full management on agent_distribution_posts'
    ) then
        create policy "Allow service_role full management on agent_distribution_posts"
            on public.agent_distribution_posts
            for all
            to service_role
            using (true)
            with check (true);
    end if;
end $$;

-- Policy: Allow public read of published distribution posts
do $$
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'agent_distribution_posts' 
          and policyname = 'Allow public read of published distribution posts'
    ) then
        create policy "Allow public read of published distribution posts"
            on public.agent_distribution_posts
            for select
            to anon, authenticated
            using (status = 'published');
    end if;
end $$;
