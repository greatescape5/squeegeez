import Link from 'next/link';
import { getProjects } from '@/lib/supabase';

export const metadata = {
  title: 'Our Projects | Squeegeez Window & Exterior Care',
  description: 'Browse recent window washing, pressure washing, and gutter cleaning projects across the Kootenays.',
};

// Re-check the database periodically so new photos appear without a redeploy.
export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <section className="hero" style={{ padding: '64px 0' }}>
        <div className="container center">
          <span className="tag">Our Work</span>
          <h1>Recent Projects</h1>
          <p className="lead">
            A look at homes and businesses we&rsquo;ve helped shine across the Kootenays.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {projects.length > 0 ? (
            <div className="gallery-grid">
              {projects.map((p) => (
                <div key={p.id} className="gallery-item">
                  {p.after_image_url && <img src={p.after_image_url} alt={p.name} />}
                  <div className="meta">
                    {p.category && <span className="badge">{p.category}</span>}
                    <h3>{p.name}</h3>
                    {p.description && <p>{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-note">
              <p style={{ margin: 0 }}>
                Projects will appear here once photos are added to the gallery.
              </p>
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
