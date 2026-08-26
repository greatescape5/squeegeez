'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { browserSupabase } from '@/lib/supabaseBrowser';
import type { Project, Folder, Comparison } from '@/lib/supabase';
import ServiceIcon from '@/components/ServiceIcon';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  service: string | null;
  message: string | null;
  created_at: string;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const TABS = [
  { id: 'folders', label: 'Service Folders' },
  { id: 'comparisons', label: 'Before & After' },
  { id: 'projects', label: 'Manage Projects' },
  { id: 'leads', label: 'Leads' },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = browserSupabase();

  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabId>('folders');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);

  // ---- New before/after form ----
  const [cTitle, setCTitle] = useState('');
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [cSaving, setCSaving] = useState(false);
  const [cMsg, setCMsg] = useState('');

  // ---- Before/after inline edit ----
  const [cEditId, setCEditId] = useState<string | null>(null);
  const [ceTitle, setCeTitle] = useState('');
  const [ceBefore, setCeBefore] = useState<File | null>(null);
  const [ceAfter, setCeAfter] = useState<File | null>(null);
  const [ceSaving, setCeSaving] = useState(false);
  const [ceMsg, setCeMsg] = useState('');

  // ---- Add photo to a folder ----
  const [photoFolderId, setPhotoFolderId] = useState<string | null>(null);
  const [fpCaption, setFpCaption] = useState('');
  const [fpFile, setFpFile] = useState<File | null>(null);
  const [fpSaving, setFpSaving] = useState(false);
  const [fpMsg, setFpMsg] = useState('');

  // ---- New folder form ----
  const [fName, setFName] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fMsg, setFMsg] = useState('');

  // ---- Folder inline edit ----
  const [editId, setEditId] = useState<string | null>(null);
  const [eName, setEName] = useState('');
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
    const { data: cmp } = await supabase
      .from('comparisons').select('*').order('sort_order', { ascending: true });
    setComparisons(cmp ?? []);
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
      sort_order: nextSort, published: true,
    }]);
    if (error) { setFMsg('Error: ' + error.message); return; }
    setFName(''); setFDesc('');
    await loadData();
  }

  function startEdit(f: Folder) {
    setEditId(f.id); setEName(f.name); setEDesc(f.description ?? '');
  }

  async function saveEdit(f: Folder) {
    const { error } = await supabase.from('folders').update({
      name: eName.trim(), slug: slugify(eName),
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

  async function handleAddFolderPhoto(e: React.FormEvent, f: Folder) {
    e.preventDefault();
    setFpSaving(true);
    setFpMsg('');
    try {
      if (!fpFile) throw new Error('Choose a photo first.');
      const imageUrl = await uploadImage(fpFile);
      const nextSort = projects.length ? Math.max(...projects.map((p) => p.sort_order)) + 1 : 1;
      const { error } = await supabase.from('projects').insert([{
        name: fpCaption.trim() || f.name, folder_id: f.id, category: f.name,
        description: null, after_image_url: imageUrl, sort_order: nextSort, published: true,
      }]);
      if (error) throw error;
      setFpCaption(''); setFpFile(null);
      setFpMsg('Photo added.');
      await loadData();
    } catch (err: any) {
      setFpMsg('Error: ' + (err?.message || 'could not save'));
    } finally {
      setFpSaving(false);
    }
  }

  // ---------- BEFORE / AFTER ----------
  async function uploadImage(f: File): Promise<string> {
    const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${Date.now()}-${Math.round(performance.now())}-${safeName}`;
    const { error } = await supabase.storage.from('gallery').upload(path, f);
    if (error) throw error;
    return supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl;
  }

  async function handleAddComparison(e: React.FormEvent) {
    e.preventDefault();
    setCSaving(true);
    setCMsg('');
    try {
      if (!beforeFile || !afterFile) throw new Error('Please choose both a before and an after photo.');
      const [beforeUrl, afterUrl] = [await uploadImage(beforeFile), await uploadImage(afterFile)];
      const nextSort = comparisons.length ? Math.max(...comparisons.map((c) => c.sort_order)) + 1 : 1;
      const { error } = await supabase.from('comparisons').insert([{
        title: cTitle.trim() || null, before_image_url: beforeUrl, after_image_url: afterUrl,
        sort_order: nextSort, published: true,
      }]);
      if (error) throw error;
      setCTitle(''); setBeforeFile(null); setAfterFile(null);
      (document.getElementById('ba-before') as HTMLInputElement).value = '';
      (document.getElementById('ba-after') as HTMLInputElement).value = '';
      setCMsg('Comparison added.');
      await loadData();
    } catch (err: any) {
      setCMsg('Error: ' + (err?.message || 'could not save'));
    } finally {
      setCSaving(false);
    }
  }

  async function toggleComparison(c: Comparison) {
    await supabase.from('comparisons').update({ published: !c.published }).eq('id', c.id);
    await loadData();
  }

  async function deleteComparison(c: Comparison) {
    if (!confirm('Delete this before/after comparison?')) return;
    const { error } = await supabase.from('comparisons').delete().eq('id', c.id);
    if (!error) await loadData();
  }

  function startEditComparison(c: Comparison) {
    setCEditId(c.id); setCeTitle(c.title ?? ''); setCeBefore(null); setCeAfter(null); setCeMsg('');
  }

  async function saveComparison(c: Comparison) {
    setCeSaving(true);
    setCeMsg('');
    try {
      const patch: Record<string, unknown> = { title: ceTitle.trim() || null };
      if (ceBefore) patch.before_image_url = await uploadImage(ceBefore);
      if (ceAfter) patch.after_image_url = await uploadImage(ceAfter);
      const { error } = await supabase.from('comparisons').update(patch).eq('id', c.id);
      if (error) throw error;
      setCEditId(null);
      await loadData();
    } catch (err: any) {
      setCeMsg('Error: ' + (err?.message || 'could not save'));
    } finally {
      setCeSaving(false);
    }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: '1.9rem', margin: 0 }}>Admin Dashboard</h1>
          <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </div>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------- FOLDERS ---------- */}
        {tab === 'folders' && (
        <div className="card" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Service Folders</h2>
          <p className="form-note">These are the services shown on the site. Each project photo goes into one folder.</p>

          {folders.map((f) => (
            <div key={f.id} style={{ borderTop: '1px solid var(--line)', padding: '14px 0' }}>
              {editId === f.id ? (
                <div style={{ display: 'grid', gap: 8 }}>
                  <input value={eName} onChange={(e) => setEName(e.target.value)} placeholder="Folder name" />
                  <input value={eDesc} onChange={(e) => setEDesc(e.target.value)} placeholder="Short description" />
                  <div className="btn-row">
                    <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => saveEdit(f)}>Save</button>
                    <button className="btn btn-ghost" style={{ padding: '8px 16px' }} onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ color: 'var(--navy)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'var(--teal)' }}><ServiceIcon slug={f.slug} name={f.name} size={18} /></span>
                      {f.name}
                    </strong>
                    {!f.published && <span className="badge" style={{ marginLeft: 8, background: '#fde8e2', color: 'var(--orange)' }}>Hidden</span>}
                    <div style={{ fontSize: '0.88rem', color: 'var(--body)' }}>
                      {f.description || <em>No description</em>} · {projects.filter((p) => p.folder_id === f.id).length} photos
                    </div>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => startEdit(f)}>Edit</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => { setPhotoFolderId(photoFolderId === f.id ? null : f.id); setFpMsg(''); setFpCaption(''); setFpFile(null); }}>Add Photo</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => toggleFolder(f)}>{f.published ? 'Hide' : 'Show'}</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem', color: 'var(--orange)' }} onClick={() => deleteFolder(f)}>Delete</button>
                  </div>
                </div>
              )}

              {photoFolderId === f.id && (
                <div style={{ marginTop: 12, background: 'var(--muted)', borderRadius: 10, padding: 14 }}>
                  <strong style={{ color: 'var(--navy)', fontSize: '0.95rem' }}>Photos in {f.name}</strong>
                  {fpMsg && <div className={`alert ${fpMsg.startsWith('Error') ? 'err' : 'ok'}`} style={{ marginTop: 8 }}>{fpMsg}</div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0' }}>
                    {projects.filter((p) => p.folder_id === f.id).map((p) => (
                      <div key={p.id} style={{ position: 'relative' }}>
                        {p.after_image_url && <img src={p.after_image_url} alt={p.name} style={{ width: 84, height: 62, objectFit: 'cover', borderRadius: 6, display: 'block' }} />}
                        <button type="button" title="Delete photo" onClick={() => handleDeleteProject(p.id)}
                          style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', border: 'none', background: 'var(--orange)', color: '#fff', cursor: 'pointer', lineHeight: '20px', fontWeight: 700 }}>×</button>
                      </div>
                    ))}
                    {projects.filter((p) => p.folder_id === f.id).length === 0 && <span className="form-note">No photos in this folder yet.</span>}
                  </div>
                  <form onSubmit={(e) => handleAddFolderPhoto(e, f)}>
                    <div className="field">
                      <label>Caption (optional)</label>
                      <input value={fpCaption} onChange={(e) => setFpCaption(e.target.value)} placeholder={`e.g. ${f.name} job in Castlegar`} />
                    </div>
                    <div className="field">
                      <label>Photo</label>
                      <input key={projects.filter((p) => p.folder_id === f.id).length} type="file" accept="image/*" onChange={(e) => setFpFile(e.target.files?.[0] ?? null)} />
                    </div>
                    <div className="btn-row">
                      <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }} disabled={fpSaving}>{fpSaving ? 'Uploading…' : 'Add Photo'}</button>
                      <button type="button" className="btn btn-ghost" style={{ padding: '8px 16px' }} onClick={() => { setPhotoFolderId(null); setFpFile(null); setFpCaption(''); }}>Close</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}

          {/* Add folder */}
          <form onSubmit={handleAddFolder} style={{ borderTop: '2px solid var(--line)', marginTop: 8, paddingTop: 18 }}>
            <h3 style={{ fontSize: '1.05rem' }}>Add a folder</h3>
            {fMsg && <div className={`alert ${fMsg.startsWith('Error') ? 'err' : 'ok'}`}>{fMsg}</div>}
            <p className="form-note" style={{ marginTop: 0 }}>An icon is chosen automatically to match the service name.</p>
            <div style={{ marginBottom: 10 }}>
              <input style={{ width: '100%' }} value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Folder name (e.g. Solar Panel Cleaning)" required />
            </div>
            <input style={{ width: '100%', marginBottom: 10 }} value={fDesc} onChange={(e) => setFDesc(e.target.value)} placeholder="Short description (optional)" />
            <button type="submit" className="btn btn-primary">Add Folder</button>
          </form>
        </div>
        )}

        {/* ---------- BEFORE / AFTER SHOWCASE ---------- */}
        {tab === 'comparisons' && (
        <div className="card" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1.3rem' }}>Before &amp; After Showcase</h2>
          <p className="form-note">These appear in the &ldquo;Our Work in Action&rdquo; slider on the home page.</p>

          {comparisons.map((c) => (
            <div key={c.id} style={{ borderTop: '1px solid var(--line)', padding: '14px 0' }}>
              {cEditId === c.id ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  <div className="field">
                    <label>Caption / title (optional)</label>
                    <input value={ceTitle} onChange={(e) => setCeTitle(e.target.value)} placeholder="e.g. Sliding door track" />
                  </div>
                  <div className="grid grid-2" style={{ gap: 16 }}>
                    <div className="field">
                      <label>Before photo (leave blank to keep)</label>
                      {c.before_image_url && <img src={c.before_image_url} alt="before" style={{ width: 100, height: 66, objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 6 }} />}
                      <input type="file" accept="image/*" onChange={(e) => setCeBefore(e.target.files?.[0] ?? null)} />
                    </div>
                    <div className="field">
                      <label>After photo (leave blank to keep)</label>
                      {c.after_image_url && <img src={c.after_image_url} alt="after" style={{ width: 100, height: 66, objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 6 }} />}
                      <input type="file" accept="image/*" onChange={(e) => setCeAfter(e.target.files?.[0] ?? null)} />
                    </div>
                  </div>
                  {ceMsg && <div className={`alert ${ceMsg.startsWith('Error') ? 'err' : 'ok'}`}>{ceMsg}</div>}
                  <div className="btn-row">
                    <button className="btn btn-primary" style={{ padding: '8px 16px' }} disabled={ceSaving} onClick={() => saveComparison(c)}>{ceSaving ? 'Saving…' : 'Save'}</button>
                    <button className="btn btn-ghost" style={{ padding: '8px 16px' }} onClick={() => setCEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {c.before_image_url && <img src={c.before_image_url} alt="before" style={{ width: 54, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
                      {c.after_image_url && <img src={c.after_image_url} alt="after" style={{ width: 54, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--navy)' }}>{c.title || 'Untitled comparison'}</strong>
                      {!c.published && <span className="badge" style={{ marginLeft: 8, background: '#fde8e2', color: 'var(--orange)' }}>Hidden</span>}
                    </div>
                  </div>
                  <div className="btn-row">
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => startEditComparison(c)}>Edit</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => toggleComparison(c)}>{c.published ? 'Hide' : 'Show'}</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 12px', fontSize: '0.85rem', color: 'var(--orange)' }} onClick={() => deleteComparison(c)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <form onSubmit={handleAddComparison} style={{ borderTop: '2px solid var(--line)', marginTop: 8, paddingTop: 18 }}>
            <h3 style={{ fontSize: '1.05rem' }}>Add a before/after</h3>
            {cMsg && <div className={`alert ${cMsg.startsWith('Error') ? 'err' : 'ok'}`}>{cMsg}</div>}
            <div className="field">
              <label htmlFor="ba-title">Title (optional)</label>
              <input id="ba-title" value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="e.g. Sliding door track" />
            </div>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="field">
                <label htmlFor="ba-before">Before photo</label>
                <input id="ba-before" type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="field">
                <label htmlFor="ba-after">After photo</label>
                <input id="ba-after" type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={cSaving}>
              {cSaving ? 'Uploading…' : 'Add Comparison'}
            </button>
          </form>
        </div>
        )}

        {/* ---------- MANAGE PROJECTS ---------- */}
        {tab === 'projects' && (
        <>
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

        </>
        )}

        {/* ---------- LEADS ---------- */}
        {tab === 'leads' && (
        <>
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
                  <th style={{ padding: 8 }}>Address</th>
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
                    <td style={{ padding: 8 }}>{l.address || '—'}</td>
                    <td style={{ padding: 8 }}>{l.service || '—'}</td>
                    <td style={{ padding: 8, maxWidth: 280 }}>{l.message || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </>
        )}
      </div>
    </section>
  );
}
