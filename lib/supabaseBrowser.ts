'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Browser client for the admin area. Persists the login session in the browser
// so the admin stays logged in between page loads.
//
// Fallbacks: `createClient` throws "supabaseUrl is required." if these are empty,
// which breaks `next build` when it prerenders the admin pages with no env vars
// set (e.g. a fresh clone, or CI without secrets). The placeholders keep the build
// green; at runtime the real NEXT_PUBLIC_* values are inlined and used instead.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

let _client: SupabaseClient | null = null;

export function browserSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}
