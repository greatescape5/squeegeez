-- ============================================================
-- MIGRATION: before/after comparison sliders ("Our Work in Action")
-- Paste into Supabase → SQL Editor → Run. Safe to re-run.
-- ============================================================

create table if not exists public.comparisons (
  id               uuid primary key default gen_random_uuid(),
  title            text,
  before_image_url text,
  after_image_url  text,
  sort_order       int  not null default 0,
  published        boolean not null default true,
  created_at       timestamptz not null default now()
);

alter table public.comparisons enable row level security;

drop policy if exists "comparisons public read" on public.comparisons;
create policy "comparisons public read"
  on public.comparisons for select
  using (published = true);

drop policy if exists "comparisons admin all" on public.comparisons;
create policy "comparisons admin all"
  on public.comparisons for all
  to authenticated
  using (true) with check (true);

-- Seed one demo slider so the section shows right away (replace it in the admin).
insert into public.comparisons (title, before_image_url, after_image_url, sort_order)
select 'Window & track detail',
       'https://placehold.co/1200x750/64748b/ffffff?text=BEFORE',
       'https://placehold.co/1200x750/2ba6a0/ffffff?text=AFTER',
       1
where not exists (select 1 from public.comparisons);

-- Done.
