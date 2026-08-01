import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFolders, getFolderBySlug, getProjectsByFolder } from '@/lib/supabase';
import ServiceIcon from '@/components/ServiceIcon';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

// Pre-render a page per folder. Wrapped safe so it never hard-fails the build.
export async function generateStaticParams() {
  try {
    const folders = await getFolders();
    return folders.map((f) => ({ slug: f.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const folder = await getFolderBySlug(params.slug);
  if (!folder) return { title: 'Service' };
  return {
    title: folder.name,
    description: folder.description || `${folder.name} across Castlegar, Nelson, Trail and the Kootenays.`,
    alternates: { canonical: `/services/${folder.slug}` },
  };
}

export default async function FolderPage({ params }: { params: { slug: string } }) {
  const folder = await getFolderBySlug(params.slug);
  if (!folder) notFound();

  const projects = await getProjectsByFolder(folder.id);

  return (
    <>
      {/* Structured data: this service + breadcrumb trail */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd({ name: folder.name, slug: folder.slug, description: folder.description })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: folder.name, path: `/services/${folder.slug}` },
          ])),
        }}
      />
      <section className="hero" style={{ padding: '56px 0' }}>
        <div className="container center">
          <Link href="/services" style={{ fontWeight: 600 }}>← All Services</Link>
          <h1 style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--teal)' }}><ServiceIcon slug={folder.slug} name={folder.name} size={34} /></span>
            {folder.name}
          </h1>
          {folder.description && <p className="lead">{folder.description}</p>}
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
                    <h3>{p.name}</h3>
                    {p.description && <p>{p.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-note">
              <p style={{ margin: 0 }}>Photos for this service are coming soon.</p>
            </div>
          )}

          <div className="center" style={{ marginTop: 40 }}>
            <Link href="/contact#get-in-touch" className="btn btn-primary">Get an Estimate</Link>
          </div>
        </div>
      </section>
    </>
  );
}
