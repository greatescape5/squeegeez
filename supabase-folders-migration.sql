-- ============================================================
-- MIGRATION: add "folders" (service categories) and link projects
-- Paste into Supabase → SQL Editor → Run. Safe to re-run.
-- ============================================================

-- 1. Folders table (each folder = a service category)
create table if not exists public.folders (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,                 -- an emoji or short label, optional
  sort_order  int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.folders enable row level security;

drop policy if exists "folders public read" on public.folders;
create policy "folders public read"
  on public.folders for select
  using (published = true);

drop policy if exists "folders admin all" on public.folders;
create policy "folders admin all"
  on public.folders for all
  to authenticated
  using (true) with check (true);

-- 2. Link each project to a folder
alter table public.projects
  add column if not exists folder_id uuid references public.folders(id) on delete set null;

-- 3. Seed the starter folders (matches the site's services)
insert into public.folders (name, slug, description, icon, sort_order) values
  ('Residential Windows', 'residential-windows', 'Interior and exterior window cleaning for homes of all sizes.', '🏠', 1),
  ('Commercial Windows',  'commercial-windows',  'Storefronts and offices on a reliable recurring schedule.',    '🏢', 2),
  ('Pressure Washing',    'pressure-washing',    'Driveways, siding, and decks blasted clean.',                  '💧', 3),
  ('Gutter Cleaning',     'gutter-cleaning',     'Clearing debris before the Kootenay rains hit.',               '🍂', 4)
on conflict (slug) do nothing;

-- 4. Backfill folder_id on any existing projects from their old category text
update public.projects p set folder_id = f.id
from public.folders f
where p.folder_id is null and (
     (p.category = 'Residential'      and f.slug = 'residential-windows')
  or (p.category = 'Commercial'       and f.slug = 'commercial-windows')
  or (p.category = 'Pressure Washing' and f.slug = 'pressure-washing')
  or (p.category = 'Gutters'          and f.slug = 'gutter-cleaning')
  or (p.category = f.name)
);

-- Done.
