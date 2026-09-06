-- ==============================================================================
-- LaunchXact: AI SaaS Grader - Idea Viability Audits Table Migration
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- (Or via Supabase CLI)
-- ==============================================================================

-- 1. Create the saas_idea_audits table
create table if not exists public.saas_idea_audits (
    id uuid primary key default gen_random_uuid(),
    idea_name text not null,
    target_customer text,
    pricing text,
    description text,
    competitors text,
    distribution text,
    url text,
    overall_score integer not null,
    market_potential integer,
    problem_severity integer,
    competition_moat integer,
    distribution_score integer,
    monetization_score integer,
    ai_defensibility integer,
    weakest_pillar text,
    verdict_headline text,
    brutal_critique text,
    action_items jsonb default '[]'::jsonb,
    founder_email text,
    created_at timestamp with time zone default now()
);

-- 2. Indexes for fast query performance
create index if not exists idx_saas_idea_audits_created_at 
    on public.saas_idea_audits(created_at desc);

create index if not exists idx_saas_idea_audits_overall_score 
    on public.saas_idea_audits(overall_score);

-- 3. Enable Row Level Security (RLS)
alter table public.saas_idea_audits enable row level security;

-- 4. Policy: Allow anonymous users & Next.js API to insert audit submissions
drop policy if exists "Allow anonymous inserts to saas_idea_audits" on public.saas_idea_audits;
create policy "Allow anonymous inserts to saas_idea_audits"
    on public.saas_idea_audits
    for insert
    to anon, authenticated
    with check (true);

-- 5. Policy: Allow reading audit submissions
drop policy if exists "Allow public read of saas_idea_audits" on public.saas_idea_audits;
create policy "Allow public read of saas_idea_audits"
    on public.saas_idea_audits
    for select
    to anon, authenticated
    using (true);
