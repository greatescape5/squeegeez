-- ============================================================
-- SQUEEGEEZ WINDOW WASHING — Supabase schema
-- Paste this whole file into Supabase → SQL Editor → Run.
-- Safe to re-run: it drops/recreates policies each time.
-- ============================================================

-- ---------- 1. TABLES ----------

-- Gallery / past projects (before + after photos)
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  category      text,                -- e.g. 'Residential', 'Commercial', 'Pressure Washing', 'Gutters'
  before_image_url text,             -- optional "before" photo
  after_image_url  text,             -- main / "after" photo
  sort_order    int  not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Leads from the contact form
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  service     text,                  -- which service they're interested in (optional)
  message     text,
  created_at  timestamptz not null default now()
);

-- ---------- 2. ROW LEVEL SECURITY ----------

alter table public.projects enable row level security;
alter table public.leads    enable row level security;

-- PROJECTS: anyone (public/anon) can READ published rows; logged-in admin can do everything.
drop policy if exists "projects public read" on public.projects;
create policy "projects public read"
  on public.projects for select
  using (published = true);

drop policy if exists "projects admin all" on public.projects;
create policy "projects admin all"
  on public.projects for all
  to authenticated
  using (true) with check (true);

-- LEADS: public/anon can INSERT (so the form works with the anon key) but CANNOT read.
--        Only logged-in admin can read/manage leads.
drop policy if exists "leads anon insert" on public.leads;
create policy "leads anon insert"
  on public.leads for insert
  to anon
  with check (true);

drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read"
  on public.leads for select
  to authenticated
  using (true);

drop policy if exists "leads admin manage" on public.leads;
create policy "leads admin manage"
  on public.leads for all
  to authenticated
  using (true) with check (true);

-- ---------- 3. STORAGE BUCKET (gallery images) ----------

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Public read of gallery images
drop policy if exists "gallery public read" on storage.objects;
create policy "gallery public read"
  on storage.objects for select
  using (bucket_id = 'gallery');

-- Only logged-in admin can upload / change / delete gallery images
drop policy if exists "gallery admin write" on storage.objects;
create policy "gallery admin write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery');

drop policy if exists "gallery admin update" on storage.objects;
create policy "gallery admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery') with check (bucket_id = 'gallery');

drop policy if exists "gallery admin delete" on storage.objects;
create policy "gallery admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery');

-- ---------- 4. SEED DATA (placeholder projects) ----------
-- Replace image URLs later once real photos are uploaded to the 'gallery' bucket.

insert into public.projects (name, description, category, after_image_url, sort_order) values
  ('Two-story home, Castlegar', 'Full interior + exterior window clean.', 'Residential',        'https://placehold.co/800x600?text=Project+1', 1),
  ('Storefront, Nelson',        'Recurring commercial window service.',   'Commercial',         'https://placehold.co/800x600?text=Project+2', 2),
  ('Driveway wash, Trail',      'Pressure washing, concrete driveway.',   'Pressure Washing',   'https://placehold.co/800x600?text=Project+3', 3),
  ('Gutter clear-out, Rossland','Full gutter cleaning before rainy season.','Gutters',          'https://placehold.co/800x600?text=Project+4', 4)
on conflict do nothing;

-- Done. Now go to Settings → API and copy your Project URL + anon public key.
