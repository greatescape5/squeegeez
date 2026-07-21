'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { browserSupabase } from '@/lib/supabaseBrowser';
import type { Project } from '@/lib/supabase';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  created_at: string;
};

const CATEGORIES = ['Residential', 'Commercial', 'Pressure Washing', 'Gutters'];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = browserSupabase();

  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // New-project form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadData = useCallback(async () => {
    const { data: proj } = await supabase
      .from('projects').select('*').order('sort_order', { ascending: true });
    setProjects(proj ?? []);
    const { data: lds } = await supabase
      .from('leads').select('*').order('created_at', { ascending: false });
    setLeads(lds ?? []);
  }, [supabase]);

  // Guard: must be logged in.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/admin'); return; }
      await loadData();
      setReady(true);
    });
  }, [supabase, router, loadData]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/admin');
  }

  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      let imageUrl = '';
      if (file) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const path = `${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from('gallery').upload(path, file);
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
      }
      const nextSort = projects.length ? Math.max(...projects.map((p) => p.sort_order)) + 1 : 1;
      const { error: insErr } = await supabase.from('projects').insert([{
        name, category, description,
        after_image_url: imageUrl || null,
        sort_order: nextSort, published: true,
      }]);
      if (insErr) throw insErr;
      setName(''); setDescription(''); setFile(null);
      (document.getElementById('proj-file') as HTMLInputElement).value = '';
      setMsg('Project added.');
      await loadData();
    } catch (err: any) {
      setMsg('Error: ' + (err?.message || 'could not save'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) await loadData();
  }

  async function togglePublished(p: Project) {
    await supabase.from('projects').update({ published: !p.published }).eq('id', p.id);
    await loadData();
  }

  if (!ready) {
    return <section className="section"><div className="container center">Loading…</div></section>;
  }

  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: '1.9rem', margin: 0 }}>Admin Dashboard</h1>
          <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </div>

        {/* ADD PROJECT */}
        <div className="card" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Add a Project</h2>
          {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
          <form onSubmit={handleAddProject}>
            <div className="field">
              <label htmlFor="p-name">Project name</label>
              <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="e.g. Two-story home, Castlegar" />
            </div>
            <div className="field">
              <label htmlFor="p-cat">Category</label>
              <select id="p-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="p-desc">Description</label>
              <textarea id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the job." />
            </div>
            <div className="field">
              <label htmlFor="proj-file">Photo</label>
              <input id="proj-file" type="file" accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Add Project'}
            </button>
          </form>
        </div>

        {/* EXISTING PROJECTS */}
        <h2 style={{ fontSize: '1.3rem' }}>Projects ({projects.length})</h2>
        <div className="grid grid-3" style={{ marginBottom: 40 }}>
          {projects.map((p) => (
            <div key={p.id} className="gallery-item">
              {p.after_image_url && <img src={p.after_image_url} alt={p.name} />}
              <div className="meta">
                {p.category && <span className="badge">{p.category}</span>}
                <h3>{p.name}</h3>
                {p.description && <p>{p.description}</p>}
                <div className="btn-row" style={{ marginTop: 12 }}>
                  <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => togglePublished(p)}>
                    {p.published ? 'Hide' : 'Show'}
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem', color: 'var(--orange)' }}
                    onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LEADS */}
        <h2 style={{ fontSize: '1.3rem' }}>Leads ({leads.length})</h2>
        {leads.length === 0 ? (
          <p>No leads yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--line)' }}>
                  <th style={{ padding: 8 }}>Date</th>
                  <th style={{ padding: 8 }}>Name</th>
                  <th style={{ padding: 8 }}>Email</th>
                  <th style={{ padding: 8 }}>Phone</th>
                  <th style={{ padding: 8 }}>Service</th>
                  <th style={{ padding: 8 }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{new Date(l.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: 8 }}>{l.name}</td>
                    <td style={{ padding: 8 }}><a href={`mailto:${l.email}`}>{l.email}</a></td>
                    <td style={{ padding: 8 }}>{l.phone || '—'}</td>
                    <td style={{ padding: 8 }}>{l.service || '—'}</td>
                    <td style={{ padding: 8, maxWidth: 280 }}>{l.message || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
