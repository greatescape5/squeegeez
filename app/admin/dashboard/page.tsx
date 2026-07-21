'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { browserSupabase } from '@/lib/supabaseBrowser';
import type { Project, Folder } from '@/lib/supabase';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string | null;
  created_at: string;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = browserSupabase();

  const [ready, setReady] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  // ---- New folder form ----
  const [fName, setFName] = useState('');
  const [fIcon, setFIcon] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fMsg, setFMsg] = useState('');

  // ---- Folder inline edit ----
  const [editId, setEditId] = useState<string | null>(null);
  const [eName, setEName] = useState('');
  const [eIcon, setEIcon] = useState('');
  const [eDesc, setEDesc] = useState('');

  // ---- New project form ----
  const [name, setName] = useState('');
  const [folderId, setFolderId] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const loadData = useCallback(async () => {
    const { data: flds } = await supabase
      .from('folders').select('*').order('sort_order', { ascending: true });
    setFolders(flds ?? []);
    const { data: proj } = await supabase
      .from('projects').select('*').order('sort_order', { ascending: true });
    setProjects(proj ?? []);
    const { data: lds } = await supabase
      .from('leads').select('*').order('created_at', { ascending: false });
    setLeads(lds ?? []);
  }, [supabase]);

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

  const folderName = (id: string | null) => folders.find((f) => f.id === id)?.name ?? '—';

  // ---------- FOLDERS ----------
  async function handleAddFolder(e: React.FormEvent) {
    e.preventDefault();
    setFMsg('');
    if (!fName.trim()) return;
    const nextSort = folders.length ? Math.max(...folders.map((f) => f.sort_order)) + 1 : 1;
    const { error } = await supabase.from('folders').insert([{
      name: fName.trim(), slug: slugify(fName), description: fDesc.trim() || null,
      icon: fIcon.trim() || null, sort_order: nextSort, published: true,
    }]);
    if (error) { setFMsg('Error: ' + error.message); return; }
    setFName(''); setFIcon(''); setFDesc('');
    await loadData();
  }

  function startEdit(f: Folder) {
    setEditId(f.id); setEName(f.name); setEIcon(f.icon ?? ''); setEDesc(f.description ?? '');
  }

  async function saveEdit(f: Folder) {
    const { error } = await supabase.from('folders').update({
      name: eName.trim(), slug: slugify(eName), icon: eIcon.trim() || null,
      description: eDesc.trim() || null,
    }).eq('id', f.id);
    if (!error) { setEditId(null); await loadData(); }
  }

  async function toggleFolder(f: Folder) {
    await supabase.from('folders').update({ published: !f.published }).eq('id', f.id);
    await loadData();
  }

  async function deleteFolder(f: Folder) {
    const count = projects.filter((p) => p.folder_id === f.id).length;
    if (!confirm(
      count > 0
        ? `Delete "${f.name}"? Its ${count} photo(s) will stay but become uncategorised.`
        : `Delete "${f.name}"?`
    )) return;
    const { error } = await supabase.from('folders').delete().eq('id', f.id);
    if (!error) await loadData();
  }

  // ---------- PROJECTS ----------
  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      if (!folderId) throw new Error('Please choose a folder first.');
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
        name, folder_id: folderId, category: folderName(folderId),
        description, after_image_url: imageUrl || null,
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

  async function handleDeleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) await loadData();
  }

  async function toggleProject(p: Project) {
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

        {/* ---------- FOLDERS ---------- */}
        <div className="card" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Service Folders</h2>
          <p className="form-note">These are the services shown on the site. Each project photo goes into one folder.</p>

          {folders.map((f) => (
            <div key={f.id} style={{ borderTop: '1px solid var(--line)', padding: '14px 0' }}>
              {editId === f.id ? (
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ width: 70 }} value={eIcon} onChange={(e) => setEIcon(e.target.value)} placeholder="🏠" />
                    <input style={{ flex: 1 }} value={eName} onChange={(e) => setEName(e.target.value)} placeholder="Folder name" />
                  </div>
                  <input value={eDesc} onChange={(e) => setEDesc(e.target.value)} placeholder="Short description" />
                  <div className="btn-row">
                    <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => saveEdit(f)}>Save</button>
                    <button className="btn btn-ghost" style={{ padding: '8px 16px' }} onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ color: 'var(--navy)' }}>{f.icon ? `${f.icon} ` : ''}{f.name}</strong>
                    {!f.published && <span className="badge" style={{ marginLeft: 8, background: '#fde8e2', color: 'var(--orange)' }}>Hidden</span>}
                    <div style={{ fontSize: '0.88rem', color: 'var(--body)' }}>
                      {f.description || <em>No description</em>} · {projects.filter((p) => p.folder_id === f.id).length} photos
                    </div>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => startEdit(f)}>Edit</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => toggleFolder(f)}>{f.published ? 'Hide' : 'Show'}</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem', color: 'var(--orange)' }} onClick={() => deleteFolder(f)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add folder */}
          <form onSubmit={handleAddFolder} style={{ borderTop: '2px solid var(--line)', marginTop: 8, paddingTop: 18 }}>
            <h3 style={{ fontSize: '1.05rem' }}>Add a folder</h3>
            {fMsg && <div className={`alert ${fMsg.startsWith('Error') ? 'err' : 'ok'}`}>{fMsg}</div>}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input style={{ width: 80 }} value={fIcon} onChange={(e) => setFIcon(e.target.value)} placeholder="🏠" aria-label="Icon" />
              <input style={{ flex: 1 }} value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Folder name (e.g. Solar Panel Cleaning)" required />
            </div>
            <input style={{ width: '100%', marginBottom: 10 }} value={fDesc} onChange={(e) => setFDesc(e.target.value)} placeholder="Short description (optional)" />
            <button type="submit" className="btn btn-primary">Add Folder</button>
          </form>
        </div>

        {/* ---------- ADD PROJECT ---------- */}
        <div className="card" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Add a Project Photo</h2>
          {msg && <div className={`alert ${msg.startsWith('Error') ? 'err' : 'ok'}`}>{msg}</div>}
          <form onSubmit={handleAddProject}>
            <div className="field">
              <label htmlFor="p-name">Project name</label>
              <input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="e.g. Two-story home, Castlegar" />
            </div>
            <div className="field">
              <label htmlFor="p-folder">Folder</label>
              <select id="p-folder" value={folderId} onChange={(e) => setFolderId(e.target.value)} required>
                <option value="" disabled>Choose a folder…</option>
                {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
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

        {/* ---------- EXISTING PROJECTS ---------- */}
        <h2 style={{ fontSize: '1.3rem' }}>Project Photos ({projects.length})</h2>
        <div className="grid grid-3" style={{ marginBottom: 40 }}>
          {projects.map((p) => (
            <div key={p.id} className="gallery-item">
              {p.after_image_url && <img src={p.after_image_url} alt={p.name} />}
              <div className="meta">
                <span className="badge">{folderName(p.folder_id)}</span>
                <h3>{p.name}</h3>
                {p.description && <p>{p.description}</p>}
                <div className="btn-row" style={{ marginTop: 12 }}>
                  <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                    onClick={() => toggleProject(p)}>
                    {p.published ? 'Hide' : 'Show'}
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: '0.85rem', color: 'var(--orange)' }}
                    onClick={() => handleDeleteProject(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- LEADS ---------- */}
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
