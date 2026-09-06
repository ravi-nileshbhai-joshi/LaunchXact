-- ==============================================================================
-- LaunchXact: Tool Telemetry Table Migration
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Create the tool_telemetry table
create table if not exists public.tool_telemetry (
    id uuid primary key default gen_random_uuid(),
    tool_id text not null,               -- 'true-cost-of-payments', 'franken-stack', etc.
    mrr numeric,                         -- Founder's MRR ($10,000)
    calculated_leakage numeric,          -- Calculated operational leakage ($13,800)
    services_count integer,              -- Number of fragmented cloud services
    category text,                       -- 'B2B Workflow', 'DevTool & Infra', etc.
    country_count integer,              -- Number of tax jurisdictions
    action text default 'calculate',    -- 'calculate', 'copy_summary', 'share_x', etc.
    created_at timestamp with time zone default now()
);

-- 2. Create index for fast telemetry queries
create index if not exists idx_tool_telemetry_created_at 
    on public.tool_telemetry(created_at desc);

create index if not exists idx_tool_telemetry_tool_id 
    on public.tool_telemetry(tool_id);

-- 3. Enable Row Level Security (RLS)
alter table public.tool_telemetry enable row level security;

-- 4. Policy: Allow anonymous users & API to insert calculation events
drop policy if exists "Allow anonymous inserts to tool_telemetry" on public.tool_telemetry;
create policy "Allow anonymous inserts to tool_telemetry"
    on public.tool_telemetry
    for insert
    to anon, authenticated
    with check (true);

-- 5. Policy: Allow reading for live public benchmark statistics
drop policy if exists "Allow public read of tool_telemetry" on public.tool_telemetry;
create policy "Allow public read of tool_telemetry"
    on public.tool_telemetry
    for select
    to anon, authenticated
    using (true);
