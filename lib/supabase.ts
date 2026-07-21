import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Public (anon) client — safe to use in the browser. RLS protects the data.
// These come from Vercel env vars (and .env.local for local dev).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lazily create the client. If the env vars are missing (e.g. a build with no
// keys yet), we return null instead of throwing "supabaseUrl is required."
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!_client) _client = createClient(url, anonKey);
  return _client;
}

// ---- Types ----
export type Project = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

// Safe read: always returns an array, never throws — so the build can't break
// when there's no network, no keys, or the table is empty.
export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
