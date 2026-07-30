-- ============================================================
-- MIGRATION: add an "address" column to the leads table
-- Paste into Supabase → SQL Editor → Run. Safe to re-run.
-- (Until you run this, the contact form still works and saves the lead —
--  it just won't store the address field yet.)
-- ============================================================

alter table public.leads
  add column if not exists address text;
