-- ==============================================================================
-- LaunchXact: 5-Email Automated Lifecycle & Qualification Funnel Migration
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Create the email_lifecycle_subscribers table
create table if not exists public.email_lifecycle_subscribers (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    idea_name text default 'Your AI SaaS',
    overall_score integer default 0,
    founder_archetype text default 'The Stealth Builder',
    weakest_pillar text default 'distribution',
    weakest_pillar_name text default 'Distribution Strategy',
    pillar_scores jsonb default '{}'::jsonb,
    action_items jsonb default '[]'::jsonb,
    tool_id text default 'ai-saas-grader',
    
    -- Funnel progression & status
    current_step integer default 1, -- 1 to 5
    status text default 'active',   -- 'active', 'completed', 'unsubscribed', 'paused', 'bounced'
    unsubscribe_token text default gen_random_uuid()::text,
    
    -- Timing & cadence management
    enrolled_at timestamp with time zone default now(),
    last_sent_at timestamp with time zone,
    next_send_at timestamp with time zone,
    
    -- Specific step delivery timestamps
    step_1_sent_at timestamp with time zone,
    step_2_sent_at timestamp with time zone,
    step_3_sent_at timestamp with time zone,
    step_4_sent_at timestamp with time zone,
    step_5_sent_at timestamp with time zone,
    
    -- Attribution & metadata
    utm_source text,
    utm_medium text,
    utm_campaign text,
    ref_code text,
    metadata jsonb default '{}'::jsonb,
    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 2. Indexes for fast query and cron dispatch performance
create index if not exists idx_email_lifecycle_queue 
    on public.email_lifecycle_subscribers(status, next_send_at);

create index if not exists idx_email_lifecycle_email 
    on public.email_lifecycle_subscribers(email);

create index if not exists idx_email_lifecycle_unsub_token 
    on public.email_lifecycle_subscribers(unsubscribe_token);

-- 3. Enable Row Level Security (RLS)
alter table public.email_lifecycle_subscribers enable row level security;

-- 4. Policies: Allow API and edge functions to insert, read, and update
drop policy if exists "Allow anonymous inserts to email_lifecycle_subscribers" on public.email_lifecycle_subscribers;
create policy "Allow anonymous inserts to email_lifecycle_subscribers"
    on public.email_lifecycle_subscribers
    for insert
    to anon, authenticated
    with check (true);

drop policy if exists "Allow reading email_lifecycle_subscribers" on public.email_lifecycle_subscribers;
create policy "Allow reading email_lifecycle_subscribers"
    on public.email_lifecycle_subscribers
    for select
    to anon, authenticated
    using (true);

drop policy if exists "Allow updating email_lifecycle_subscribers" on public.email_lifecycle_subscribers;
create policy "Allow updating email_lifecycle_subscribers"
    on public.email_lifecycle_subscribers
    for update
    to anon, authenticated
    using (true)
    with check (true);
