-- ============================================
-- GrokSkill Forge — Supabase Schema
-- ============================================
-- Run this entire file in the Supabase SQL Editor (one time)
-- Then enable Row Level Security policies below.

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (lightweight mirror of auth.users)
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- SKILLS (core entity)
-- ============================================
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  slug text not null unique,
  description text not null,
  content text not null,                    -- Full raw SKILL.md markdown
  frontmatter jsonb,                       -- Parsed frontmatter for advanced queries

  category text,
  tags text[] default '{}',

  visibility text not null default 'public' check (visibility in ('public','private')),

  stars_count integer not null default 0,
  forks_count integer not null default 0,
  downloads_count integer not null default 0,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  published_at timestamptz
);

create index if not exists skills_owner_idx on public.skills(owner_id);
create index if not exists skills_slug_idx on public.skills(slug);
create index if not exists skills_visibility_published_idx on public.skills(visibility, published_at desc);
create index if not exists skills_category_idx on public.skills(category);

-- ============================================
-- STARS (many-to-many)
-- ============================================
create table if not exists public.stars (
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  created_at timestamptz default now() not null,
  primary key (user_id, skill_id)
);

-- ============================================
-- FORKS (provenance tracking)
-- ============================================
create table if not exists public.forks (
  id uuid primary key default gen_random_uuid(),
  source_skill_id uuid references public.skills(id) on delete set null,
  forked_skill_id uuid not null references public.skills(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.stars enable row level security;
alter table public.forks enable row level security;

-- Profiles: users can read any, update only their own
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Skills policies
create policy "Public skills are viewable by everyone" on public.skills
  for select using (visibility = 'public');

create policy "Users can view their own private skills" on public.skills
  for select using (auth.uid() = owner_id);

create policy "Users can insert their own skills" on public.skills
  for insert with check (auth.uid() = owner_id);

create policy "Users can update their own skills" on public.skills
  for update using (auth.uid() = owner_id);

create policy "Users can delete their own skills" on public.skills
  for delete using (auth.uid() = owner_id);

-- Stars policies
create policy "Anyone can read stars" on public.stars for select using (true);

create policy "Authenticated users can star" on public.stars
  for insert with check (auth.uid() = user_id);

create policy "Users can unstar their stars" on public.stars
  for delete using (auth.uid() = user_id);

-- Forks are readable by all
create policy "Forks are viewable" on public.forks for select using (true);
create policy "Users can record their forks" on public.forks
  for insert with check (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS — maintain counters
-- ============================================
create or replace function public.increment_skill_counter(skill_uuid uuid, counter text)
returns void
language plpgsql
security definer
as $$
begin
  if counter = 'stars' then
    update public.skills set stars_count = stars_count + 1 where id = skill_uuid;
  elsif counter = 'forks' then
    update public.skills set forks_count = forks_count + 1 where id = skill_uuid;
  elsif counter = 'downloads' then
    update public.skills set downloads_count = downloads_count + 1 where id = skill_uuid;
  end if;
end;
$$;

create or replace function public.decrement_skill_counter(skill_uuid uuid, counter text)
returns void
language plpgsql
security definer
as $$
begin
  if counter = 'stars' then
    update public.skills set stars_count = greatest(stars_count - 1, 0) where id = skill_uuid;
  end if;
end;
$$;

-- ============================================
-- SEED DATA — High quality starter skills
-- (These will be inserted after you have at least one real user account)
-- ============================================

-- To seed, first create an account via the app /signup, then replace the owner_id below.
-- For demo purposes you can temporarily disable RLS on skills and insert, then re-enable.

-- Example seed (commented out — run manually after creating a user):
/*
insert into public.skills (owner_id, name, slug, description, content, category, tags, visibility, published_at)
values (
  '<YOUR-USER-UUID>',
  'review',
  'review',
  'Run a reviewer subagent against uncommitted local changes, a named branch, or a GitHub PR. Produces structured, actionable findings.',
  '---\nname: review\ndescription: >-\n  Run a reviewer subagent against uncommitted local changes, a named branch,\n  or a GitHub PR.\nwhen-to-use: "Use when asked to review code or PRs"\n---\n\n# Review Skill\n\n...full content...',
  'development',
  array['code-review','github','quality'],
  'public',
  now()
);
*/
