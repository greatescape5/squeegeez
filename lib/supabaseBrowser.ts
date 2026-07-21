'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Browser client for the admin area. Persists the login session in the browser
// so the admin stays logged in between page loads.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let _client: SupabaseClient | null = null;

export function browserSupabase(): SupabaseClient {
  if (!_client) {
    _client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}
