-- ==============================================================================
-- LaunchXact: Acquisition & Funnel Telemetry Infrastructure Migration
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- (Safe to run: Creates new tables, indexes, and policies only. No data is deleted.)
-- ==============================================================================

-- 1. Create the acquisition_events table
create table if not exists public.acquisition_events (
    id uuid primary key default gen_random_uuid(),
    session_id text not null,            -- Anonymous persistent visitor identifier (e.g. lx_anon_xxx)
    tool_id text not null,               -- 'true-cost-of-payments', 'franken-stack-cost-forecaster', etc.
    event_name text not null,            -- 'landing_page_view', 'tool_started', 'tool_completed', 'result_viewed', 'result_shared', 'email_submitted', 'waitlist_joined', 'genesis_application'
    utm_source text,                     -- 'twitter', 'reddit', 'linkedin', 'newsletter', etc.
    utm_medium text,                     -- 'social', 'cpc', 'referral', etc.
    utm_campaign text,                   -- 'launch_q1', 'founder_audit', etc.
    utm_content text,
    utm_term text,
    ref_code text,                       -- Referral code of referring user / campaign
    referrer text,                       -- document.referrer
    metadata jsonb default '{}'::jsonb,  -- Flexible payload (calculation result, platform shared, etc.)
    created_at timestamp with time zone default now()
);

-- 2. Create the tool_leads table (Email Capture After Value)
create table if not exists public.tool_leads (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    tool_id text not null,
    session_id text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    ref_code text,
    joined_waitlist boolean default false,
    result_summary jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- 3. High-performance indexes for lightning-fast funnel calculations
create index if not exists idx_acquisition_events_created_at 
    on public.acquisition_events(created_at desc);

create index if not exists idx_acquisition_events_funnel 
    on public.acquisition_events(event_name, tool_id, created_at desc);

create index if not exists idx_acquisition_events_session 
    on public.acquisition_events(session_id);

create index if not exists idx_acquisition_events_utm_source 
    on public.acquisition_events(utm_source);

create index if not exists idx_acquisition_events_ref_code 
    on public.acquisition_events(ref_code);

create index if not exists idx_tool_leads_email 
    on public.tool_leads(email);

create index if not exists idx_tool_leads_tool_id 
    on public.tool_leads(tool_id);

create index if not exists idx_tool_leads_created_at 
    on public.tool_leads(created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.acquisition_events enable row level security;
alter table public.tool_leads enable row level security;

-- 5. Safe Idempotent Policies (Zero deletion statements)

-- Policy: Allow anonymous and authenticated visitors to insert acquisition events
do $$ 
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'acquisition_events' 
          and policyname = 'Allow anonymous inserts to acquisition_events'
    ) then
        create policy "Allow anonymous inserts to acquisition_events"
            on public.acquisition_events
            for insert
            to anon, authenticated
            with check (true);
    end if;
end $$;

-- Policy: Allow public read of acquisition events for funnel telemetry aggregation
do $$ 
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'acquisition_events' 
          and policyname = 'Allow public read of acquisition_events'
    ) then
        create policy "Allow public read of acquisition_events"
            on public.acquisition_events
            for select
            to anon, authenticated
            using (true);
    end if;
end $$;

-- Policy: Allow anonymous visitors to submit their email on tool completion
do $$ 
begin
    if not exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
          and tablename = 'tool_leads' 
          and policyname = 'Allow anonymous inserts to tool_leads'
    ) then
        create policy "Allow anonymous inserts to tool_leads"
            on public.tool_leads
            for insert
            to anon, authenticated
            with check (true);
    end if;
end $$;

-- Note: We intentionally do NOT create a public select policy for tool_leads.
-- This ensures captured founder email addresses are kept private and accessible 
-- only to server-side APIs (service_role) and your Supabase dashboard.
