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
  folder_id: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type Folder = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
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

// All published folders (service categories), ordered.
export async function getFolders(): Promise<Folder[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// One folder by its slug (or null if not found).
export async function getFolderBySlug(slug: string): Promise<Folder | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();
    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

// All published projects inside a given folder.
export async function getProjectsByFolder(folderId: string): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .eq('folder_id', folderId)
      .order('sort_order', { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
