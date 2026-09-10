-- ==============================================================================
-- LaunchXact: Add Logo & Monetization Columns to Supabase
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. Add dedicated logo_url, review_tier, fast_track_paid, badge_verified, tweet_url, and x_priority_boost to public.products
alter table public.products
    add column if not exists logo_url text,
    add column if not exists review_tier text default 'standard',
    add column if not exists fast_track_paid boolean default false,
    add column if not exists badge_verified boolean default false,
    add column if not exists tweet_url text,
    add column if not exists x_priority_boost boolean default false;

-- 2. Add dedicated logo_url, review_tier, fast_track_paid, badge_verified, tweet_url, and x_priority_boost to public.waitlist_founders
alter table public.waitlist_founders
    add column if not exists logo_url text,
    add column if not exists review_tier text default 'standard',
    add column if not exists fast_track_paid boolean default false,
    add column if not exists badge_verified boolean default false,
    add column if not exists tweet_url text,
    add column if not exists x_priority_boost boolean default false;

-- 3. Indexes for fast lookups
create index if not exists idx_products_logo_url on public.products(logo_url);
create index if not exists idx_waitlist_founders_review_tier on public.waitlist_founders(review_tier);
create index if not exists idx_products_review_tier on public.products(review_tier);
create index if not exists idx_waitlist_founders_badge_verified on public.waitlist_founders(badge_verified);
create index if not exists idx_products_badge_verified on public.products(badge_verified);
create index if not exists idx_waitlist_founders_x_priority on public.waitlist_founders(x_priority_boost);
create index if not exists idx_products_x_priority on public.products(x_priority_boost);


