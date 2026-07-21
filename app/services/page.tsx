import Link from 'next/link';
import { getFolders, getProjects } from '@/lib/supabase';

export const metadata = {
  title: 'Our Services | Squeegeez Window & Exterior Care',
  description: 'Explore our services — residential and commercial windows, pressure washing, and gutter cleaning across the Kootenays.',
};

// Re-check the database periodically so new folders/photos appear without a redeploy.
export const revalidate = 60;

export default async function ServicesPage() {
  const [folders, projects] = await Promise.all([getFolders(), getProjects()]);

  // Group projects by folder so each card can show a cover photo + count.
  const byFolder = new Map<string, typeof projects>();
  for (const p of projects) {
    if (!p.folder_id) continue;
    const list = byFolder.get(p.folder_id) ?? [];
    list.push(p);
    byFolder.set(p.folder_id, list);
  }

  return (
    <>
      <section className="hero" style={{ padding: '64px 0' }}>
        <div className="container center">
          <span className="tag">What We Offer</span>
          <h1>Our Services</h1>
          <p className="lead">
            Everything your home or business exterior needs — done right, by people who care.
            Tap a service to see recent work.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {folders.length > 0 ? (
            <div className="gallery-grid">
              {folders.map((f) => {
                const items = byFolder.get(f.id) ?? [];
                const cover = items.find((p) => p.after_image_url)?.after_image_url || null;
                return (
                  <Link key={f.id} href={`/services/${f.slug}`} className="gallery-item folder-card">
                    {cover ? (
                      <img src={cover} alt={f.name} />
                    ) : (
                      <div className="folder-cover-empty" aria-hidden="true">
                        <span>{f.icon || '📁'}</span>
                      </div>
                    )}
                    <div className="meta">
                      <h3>{f.icon ? `${f.icon} ${f.name}` : f.name}</h3>
                      {f.description && <p>{f.description}</p>}
                      <span className="folder-count">
                        {items.length} {items.length === 1 ? 'photo' : 'photos'} · View →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-note">
              <p style={{ margin: 0 }}>Services will appear here once they&rsquo;re added in the admin.</p>
            </div>
          )}

          <div className="center" style={{ marginTop: 40 }}>
            <Link href="/contact" className="btn btn-primary">Get a Free Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
